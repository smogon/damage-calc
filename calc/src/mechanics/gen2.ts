import { Pokemon } from '../pokemon';
import { Move } from '../move';
import { Field } from '../field';
import { TYPE_CHART } from '../data/types';
import { AT, DF, SA, SD, SP } from '../stats';
import { RawDesc } from '../desc';
import { getItemBoostType } from '../data/items';
import { getModifiedStat, getFinalSpeed, getMoveEffectiveness } from './util';

const GSC = 2;

function calculateGSC(attacker: Pokemon, defender: Pokemon, move: Move, field: Field) {
  attacker.stats[AT] = getModifiedStat(attacker.rawStats[AT], attacker.boosts[AT], GSC);
  attacker.stats[DF] = getModifiedStat(attacker.rawStats[DF], attacker.boosts[DF], GSC);
  attacker.stats[SA] = getModifiedStat(attacker.rawStats[SA], attacker.boosts[SA], GSC);
  attacker.stats[SD] = getModifiedStat(attacker.rawStats[SD], attacker.boosts[SD], GSC);
  attacker.stats[SP] = getFinalSpeed(GSC, attacker, field, field.attackerSide);

  defender.stats[AT] = getModifiedStat(defender.rawStats[AT], defender.boosts[AT], GSC);
  defender.stats[DF] = getModifiedStat(defender.rawStats[DF], defender.boosts[DF], GSC);
  defender.stats[SA] = getModifiedStat(defender.rawStats[SA], defender.boosts[SA], GSC);
  defender.stats[SD] = getModifiedStat(defender.rawStats[SD], defender.boosts[SD], GSC);
  defender.stats[SP] = getFinalSpeed(GSC, defender, field, field.defenderSide);

  const description: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
  };

  if (move.bp === 0) {
    return { damage: [0], description };
  }

  if (field.defenderSide.isProtected) {
    description.isProtected = true;
    return { damage: [0], description };
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
    return { damage: [0], description };
  }

  const lv = attacker.level;
  if (move.name === 'Seismic Toss' || move.name === 'Night Shade') {
    return { damage: [lv], description };
  }

  if (move.hits > 1) {
    description.hits = move.hits;
  }

  // Flail and Reversal are variable BP and never crit
  if (move.name === 'Flail' || move.name === 'Reversal') {
    move.isCrit = false;
    const p = Math.floor((48 * attacker.curHP) / attacker.maxHP);
    move.bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
    description.moveBP = move.bp;
  }

  const isPhysical = TYPE_CHART[GSC][move.type].category === 'Physical';
  const attackStat = isPhysical ? AT : SA;
  const defenseStat = isPhysical ? DF : SD;
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
    return { damage: [baseDamage], description };
  }

  const damage = [];
  for (let i = 217; i <= 255; i++) {
    damage[i - 217] = Math.floor((baseDamage * i) / 255);
  }
  return { damage, description };
}

// TODO: switch to inline exports no longer relying on globals
export { calculateGSC };
