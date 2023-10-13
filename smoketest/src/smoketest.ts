// TODO: Use CoordinatedPlayerAI, Pools, TeamGenerators
//  from `sim/tools/exhaustive-runner.ts` (possibly export it so we can use it directly from @pkmn/sim?)
// TODO: CLI flags support for specific formats, times ran, max failuresetc.
// TODO: Support FFA (pending #445)
// TODO: Prettier debug statements (more info, colors, etc.)
// TODO: Write docs

import * as fs from 'fs';

import {Battle, Field, NA, Pokemon, Side} from '@pkmn/client';
import {Generations, Move, TypeName} from '@pkmn/data';
import {Dex, GenderName, PokemonSet} from '@pkmn/dex';
import {
  ArgName, ArgType, Args, BattleArgsKWArgType, Handler, KWArgs, Protocol,
} from '@pkmn/protocol';
import {TeamGenerators} from '@pkmn/randoms';
import {BattleStreams, ID, RandomPlayerAI, Teams} from '@pkmn/sim';
import * as calc from 'calc';

const DEBUG_MODE = !!process.argv[2];

const lastAttack: {
  poke: Pokemon; move: Partial<Move> & NA; isCrit: boolean; isSash: boolean;
} = Object.create(null);

function debug(s: string) {
  if (!DEBUG_MODE) return;
  console.log(s);
}

function getItem(poke: Pokemon, set: PokemonSet) {
  return poke.lastItemEffect ? undefined : set.item;
}
function getSet(poke: Pokemon) {
  const set = poke.side.sets!.find(s => (s.name || s.species) === poke.name)!;
  return set;
}

function createCalcPoke(battle: Battle, poke: Pokemon): calc.Pokemon {
  const set = getSet(poke);
  const cPoke = new calc.Pokemon(
    battle.gen,
    poke.speciesForme,
    {
      ability: set.ability,
      item: getItem(poke, set),
      nature: set.nature,
      curHP: poke.hp,
      ivs: set.ivs,
      evs: set.evs,
      boosts: poke.boosts,
      level: set.level,
      isDynamaxed: !!poke.volatiles['dynamax'],
      alliesFainted: poke.side.faints,
      gender: set.gender as GenderName,
      status: poke.status,
      teraType: poke.isTerastallized ? poke.teraType : undefined,
      overrides: {
        // XXX: The calc seems to copy over the elements of `target` to `source` for overrides
        // meaning if `source` is longer than `target` then there well be elements will be left over
        // from source. Example: `['Ice', Flying]`, `['Ice']` -> ['Ice', 'Flying'].
        // Leaving in an empty string is a terrible solution but fixing it in the calc
        // is technically a 'breaking' change I believe.
        // I'll have to investigate what overrides are *supposed* to do and figure out what to do.
        types: poke.types.length === 1 ? [poke.types[0], '' as TypeName] : poke.types,
      },
    }
  );
  return cPoke;
}
function createCalcSide(side: Side) {
  return new calc.Side({
    spikes: side.sideConditions['spikes']?.level,
    steelsurge: !!side.sideConditions['steelsurge'],
    vinelash: !!side.sideConditions['vinelash'],
    wildfire: !!side.sideConditions['wildfire'],
    cannonade: !!side.sideConditions['cannonade'],
    volcalith: !!side.sideConditions['volcalith'],
    isSR: !!side.sideConditions['steathrock'],
    isReflect: !!side.sideConditions['reflect'],
    isLightScreen: !!side.sideConditions['lightscreen'],
    isProtected: !!side.sideConditions['protect'],
    isSeeded: !!side.sideConditions['leechseed'],
    isForesight: !!side.sideConditions['foresight'],
    isFriendGuard: !!side.sideConditions['friendguard'],
    isAuroraVeil: !!side.sideConditions['auroraveil'],
    isBattery: !!side.sideConditions['battery'],
  });
}
function createCalcField(battle: Battle, field: Field, sides: [Side, Side]) {
  return new calc.Field({
    gameType: battle.gameType === 'singles' ? 'Singles' : 'Doubles',
    weather: field.weather,
    terrain: field.terrain,
    isMagicRoom: field.hasPseudoWeather('magicroom' as ID),
    isWonderRoom: field.hasPseudoWeather('wonderroom' as ID),
    isGravity: field.hasPseudoWeather('gravity' as ID),
    isAuraBreak: battle.abilityActive(['aurabreak'] as ID[]),
    isFairyAura: battle.abilityActive(['fairyaura'] as ID[]),
    isDarkAura: battle.abilityActive(['darkaura'] as ID[]),
    isBeadsOfRuin: battle.abilityActive(['beadsofruin'] as ID[]),
    isSwordOfRuin: battle.abilityActive(['swordofruin'] as ID[]),
    isTabletsOfRuin: battle.abilityActive(['tabletsofruin'] as ID[]),
    isVesselOfRuin: battle.abilityActive(['vesselofruin'] as ID[]),
    attackerSide: createCalcSide(sides[0]),
    defenderSide: createCalcSide(sides[1]),
  });
}
function createCalcMove(battle: Battle, move: Partial<Move> & NA, isCrit = false) {
  return new calc.Move(battle.gen, move.id, {
    name: move.name,
    useZ: !!move.isZ,
    useMax: !!move.isMax,
    isCrit,
    hits: 1,
    timesUsed: 1,
    overrides: {
      multihit: 1,
    },
  });
}

let fails = 0;

class PreHandler implements Handler<void> {
  private readonly battle: Battle;
  constructor(battle: Battle) {
    this.battle = battle;
  }

  '|move|'(args: Args['|move|'], kwArgs: KWArgs['|move|']) {
    if (kwArgs.miss) return;
    const poke = this.battle.getPokemon(args[1])!;
    const move = this.battle.get('moves', args[2]) as Partial<Move> & NA;
    lastAttack.poke = poke;
    lastAttack.move = move;
    lastAttack.isCrit = false;
    lastAttack.isSash = false;
  }

  '|-crit|'() {
    lastAttack.isCrit = true;
  }

  '|-enditem|'(args: Args['|-enditem|'], kwArgs: KWArgs['|-enditem|']) {
    if (Object.keys(kwArgs).length) return;
    if (['Focus Sash', 'Focus Band'].includes(args[2])) {
      lastAttack.isSash = true;
    }
  }

  '|-damage|'(args: Args['|-damage|'], kwArgs: KWArgs['|-damage|']) {
    if (kwArgs.from) return;
    const {poke: attackerPoke, move, isCrit, isSash} = lastAttack;
    if (move.category === 'Status' || (move.basePower && move.basePower <= 1)) {
      return;
    }
    // FIXME: handle properly
    if (args[2] === '0 fnt' || isSash) {
      return;
    }
    const defenderPoke = this.battle.getPokemon(args[1])!;
    const health = Protocol.parseHealth(args[2]);
    if (!health) return;
    const damage = defenderPoke.hp - health.hp;
    const attackerPokeSet = getSet(attackerPoke);
    const attackerPokeItem = getItem(attackerPoke, attackerPokeSet);
    const defenderPokeSet = getSet(defenderPoke);
    const defenderPokeItem = getItem(defenderPoke, defenderPokeSet);
    let result: calc.Result | undefined;
    try {
      result = calc.calculate(
        this.battle.gen,
        createCalcPoke(this.battle, attackerPoke),
        createCalcPoke(this.battle, defenderPoke),
        createCalcMove(this.battle, move, isCrit),
        createCalcField(this.battle, this.battle.field, [attackerPoke.side, defenderPoke.side])
      );
    } catch (err) {
      console.error(err);
    }
    if (!result) return;
    const fail = () => {
      debug(
        `Failure on turn ${this.battle.turn}: ${attackerPoke.speciesForme} [${attackerPokeItem}] ${move.name} -> ${
          defenderPoke.speciesForme} [${defenderPokeItem}] [${damage}]`
      );
      debug(
        `Calc roll: ${Array.isArray(result!.damage) ? result!.damage.flat(1).join(', ') : result!.damage}`
      );
      fails++;
    };
    if (typeof result.damage === 'number') {
      if (result.damage !== Math.abs(damage)) {
        fail();
      }
    } else if (!result.damage.flat(1).includes((Math.abs(damage)))) {
      fail();
    }
  }
}

const add = <T>(
  h: Handler<T>,
  k: ArgName | undefined,
  a: ArgType,
  kw: BattleArgsKWArgType
) => {
  if (k && k in h) (h as any)[k](a, kw);
};

if (process.argv[2]) {
  const [, p1team, p2team, ...lines] = fs.readFileSync(process.argv[2]).toString().split('\n');

  const battle = new Battle(
    new Generations(Dex),
    null,
    [p1team, p2team].map(t => Teams.import(t)!)
  );

  const pre = new PreHandler(battle);

  for (const line of lines) {
    const {args, kwArgs} = Protocol.parseBattleLine(line);
    const key = Protocol.key(args);
    add(pre, key, args, kwArgs);
    battle.add(args, kwArgs);
  }
  process.exit(fails);
}

Teams.setGeneratorFactory(TeamGenerators);

async function run(gen: number, type: 'singles' | 'doubles') {
  if (gen < 8 && type === 'doubles') {
    type = 'singles';
  }
  const streams = BattleStreams.getPlayerStreams(new BattleStreams.BattleStream());
  const spec = {formatid: `gen${gen}customgame`};

  const p1spec = {
    name: 'Bot 1',
    team: Teams.pack(Teams.generate(
      `gen${gen}random${type === 'doubles' ? 'doubles' : ''}battle`
    ))};
  const p2spec = {
    name: 'Bot 2',
    team: Teams.pack(Teams.generate(
      `gen${gen}random${type === 'doubles' ? 'doubles' : ''}battle`
    ))};

  const p1 = new RandomPlayerAI(streams.p1);
  const p2 = new RandomPlayerAI(streams.p2);

  void p1.start();
  void p2.start();

  const battle = new Battle(
    new Generations(Dex),
    null,
    [p1spec.team, p2spec.team].map(t => Teams.import(t)!)
  );

  void streams.omniscient.write([
    `>start ${JSON.stringify(spec)}`,
    `>player p1 ${JSON.stringify(p1spec)}`,
    `>player p2 ${JSON.stringify(p2spec)}`,
  ].join('\n'));

  const pre = new PreHandler(battle);
  const logs: string[] = [];

  for await (const chunk of streams.omniscient) {
    for (const line of chunk.split('\n')) {
      logs.push(line);
      const {args, kwArgs} = Protocol.parseBattleLine(line);
      const key = Protocol.key(args);
      add(pre, key, args, kwArgs);
      battle.add(args, kwArgs);
    }
  }

  await streams.omniscient.writeEnd();
  const fname = `./logs/${Date.now()}.txt`;
  console.log(`${fname}: ${fails} fails [gen${gen}${type}]`);
  fs.writeFileSync(
    fname,
    `FAILS: ${fails}\n${p1spec.team}\n${p2spec.team}\n${logs.join('\n')}`
  );
}

(async () => {
  for (let i = 0; i < 10; i++) {
    const randomGen = Math.floor(Math.random() * 9) + 1;
    const randomType = (['singles', 'doubles'] as const)[Math.floor(Math.random() * 2)];
    await run(randomGen === 0 ? 1 : randomGen, randomType);
    fails = 0;
  }
})().catch(err => {
  throw err;
});
