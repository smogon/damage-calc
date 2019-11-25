import {getItemBoostType, getNaturalGift, getFlingPower, getBerryResistType} from '../data/items';
import {NATURES} from '../data/natures';
import {RawDesc} from '../desc';
import {Field} from '../field';
import {Move} from '../move';
import {Pokemon} from '../pokemon';
import {Result} from '../result';
import {displayStat} from '../stats';
import {
  getModifiedStat,
  getFinalSpeed,
  getMoveEffectiveness,
  checkAirLock,
  checkForecast,
  checkKlutz,
  checkIntimidate,
  checkDownload,
  countBoosts,
  pokeRound,
} from './util';

const DPP = 4;

export function calculateDPP(attacker: Pokemon, defender: Pokemon, move: Move, field: Field) {
  checkAirLock(attacker, field);
  checkAirLock(defender, field);
  checkForecast(attacker, field.weather);
  checkForecast(defender, field.weather);
  checkKlutz(attacker);
  checkKlutz(defender);
  checkIntimidate(attacker, defender);
  checkIntimidate(defender, attacker);
  checkDownload(attacker, defender);
  checkDownload(defender, attacker);
  attacker.stats.spe = getFinalSpeed(DPP, attacker, field, field.attackerSide);
  defender.stats.spe = getFinalSpeed(DPP, defender, field, field.defenderSide);

  const description: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
  };

  const damage: number[] = [];
  const result = new Result(DPP, attacker, defender, move, field, damage, description);

  if (move.bp === 0) {
    damage.push(0);
    return result;
  }

  if (field.defenderSide.isProtected && !move.bypassesProtect) {
    description.isProtected = true;
    damage.push(0);
    return result;
  }

  if (attacker.hasAbility('Mold Breaker')) {
    defender.ability = '';
    description.attackerAbility = attacker.ability;
  }

  const isCritical = move.isCrit && !defender.hasAbility('Battle Armor', 'Shell Armor');

  let basePower = move.bp;
  if (move.name === 'Weather Ball') {
    if (field.hasWeather('Sun')) {
      move.type = 'Fire';
      basePower *= 2;
    } else if (field.hasWeather('Rain')) {
      move.type = 'Water';
      basePower *= 2;
    } else if (field.hasWeather('Sand')) {
      move.type = 'Rock';
      basePower *= 2;
    } else if (field.hasWeather('Hail')) {
      move.type = 'Ice';
      basePower *= 2;
    } else {
      move.type = 'Normal';
    }
    description.weather = field.weather;
    description.moveType = move.type;
    description.moveBP = basePower;
  } else if (move.name === 'Judgment' && attacker.item && attacker.item.indexOf('Plate') !== -1) {
    move.type = getItemBoostType(attacker.item)!;
  } else if (
    move.name === 'Natural Gift' &&
    attacker.item &&
    attacker.item.indexOf('Berry') !== -1
  ) {
    const gift = getNaturalGift(DPP, attacker.item)!;
    move.type = gift.t;
    move.bp = gift.p;
    description.attackerItem = attacker.item;
    description.moveBP = move.bp;
    description.moveType = move.type;
  }

  if (attacker.hasAbility('Normalize')) {
    move.type = 'Normal';
    description.attackerAbility = attacker.ability;
  }

  const typeEffect1 = getMoveEffectiveness(
    DPP,
    move,
    defender.type1,
    attacker.hasAbility('Scrappy') || field.defenderSide.isForesight,
    field.isGravity
  );
  const typeEffect2 = defender.type2
    ? getMoveEffectiveness(
        DPP,
        move,
        defender.type2,
        attacker.hasAbility('Scrappy') || field.defenderSide.isForesight,
        field.isGravity
      )
    : 1;
  const typeEffectiveness = typeEffect1 * typeEffect2;

  if (typeEffectiveness === 0) {
    damage.push(0);
    return result;
  }
  const ignoresWonderGuard = move.type === 'None' || move.name === 'Fire Fang';
  if (
    (!ignoresWonderGuard && defender.hasAbility('Wonder Guard') && typeEffectiveness <= 1) ||
    (move.type === 'Fire' && defender.hasAbility('Flash Fire')) ||
    (move.type === 'Water' && defender.hasAbility('Dry Skin', 'Water Absorb')) ||
    (move.type === 'Electric' && defender.hasAbility('Motor Drive', 'Volt Absorb')) ||
    (move.type === 'Ground' && !field.isGravity && defender.hasAbility('Levitate')) ||
    (move.isSound && defender.hasAbility('Soundproof'))
  ) {
    description.defenderAbility = defender.ability;
    damage.push(0);
    return result;
  }

  description.HPEVs = defender.evs.hp + ' HP';

  if (move.name === 'Seismic Toss' || move.name === 'Night Shade') {
    damage.push(attacker.level);
    return result;
  }

  if (move.hits > 1) {
    description.hits = move.hits;
  }
  const turnOrder = attacker.stats.spe > defender.stats.spe ? 'FIRST' : 'LAST';

  ////////////////////////////////
  ////////// BASE POWER //////////
  ////////////////////////////////
  switch (move.name) {
    case 'Brine':
      if (defender.curHP <= defender.maxHP() / 2) {
        basePower *= 2;
        description.moveBP = basePower;
      }
      break;
    case 'Eruption':
    case 'Water Spout':
      basePower = Math.max(1, Math.floor((basePower * attacker.curHP) / attacker.maxHP()));
      description.moveBP = basePower;
      break;
    case 'Facade':
      if (attacker.hasStatus('Paralyzed', 'Poisoned', 'Badly Poisoned', 'Burned')) {
        basePower = move.bp * 2;
        description.moveBP = basePower;
      }
      break;
    case 'Flail':
    case 'Reversal':
      const p = Math.floor((48 * attacker.curHP) / attacker.maxHP());
      basePower = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
      description.moveBP = basePower;
      break;
    case 'Fling':
      basePower = getFlingPower(attacker.item);
      description.moveBP = basePower;
      description.attackerItem = attacker.item;
      break;
    case 'Grass Knot':
    case 'Low Kick':
      const w = defender.weight;
      basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
      description.moveBP = basePower;
      break;
    case 'Gyro Ball':
      basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe));
      description.moveBP = basePower;
      break;
    case 'Payback':
      if (turnOrder !== 'FIRST') {
        basePower *= 2;
        description.moveBP = basePower;
      }
      break;
    case 'Punishment':
      const boostCount = countBoosts(DPP, defender.boosts);
      if (boostCount > 0) {
        basePower = Math.min(200, basePower + 20 * boostCount);
        description.moveBP = basePower;
      }
      break;
    case 'Wake-Up Slap':
      if (defender.hasStatus('Asleep')) {
        basePower *= 2;
        description.moveBP = basePower;
      }
      break;
    case 'Crush Grip':
    case 'Wring Out':
      basePower = Math.floor((defender.curHP * 120) / defender.maxHP()) + 1;
      description.moveBP = basePower;
      break;
    default:
      basePower = move.bp;
  }

  if (field.attackerSide.isHelpingHand) {
    basePower = Math.floor(basePower * 1.5);
    description.isHelpingHand = true;
  }

  const isPhysical = move.category === 'Physical';
  if (
    (attacker.hasItem('Muscle Band') && isPhysical) ||
    (attacker.hasItem('Wise Glasses') && !isPhysical)
  ) {
    basePower = Math.floor(basePower * 1.1);
    description.attackerItem = attacker.item;
  } else if (
    getItemBoostType(attacker.item) === move.type ||
    (attacker.hasItem('Adamant Orb') && attacker.named('Dialga')) ||
    (attacker.hasItem('Lustrous Orb') && attacker.named('Palkia')) ||
    (attacker.hasItem('Griseous Orb') &&
      attacker.named('Giratina-Origin') &&
      (move.type === attacker.type1 || move.type === attacker.type2))
  ) {
    basePower = Math.floor(basePower * 1.2);
    description.attackerItem = attacker.item;
  }

  if (
    (attacker.hasAbility('Reckless') && move.hasRecoil) ||
    (attacker.hasAbility('Iron Fist') && move.isPunch)
  ) {
    basePower = Math.floor(basePower * 1.2);
    description.attackerAbility = attacker.ability;
  } else if (
    (attacker.curHP <= attacker.maxHP() / 3 &&
      ((attacker.hasAbility('Overgrow') && move.type === 'Grass') ||
        (attacker.hasAbility('Blaze') && move.type === 'Fire') ||
        (attacker.hasAbility('Torrent') && move.type === 'Water') ||
        (attacker.hasAbility('Swarm') && move.type === 'Bug'))) ||
    (attacker.hasAbility('Technician') && basePower <= 60)
  ) {
    basePower = Math.floor(basePower * 1.5);
    description.attackerAbility = attacker.ability;
  }

  if (
    (defender.hasAbility('Thick Fat') && (move.type === 'Fire' || move.type === 'Ice')) ||
    (defender.hasAbility('Heatproof') && move.type === 'Fire')
  ) {
    basePower = Math.floor(basePower * 0.5);
    description.defenderAbility = defender.ability;
  } else if (defender.hasAbility('Dry Skin') && move.type === 'Fire') {
    basePower = Math.floor(basePower * 1.25);
    description.defenderAbility = defender.ability;
  }

  ////////////////////////////////
  ////////// (SP)ATTACK //////////
  ////////////////////////////////
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
  let attack: number;
  const attackBoost = attacker.boosts[attackStat];
  const rawAttack = attacker.rawStats[attackStat];
  if (attackBoost === 0 || (isCritical && attackBoost < 0)) {
    attack = rawAttack;
  } else if (defender.hasAbility('Unaware')) {
    attack = rawAttack;
    description.defenderAbility = defender.ability;
  } else if (attacker.ability === 'Simple') {
    attack = getSimpleModifiedStat(rawAttack, attackBoost);
    description.attackerAbility = attacker.ability;
    description.attackBoost = attackBoost;
  } else {
    attack = getModifiedStat(rawAttack, attackBoost);
    description.attackBoost = attackBoost;
  }

  if (isPhysical && attacker.hasAbility('Pure Power', 'Huge Power')) {
    attack *= 2;
    description.attackerAbility = attacker.ability;
  } else if (
    field.weather === 'Sun' &&
    (isPhysical ? attacker.hasAbility('Flower Gift') : attacker.hasAbility('Solar Power'))
  ) {
    attack = Math.floor(attack * 1.5);
    description.attackerAbility = attacker.ability;
    description.weather = field.weather;
  } else if (
    isPhysical &&
    (attacker.hasAbility('Hustle') ||
      (attacker.hasAbility('Guts') && !attacker.hasStatus('Healthy')) ||
      (!isPhysical && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus')))
  ) {
    attack = Math.floor(attack * 1.5);
    description.attackerAbility = attacker.ability;
  } else if (isPhysical && attacker.hasAbility('Slow Start') && attacker.abilityOn) {
    attack = Math.floor(attack / 2);
    description.attackerAbility = attacker.ability;
  }

  if (
    (isPhysical ? attacker.hasItem('Choice Band') : attacker.hasItem('Choice Specs')) ||
    (attacker.hasItem('Soul Dew') && attacker.named('Latios', 'Latias') && !isPhysical)
  ) {
    attack = Math.floor(attack * 1.5);
    description.attackerItem = attacker.item;
  } else if (
    (attacker.hasItem('Light Ball') && attacker.named('Pikachu')) ||
    (attacker.hasItem('Thick Club') && attacker.named('Cubone', 'Marowak') && isPhysical) ||
    (attacker.hasItem('Deep Sea Tooth') && attacker.named('Clamperl') && !isPhysical)
  ) {
    attack *= 2;
    description.attackerItem = attacker.item;
  }

  ////////////////////////////////
  ///////// (SP)DEFENSE //////////
  ////////////////////////////////
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
  let defense: number;
  const defenseBoost = defender.boosts[defenseStat];
  const rawDefense = defender.rawStats[defenseStat];
  if (defenseBoost === 0 || (isCritical && defenseBoost > 0)) {
    defense = rawDefense;
  } else if (attacker.hasAbility('Unaware')) {
    defense = rawDefense;
    description.attackerAbility = attacker.ability;
  } else if (defender.hasAbility('Simple')) {
    defense = getSimpleModifiedStat(rawDefense, defenseBoost);
    description.defenderAbility = defender.ability;
    description.defenseBoost = defenseBoost;
  } else {
    defense = getModifiedStat(rawDefense, defenseBoost);
    description.defenseBoost = defenseBoost;
  }

  if (defender.hasAbility('Marvel Scale') && !defender.hasStatus('Healthy') && isPhysical) {
    defense = Math.floor(defense * 1.5);
    description.defenderAbility = defender.ability;
  } else if (defender.hasAbility('Flower Gift') && field.hasWeather('Sun') && !isPhysical) {
    defense = Math.floor(defense * 1.5);
    description.defenderAbility = defender.ability;
    description.weather = field.weather;
  }

  if (defender.hasItem('Soul Dew') && defender.named('Latios', 'Latias') && !isPhysical) {
    defense = Math.floor(defense * 1.5);
    description.defenderItem = defender.item;
  } else if (
    (defender.hasItem('Deep Sea Scale') && defender.named('Clamperl') && !isPhysical) ||
    (defender.hasItem('Metal Powder') && defender.named('Ditto') && isPhysical)
  ) {
    defense *= 2;
    description.defenderItem = defender.item;
  }

  if (field.weather === 'Sand' && defender.hasType('Rock') && !isPhysical) {
    defense = Math.floor(defense * 1.5);
    description.weather = field.weather;
  }

  if (move.name === 'Explosion' || move.name === 'Self-Destruct') {
    defense = Math.floor(defense * 0.5);
  }

  if (defense < 1) {
    defense = 1;
  }

  ////////////////////////////////
  //////////// DAMAGE ////////////
  ////////////////////////////////
  let baseDamage = Math.floor(
    Math.floor((Math.floor((2 * attacker.level) / 5 + 2) * basePower * attack) / 50) / defense
  );

  if (attacker.hasStatus('Burned') && isPhysical && !attacker.hasAbility('Guts')) {
    baseDamage = Math.floor(baseDamage * 0.5);
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

  if (field.gameType !== 'Singles' && move.isSpread) {
    baseDamage = Math.floor((baseDamage * 3) / 4);
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
    baseDamage = Math.floor(baseDamage * 0.5);
    description.weather = field.weather;
  }

  if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.type === 'Fire') {
    baseDamage = Math.floor(baseDamage * 1.5);
    description.attackerAbility = 'Flash Fire';
  }

  baseDamage += 2;

  if (isCritical) {
    if (attacker.hasAbility('Sniper')) {
      baseDamage *= 3;
      description.attackerAbility = attacker.ability;
    } else {
      baseDamage *= 2;
    }
    description.isCritical = isCritical;
  }

  if (attacker.hasItem('Life Orb')) {
    baseDamage = Math.floor(baseDamage * 1.3);
    description.attackerItem = attacker.item;
  }

  // the random factor is applied between the LO mod and the STAB mod, so don't apply anything below this until we're inside the loop
  let stabMod = 1;
  if (move.type === attacker.type1 || move.type === attacker.type2) {
    if (attacker.hasAbility('Adaptability')) {
      stabMod = 2;
      description.attackerAbility = attacker.ability;
    } else {
      stabMod = 1.5;
    }
  }

  let filterMod = 1;
  if (defender.hasAbility('Filter', 'Solid Rock') && typeEffectiveness > 1) {
    filterMod = 0.75;
    description.defenderAbility = defender.ability;
  }
  let ebeltMod = 1;
  if (attacker.hasItem('Expert Belt') && typeEffectiveness > 1) {
    ebeltMod = 1.2;
    description.attackerItem = attacker.item;
  }
  let tintedMod = 1;
  if (attacker.hasAbility('Tinted Lens') && typeEffectiveness < 1) {
    tintedMod = 2;
    description.attackerAbility = attacker.ability;
  }
  let berryMod = 1;
  if (
    getBerryResistType(defender.item) === move.type &&
    (typeEffectiveness > 1 || move.type === 'Normal')
  ) {
    berryMod = 0.5;
    description.defenderItem = defender.item;
  }

  for (let i = 0; i < 16; i++) {
    damage[i] = Math.floor((baseDamage * (85 + i)) / 100);
    damage[i] = Math.floor(damage[i] * stabMod);
    damage[i] = Math.floor(damage[i] * typeEffect1);
    damage[i] = Math.floor(damage[i] * typeEffect2);
    damage[i] = Math.floor(damage[i] * filterMod);
    damage[i] = Math.floor(damage[i] * ebeltMod);
    damage[i] = Math.floor(damage[i] * tintedMod);
    damage[i] = Math.floor(damage[i] * berryMod);
    damage[i] = Math.max(1, damage[i]);
  }
  return result;
}

function getSimpleModifiedStat(stat: number, mod: number) {
  const simpleMod = Math.min(6, Math.max(-6, mod * 2));
  return simpleMod > 0
    ? Math.floor((stat * (2 + simpleMod)) / 2)
    : simpleMod < 0
    ? Math.floor((stat * 2) / (2 - simpleMod))
    : stat;
}
