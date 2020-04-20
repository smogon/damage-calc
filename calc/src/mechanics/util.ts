import {Generation, TypeName, NatureName, ID, ItemName} from '../data/interface';
import {toID} from '../util';
import {Field, Side, Weather} from '../field';
import {Move} from '../move';
import {Pokemon} from '../pokemon';
import {STATS, Stats, StatsTable} from '../stats';

const EV_ITEMS = [
  'Macho Brace',
  'Power Anklet',
  'Power Band',
  'Power Belt',
  'Power Bracer',
  'Power Lens',
  'Power Weight',
];

export function isGrounded(pokemon: Pokemon, field: Field) {
  return (
    field.isGravity ||
    (!pokemon.hasType('Flying') &&
      !pokemon.hasAbility('Levitate') &&
      !pokemon.hasItem('Air Balloon'))
  );
}

export function getModifiedStat(stat: number, mod: number, gen?: Generation) {
  const boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
  if (gen && gen.num < 3) {
    if (mod >= 0) {
      stat = Math.floor(stat * boostTable[mod]);
    } else {
      const numerators = [100, 66, 50, 40, 33, 28, 25];
      stat = Math.floor((stat * numerators[-mod]) / 100);
    }
    return Math.min(999, Math.max(1, stat));
  }

  if (mod >= 0) {
    stat = Math.floor(stat * boostTable[mod]);
  } else {
    stat = Math.floor(stat / boostTable[-mod]);
  }

  return stat;
}

export function getFinalSpeed(gen: Generation, pokemon: Pokemon, field: Field, side: Side) {
  const weather = field.weather || '';
  const terrain = field.terrain;
  let speed = getModifiedStat(pokemon.rawStats.spe, pokemon.boosts.spe, gen);

  if (pokemon.hasItem('Choice Scarf')) {
    speed = pokeRound(speed * 1.5);
  } else if (pokemon.hasItem('Iron Ball', ...EV_ITEMS)) {
    speed = pokeRound(speed / 2);
  } else if (pokemon.hasItem('Quick Powder') && pokemon.named('Ditto')) {
    speed *= 2;
  }
  if (
    (pokemon.hasAbility('Chlorophyll') && weather.includes('Sun')) ||
    (pokemon.hasAbility('Sand Rush') && weather === 'Sand') ||
    (pokemon.hasAbility('Swift Swim') && weather.includes('Rain')) ||
    (pokemon.hasAbility('Slush Rush') && weather === 'Hail')
  ) {
    speed *= 2;
  } else if (pokemon.hasAbility('Quick Feet') && !pokemon.hasStatus('Healthy')) {
    speed = pokeRound(speed * 1.5);
  } else if (pokemon.hasAbility('Slow Start') && pokemon.abilityOn) {
    speed = pokeRound(speed / 2);
  } else if (
    (pokemon.hasAbility('Surge Surfer') && terrain === 'Electric') ||
    (pokemon.hasAbility('Unburden') && pokemon.abilityOn)
  ) {
    speed *= 2;
  }

  if (side.isTailwind) speed *= 2;
  if (pokemon.hasStatus('Paralyzed') && !pokemon.hasAbility('Quick Feet')) {
    speed = pokeRound(speed * (gen.num < 7 ? 0.25 : 0.5));
  }

  if (gen.num <= 2) speed = Math.min(999, speed);
  return Math.max(1, speed);
}

// GameFreak rounds DOWN on .5
export function pokeRound(num: number) {
  return num % 1 > 0.5 ? Math.ceil(num) : Math.floor(num);
}

export function getMoveEffectiveness(
  gen: Generation,
  move: Move,
  type: TypeName,
  isGhostRevealed?: boolean,
  isGravity?: boolean
) {
  if (isGhostRevealed && type === 'Ghost' && ['Normal', 'Fighting'].includes(move.type)) {
    return 1;
  } else if (isGravity && type === 'Flying' && move.type === 'Ground') {
    return 1;
  } else if (move.name === 'Freeze-Dry' && type === 'Water') {
    return 2;
  } else if (move.name === 'Flying Press') {
    return (
      gen.types.get('fighting' as ID)!.effectiveness[type]! *
      gen.types.get('flying' as ID)!.effectiveness[type]!
    );
  } else {
    return gen.types.get(toID(move.type))!.effectiveness[type]!;
  }
}

export function checkAirLock(pokemon: Pokemon, field: Field) {
  if (pokemon.hasAbility('Air Lock', 'Cloud Nine')) {
    field.weather = undefined;
  }
}

export function checkForecast(pokemon: Pokemon, weather?: Weather) {
  if (pokemon.hasAbility('Forecast') && pokemon.named('Castform')) {
    switch (weather) {
    case 'Sun':
    case 'Harsh Sunshine':
      pokemon.type1 = 'Fire';
      break;
    case 'Rain':
    case 'Heavy Rain':
      pokemon.type1 = 'Water';
      break;
    case 'Hail':
      pokemon.type1 = 'Ice';
      break;
    default:
      pokemon.type1 = 'Normal';
    }
    pokemon.type2 = undefined;
  }
}

export function checkKlutz(pokemon: Pokemon) {
  if (pokemon.hasAbility('Klutz') && !EV_ITEMS.includes(pokemon.item!)) {
    pokemon.item = '' as ItemName;
  }
}

export function checkIntimidate(source: Pokemon, target: Pokemon) {
  if (
    source.ability === 'Intimidate' &&
    source.abilityOn &&
    !target.hasAbility('Clear Body', 'White Smoke', 'Hyper Cutter', 'Full Metal Body')
  ) {
    if (target.hasAbility('Contrary', 'Defiant')) {
      target.boosts.atk = Math.min(6, target.boosts.atk + 1);
    } else if (target.hasAbility('Simple')) {
      target.boosts.atk = Math.max(-6, target.boosts.atk - 2);
    } else {
      target.boosts.atk = Math.max(-6, target.boosts.atk - 1);
    }
  }
}

export function checkDownload(source: Pokemon, target: Pokemon) {
  if (source.hasAbility('Download')) {
    if (target.stats.spd <= target.stats.def) {
      source.boosts.spa = Math.min(6, source.boosts.spa + 1);
    } else {
      source.boosts.atk = Math.min(6, source.boosts.atk + 1);
    }
  }
}

export function checkIntrepidSword(source: Pokemon) {
  if (source.hasAbility('Intrepid Sword')) {
    source.boosts.atk = Math.min(6, source.boosts.atk + 1);
  }
}

export function checkDauntlessShield(source: Pokemon) {
  if (source.hasAbility('Dauntless Shield')) {
    source.boosts.def = Math.min(6, source.boosts.def + 1);
  }
}

export function checkInfiltrator(pokemon: Pokemon, affectedSide: Side) {
  if (pokemon.hasAbility('Infiltrator')) {
    affectedSide.isReflect = false;
    affectedSide.isLightScreen = false;
    affectedSide.isAuroraVeil = false;
  }
}

export function checkSeedBoost(pokemon: Pokemon, field: Field) {
  if (!pokemon.item) return;
  if (field.terrain && pokemon.item.includes('Seed')) {
    const terrainSeed = pokemon.item.substring(0, pokemon.item.indexOf(' '));
    if (terrainSeed === field.terrain) {
      if (terrainSeed === 'Grassy' || terrainSeed === 'Electric') {
        pokemon.boosts.def = pokemon.hasAbility('Contrary')
          ? Math.max(-6, pokemon.boosts.def - 1)
          : Math.min(6, pokemon.boosts.def + 1);
      } else {
        pokemon.boosts.spd = pokemon.hasAbility('Contrary')
          ? Math.max(-6, pokemon.boosts.spd - 1)
          : Math.min(6, pokemon.boosts.spd + 1);
      }
    }
  }
}

export function chainMods(mods: number[]) {
  let M = 0x1000;
  for (const mod of mods) {
    if (mod !== 0x1000) {
      M = (M * mod + 0x800) >> 12;
    }
  }
  return M;
}

export function getBaseDamage(level: number, basePower: number, attack: number, defense: number) {
  return Math.floor(
    Math.floor((Math.floor((2 * level) / 5 + 2) * basePower * attack) / defense) / 50 + 2
  );
}

export function getFinalDamage(
  baseAmount: number,
  i: number,
  effectiveness: number,
  isBurned: boolean,
  stabMod: number,
  finalMod: number,
  protect?: boolean
) {
  let damageAmount = Math.floor(
    pokeRound((Math.floor((baseAmount * (85 + i)) / 100) * stabMod) / 0x1000) * effectiveness
  );
  if (isBurned) damageAmount = Math.floor(damageAmount / 2);
  if (protect) damageAmount = pokeRound((damageAmount * 0x400) / 0x1000);
  return pokeRound(Math.max(1, (damageAmount * finalMod) / 0x1000));
}

export function getWeightFactor(pokemon: Pokemon) {
  return pokemon.hasAbility('Heavy Metal') ? 2 : pokemon.hasAbility('Light Metal') ? 0.5 : 1;
}

export function countBoosts(gen: Generation, boosts: StatsTable) {
  let sum = 0;
  // NOTE: starting from 1 because HP is not boostable
  for (let i = 1; i < STATS[gen.num].length; i++) {
    // Only positive boosts are counted
    const boost = boosts[STATS[gen.num][i]];
    if (boost && boost > 0) sum += boost;
  }
  return sum;
}

export function getEVDescriptionText(
  gen: Generation,
  pokemon: Pokemon,
  stat: 'atk' | 'def' | 'spd' | 'spa',
  natureName: NatureName
): string {
  const nature = gen.natures.get(toID(natureName))!;
  return (
    pokemon.evs[stat] +
    (nature.plus === nature.minus
      ? ''
      : nature.plus === stat
        ? '+'
        : nature.minus === stat
          ? '-'
          : '') +
    ' ' +
    Stats.displayStat(stat)
  );
}
