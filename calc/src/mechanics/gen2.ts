import {getItemBoostType} from '../data/items';
import {TYPE_CHART} from '../data/types';
import {RawDesc} from '../desc';
import {Field} from '../field';
import {Move} from '../move';
import {Pokemon} from '../pokemon';
import {Result} from '../result';
import {getModifiedStat, getFinalSpeed, getMoveEffectiveness} from './util';

const GSC = 2;

export function calculateGSC(attacker: Pokemon, defender: Pokemon, move: Move, field: Field) {
  attacker.stats.atk = getModifiedStat(attacker.rawStats.atk, attacker.boosts.atk, GSC);
  attacker.stats.def = getModifiedStat(attacker.rawStats.def, attacker.boosts.def, GSC);
  attacker.stats.spa = getModifiedStat(attacker.rawStats.spa, attacker.boosts.spa, GSC);
  attacker.stats.spd = getModifiedStat(attacker.rawStats.spd, attacker.boosts.spd, GSC);
  attacker.stats.spe = getFinalSpeed(GSC, attacker, field, field.attackerSide);

  defender.stats.atk = getModifiedStat(defender.rawStats.atk, defender.boosts.atk, GSC);
  defender.stats.def = getModifiedStat(defender.rawStats.def, defender.boosts.def, GSC);
  defender.stats.spa = getModifiedStat(defender.rawStats.spa, defender.boosts.spa, GSC);
  defender.stats.spd = getModifiedStat(defender.rawStats.spd, defender.boosts.spd, GSC);
  defender.stats.spe = getFinalSpeed(GSC, defender, field, field.defenderSide);

  const description: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
  };

  const damage: number[] = [];
  const result = new Result(GSC, attacker, defender, move, field, damage, description);

  if (move.bp === 0) {
    damage.push(0);
    return result;
  }

  if (field.defenderSide.isProtected) {
    description.isProtected = true;
    damage.push(0);
    return result;
  }

  const typeEffect1 = getMoveEffectiveness(
    GSC,
    move,
    defender.type1,
    field.defenderSide.isForesight
  );
  const typeEffect2 = defender.type2
    ? getMoveEffectiveness(GSC, move, defender.type2, field.defenderSide.isForesight)
    : 1;
  const typeEffectiveness = typeEffect1 * typeEffect2;

  if (typeEffectiveness === 0) {
    damage.push(0);
    return result;
  }

  let lv = attacker.level;
  if (move.name === 'Seismic Toss' || move.name === 'Night Shade') {
    damage.push(lv);
    return result;
  }

  if (move.hits > 1) {
    description.hits = move.hits;
  }

  // Flail and Reversal are variable BP and never crit
  if (move.name === 'Flail' || move.name === 'Reversal') {
    move.isCrit = false;
    const p = Math.floor((48 * attacker.curHP) / attacker.maxHP());
    move.bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
    description.moveBP = move.bp;
  }

  const isPhysical = TYPE_CHART[GSC][move.type]!.category === 'Physical';
  const attackStat = isPhysical ? 'atk' : 'spa';
  const defenseStat = isPhysical ? 'def' : 'spd';
  let at = attacker.stats[attackStat];
  let df = defender.stats[defenseStat];

  // ignore Reflect, Light Screen, stat stages, and burns if attack is a crit and attacker does not have stat stage advantage
  const ignoreMods = move.isCrit && attacker.boosts[attackStat] <= defender.boosts[defenseStat];

  if (ignoreMods) {
    at = attacker.rawStats[attackStat];
    df = defender.rawStats[defenseStat];
  } else {
    if (attacker.boosts[attackStat] !== 0) {
      description.attackBoost = attacker.boosts[attackStat];
    }
    if (defender.boosts[defenseStat] !== 0) {
      description.defenseBoost = defender.boosts[defenseStat];
    }
    if (isPhysical && attacker.hasStatus('Burned')) {
      at = Math.floor(at / 2);
      description.isBurned = true;
    }
  }

  if (move.name === 'Explosion' || move.name === 'Self-Destruct') {
    df = Math.floor(df / 2);
  }

  if (!ignoreMods) {
    if (isPhysical && field.defenderSide.isReflect) {
      df *= 2;
      description.isReflect = true;
    } else if (!isPhysical && field.defenderSide.isLightScreen) {
      df *= 2;
      description.isLightScreen = true;
    }
  }

  if (
    (attacker.named('Pikachu') && attacker.hasItem('Light Ball') && !isPhysical) ||
    (attacker.named('Cubone', 'Marowak') && attacker.hasItem('Thick Club') && isPhysical)
  ) {
    at *= 2;
    description.attackerItem = attacker.item;
  }

  if (at > 255 || df > 255) {
    at = Math.floor(at / 4) % 256;
    df = Math.floor(df / 4) % 256;
  }

  // Gen 2 Present has a glitched damage calculation using the secondary types of the Pokemon for the Attacker's Level and Defender's Defense.
  if (move.name === 'Present') {
    const type_index: {[id: string]: number} = {
      Normal: 0,
      Fighting: 1,
      Flying: 2,
      Poison: 3,
      Ground: 4,
      Rock: 5,
      Bug: 7,
      Ghost: 8,
      Steel: 9,
      None: 19,
      Fire: 20,
      Water: 21,
      Grass: 22,
      Electric: 23,
      Psychic: 24,
      Ice: 25,
      Dragon: 26,
      Dark: 27,
    };

    at = 10;
    df = Math.max(type_index[attacker.type2 ? attacker.type2 : attacker.type1], 1);
    lv = Math.max(type_index[defender.type2 ? defender.type2 : defender.type1], 1);
  }

  if (defender.named('Ditto') && defender.hasItem('Metal Powder')) {
    df = Math.floor(df * 1.5);
    description.defenderItem = defender.item;
  }

  let baseDamage = Math.floor(
    Math.floor((Math.floor((2 * lv) / 5 + 2) * Math.max(1, at) * move.bp) / Math.max(1, df)) / 50
  );

  if (move.isCrit) {
    baseDamage *= 2;
    description.isCritical = true;
  }

  if (getItemBoostType(attacker.item) === move.type) {
    baseDamage = Math.floor(baseDamage * 1.1);
    description.attackerItem = attacker.item;
  }

  baseDamage = Math.min(997, baseDamage) + 2;

  if (
    (field.hasWeather('Sun') && move.type === 'Fire') ||
    (field.hasWeather('Rain') && move.type === 'Water')
  ) {
    baseDamage = Math.floor(baseDamage * 1.5);
    description.weather = field.weather;
  } else if (
    (field.hasWeather('Sun') && move.type === 'Water') ||
    (field.hasWeather('Rain') && (move.type === 'Fire' || move.name === 'Solar Beam'))
  ) {
    baseDamage = Math.floor(baseDamage / 2);
    description.weather = field.weather;
  }

  if (move.type === attacker.type1 || move.type === attacker.type2) {
    baseDamage = Math.floor(baseDamage * 1.5);
  }

  baseDamage = Math.floor(baseDamage * typeEffectiveness);

  // Flail and Reversal don't use random factor
  if (move.name === 'Flail' || move.name === 'Reversal') {
    damage.push(baseDamage);
    return result;
  }

  for (let i = 217; i <= 255; i++) {
    damage[i - 217] = Math.floor((baseDamage * i) / 255);
  }
  return result;
}
