import {Generation, AbilityName} from '../data/interface';
import {getItemBoostType, getNaturalGift, getFlingPower, getBerryResistType} from '../items';
import {RawDesc} from '../desc';
import {Field} from '../field';
import {Move} from '../move';
import {Pokemon} from '../pokemon';
import {Result} from '../result';
import {
  getModifiedStat,
  getEVDescriptionText,
  getFinalSpeed,
  getMoveEffectiveness,
  checkAirLock,
  checkForecast,
  checkItem,
  checkIntimidate,
  checkDownload,
  countBoosts,
  handleFixedDamageMoves,
} from './util';

export function calculateDPP(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field
) {
  // #region Initial

  checkAirLock(attacker, field);
  checkAirLock(defender, field);
  checkForecast(attacker, field.weather);
  checkForecast(defender, field.weather);
  checkItem(attacker);
  checkItem(defender);
  checkIntimidate(gen, attacker, defender);
  checkIntimidate(gen, defender, attacker);
  checkDownload(attacker, defender);
  checkDownload(defender, attacker);
  attacker.stats.spe = getFinalSpeed(gen, attacker, field, field.attackerSide);
  defender.stats.spe = getFinalSpeed(gen, defender, field, field.defenderSide);

  const desc: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
  };

  const result = new Result(gen, attacker, defender, move, field, 0, desc);

  if (move.category === 'Status' && !move.named('Nature Power')) {
    return result;
  }

  if (field.defenderSide.isProtected && !move.breaksProtect) {
    desc.isProtected = true;
    return result;
  }

  if (attacker.hasAbility('Mold Breaker')) {
    defender.ability = '' as AbilityName;
    desc.attackerAbility = attacker.ability;
  }

  const isCritical = move.isCrit && !defender.hasAbility('Battle Armor', 'Shell Armor');

  let basePower = move.bp;
  if (move.named('Weather Ball')) {
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

    desc.weather = field.weather;
    desc.moveType = move.type;
    desc.moveBP = basePower;
  } else if (move.named('Judgment') && attacker.item && attacker.item.includes('Plate')) {
    move.type = getItemBoostType(attacker.item)!;
  } else if (move.named('Natural Gift') && attacker.item && attacker.item.includes('Berry')) {
    const gift = getNaturalGift(gen, attacker.item)!;
    move.type = gift.t;
    move.bp = gift.p;
    desc.attackerItem = attacker.item;
    desc.moveBP = move.bp;
    desc.moveType = move.type;
  }

  if (attacker.hasAbility('Normalize')) {
    move.type = 'Normal';
    desc.attackerAbility = attacker.ability;
  }

  const isGhostRevealed = attacker.hasAbility('Scrappy') || field.defenderSide.isForesight;
  let type1Effectiveness =
    getMoveEffectiveness(gen, move, defender.types[0], isGhostRevealed, field.isGravity);
  let type2Effectiveness = defender.types[1]
    ? getMoveEffectiveness(gen, move, defender.types[1], isGhostRevealed, field.isGravity)
    : 1;

  let typeEffectiveness = type1Effectiveness * type2Effectiveness;

  // Iron Ball ignores Klutz in generation 4
  if (typeEffectiveness === 0 && move.hasType('Ground') && defender.hasItem('Iron Ball')) {
    if (type1Effectiveness === 0) {
      type1Effectiveness = 1;
    } else if (defender.types[1] && type2Effectiveness === 0) {
      type2Effectiveness = 1;
    }
    typeEffectiveness = type1Effectiveness * type2Effectiveness;
  }

  if (typeEffectiveness === 0) {
    return result;
  }

  const ignoresWonderGuard = move.hasType('???') || move.named('Fire Fang');
  if ((!ignoresWonderGuard && defender.hasAbility('Wonder Guard') && typeEffectiveness <= 1) ||
      (move.hasType('Fire') && defender.hasAbility('Flash Fire')) ||
      (move.hasType('Water') && defender.hasAbility('Dry Skin', 'Water Absorb')) ||
      (move.hasType('Electric') && defender.hasAbility('Motor Drive', 'Volt Absorb')) ||
      (move.hasType('Ground') && !field.isGravity &&
        !defender.hasItem('Iron Ball') && defender.hasAbility('Levitate')) ||
      (move.flags.sound && defender.hasAbility('Soundproof'))
  ) {
    desc.defenderAbility = defender.ability;
    return result;
  }

  desc.HPEVs = `${defender.evs.hp} HP`;

  const fixedDamage = handleFixedDamageMoves(attacker, move);
  if (fixedDamage) {
    result.damage = fixedDamage;
    return result;
  }

  if (move.hits > 1) {
    desc.hits = move.hits;
  }
  const turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';

  // #endregion
  // #region Base Power

  switch (move.name) {
  case 'Brine':
    if (defender.curHP() <= defender.maxHP() / 2) {
      basePower *= 2;
      desc.moveBP = basePower;
    }
    break;
  case 'Eruption':
  case 'Water Spout':
    basePower = Math.max(1, Math.floor((basePower * attacker.curHP()) / attacker.maxHP()));
    desc.moveBP = basePower;
    break;
  case 'Facade':
    if (attacker.hasStatus('par', 'psn', 'tox', 'brn')) {
      basePower = move.bp * 2;
      desc.moveBP = basePower;
    }
    break;
  case 'Flail':
  case 'Reversal':
    const p = Math.floor((64 * attacker.curHP()) / attacker.maxHP());
    basePower = p <= 1 ? 200 : p <= 5 ? 150 : p <= 12 ? 100 : p <= 21 ? 80 : p <= 42 ? 40 : 20;
    desc.moveBP = basePower;
    break;
  case 'Fling':
    basePower = getFlingPower(attacker.item);
    desc.moveBP = basePower;
    desc.attackerItem = attacker.item;
    break;
  case 'Grass Knot':
  case 'Low Kick':
    const w = defender.weightkg;
    basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
    desc.moveBP = basePower;
    break;
  case 'Gyro Ball':
    basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe));
    desc.moveBP = basePower;
    break;
  case 'Payback':
    if (turnOrder !== 'first') {
      basePower *= 2;
      desc.moveBP = basePower;
    }
    break;
  case 'Punishment':
    basePower = Math.min(200, 60 + 20 * countBoosts(gen, defender.boosts));
    desc.moveBP = basePower;
    break;
  case 'Wake-Up Slap':
    if (defender.hasStatus('slp')) {
      basePower *= 2;
      desc.moveBP = basePower;
    }
    break;
  case 'Crush Grip':
  case 'Wring Out':
    basePower = Math.floor((defender.curHP() * 120) / defender.maxHP()) + 1;
    desc.moveBP = basePower;
    break;
  default:
    basePower = move.bp;
  }

  if (basePower === 0) {
    return result;
  }

  if (field.attackerSide.isHelpingHand) {
    basePower = Math.floor(basePower * 1.5);
    desc.isHelpingHand = true;
  }

  const isPhysical = move.category === 'Physical';
  if ((attacker.hasItem('Muscle Band') && isPhysical) ||
      (attacker.hasItem('Wise Glasses') && !isPhysical)) {
    basePower = Math.floor(basePower * 1.1);
    desc.attackerItem = attacker.item;
  } else if (move.hasType(getItemBoostType(attacker.item)) ||
    (attacker.hasItem('Adamant Orb') &&
     attacker.named('Dialga') &&
     move.hasType('Steel', 'Dragon')) ||
    (attacker.hasItem('Lustrous Orb') &&
     attacker.named('Palkia') &&
     move.hasType('Water', 'Dragon')) ||
    (attacker.hasItem('Griseous Orb') &&
     attacker.named('Giratina-Origin') &&
     move.hasType('Ghost', 'Dragon'))
  ) {
    basePower = Math.floor(basePower * 1.2);
    desc.attackerItem = attacker.item;
  }

  if ((attacker.hasAbility('Reckless') && (move.recoil || move.hasCrashDamage)) ||
      (attacker.hasAbility('Iron Fist') && move.flags.punch)) {
    basePower = Math.floor(basePower * 1.2);
    desc.attackerAbility = attacker.ability;
  } else if ((attacker.curHP() <= attacker.maxHP() / 3 &&
    ((attacker.hasAbility('Overgrow') && move.hasType('Grass')) ||
      (attacker.hasAbility('Blaze') && move.hasType('Fire')) ||
      (attacker.hasAbility('Torrent') && move.hasType('Water')) ||
      (attacker.hasAbility('Swarm') && move.hasType('Bug')))) ||
      (attacker.hasAbility('Technician') && basePower <= 60)
  ) {
    basePower = Math.floor(basePower * 1.5);
    desc.attackerAbility = attacker.ability;
  }

  if ((defender.hasAbility('Heatproof') && move.hasType('Fire')) ||
      (defender.hasAbility('Thick Fat') && (move.hasType('Fire', 'Ice')))) {
    basePower = Math.floor(basePower * 0.5);
    desc.defenderAbility = defender.ability;
  } else if (defender.hasAbility('Dry Skin') && move.hasType('Fire')) {
    basePower = Math.floor(basePower * 1.25);
    desc.defenderAbility = defender.ability;
  }

  // #endregion
  // #region (Special) Attack

  const attackStat = isPhysical ? 'atk' : 'spa';
  desc.attackEVs = getEVDescriptionText(gen, attacker, attackStat, attacker.nature);
  let attack: number;
  const attackBoost = attacker.boosts[attackStat];
  const rawAttack = attacker.rawStats[attackStat];
  if (attackBoost === 0 || (isCritical && attackBoost < 0)) {
    attack = rawAttack;
  } else if (defender.hasAbility('Unaware')) {
    attack = rawAttack;
    desc.defenderAbility = defender.ability;
  } else if (attacker.hasAbility('Simple')) {
    attack = getSimpleModifiedStat(rawAttack, attackBoost);
    desc.attackerAbility = attacker.ability;
    desc.attackBoost = attackBoost;
  } else {
    attack = getModifiedStat(rawAttack, attackBoost);
    desc.attackBoost = attackBoost;
  }

  if (isPhysical && attacker.hasAbility('Pure Power', 'Huge Power')) {
    attack *= 2;
    desc.attackerAbility = attacker.ability;
  } else if (field.hasWeather('Sun') &&
    (attacker.hasAbility(isPhysical ? 'Flower Gift' : 'Solar Power'))
  ) {
    attack = Math.floor(attack * 1.5);
    desc.attackerAbility = attacker.ability;
    desc.weather = field.weather;
  } else if (
    (isPhysical &&
      (attacker.hasAbility('Hustle') || (attacker.hasAbility('Guts') && attacker.status)) ||
    (!isPhysical && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus')))
  ) {
    attack = Math.floor(attack * 1.5);
    desc.attackerAbility = attacker.ability;
  } else if (isPhysical && attacker.hasAbility('Slow Start') && attacker.abilityOn) {
    attack = Math.floor(attack / 2);
    desc.attackerAbility = attacker.ability;
  }

  if ((isPhysical ? attacker.hasItem('Choice Band') : attacker.hasItem('Choice Specs')) ||
      (!isPhysical && attacker.hasItem('Soul Dew') && attacker.named('Latios', 'Latias'))) {
    attack = Math.floor(attack * 1.5);
    desc.attackerItem = attacker.item;
  } else if (
    (attacker.hasItem('Light Ball') && attacker.named('Pikachu')) ||
    (attacker.hasItem('Thick Club') && attacker.named('Cubone', 'Marowak') && isPhysical) ||
    (attacker.hasItem('Deep Sea Tooth') && attacker.named('Clamperl') && !isPhysical)
  ) {
    attack *= 2;
    desc.attackerItem = attacker.item;
  }

  // #endregion
  // #region (Special) Defense

  const defenseStat = isPhysical ? 'def' : 'spd';
  desc.defenseEVs = getEVDescriptionText(gen, defender, defenseStat, defender.nature);
  let defense: number;
  const defenseBoost = defender.boosts[defenseStat];
  const rawDefense = defender.rawStats[defenseStat];
  if (defenseBoost === 0 || (isCritical && defenseBoost > 0)) {
    defense = rawDefense;
  } else if (attacker.hasAbility('Unaware')) {
    defense = rawDefense;
    desc.attackerAbility = attacker.ability;
  } else if (defender.hasAbility('Simple')) {
    defense = getSimpleModifiedStat(rawDefense, defenseBoost);
    desc.defenderAbility = defender.ability;
    desc.defenseBoost = defenseBoost;
  } else {
    defense = getModifiedStat(rawDefense, defenseBoost);
    desc.defenseBoost = defenseBoost;
  }

  if (defender.hasAbility('Marvel Scale') && defender.status && isPhysical) {
    defense = Math.floor(defense * 1.5);
    desc.defenderAbility = defender.ability;
  } else if (defender.hasAbility('Flower Gift') && field.hasWeather('Sun') && !isPhysical) {
    defense = Math.floor(defense * 1.5);
    desc.defenderAbility = defender.ability;
    desc.weather = field.weather;
  }

  if (defender.hasItem('Soul Dew') && defender.named('Latios', 'Latias') && !isPhysical) {
    defense = Math.floor(defense * 1.5);
    desc.defenderItem = defender.item;
  } else if (
    (defender.hasItem('Deep Sea Scale') && defender.named('Clamperl') && !isPhysical) ||
    (defender.hasItem('Metal Powder') && defender.named('Ditto') && isPhysical)
  ) {
    defense *= 2;
    desc.defenderItem = defender.item;
  }

  if (field.hasWeather('Sand') && defender.hasType('Rock') && !isPhysical) {
    defense = Math.floor(defense * 1.5);
    desc.weather = field.weather;
  }

  if (move.named('Explosion') || move.named('Self-Destruct')) {
    defense = Math.floor(defense * 0.5);
  }

  if (defense < 1) {
    defense = 1;
  }

  // #endregion
  // #region Damage

  let baseDamage = Math.floor(
    Math.floor((Math.floor((2 * attacker.level) / 5 + 2) * basePower * attack) / 50) / defense
  );

  if (attacker.hasStatus('brn') && isPhysical && !attacker.hasAbility('Guts')) {
    baseDamage = Math.floor(baseDamage * 0.5);
    desc.isBurned = true;
  }

  if (!isCritical) {
    const screenMultiplier = field.gameType !== 'Singles' ? 2 / 3 : 1 / 2;
    if (isPhysical && field.defenderSide.isReflect) {
      baseDamage = Math.floor(baseDamage * screenMultiplier);
      desc.isReflect = true;
    } else if (!isPhysical && field.defenderSide.isLightScreen) {
      baseDamage = Math.floor(baseDamage * screenMultiplier);
      desc.isLightScreen = true;
    }
  }

  if (field.gameType !== 'Singles' &&
      ['allAdjacent', 'allAdjacentFoes'].includes(move.target)) {
    baseDamage = Math.floor((baseDamage * 3) / 4);
  }

  if ((field.hasWeather('Sun') && move.hasType('Fire')) ||
      (field.hasWeather('Rain') && move.hasType('Water'))) {
    baseDamage = Math.floor(baseDamage * 1.5);
    desc.weather = field.weather;
  } else if (
    (field.hasWeather('Sun') && move.hasType('Water')) ||
    (field.hasWeather('Rain') && move.hasType('Fire')) ||
    (move.named('Solar Beam') && field.hasWeather('Rain', 'Sand', 'Hail'))
  ) {
    baseDamage = Math.floor(baseDamage * 0.5);
    desc.weather = field.weather;
  }

  if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.hasType('Fire')) {
    baseDamage = Math.floor(baseDamage * 1.5);
    desc.attackerAbility = 'Flash Fire';
  }

  baseDamage += 2;

  if (isCritical) {
    if (attacker.hasAbility('Sniper')) {
      baseDamage *= 3;
      desc.attackerAbility = attacker.ability;
    } else {
      baseDamage *= 2;
    }
    desc.isCritical = isCritical;
  }

  if (attacker.hasItem('Life Orb')) {
    baseDamage = Math.floor(baseDamage * 1.3);
    desc.attackerItem = attacker.item;
  }

  if (move.named('Pursuit') && field.defenderSide.isSwitching === 'out') {
    // technician negates switching boost, thanks DaWoblefet
    if (attacker.hasAbility('Technician')) {
      baseDamage = Math.floor(baseDamage * 1);
    } else {
      baseDamage = Math.floor(baseDamage * 2);
      desc.isSwitching = 'out';
    }
  }

  // the random factor is applied between the LO mod and the STAB mod, so don't apply anything
  // below this until we're inside the loop
  let stabMod = 1;
  if (move.hasType(...attacker.types)) {
    if (attacker.hasAbility('Adaptability')) {
      stabMod = 2;
      desc.attackerAbility = attacker.ability;
    } else {
      stabMod = 1.5;
    }
  }

  let filterMod = 1;
  if (defender.hasAbility('Filter', 'Solid Rock') && typeEffectiveness > 1) {
    filterMod = 0.75;
    desc.defenderAbility = defender.ability;
  }
  let ebeltMod = 1;
  if (attacker.hasItem('Expert Belt') && typeEffectiveness > 1) {
    ebeltMod = 1.2;
    desc.attackerItem = attacker.item;
  }
  let tintedMod = 1;
  if (attacker.hasAbility('Tinted Lens') && typeEffectiveness < 1) {
    tintedMod = 2;
    desc.attackerAbility = attacker.ability;
  }
  let berryMod = 1;
  if (move.hasType(getBerryResistType(defender.item)) &&
    (typeEffectiveness > 1 || move.hasType('Normal'))) {
    berryMod = 0.5;
    desc.defenderItem = defender.item;
  }

  const damage: number[] = [];
  for (let i = 0; i < 16; i++) {
    damage[i] = Math.floor((baseDamage * (85 + i)) / 100);
    damage[i] = Math.floor(damage[i] * stabMod);
    damage[i] = Math.floor(damage[i] * type1Effectiveness);
    damage[i] = Math.floor(damage[i] * type2Effectiveness);
    damage[i] = Math.floor(damage[i] * filterMod);
    damage[i] = Math.floor(damage[i] * ebeltMod);
    damage[i] = Math.floor(damage[i] * tintedMod);
    damage[i] = Math.floor(damage[i] * berryMod);
    damage[i] = Math.max(1, damage[i]);
  }
  result.damage = damage;

  // #endregion

  return result;
}

function getSimpleModifiedStat(stat: number, mod: number) {
  const simpleMod = Math.min(6, Math.max(-6, mod * 2));
  return simpleMod > 0
    ? Math.floor((stat * (2 + simpleMod)) / 2)
    : simpleMod < 0 ? Math.floor((stat * 2) / (2 - simpleMod)) : stat;
}
