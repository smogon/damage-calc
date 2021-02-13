﻿import {Generation, AbilityName} from '../data/interface';
import {toID} from '../util';
import {
  getItemBoostType,
  getNaturalGift,
  getFlingPower,
  getBerryResistType,
  getTechnoBlast,
} from '../items';
import {RawDesc} from '../desc';
import {Field} from '../field';
import {Move} from '../move';
import {Pokemon} from '../pokemon';
import {Result} from '../result';
import {
  chainMods,
  checkAirLock,
  checkDownload,
  checkForecast,
  checkInfiltrator,
  checkIntimidate,
  checkKlutz,
  checkMultihitBoost,
  checkSeedBoost,
  computeFinalStats,
  countBoosts,
  getBaseDamage,
  getEVDescriptionText,
  getFinalDamage,
  getModifiedStat,
  getMoveEffectiveness,
  getWeightFactor,
  handleFixedDamageMoves,
  isGrounded,
  OF16, OF32,
  pokeRound,
} from './util';

export function calculateBWXY(
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
  checkKlutz(attacker);
  checkKlutz(defender);
  checkSeedBoost(attacker, field);
  checkSeedBoost(defender, field);

  computeFinalStats(gen, attacker, defender, field, 'def', 'spd', 'spe');

  checkIntimidate(gen, attacker, defender);
  checkIntimidate(gen, defender, attacker);
  checkDownload(attacker, defender);
  checkDownload(defender, attacker);

  computeFinalStats(gen, attacker, defender, field, 'atk', 'spa');

  checkInfiltrator(attacker, field.defenderSide);
  checkInfiltrator(defender, field.attackerSide);

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

  if (attacker.hasAbility('Mold Breaker', 'Teravolt', 'Turboblaze')) {
    defender.ability = '' as AbilityName;
    desc.attackerAbility = attacker.ability;
  }

  const isCritical =
    move.isCrit && !defender.hasAbility('Battle Armor', 'Shell Armor') && move.timesUsed === 1;

  if (move.named('Weather Ball')) {
    move.type =
      field.hasWeather('Sun', 'Harsh Sunshine') ? 'Fire'
      : field.hasWeather('Rain', 'Heavy Rain') ? 'Water'
      : field.hasWeather('Sand') ? 'Rock'
      : field.hasWeather('Hail') ? 'Ice'
      : 'Normal';
    desc.weather = field.weather;
    desc.moveType = move.type;
  } else if (move.named('Judgment') && attacker.item && attacker.item.includes('Plate')) {
    move.type = getItemBoostType(attacker.item)!;
  } else if (move.named('Techno Blast') && attacker.item && attacker.item.includes('Drive')) {
    move.type = getTechnoBlast(attacker.item)!;
  } else if (move.named('Natural Gift') && attacker.item && attacker.item.includes('Berry')) {
    const gift = getNaturalGift(gen, attacker.item)!;
    move.type = gift.t;
    move.bp = gift.p;
    desc.attackerItem = attacker.item;
    desc.moveBP = move.bp;
    desc.moveType = move.type;
  } else if (move.named('Nature Power')) {
    move.type =
      field.hasTerrain('Electric') ? 'Electric'
      : field.hasTerrain('Grassy') ? 'Grass'
      : field.hasTerrain('Misty') ? 'Fairy'
      : field.hasTerrain('Psychic') ? 'Psychic'
      : 'Normal';
  }

  let isAerilate = false;
  let isPixilate = false;
  let isRefrigerate = false;
  let isNormalize = false;
  const noTypeChange =
    move.named('Judgment', 'Nature Power', 'Techo Blast', 'Natural Gift', 'Weather Ball');

  if (!move.isZ && !noTypeChange) {
    const normal = move.hasType('Normal');
    if ((isAerilate = attacker.hasAbility('Aerilate') && normal)) {
      move.type = 'Flying';
    } else if ((isPixilate = attacker.hasAbility('Pixilate') && normal)) {
      move.type = 'Fairy';
    } else if ((isRefrigerate = attacker.hasAbility('Refrigerate') && normal)) {
      move.type = 'Ice';
    } else if ((isNormalize = attacker.hasAbility('Normalize'))) {
      move.type = 'Normal';
    }
    if (isPixilate || isRefrigerate || isAerilate || isNormalize) {
      desc.attackerAbility = attacker.ability;
    }
  }

  if (attacker.hasAbility('Gale Wings') && move.hasType('Flying')) {
    move.priority = 1;
    desc.attackerAbility = attacker.ability;
  }

  const isGhostRevealed = attacker.hasAbility('Scrappy') || field.defenderSide.isForesight;
  const type1Effectiveness =
    getMoveEffectiveness(gen, move, defender.types[0], isGhostRevealed, field.isGravity);
  const type2Effectiveness = defender.types[1]
    ? getMoveEffectiveness(gen, move, defender.types[1], isGhostRevealed, field.isGravity)
    : 1;
  let typeEffectiveness = type1Effectiveness * type2Effectiveness;

  let resistedKnockOffDamage =
    !defender.item ||
    (defender.named('Giratina-Origin') && defender.hasItem('Griseous Orb')) ||
    (defender.name.includes('Arceus') && defender.item.includes('Plate')) ||
    (defender.name.includes('Genesect') && defender.item.includes('Drive')) ||
    (defender.named('Groudon', 'Groudon-Primal') && defender.hasItem('Red Orb')) ||
    (defender.named('Kyogre', 'Kyogre-Primal') && defender.hasItem('Blue Orb'));

  // The last case only applies when the Pokemon is holding the Mega Stone that matches its species
  // (or when it's already a Mega-Evolution)
  if (!resistedKnockOffDamage && defender.item) {
    const item = gen.items.get(toID(defender.item))!;
    resistedKnockOffDamage = !!(item.megaEvolves && defender.name.includes(item.megaEvolves));
  }

  if (typeEffectiveness === 0 && move.named('Thousand Arrows')) {
    typeEffectiveness = 1;
  } else if (typeEffectiveness === 0 && defender.hasItem('Ring Target')) {
    const effectiveness = gen.types.get(toID(move.type))!.effectiveness;
    if (effectiveness[defender.types[0]]! === 0) {
      typeEffectiveness = type2Effectiveness;
    } else if (defender.types[1] && effectiveness[defender.types[1]]! === 0) {
      typeEffectiveness = type1Effectiveness;
    }
  }

  if (typeEffectiveness === 0) {
    return result;
  }

  if ((move.named('Sky Drop') &&
        (defender.hasType('Flying') || defender.weightkg >= 200 || field.isGravity)) ||
      (move.named('Synchronoise') && !defender.hasType(attacker.types[0]) &&
        (!attacker.types[1] || !defender.hasType(attacker.types[1]))) ||
      (move.named('Dream Eater') && !defender.hasStatus('slp'))
  ) {
    return result;
  }

  if ((defender.hasAbility('Wonder Guard') && typeEffectiveness <= 1) ||
      (move.hasType('Grass') && defender.hasAbility('Sap Sipper')) ||
      (move.hasType('Fire') && defender.hasAbility('Flash Fire')) ||
      (move.hasType('Water') && defender.hasAbility('Dry Skin', 'Storm Drain', 'Water Absorb')) ||
      (move.hasType('Electric') &&
        defender.hasAbility('Lightning Rod', 'Motor Drive', 'Volt Absorb')) ||
      (move.hasType('Ground') &&
        !field.isGravity && !move.named('Thousand Arrows') && defender.hasAbility('Levitate')) ||
      (move.flags.bullet && defender.hasAbility('Bulletproof')) ||
      (move.flags.sound && defender.hasAbility('Soundproof'))
  ) {
    desc.defenderAbility = defender.ability;
    return result;
  }

  if (field.hasWeather('Strong Winds') && defender.hasType('Flying') &&
      gen.types.get(toID(move.type))!.effectiveness['Flying']! > 1) {
    typeEffectiveness /= 2;
    desc.weather = field.weather;
  }

  if (move.hasType('Ground') && !move.named('Thousand Arrows') &&
      !field.isGravity && defender.hasItem('Air Balloon')) {
    desc.defenderItem = defender.item;
    return result;
  }

  if (move.priority > 0 && field.hasTerrain('Psychic') && isGrounded(defender, field)) {
    desc.terrain = field.terrain;
    return result;
  }

  desc.HPEVs = `${defender.evs.hp} HP`;

  const fixedDamage = handleFixedDamageMoves(attacker, move);
  if (fixedDamage) {
    if (attacker.hasAbility('Parental Bond')) {
      result.damage = [fixedDamage, fixedDamage];
      desc.attackerAbility = attacker.ability;
    } else {
      result.damage = fixedDamage;
    }
    return result;
  }

  if (move.named('Final Gambit')) {
    result.damage = attacker.curHP();
    return result;
  }

  if (move.hits > 1) {
    desc.hits = move.hits;
  }

  const turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';

  // #endregion
  // #region Base Power

  let basePower: number;

  switch (move.name) {
  case 'Payback':
    basePower = turnOrder === 'last' ? 100 : 50;
    desc.moveBP = basePower;
    break;
  case 'Electro Ball':
    const r = Math.floor(attacker.stats.spe / defender.stats.spe);
    basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : r >= 1 ? 60 : 40;
    desc.moveBP = basePower;
    break;
  case 'Gyro Ball':
    basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe));
    desc.moveBP = basePower;
    break;
  case 'Punishment':
    basePower = Math.min(200, 60 + 20 * countBoosts(gen, defender.boosts));
    desc.moveBP = basePower;
    break;
  case 'Low Kick':
  case 'Grass Knot':
    const w = defender.weightkg * getWeightFactor(defender);
    basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
    desc.moveBP = basePower;
    break;
  case 'Hex':
    basePower = move.bp * (defender.status ? 2 : 1);
    desc.moveBP = basePower;
    break;
  case 'Heavy Slam':
  case 'Heat Crash':
    const wr =
        (attacker.weightkg * getWeightFactor(attacker)) /
        (defender.weightkg * getWeightFactor(defender));
    basePower = wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
    desc.moveBP = basePower;
    break;
  case 'Stored Power':
  case 'Power Trip':
    basePower = 20 + 20 * countBoosts(gen, attacker.boosts);
    desc.moveBP = basePower;
    break;
  case 'Acrobatics':
    basePower = attacker.hasItem('Flying Gem') || !attacker.item ? 110 : 55;
    desc.moveBP = basePower;
    break;
  case 'Assurance':
    basePower = move.bp * (defender.hasAbility('Parental Bond (Child)') ? 2 : 1);
    // NOTE: desc.attackerAbility = 'Parental Bond' will already reflect this boost
    break;
  case 'Wake-Up Slap':
    basePower = move.bp * (defender.hasStatus('slp') ? 2 : 1);
    desc.moveBP = basePower;
    break;
  case 'Weather Ball':
    basePower = field.weather && !field.hasWeather('Strong Winds') ? 100 : 50;
    desc.moveBP = basePower;
    break;
  case 'Fling':
    basePower = getFlingPower(attacker.item);
    desc.moveBP = basePower;
    desc.attackerItem = attacker.item;
    break;
  case 'Eruption':
  case 'Water Spout':
    basePower = Math.max(1, Math.floor((150 * attacker.curHP()) / attacker.maxHP()));
    desc.moveBP = basePower;
    break;
  case 'Flail':
  case 'Reversal':
    const p = Math.floor((48 * attacker.curHP()) / attacker.maxHP());
    basePower = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
    desc.moveBP = basePower;
    break;
  case 'Nature Power':
    basePower =
        field.terrain && field.hasTerrain('Electric', 'Grassy', 'Psychic') ? 90
        : field.hasTerrain('Misty') ? 95
        : 80;
    break;
  case 'Water Shuriken':
    basePower = attacker.named('Greninja-Ash') && attacker.hasAbility('Battle Bond') ? 20 : 15;
    desc.moveBP = basePower;
    break;
  case 'Crush Grip':
  case 'Wring Out':
    basePower = 100 * Math.floor((defender.curHP() * 4096) / defender.maxHP());
    basePower = Math.floor(Math.floor((120 * basePower + 2048 - 1) / 4096) / 100) || 1;
    desc.moveBP = basePower;
    break;
  default:
    basePower = move.bp;
  }

  if (basePower === 0) {
    return result;
  }

  const bpMods = [];
  if ((attacker.hasAbility('Technician') && basePower <= 60) ||
      (attacker.hasAbility('Flare Boost') &&
       attacker.hasStatus('brn') && move.category === 'Special') ||
      (attacker.hasAbility('Toxic Boost') &&
       attacker.hasStatus('psn', 'tox') && move.category === 'Physical')
  ) {
    bpMods.push(0x1800);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Analytic') && turnOrder !== 'first') {
    bpMods.push(0x14cd);
    desc.attackerAbility = attacker.ability;
  } else if (
    attacker.hasAbility('Sand Force') &&
    field.hasWeather('Sand') &&
    move.hasType('Rock', 'Ground', 'Steel')
  ) {
    bpMods.push(0x14cd);
    desc.attackerAbility = attacker.ability;
    desc.weather = field.weather;
  } else if (
    (attacker.hasAbility('Reckless') && (move.recoil || move.hasCrashDamage)) ||
    (attacker.hasAbility('Iron Fist') && move.flags.punch)
  ) {
    bpMods.push(0x1333);
    desc.attackerAbility = attacker.ability;
  }

  if (defender.hasAbility('Heatproof') && move.hasType('Fire')) {
    bpMods.push(0x800);
    desc.defenderAbility = defender.ability;
  } else if (defender.hasAbility('Dry Skin') && move.hasType('Fire')) {
    bpMods.push(0x1400);
    desc.defenderAbility = defender.ability;
  }

  if (attacker.hasAbility('Sheer Force') && move.secondaries) {
    bpMods.push(0x14cd);
    desc.attackerAbility = attacker.ability;
  }

  if (attacker.hasAbility('Rivalry') && ![attacker.gender, defender.gender].includes('N')) {
    if (attacker.gender === defender.gender) {
      bpMods.push(0x1400);
      desc.rivalry = 'buffed';
    } else {
      bpMods.push(0xccd);
      desc.rivalry = 'nerfed';
    }
    desc.attackerAbility = attacker.ability;
  }

  if (attacker.item && getItemBoostType(attacker.item) === move.type) {
    bpMods.push(0x1333);
    desc.attackerItem = attacker.item;
  } else if (
    (attacker.hasItem('Muscle Band') && move.category === 'Physical') ||
    (attacker.hasItem('Wise Glasses') && move.category === 'Special')
  ) {
    bpMods.push(0x1199);
    desc.attackerItem = attacker.item;
  } else if (
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
    bpMods.push(0x1333);
    desc.attackerItem = attacker.item;
  } else if (attacker.hasItem(`${move.type} Gem`)) {
    bpMods.push(gen.num > 5 ? 0x14cd : 0x1800);
    desc.attackerItem = attacker.item;
  }

  if ((move.named('Facade') && attacker.hasStatus('brn', 'par', 'psn', 'tox')) ||
      (move.named('Brine') && defender.curHP() <= defender.maxHP() / 2) ||
      (move.named('Venoshock') && defender.hasStatus('psn', 'tox'))) {
    bpMods.push(0x2000);
    desc.moveBP = basePower * 2;
  } else if (move.named('Solar Beam') && field.hasWeather('Rain', 'Heavy Rain', 'Sand', 'Hail')) {
    bpMods.push(0x800);
    desc.moveBP = basePower / 2;
    desc.weather = field.weather;
  } else if (gen.num > 5 && move.named('Knock Off') && !resistedKnockOffDamage) {
    bpMods.push(0x1800);
    desc.moveBP = basePower * 1.5;
  }

  if (field.attackerSide.isHelpingHand) {
    bpMods.push(0x1800);
    desc.isHelpingHand = true;
  }

  if (field.attackerSide.isBattery && move.category === 'Special') {
    bpMods.push(0x14cc);
    desc.isBattery = true;
  }

  if (isAerilate || isPixilate || isRefrigerate || isNormalize) {
    bpMods.push(0x14cd);
    desc.attackerAbility = attacker.ability;
  } else if (
    (attacker.hasAbility('Mega Launcher') && move.flags.pulse) ||
    (attacker.hasAbility('Strong Jaw') && move.flags.bite)
  ) {
    bpMods.push(0x1800);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Tough Claws') && move.flags.contact) {
    bpMods.push(0x14cd);
    desc.attackerAbility = attacker.ability;
  }

  const aura = `${move.type} Aura`;
  const isAttackerAura = attacker.hasAbility(aura);
  const isDefenderAura = defender.hasAbility(aura);
  const isUserAuraBreak = attacker.hasAbility('Aura Break') || defender.hasAbility('Aura Break');
  const isFieldAuraBreak = field.isAuraBreak;
  const isFieldFairyAura = field.isFairyAura && move.type === 'Fairy';
  const isFieldDarkAura = field.isDarkAura && move.type === 'Dark';
  if (isFieldFairyAura || isFieldDarkAura || isAttackerAura || isDefenderAura) {
    if (isFieldAuraBreak || isUserAuraBreak) {
      bpMods.push(0x0c00);
      desc.attackerAbility = attacker.ability;
      desc.defenderAbility = defender.ability;
    } else {
      bpMods.push(0x1547);
      if (isAttackerAura) {
        desc.attackerAbility = attacker.ability;
      }
      if (isDefenderAura) {
        desc.defenderAbility = defender.ability;
      }
    }
  }

  // It's not actually clear if the terrain modifiers are base damage mods like weather or are
  // base power mods like in Gen 7+, but the research doesn't exist for this yet so we match PS here
  if (isGrounded(attacker, field)) {
    if (field.hasTerrain('Electric') && move.hasType('Electric')) {
      bpMods.push(0x1800);
      desc.terrain = field.terrain;
    } else if (field.hasTerrain('Grassy') && move.hasType('Grass')) {
      bpMods.push(0x1800);
      desc.terrain = field.terrain;
    } else if (field.hasTerrain('Psychic') && move.hasType('Psychic')) {
      bpMods.push(0x1800);
      desc.terrain = field.terrain;
    }
  }
  if (isGrounded(defender, field)) {
    if (field.hasTerrain('Misty') && move.hasType('Dragon')) {
      bpMods.push(0x800);
      desc.terrain = field.terrain;
    } else if (field.hasTerrain('Grassy') && move.named('Bulldoze', 'Earthquake')) {
      bpMods.push(0x800);
      desc.terrain = field.terrain;
    }
  }

  basePower = OF16(Math.max(1, pokeRound((basePower * chainMods(bpMods)) / 0x1000)));

  // #endregion
  // #region (Special) Attack

  let attack: number;
  const attackSource = move.named('Foul Play') ? defender : attacker;
  const attackStat = move.category === 'Special' ? 'spa' : 'atk';
  desc.attackEVs =
    move.named('Foul Play')
      ? getEVDescriptionText(gen, defender, attackStat, defender.nature)
      : getEVDescriptionText(gen, attacker, attackStat, attacker.nature);

  if (attackSource.boosts[attackStat] === 0 ||
      (isCritical && attackSource.boosts[attackStat] < 0)) {
    attack = attackSource.rawStats[attackStat];
  } else if (defender.hasAbility('Unaware')) {
    attack = attackSource.rawStats[attackStat];
    desc.defenderAbility = defender.ability;
  } else {
    attack = attackSource.stats[attackStat];
    desc.attackBoost = attackSource.boosts[attackStat];
  }

  // unlike all other attack modifiers, Hustle gets applied directly
  if (attacker.hasAbility('Hustle') && move.category === 'Physical') {
    attack = pokeRound((attack * 3) / 2);
    desc.attackerAbility = attacker.ability;
  }

  const atMods = [];
  if (defender.hasAbility('Thick Fat') && move.hasType('Fire', 'Ice')) {
    atMods.push(0x800);
    desc.defenderAbility = defender.ability;
  }

  if (move.named('Pursuit') && field.defenderSide.isSwitching === 'out') {
    // technician negates switching boost, thanks DaWoblefet
    if (attacker.hasAbility('Technician')) {
      atMods.push(0x1000);
    } else {
      atMods.push(0x2000);
      desc.isSwitching = 'out';
    }
  }

  if ((attacker.hasAbility('Guts') && attacker.status && move.category === 'Physical') ||
      (attacker.curHP() <= attacker.maxHP() / 3 &&
        ((attacker.hasAbility('Overgrow') && move.hasType('Grass')) ||
         (attacker.hasAbility('Blaze') && move.hasType('Fire')) ||
         (attacker.hasAbility('Torrent') && move.hasType('Water')) ||
         (attacker.hasAbility('Swarm') && move.hasType('Bug')))) ||
      (move.category === 'Special' && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus'))
  ) {
    atMods.push(0x1800);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.hasType('Fire')) {
    atMods.push(0x1800);
    desc.attackerAbility = 'Flash Fire';
  } else if (
    (attacker.hasAbility('Solar Power') &&
     field.hasWeather('Sun', 'Harsh Sunshine') &&
     move.category === 'Special') ||
    (attacker.named('Cherrim') &&
     attacker.hasAbility('Flower Gift') &&
     field.hasWeather('Sun', 'Harsh Sunshine') &&
     move.category === 'Physical')
  ) {
    atMods.push(0x1800);
    desc.attackerAbility = attacker.ability;
    desc.weather = field.weather;
  } else if (
    (attacker.hasAbility('Defeatist') && attacker.curHP() <= attacker.maxHP() / 2) ||
    (attacker.hasAbility('Slow Start') && attacker.abilityOn && move.category === 'Physical')
  ) {
    atMods.push(0x800);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Huge Power', 'Pure Power') && move.category === 'Physical') {
    atMods.push(0x2000);
    desc.attackerAbility = attacker.ability;
  }

  if ((attacker.hasItem('Thick Club') &&
       attacker.named('Cubone', 'Marowak', 'Marowak-Alola') &&
       move.category === 'Physical') ||
      (attacker.hasItem('Deep Sea Tooth') &&
       attacker.named('Clamperl') &&
       move.category === 'Special') ||
      (attacker.hasItem('Light Ball') && attacker.name.startsWith('Pikachu') && !move.isZ)
  ) {
    atMods.push(0x2000);
    desc.attackerItem = attacker.item;
  } else if (
    (attacker.hasItem('Soul Dew') &&
      attacker.named('Latios', 'Latias', 'Latios-Mega', 'Latias-Mega') &&
      move.category === 'Special') ||
    (attacker.hasItem('Choice Band') && move.category === 'Physical') ||
    (attacker.hasItem('Choice Specs') && move.category === 'Special')
  ) {
    atMods.push(0x1800);
    desc.attackerItem = attacker.item;
  }

  attack = OF16(Math.max(1, pokeRound((attack * chainMods(atMods)) / 0x1000)));

  // #endregion
  // #region (Special) Defense

  let defense: number;
  const hitsPhysical = move.defensiveCategory === 'Physical';
  const defenseStat = hitsPhysical ? 'def' : 'spd';
  desc.defenseEVs = getEVDescriptionText(gen, defender, defenseStat, defender.nature);
  if (defender.boosts[defenseStat] === 0 ||
    (isCritical && defender.boosts[defenseStat] > 0) ||
    move.ignoreDefensive) {
    defense = defender.rawStats[defenseStat];
  } else if (attacker.hasAbility('Unaware')) {
    defense = defender.rawStats[defenseStat];
    desc.attackerAbility = attacker.ability;
  } else {
    defense = defender.stats[defenseStat];
    desc.defenseBoost = defender.boosts[defenseStat];
  }

  // unlike all other defense modifiers, Sandstorm SpD boost gets applied directly
  if (field.hasWeather('Sand') && defender.hasType('Rock') && !hitsPhysical) {
    defense = pokeRound((defense * 3) / 2);
    desc.weather = field.weather;
  }

  const dfMods = [];
  if (defender.hasAbility('Marvel Scale') && defender.status && hitsPhysical) {
    dfMods.push(0x1800);
    desc.defenderAbility = defender.ability;
  } else if (
    defender.named('Cherrim') &&
    defender.hasAbility('Flower Gift') &&
    field.hasWeather('Sun', 'Harsh Sunshine') &&
    !hitsPhysical
  ) {
    dfMods.push(0x1800);
    desc.defenderAbility = defender.ability;
    desc.weather = field.weather;
  }

  if (field.hasTerrain('Grassy') && defender.hasAbility('Grass Pelt') && hitsPhysical) {
    dfMods.push(0x1800);
    desc.defenderAbility = defender.ability;
  }

  if ((!hitsPhysical && defender.hasItem('Soul Dew') &&
       defender.named('Latios', 'Latias', 'Latios-Mega', 'Latias-Mega')) ||
      (defender.hasItem('Eviolite') && gen.species.get(toID(defender.name))?.nfe) ||
      (!hitsPhysical && defender.hasItem('Assault Vest'))) {
    dfMods.push(0x1800);
    desc.defenderItem = defender.item;
  }

  if ((defender.hasItem('Metal Powder') && defender.named('Ditto') && hitsPhysical) ||
      (defender.hasItem('Deep Sea Scale') && defender.named('Clamperl') && !hitsPhysical)) {
    dfMods.push(0x2000);
    desc.defenderItem = defender.item;
  }

  if (defender.hasAbility('Fur Coat') && hitsPhysical) {
    dfMods.push(0x2000);
    desc.defenderAbility = defender.ability;
  }

  defense = OF16(Math.max(1, pokeRound((defense * chainMods(dfMods)) / 0x1000)));

  // #endregion
  // #region Damage

  let baseDamage = getBaseDamage(attacker.level, basePower, attack, defense);

  const isSpread = field.gameType !== 'Singles' &&
    ['allAdjacent', 'allAdjacentFoes'].includes(move.target);
  if (isSpread) {
    baseDamage = pokeRound(OF32(baseDamage * 0xc00) / 0x1000);
  }

  if (attacker.hasAbility('Parental Bond (Child)')) {
    baseDamage = pokeRound(OF32(baseDamage * 0x800) / 0x1000);
  }

  if ((field.hasWeather('Sun', 'Harsh Sunshine') && move.hasType('Fire')) ||
      (field.hasWeather('Rain', 'Heavy Rain') && move.hasType('Water'))) {
    baseDamage = pokeRound(OF32(baseDamage * 0x1800) / 0x1000);
    desc.weather = field.weather;
  } else if (
    (field.hasWeather('Sun') && move.hasType('Water')) ||
    (field.hasWeather('Rain') && move.hasType('Fire'))
  ) {
    baseDamage = pokeRound(OF32(baseDamage * 0x800) / 0x1000);
    desc.weather = field.weather;
  } else if (
    (field.hasWeather('Harsh Sunshine') && move.hasType('Water')) ||
    (field.hasWeather('Heavy Rain') && move.hasType('Fire'))
  ) {
    return result;
  }

  if (isCritical) {
    baseDamage = Math.floor(OF32(baseDamage * (gen.num > 5 ? 1.5 : 2)));
    desc.isCritical = isCritical;
  }

  // the random factor is applied between the crit mod and the stab mod, so don't apply anything
  // below this until we're inside the loop
  let stabMod = 0x1000;
  if (attacker.hasType(move.type)) {
    if (attacker.hasAbility('Adaptability')) {
      stabMod = 0x2000;
      desc.attackerAbility = attacker.ability;
    } else {
      stabMod = 0x1800;
    }
  } else if (attacker.hasAbility('Protean')) {
    stabMod = 0x1800;
    desc.attackerAbility = attacker.ability;
  }

  const applyBurn =
    attacker.hasStatus('brn') &&
    move.category === 'Physical' &&
    !attacker.hasAbility('Guts') &&
    !(move.named('Facade') && gen.num === 6);
  desc.isBurned = applyBurn;

  const finalMods = [];

  if (field.defenderSide.isReflect && move.category === 'Physical' && !isCritical) {
    finalMods.push(field.gameType !== 'Singles' ? (gen.num > 5 ? 0xaac : 0xa8f) : 0x800);
    desc.isReflect = true;
  } else if (field.defenderSide.isLightScreen && move.category === 'Special' && !isCritical) {
    finalMods.push(field.gameType !== 'Singles' ? (gen.num > 5 ? 0xaac : 0xa8f) : 0x800);
    desc.isLightScreen = true;
  }

  if (defender.hasAbility('Multiscale') && defender.curHP() === defender.maxHP() &&
      !field.defenderSide.isSR && (!field.defenderSide.spikes || defender.hasType('Flying')) &&
      !attacker.hasAbility('Parental Bond (Child)')) {
    finalMods.push(0x800);
    desc.defenderAbility = defender.ability;
  }

  if (attacker.hasAbility('Tinted Lens') && typeEffectiveness < 1) {
    finalMods.push(0x2000);
    desc.attackerAbility = attacker.ability;
  }

  if (field.defenderSide.isFriendGuard) {
    finalMods.push(0xc00);
    desc.isFriendGuard = true;
  }

  if (attacker.hasAbility('Sniper') && isCritical) {
    finalMods.push(0x1800);
    desc.attackerAbility = attacker.ability;
  }

  if (defender.hasAbility('Solid Rock', 'Filter') && typeEffectiveness > 1) {
    finalMods.push(0xc00);
    desc.defenderAbility = defender.ability;
  }

  if (attacker.hasItem('Metronome') && move.timesUsedWithMetronome! >= 1) {
    const timesUsedWithMetronome = Math.floor(move.timesUsedWithMetronome!);
    if (timesUsedWithMetronome <= 4) {
      finalMods.push(0x1000 + timesUsedWithMetronome * 0x333);
    } else {
      finalMods.push(0x2000);
    }
    desc.attackerItem = attacker.item;
  }

  if (attacker.hasItem('Expert Belt') && typeEffectiveness > 1 && !move.isZ) {
    finalMods.push(0x1333);
    desc.attackerItem = attacker.item;
  } else if (attacker.hasItem('Life Orb')) {
    finalMods.push(0x14cc);
    desc.attackerItem = attacker.item;
  }

  if (move.hasType(getBerryResistType(defender.item)) &&
      (typeEffectiveness > 1 || move.hasType('Normal')) &&
      !attacker.hasAbility('Unnerve')) {
    finalMods.push(0x800);
    desc.defenderItem = defender.item;
  }

  if (field.defenderSide.isProtected && move.isZ && attacker.item && attacker.item.includes(' Z')) {
    finalMods.push(0x400);
    desc.isProtected = true;
  }

  const finalMod = chainMods(finalMods);

  let childDamage: number[] | undefined;
  if (attacker.hasAbility('Parental Bond') && move.hits === 1 && !isSpread) {
    const child = attacker.clone();
    child.ability = 'Parental Bond (Child)' as AbilityName;
    checkMultihitBoost(gen, child, defender, move, field, desc);
    childDamage = calculateBWXY(gen, child, defender, move, field).damage as number[];
    desc.attackerAbility = attacker.ability;
  }

  let damage: number[] = [];
  for (let i = 0; i < 16; i++) {
    damage[i] =
      getFinalDamage(baseDamage, i, typeEffectiveness, applyBurn, stabMod, finalMod);
  }

  if (move.dropsStats && (move.timesUsed || 0) > 1) {
    const simpleMultiplier = attacker.hasAbility('Simple') ? 2 : 1;

    desc.moveTurns = `over ${move.timesUsed} turns`;
    const hasWhiteHerb = attacker.hasItem('White Herb');
    let usedWhiteHerb = false;
    let dropCount = attacker.boosts[attackStat];
    for (let times = 0; times < move.timesUsed!; times++) {
      const newAttack = getModifiedStat(attack, dropCount);
      let damageMultiplier = 0;
      damage = damage.map(affectedAmount => {
        if (times) {
          const newBaseDamage = getBaseDamage(attacker.level, basePower, newAttack, defense);
          const newFinalDamage = getFinalDamage(
            newBaseDamage,
            damageMultiplier,
            typeEffectiveness,
            applyBurn,
            stabMod,
            finalMod
          );
          damageMultiplier++;
          return affectedAmount + newFinalDamage;
        }
        return affectedAmount;
      });

      if (attacker.hasAbility('Contrary')) {
        dropCount = Math.min(6, dropCount + move.dropsStats);
        desc.attackerAbility = attacker.ability;
      } else {
        dropCount = Math.max(-6, dropCount - move.dropsStats * simpleMultiplier);
        if (attacker.hasAbility('Simple')) {
          desc.attackerAbility = attacker.ability;
        }
      }

      // the Pokémon hits THEN the stat rises / lowers
      if (hasWhiteHerb && attacker.boosts[attackStat] < 0 && !usedWhiteHerb) {
        dropCount += move.dropsStats * simpleMultiplier;
        usedWhiteHerb = true;
        desc.attackerItem = attacker.item;
      }
    }
  }

  desc.attackBoost =
    move.named('Foul Play') ? defender.boosts[attackStat] : attacker.boosts[attackStat];

  result.damage = childDamage ? [damage, childDamage] : damage;

  // #endregion

  return result;
}
