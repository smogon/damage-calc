import {Generation} from '../data/interface';
import {toID} from '../util';
import {getItemBoostType} from '../items';
import {RawDesc} from '../desc';
import {Field} from '../field';
import {Move} from '../move';
import {Pokemon} from '../pokemon';
import {Result} from '../result';
import {computeFinalStats, getMoveEffectiveness} from './util';

export function calculateGSC(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field
) {
  computeFinalStats(gen, attacker, defender, field, 'atk', 'def', 'spa', 'spd', 'spe');

  const desc: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
  };

  const damage: number[] = [];
  const result = new Result(gen, attacker, defender, move, field, damage, desc);

  if (move.bp === 0) {
    damage.push(0);
    return result;
  }

  if (field.defenderSide.isProtected) {
    desc.isProtected = true;
    damage.push(0);
    return result;
  }

  const type1Effectiveness =
    getMoveEffectiveness(gen, move, defender.type1, field.defenderSide.isForesight);
  const type2Effectiveness = defender.type2
    ? getMoveEffectiveness(gen, move, defender.type2, field.defenderSide.isForesight)
    : 1;
  const typeEffectiveness = type1Effectiveness * type2Effectiveness;

  if (typeEffectiveness === 0) {
    damage.push(0);
    return result;
  }

  let lv = attacker.level;
  if (move.named('Seismic Toss', 'Night Shade')) {
    damage.push(lv);
    return result;
  } else if (move.named('Sonic Boom')) {
    damage.push(20);
    return result;
  } else if (move.named('Dragon Rage')) {
    damage.push(40);
    return result;
  }

  if (move.hits > 1) {
    desc.hits = move.hits;
  }

  // Flail and Reversal are variable BP and never crit
  if (move.named('Flail', 'Reversal')) {
    move.isCrit = false;
    const p = Math.floor((48 * attacker.curHP) / attacker.maxHP());
    move.bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
    desc.moveBP = move.bp;
  }

  const isPhysical = gen.types.get(toID(move.type))!.category === 'Physical';
  const attackStat = isPhysical ? 'atk' : 'spa';
  const defenseStat = isPhysical ? 'def' : 'spd';
  let at = attacker.stats[attackStat];
  let df = defender.stats[defenseStat];

  // ignore Reflect, Light Screen, stat stages, and burns if attack is a crit and attacker does
  // not have stat stage advantage
  const ignoreMods = move.isCrit && attacker.boosts[attackStat] <= defender.boosts[defenseStat];

  if (ignoreMods) {
    at = attacker.rawStats[attackStat];
    df = defender.rawStats[defenseStat];
  } else {
    if (attacker.boosts[attackStat] !== 0) desc.attackBoost = attacker.boosts[attackStat];
    if (defender.boosts[defenseStat] !== 0) desc.defenseBoost = defender.boosts[defenseStat];
    if (isPhysical && attacker.hasStatus('brn')) {
      at = Math.floor(at / 2);
      desc.isBurned = true;
    }
  }

  if (move.named('Explosion', 'Self-Destruct')) {
    df = Math.floor(df / 2);
  }

  if (!ignoreMods) {
    if (isPhysical && field.defenderSide.isReflect) {
      df *= 2;
      desc.isReflect = true;
    } else if (!isPhysical && field.defenderSide.isLightScreen) {
      df *= 2;
      desc.isLightScreen = true;
    }
  }

  if ((attacker.named('Pikachu') && attacker.hasItem('Light Ball') && !isPhysical) ||
      (attacker.named('Cubone', 'Marowak') && attacker.hasItem('Thick Club') && isPhysical)) {
    at *= 2;
    desc.attackerItem = attacker.item;
  }

  if (at > 255 || df > 255) {
    at = Math.floor(at / 4) % 256;
    df = Math.floor(df / 4) % 256;
  }

  // Gen 2 Present has a glitched damage calculation using the secondary types of the Pokemon
  // for the Attacker's Level and Defender's Defense.
  if (move.named('Present')) {
    const lookup: {[id: string]: number} = {
      Normal: 0, Fighting: 1, Flying: 2, Poison: 3, Ground: 4, Rock: 5, Bug: 7,
      Ghost: 8, Steel: 9, '???': 19, Fire: 20, Water: 21, Grass: 22, Electric: 23,
      Psychic: 24, Ice: 25, Dragon: 26, Dark: 27,
    };

    at = 10;
    df = Math.max(lookup[attacker.type2 ? attacker.type2 : attacker.type1], 1);
    lv = Math.max(lookup[defender.type2 ? defender.type2 : defender.type1], 1);
  }

  if (defender.named('Ditto') && defender.hasItem('Metal Powder')) {
    df = Math.floor(df * 1.5);
    desc.defenderItem = defender.item;
  }

  let baseDamage = Math.floor(
    Math.floor((Math.floor((2 * lv) / 5 + 2) * Math.max(1, at) * move.bp) / Math.max(1, df)) / 50
  );

  if (move.isCrit) {
    baseDamage *= 2;
    desc.isCritical = true;
  }

  if (move.named('Pursuit') && field.defenderSide.isSwitching) {
    baseDamage = Math.floor(baseDamage * 2);
    desc.isSwitching = true;
  }

  // In Gen 2 and no other gens, Dragon Fang in a no-op and Dragon Scale erroneously has its effect
  const itemBoostType =
    attacker.hasItem('Dragon Fang')
      ? undefined
      : getItemBoostType(attacker.hasItem('Dragon Scale') ? 'Dragon Fang' : attacker.item);

  if (move.hasType(itemBoostType)) {
    baseDamage = Math.floor(baseDamage * 1.1);
    desc.attackerItem = attacker.item;
  }

  baseDamage = Math.min(997, baseDamage) + 2;

  if ((field.hasWeather('Sun') && move.hasType('Fire')) ||
      (field.hasWeather('Rain') && move.hasType('Water'))) {
    baseDamage = Math.floor(baseDamage * 1.5);
    desc.weather = field.weather;
  } else if (
    (field.hasWeather('Sun') && move.hasType('Water')) ||
    (field.hasWeather('Rain') && (move.hasType('Fire') || move.named('Solar Beam')))
  ) {
    baseDamage = Math.floor(baseDamage / 2);
    desc.weather = field.weather;
  }

  if (move.hasType(attacker.type1, attacker.type2)) {
    baseDamage = Math.floor(baseDamage * 1.5);
  }

  baseDamage = Math.floor(baseDamage * typeEffectiveness);

  // Flail and Reversal don't use random factor
  if (move.named('Flail', 'Reversal')) {
    damage.push(baseDamage);
    return result;
  }

  for (let i = 217; i <= 255; i++) {
    damage[i - 217] = Math.floor((baseDamage * i) / 255);
  }

  return result;
}
