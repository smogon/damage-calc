import {getItemBoostType} from '../data/items';
import {NATURES} from '../data/natures';
import {TYPE_CHART} from '../data/types';
import {RawDesc} from '../desc';
import {Pokemon} from '../pokemon';
import {Move} from '../move';
import {Field} from '../field';
import {Result} from '../result';
import {displayStat} from '../stats';
import {
  getModifiedStat,
  getFinalSpeed,
  getMoveEffectiveness,
  checkAirLock,
  checkForecast,
  checkIntimidate,
} from './util';

const ADV = 3;

export function calculateADV(attacker: Pokemon, defender: Pokemon, move: Move, field: Field) {
  checkAirLock(attacker, field);
  checkAirLock(defender, field);
  checkForecast(attacker, field.weather);
  checkForecast(defender, field.weather);
  checkIntimidate(attacker, defender);
  checkIntimidate(defender, attacker);
  attacker.stats.spe = getFinalSpeed(ADV, attacker, field, field.attackerSide);
  defender.stats.spe = getFinalSpeed(ADV, defender, field, field.defenderSide);

  const description: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
  };

  const damage: number[] = [];
  const result = new Result(ADV, attacker, defender, move, field, damage, description);

  if (move.bp === 0) {
    damage.push(0);
    return result;
  }

  if (field.defenderSide.isProtected) {
    description.isProtected = true;
    damage.push(0);
    return result;
  }

  if (move.name === 'Weather Ball') {
    move.type = field.hasWeather('Sun')
      ? 'Fire'
      : field.hasWeather('Rain')
      ? 'Water'
      : field.hasWeather('Sand')
      ? 'Rock'
      : field.hasWeather('Hail')
      ? 'Ice'
      : 'Normal';
    description.weather = field.weather;
    description.moveType = move.type;
    description.moveBP = move.bp;
  }

  const typeEffect1 = getMoveEffectiveness(
    ADV,
    move,
    defender.type1,
    field.defenderSide.isForesight
  );
  const typeEffect2 = defender.type2
    ? getMoveEffectiveness(ADV, move, defender.type2, field.defenderSide.isForesight)
    : 1;
  const typeEffectiveness = typeEffect1 * typeEffect2;

  if (typeEffectiveness === 0) {
    damage.push(0);
    return result;
  }

  if (
    (defender.hasAbility('Flash Fire', 'Flash Fire (activated)') && move.type === 'Fire') ||
    (defender.hasAbility('Levitate') && move.type === 'Ground') ||
    (defender.hasAbility('Volt Absorb') && move.type === 'Electric') ||
    (defender.hasAbility('Water Absorb') && move.type === 'Water') ||
    (move.type !== 'None' && defender.hasAbility('Wonder Guard') && typeEffectiveness <= 1) ||
    (defender.hasAbility('Soundproof') && move.isSound)
  ) {
    description.defenderAbility = defender.ability;
    damage.push(0);
    return result;
  }

  description.HPEVs = defender.evs.hp + ' HP';

  const lv = attacker.level;
  if (move.name === 'Seismic Toss' || move.name === 'Night Shade') {
    damage.push(lv);
    return result;
  }

  if (move.hits > 1) {
    description.hits = move.hits;
  }

  let bp;
  switch (move.name) {
    case 'Flail':
    case 'Reversal':
      const p = Math.floor((48 * attacker.curHP) / attacker.maxHP());
      bp = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
      description.moveBP = bp;
      break;
    case 'Eruption':
    case 'Water Spout':
      bp = Math.max(1, Math.floor((150 * attacker.curHP) / attacker.maxHP()));
      description.moveBP = bp;
      break;
    case 'Low Kick':
      const w = defender.weight;
      bp = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
      description.moveBP = bp;
      break;
    default:
      bp = move.bp;
  }

  const isPhysical = TYPE_CHART[ADV][move.type]!.category === 'Physical';
  const attackStat = isPhysical ? 'atk' : 'spa';
  description.attackEVs =
    attacker.evs[attackStat] +
    (NATURES[attacker.nature][0] === attackStat
      ? '+'
      : NATURES[attacker.nature][1] === attackStat
      ? '-'
      : '') +
    ' ' +
    displayStat(attackStat);
  const defenseStat = isPhysical ? 'def' : 'spd';
  description.defenseEVs =
    defender.evs[defenseStat] +
    (NATURES[defender.nature][0] === defenseStat
      ? '+'
      : NATURES[defender.nature][1] === defenseStat
      ? '-'
      : '') +
    ' ' +
    displayStat(defenseStat);
  let at = attacker.rawStats[attackStat];
  let df = defender.rawStats[defenseStat];

  if (isPhysical && attacker.hasAbility('Huge Power', 'Pure Power')) {
    at *= 2;
    description.attackerAbility = attacker.ability;
  }

  if (!attacker.hasItem('Sea Incense') && getItemBoostType(attacker.item) === move.type) {
    at = Math.floor(at * 1.1);
    description.attackerItem = attacker.item;
  } else if (attacker.hasItem('Sea Incense') && move.type === 'Water') {
    at = Math.floor(at * 1.05);
    description.attackerItem = attacker.item;
  } else if (
    (isPhysical && attacker.hasItem('Choice Band')) ||
    (!isPhysical && attacker.hasItem('Soul Dew') && attacker.named('Latios', 'Latias'))
  ) {
    at = Math.floor(at * 1.5);
    description.attackerItem = attacker.item;
  } else if (
    (!isPhysical && attacker.hasItem('Deep Sea Tooth') && attacker.named('Clamperl')) ||
    (!isPhysical && attacker.hasItem('Light Ball') && attacker.named('Pikachu')) ||
    (isPhysical && attacker.hasItem('Thick Club') && attacker.named('Cubone', 'Marowak'))
  ) {
    at *= 2;
    description.attackerItem = attacker.item;
  }

  if (!isPhysical && defender.hasItem('Soul Dew') && defender.named('Latios', 'Latias')) {
    df = Math.floor(df * 1.5);
    description.defenderItem = defender.item;
  } else if (
    (!isPhysical && defender.hasItem('Deep Sea Scale') && defender.named('Clamperl')) ||
    (isPhysical && defender.hasItem('Metal Powder') && defender.named('Ditto'))
  ) {
    df *= 2;
    description.defenderItem = defender.item;
  }

  if (defender.hasAbility('Thick Fat') && (move.type === 'Fire' || move.type === 'Ice')) {
    at = Math.floor(at / 2);
    description.defenderAbility = defender.ability;
  } else if (isPhysical && defender.hasAbility('Marvel Scale') && defender.status !== 'Healthy') {
    df = Math.floor(df * 1.5);
    description.defenderAbility = defender.ability;
  }

  if (
    (isPhysical &&
      (attacker.hasAbility('Hustle') ||
        (attacker.hasAbility('Guts') && attacker.status !== 'Healthy'))) ||
    (!isPhysical && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus'))
  ) {
    at = Math.floor(at * 1.5);
    description.attackerAbility = attacker.ability;
  } else if (
    attacker.curHP <= attacker.maxHP() / 3 &&
    ((attacker.hasAbility('Overgrow') && move.type === 'Grass') ||
      (attacker.hasAbility('Blaze') && move.type === 'Fire') ||
      (attacker.hasAbility('Torrent') && move.type === 'Water') ||
      (attacker.hasAbility('Swarm') && move.type === 'Bug'))
  ) {
    bp = Math.floor(bp * 1.5);
    description.attackerAbility = attacker.ability;
  }

  if (move.name === 'Explosion' || move.name === 'Self-Destruct') {
    df = Math.floor(df / 2);
  }

  const isCritical = move.isCrit && !defender.hasAbility('Battle Armor', 'Shell Armor');

  const attackBoost = attacker.boosts[attackStat];
  const defenseBoost = defender.boosts[defenseStat];
  if (attackBoost > 0 || (!isCritical && attackBoost < 0)) {
    at = getModifiedStat(at, attackBoost);
    description.attackBoost = attackBoost;
  }
  if (defenseBoost < 0 || (!isCritical && defenseBoost > 0)) {
    df = getModifiedStat(df, defenseBoost);
    description.defenseBoost = defenseBoost;
  }

  let baseDamage = Math.floor(Math.floor((Math.floor((2 * lv) / 5 + 2) * at * bp) / df) / 50);

  if (attacker.hasStatus('Burned') && isPhysical && attacker.ability !== 'Guts') {
    baseDamage = Math.floor(baseDamage / 2);
    description.isBurned = true;
  }

  if (!isCritical) {
    const screenMultiplier = field.gameType !== 'Singles' ? 2 / 3 : 1 / 2;
    if (isPhysical && field.defenderSide.isReflect) {
      baseDamage = Math.floor(baseDamage * screenMultiplier);
      description.isReflect = true;
    } else if (!isPhysical && field.defenderSide.isLightScreen) {
      baseDamage = Math.floor(baseDamage * screenMultiplier);
      description.isLightScreen = true;
    }
  }

  if (field.gameType !== 'Singles' && move.isSpread && move.isSpread !== 'allAdjacent') {
    baseDamage = Math.floor(baseDamage / 2);
  }

  if (
    (field.hasWeather('Sun') && move.type === 'Fire') ||
    (field.hasWeather('Rain') && move.type === 'Water')
  ) {
    baseDamage = Math.floor(baseDamage * 1.5);
    description.weather = field.weather;
  } else if (
    (field.hasWeather('Sun') && move.type === 'Water') ||
    (field.hasWeather('Rain') && move.type === 'Fire') ||
    (move.name === 'Solar Beam' && field.hasWeather('Rain', 'Sand', 'Hail'))
  ) {
    baseDamage = Math.floor(baseDamage / 2);
    description.weather = field.weather;
  }

  if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.type === 'Fire') {
    baseDamage = Math.floor(baseDamage * 1.5);
    description.attackerAbility = 'Flash Fire';
  }

  baseDamage = (move.category === 'Physical' ? Math.max(1, baseDamage) : baseDamage) + 2;

  if (isCritical) {
    baseDamage *= 2;
    description.isCritical = true;
  }

  if (move.name === 'Weather Ball' && field.weather) {
    baseDamage *= 2;
    description.moveBP = move.bp * 2;
  }

  if (field.attackerSide.isHelpingHand) {
    baseDamage = Math.floor(baseDamage * 1.5);
    description.isHelpingHand = true;
  }

  if (move.type === attacker.type1 || move.type === attacker.type2) {
    baseDamage = Math.floor(baseDamage * 1.5);
  }

  baseDamage = Math.floor(baseDamage * typeEffectiveness);
  for (let i = 85; i <= 100; i++) {
    damage[i - 85] = Math.max(1, Math.floor((baseDamage * i) / 100));
  }
  return result;
}
