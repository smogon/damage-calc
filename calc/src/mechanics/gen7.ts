import {
  getItemBoostType,
  getNaturalGift,
  getFlingPower,
  getBerryResistType,
  getTechnoBlast,
  getMultiAttack,
  MEGA_STONES,
  SEED_BOOSTED_STAT,
} from '../data/items';
import {NATURES} from '../data/natures';
import {SPECIES} from '../data/species';
import {TYPE_CHART} from '../data/types';
import {RawDesc} from '../desc';
import {Field, Side} from '../field';
import {Move} from '../move';
import {Pokemon} from '../pokemon';
import {Result} from '../result';
import {displayStat, Stat} from '../stats';
import {
  getModifiedStat,
  getFinalSpeed,
  getMoveEffectiveness,
  checkAirLock,
  checkForecast,
  checkKlutz,
  checkIntimidate,
  checkDownload,
  isGrounded,
  countBoosts,
  pokeRound,
} from './util';

const SM = 7;

export function makeCalculate(gen: 5 | 6 | 7) {
  return (attacker: Pokemon, defender: Pokemon, move: Move, field: Field) =>
    calculateModern(gen, attacker, defender, move, field);
}

export const calculateSM = makeCalculate(SM);

function calculateModern(
  gen: 5 | 6 | 7,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field
) {
  checkAirLock(attacker, field);
  checkAirLock(defender, field);
  checkForecast(attacker, field.weather);
  checkForecast(defender, field.weather);
  checkKlutz(attacker);
  checkKlutz(defender);
  checkSeedBoost(attacker, field);
  checkSeedBoost(defender, field);

  attacker.stats.def = getModifiedStat(attacker.rawStats.def, attacker.boosts.def);
  attacker.stats.spd = getModifiedStat(attacker.rawStats.spd, attacker.boosts.spd);
  attacker.stats.spe = getFinalSpeed(gen, attacker, field, field.attackerSide);
  defender.stats.def = getModifiedStat(defender.rawStats.def, defender.boosts.def);
  defender.stats.spd = getModifiedStat(defender.rawStats.spd, defender.boosts.spd);
  defender.stats.spe = getFinalSpeed(gen, defender, field, field.defenderSide);

  checkIntimidate(attacker, defender);
  checkIntimidate(defender, attacker);
  checkDownload(attacker, defender);
  checkDownload(defender, attacker);

  attacker.stats.atk = getModifiedStat(attacker.rawStats.atk, attacker.boosts.atk);
  attacker.stats.spa = getModifiedStat(attacker.rawStats.spa, attacker.boosts.spa);
  defender.stats.atk = getModifiedStat(defender.rawStats.atk, defender.boosts.atk);
  defender.stats.spa = getModifiedStat(defender.rawStats.spa, defender.boosts.spa);

  checkInfiltrator(attacker, field.defenderSide);
  checkInfiltrator(defender, field.attackerSide);

  const description: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
  };

  const damage: number[] = [];
  const result = new Result(gen, attacker, defender, move, field, damage, description);

  if (move.bp === 0) {
    damage.push(0);
    return result;
  }

  if (field.defenderSide.isProtected && !move.bypassesProtect && !move.isZ) {
    description.isProtected = true;
    damage.push(0);
    return result;
  }
  const defenderIgnoresAbility = defender.hasAbility(
    'Full Metal Body',
    'Prism Armor',
    'Shadow Shield'
  );
  const attackerIgnoresAbility = attacker.hasAbility('Mold Breaker', 'Teravolt', 'Turboblaze');
  const moveIgnoresAbility =
    [
      'Light That Burns the Sky',
      'Menacing Moonraze Maelstrom',
      'Moongeist Beam',
      'Photon Geyser',
      'Searing Sunraze Smash',
      'Sunsteel Strike',
    ].indexOf(move.name) !== -1;
  if (!defenderIgnoresAbility) {
    if (attackerIgnoresAbility) {
      defender.ability = '';
      description.attackerAbility = attacker.ability;
    }
  }
  if (moveIgnoresAbility && !defenderIgnoresAbility) {
    defender.ability = '';
  }

  const isCritical =
    ((move.isCrit && !defender.hasAbility('Battle Armor', 'Shell Armor')) ||
      (attacker.hasAbility('Merciless') && defender.hasStatus('Poisoned', 'Badly Poisoned'))) &&
    move.usedTimes === 1;

  if (move.name === 'Weather Ball') {
    move.type = field.hasWeather('Sun', 'Harsh Sunshine')
      ? 'Fire'
      : field.hasWeather('Rain', 'Heavy Rain')
      ? 'Water'
      : field.hasWeather('Sand')
      ? 'Rock'
      : field.hasWeather('Hail')
      ? 'Ice'
      : 'Normal';
    description.weather = field.weather;
    description.moveType = move.type;
  } else if (move.name === 'Judgment' && attacker.item && attacker.item.indexOf('Plate') !== -1) {
    move.type = getItemBoostType(attacker.item)!;
  } else if (
    move.name === 'Techno Blast' &&
    attacker.item &&
    attacker.item.indexOf('Drive') !== -1
  ) {
    move.type = getTechnoBlast(attacker.item)!;
  } else if (
    move.name === 'Multi-Attack' &&
    attacker.item &&
    attacker.item.indexOf('Memory') !== -1
  ) {
    move.type = getMultiAttack(attacker.item)!;
  } else if (
    move.name === 'Natural Gift' &&
    attacker.item &&
    attacker.item.indexOf('Berry') !== -1
  ) {
    const gift = getNaturalGift(gen, attacker.item)!;
    move.type = gift.t;
    move.bp = gift.p;
    description.attackerItem = attacker.item;
    description.moveBP = move.bp;
    description.moveType = move.type;
  } else if (move.name === 'Nature Power') {
    move.type =
      field.terrain === 'Electric'
        ? 'Electric'
        : field.terrain === 'Grassy'
        ? 'Grass'
        : field.terrain === 'Misty'
        ? 'Fairy'
        : field.terrain === 'Psychic'
        ? 'Psychic'
        : 'Normal';
  } else if (move.name === 'Revelation Dance') {
    move.type = attacker.type1;
  }

  let isAerilate = false;
  let isPixilate = false;
  let isRefrigerate = false;
  let isGalvanize = false;
  let isLiquidVoice = false;
  let isNormalize = false;
  const noTypeChange =
    [
      'Revelation Dance',
      'Judgement',
      'Nature Power',
      'Techo Blast',
      'Multi Attack',
      'Natural Gift',
      'Weather Ball',
    ].indexOf(move.name) !== -1;

  if (!move.isZ && !noTypeChange) {
    isAerilate = attacker.ability === 'Aerilate' && move.type === 'Normal';
    isPixilate = attacker.ability === 'Pixilate' && move.type === 'Normal';
    isRefrigerate = attacker.ability === 'Refrigerate' && move.type === 'Normal';
    isGalvanize = attacker.ability === 'Galvanize' && move.type === 'Normal';
    isLiquidVoice = attacker.ability === 'Liquid Voice' && move.isSound;
    isNormalize = attacker.ability === 'Normalize' && !!move.type;
    if (isAerilate) {
      move.type = 'Flying';
    } else if (isGalvanize) {
      move.type = 'Electric';
    } else if (isLiquidVoice) {
      move.type = 'Water';
    } else if (isPixilate) {
      move.type = 'Fairy';
    } else if (isRefrigerate) {
      move.type = 'Ice';
    } else if (isNormalize) {
      move.type = 'Normal';
    }
    if (isGalvanize || isLiquidVoice || isPixilate || isRefrigerate || isAerilate || isNormalize) {
      description.attackerAbility = attacker.ability;
    }
  }

  if (
    (attacker.hasAbility('Gale Wings') &&
      move.type === 'Flying' &&
      (gen >= 7 ? attacker.curHP === attacker.maxHP() : true)) ||
    (attacker.hasAbility('Triage') && move.givesHealth)
  ) {
    move.hasPriority = true;
    description.attackerAbility = attacker.ability;
  }

  const typeEffect1 = getMoveEffectiveness(
    gen,
    move,
    defender.type1,
    attacker.ability === 'Scrappy' || field.defenderSide.isForesight,
    field.isGravity
  );
  const typeEffect2 = defender.type2
    ? getMoveEffectiveness(
        gen,
        move,
        defender.type2,
        attacker.hasAbility('Scrappy') || field.defenderSide.isForesight,
        field.isGravity
      )
    : 1;
  let typeEffectiveness = typeEffect1 * typeEffect2;
  const resistedKnockOffDamage =
    !defender.item ||
    (defender.named('Giratina-Origin') && defender.hasItem('Griseous Orb')) ||
    (defender.name.indexOf('Arceus') !== -1 && defender.item.indexOf('Plate') !== -1) ||
    (defender.name.indexOf('Genesect') !== -1 && defender.item.indexOf('Drive') !== -1) ||
    (defender.hasAbility('RKS System') && defender.item.indexOf('Memory') !== -1) ||
    defender.item.indexOf(' Z') !== -1 ||
    (MEGA_STONES[defender.item] && defender.name.indexOf(MEGA_STONES[defender.item]) !== -1);
  // The last case only applies when the Pokemon is holding the Mega Stone that matches its species (or when it's already a Mega-Evolution)

  if (typeEffectiveness === 0 && move.name === 'Thousand Arrows') {
    typeEffectiveness = 1;
  }
  if (defender.hasItem('Ring Target') && typeEffectiveness === 0) {
    if (TYPE_CHART[gen][move.type]![defender.type1]! === 0) {
      typeEffectiveness = typeEffect2;
    } else if (defender.type2 && TYPE_CHART[gen][move.type]![defender.type2]! === 0) {
      typeEffectiveness = typeEffect1;
    }
  }
  if (typeEffectiveness === 0) {
    damage.push(0);
    return result;
  }
  if (
    move.name === 'Sky Drop' &&
    (defender.hasType('Flying') || (gen >= 6 && defender.weight >= 200) || field.isGravity)
  ) {
    damage.push(0);
    return result;
  }
  if (
    move.name === 'Synchronoise' &&
    !defender.hasType(attacker.type1) &&
    (!attacker.type2 || !defender.hasType(attacker.type2))
  ) {
    damage.push(0);
    return result;
  }
  if (
    move.name === 'Dream Eater' &&
    !defender.hasStatus('Asleep') &&
    !defender.hasAbility('Comatose')
  ) {
    damage.push(0);
    return result;
  }
  if (
    (defender.hasAbility('Wonder Guard') && typeEffectiveness <= 1) ||
    (move.type === 'Grass' && defender.hasAbility('Sap Sipper')) ||
    (move.type === 'Fire' && defender.hasAbility('Flash Fire', 'Flash Fire (activated)')) ||
    (move.type === 'Water' && defender.hasAbility('Dry Skin', 'Storm Drain', 'Water Absorb')) ||
    (move.type === 'Electric' &&
      defender.hasAbility('Lightning Rod', 'Motor Drive', 'Volt Absorb')) ||
    (move.type === 'Ground' &&
      !field.isGravity &&
      move.name !== 'Thousand Arrows' &&
      defender.hasAbility('Levitate')) ||
    (move.isBullet && defender.hasAbility('Bulletproof')) ||
    (move.isSound && defender.hasAbility('Soundproof')) ||
    (move.hasPriority && defender.hasAbility('Queenly Majesty', 'Dazzling'))
  ) {
    description.defenderAbility = defender.ability;
    damage.push(0);
    return result;
  }
  if (
    field.weather === 'Strong Winds' &&
    defender.hasType('Flying') &&
    TYPE_CHART[gen][move.type]!['Flying']! > 1
  ) {
    typeEffectiveness /= 2;
    description.weather = field.weather;
  }
  if (
    move.type === 'Ground' &&
    move.name !== 'Thousand Arrows' &&
    !field.isGravity &&
    defender.hasItem('Air Balloon')
  ) {
    description.defenderItem = defender.item;
    damage.push(0);
    return result;
  }
  if (move.hasPriority && field.terrain === 'Psychic' && isGrounded(defender, field)) {
    description.terrain = field.terrain;
    damage.push(0);
    return result;
  }

  description.HPEVs = defender.evs.hp + ' HP';

  if (['Seismic Toss', 'Night Shade'].indexOf(move.name) !== -1) {
    let lv = attacker.level;
    if (attacker.hasAbility('Parental Bond')) {
      lv *= 2;
    }
    damage.push(lv);
    return result;
  }

  if (move.name === 'Final Gambit') {
    damage.push(attacker.curHP);
    return result;
  }

  if (move.name === 'Guardian of Alola') {
    let zLostHP = Math.floor((defender.curHP * 3) / 4);
    if (field.defenderSide.isProtected && attacker.item && attacker.item.indexOf(' Z') !== -1) {
      zLostHP = Math.ceil(zLostHP / 4 - 0.5);
    }
    damage.push(zLostHP);
    return result;
  }

  if (move.name === "Nature's Madness") {
    const lostHP = field.defenderSide.isProtected ? 0 : Math.floor(defender.curHP / 2);
    damage.push(lostHP);
    return result;
  }

  if (move.name === 'Spectral Thief') {
    let stat: Stat;
    for (stat in defender.boosts) {
      if (defender.boosts[stat]) {
        attacker.boosts[stat] +=
          attacker.ability === 'Contrary' ? -defender.boosts[stat]! : defender.boosts[stat]!;
        attacker.stats[stat] = getModifiedStat(attacker.rawStats[stat]!, attacker.boosts[stat]!);
      }
    }
  }

  if (move.hits > 1) {
    description.hits = move.hits;
  }

  const turnOrder = attacker.stats.spe > defender.stats.spe ? 'FIRST' : 'LAST';

  ////////////////////////////////
  ////////// BASE POWER //////////
  ////////////////////////////////
  let basePower: number;

  switch (move.name) {
    case 'Payback':
      basePower = turnOrder === 'LAST' ? 100 : 50;
      description.moveBP = basePower;
      break;
    case 'Electro Ball':
      const r = Math.floor(attacker.stats.spe / defender.stats.spe);
      basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : r >= 1 ? 60 : 40;
      description.moveBP = basePower;
      break;
    case 'Gyro Ball':
      basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe));
      description.moveBP = basePower;
      break;
    case 'Punishment':
      basePower = Math.min(200, 60 + 20 * countBoosts(gen, defender.boosts));
      description.moveBP = basePower;
      break;
    case 'Low Kick':
    case 'Grass Knot':
      const w = defender.weight * getWeightFactor(defender);
      basePower = w >= 200 ? 120 : w >= 100 ? 100 : w >= 50 ? 80 : w >= 25 ? 60 : w >= 10 ? 40 : 20;
      description.moveBP = basePower;
      break;
    case 'Hex':
      basePower = move.bp * (!defender.hasStatus('Healthy') ? 2 : 1);
      description.moveBP = basePower;
      break;
    case 'Heavy Slam':
    case 'Heat Crash':
      const wr =
        (attacker.weight * getWeightFactor(attacker)) /
        (defender.weight * getWeightFactor(defender));
      basePower = wr >= 5 ? 120 : wr >= 4 ? 100 : wr >= 3 ? 80 : wr >= 2 ? 60 : 40;
      description.moveBP = basePower;
      break;
    case 'Stored Power':
    case 'Power Trip':
      basePower = 20 + 20 * countBoosts(gen, attacker.boosts);
      description.moveBP = basePower;
      break;
    case 'Acrobatics':
      basePower = attacker.hasItem('Flying Gem') || !attacker.item ? 110 : 55;
      description.moveBP = basePower;
      break;
    case 'Wake-Up Slap':
      basePower = move.bp * (defender.hasStatus('Asleep') ? 2 : 1);
      description.moveBP = basePower;
      break;
    case 'Weather Ball':
      basePower = field.weather && !field.hasWeather('Strong Winds') ? 100 : 50;
      description.moveBP = basePower;
      break;
    case 'Fling':
      basePower = getFlingPower(attacker.item);
      description.moveBP = basePower;
      description.attackerItem = attacker.item;
      break;
    case 'Eruption':
    case 'Water Spout':
      basePower = Math.max(1, Math.floor((150 * attacker.curHP) / attacker.maxHP()));
      description.moveBP = basePower;
      break;
    case 'Flail':
    case 'Reversal':
      const p = Math.floor((48 * attacker.curHP) / attacker.maxHP());
      basePower = p <= 1 ? 200 : p <= 4 ? 150 : p <= 9 ? 100 : p <= 16 ? 80 : p <= 32 ? 40 : 20;
      description.moveBP = basePower;
      break;
    case 'Nature Power':
      basePower =
        field.terrain && ['Electric', 'Grassy', 'Psychic'].indexOf(field.terrain) !== -1
          ? 90
          : field.terrain === 'Misty'
          ? 95
          : 80;
      break;
    case 'Water Shuriken':
      basePower = attacker.name === 'Greninja-Ash' && attacker.hasAbility('Battle Bond') ? 20 : 15;
      description.moveBP = basePower;
      break;
    case 'Crush Grip':
    case 'Wring Out':
      basePower = 100 * Math.floor((defender.curHP * 4096) / defender.maxHP());
      basePower = Math.floor(Math.floor((120 * basePower + 2048 - 1) / 4096) / 100) || 1;
      description.moveBP = basePower;
      break;
    default:
      basePower = move.bp;
  }

  const bpMods = [];
  if (
    (attacker.hasAbility('Technician') && basePower <= 60) ||
    (attacker.hasAbility('Flare Boost') &&
      attacker.hasStatus('Burned') &&
      move.category === 'Special') ||
    (attacker.hasAbility('Toxic Boost') &&
      attacker.hasStatus('Poisoned', 'Badly Poisoned') &&
      move.category === 'Physical')
  ) {
    bpMods.push(0x1800);
    description.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Analytic') && turnOrder !== 'FIRST') {
    bpMods.push(0x14cd);
    description.attackerAbility = attacker.ability;
  } else if (
    attacker.hasAbility('Sand Force') &&
    field.hasWeather('Sand') &&
    ['Rock', 'Ground', 'Steel'].indexOf(move.type) !== -1
  ) {
    bpMods.push(0x14cd);
    description.attackerAbility = attacker.ability;
    description.weather = field.weather;
  } else if (
    (attacker.hasAbility('Reckless') &&
      (typeof move.hasRecoil === 'number' || move.hasRecoil === 'crash')) ||
    (attacker.hasAbility('Iron Fist') && move.isPunch)
  ) {
    bpMods.push(0x1333);
    description.attackerAbility = attacker.ability;
  }

  if (defender.hasAbility('Heatproof') && move.type === 'Fire') {
    bpMods.push(0x800);
    description.defenderAbility = defender.ability;
  } else if (defender.hasAbility('Dry Skin') && move.type === 'Fire') {
    bpMods.push(0x1400);
    description.defenderAbility = defender.ability;
  } else if (
    defender.hasAbility('Fluffy') &&
    (!move.makesContact || attacker.hasAbility('Long Reach')) &&
    move.type === 'Fire'
  ) {
    bpMods.push(0x2000);
    description.defenderAbility = defender.ability;
  } else if (
    defender.hasAbility('Fluffy') &&
    move.makesContact &&
    !attacker.hasAbility('Long Reach') &&
    move.type !== 'Fire'
  ) {
    bpMods.push(0x800);
    description.defenderAbility = defender.ability;
  }

  if (attacker.hasAbility('Sheer Force') && move.hasSecondaryEffect) {
    bpMods.push(0x14cd);
    description.attackerAbility = attacker.ability;
  }

  if (
    attacker.hasAbility('Rivalry') &&
    [attacker.gender, defender.gender].indexOf('genderless') === -1
  ) {
    if (attacker.gender === defender.gender) {
      bpMods.push(0x1400);
      description.rivalry = 'buffed';
    } else {
      bpMods.push(0xccd);
      description.rivalry = 'nerfed';
    }
    description.attackerAbility = attacker.ability;
  }

  const isSTAB = attacker.hasType(move.type);

  if (attacker.item && getItemBoostType(attacker.item) === move.type) {
    bpMods.push(0x1333);
    description.attackerItem = attacker.item;
  } else if (
    (attacker.hasItem('Muscle Band') && move.category === 'Physical') ||
    (attacker.hasItem('Wise Glasses') && move.category === 'Special')
  ) {
    bpMods.push(0x1199);
    description.attackerItem = attacker.item;
  } else if (
    ((attacker.hasItem('Adamant Orb') && attacker.named('Dialga')) ||
      (attacker.hasItem('Lustrous Orb') && attacker.named('Palkia')) ||
      (attacker.hasItem('Griseous Orb') && attacker.named('Giratina-Origin'))) &&
    isSTAB
  ) {
    bpMods.push(0x1333);
    description.attackerItem = attacker.item;
  } else if (attacker.item === move.type + ' Gem') {
    bpMods.push(gen >= 6 ? 0x14cd : 0x1800);
    description.attackerItem = attacker.item;
  } else if (
    attacker.hasItem('Soul Dew') &&
    attacker.named('Latios', 'Latias', 'Latios-Mega', 'Latias-Mega') &&
    isSTAB
  ) {
    bpMods.push(gen >= 7 ? 0x1333 : 0x1000);
    description.attackerItem = attacker.item;
  }

  if (
    (move.name === 'Facade' &&
      attacker.hasStatus('Burned', 'Paralyzed', 'Poisoned', 'Badly Poisoned')) ||
    (move.name === 'Brine' && defender.curHP <= defender.maxHP() / 2) ||
    (move.name === 'Venoshock' && defender.hasStatus('Poisoned', 'Badly Poisoned'))
  ) {
    bpMods.push(0x2000);
    description.moveBP = move.bp * 2;
  } else if (move.name === 'Solar Beam' && field.hasWeather('Rain', 'Heavy Rain', 'Sand', 'Hail')) {
    bpMods.push(0x800);
    description.moveBP = move.bp / 2;
    description.weather = field.weather;
  } else if (gen >= 6 && move.name === 'Knock Off' && !resistedKnockOffDamage) {
    bpMods.push(0x1800);
    description.moveBP = move.bp * 1.5;
  } else if (
    [
      'Breakneck Blitz',
      'Bloom Doom',
      'Inferno Overdrive',
      'Hydro Vortex',
      'Gigavolt Havoc',
      'Subzero Slammer',
      'Supersonic Skystrike',
      'Savage Spin-Out',
      'Acid Downpour',
      'Tectonic Rage',
      'Continental Crush',
      'All-Out Pummeling',
      'Shattered Psyche',
      'Never-Ending Nightmare',
      'Devastating Drake',
      'Black Hole Eclipse',
      'Corkscrew Crash',
      'Twinkle Tackle',
    ].indexOf(move.name) !== -1
  ) {
    // show z-move power in description
    description.moveBP = move.bp;
  }

  if (field.attackerSide.isHelpingHand) {
    bpMods.push(0x1800);
    description.isHelpingHand = true;
  }

  if (field.attackerSide.isBattery && move.category === 'Special') {
    bpMods.push(0x14cc);
    description.isBattery = true;
  }

  if (isAerilate || isPixilate || isRefrigerate || isGalvanize || isNormalize) {
    bpMods.push(gen >= 7 ? 0x1333 : 0x14cd);
    description.attackerAbility = attacker.ability;
  } else if (
    (attacker.hasAbility('Mega Launcher') && move.isPulse) ||
    (attacker.hasAbility('Strong Jaw') && move.isBite)
  ) {
    bpMods.push(0x1800);
    description.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Tough Claws') && move.makesContact) {
    bpMods.push(0x14cd);
    description.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Neuroforce') && typeEffectiveness > 1) {
    bpMods.push(0x1400);
    description.attackerAbility = attacker.ability;
  }

  const isAttackerAura = attacker.ability === move.type + ' Aura';
  const isDefenderAura = defender.ability === move.type + ' Aura';
  if (isAttackerAura || isDefenderAura) {
    if (attacker.hasAbility('Aura Break') || defender.hasAbility('Aura Break')) {
      bpMods.push(0x0c00);
      description.attackerAbility = attacker.ability;
      description.defenderAbility = defender.ability;
    } else {
      bpMods.push(0x1547);
      if (isAttackerAura) {
        description.attackerAbility = attacker.ability;
      }
      if (isDefenderAura) {
        description.defenderAbility = defender.ability;
      }
    }
  }

  basePower = Math.max(1, pokeRound((basePower * chainMods(bpMods)) / 0x1000));

  ////////////////////////////////
  ////////// (SP)ATTACK //////////
  ////////////////////////////////
  let attack: number;
  const attackSource = move.name === 'Foul Play' ? defender : attacker;
  if (move.usesHighestAttackStat) {
    move.category = attackSource.stats.atk > attackSource.stats.spa ? 'Physical' : 'Special';
  }
  const attackStat = move.category === 'Physical' ? 'atk' : 'spa';
  description.attackEVs =
    attacker.evs[attackStat] +
    (NATURES[attacker.nature][0] === attackStat
      ? '+'
      : NATURES[attacker.nature][1] === attackStat
      ? '-'
      : '') +
    ' ' +
    displayStat(attackStat);
  if (
    attackSource.boosts[attackStat] === 0 ||
    (isCritical && attackSource.boosts[attackStat] < 0)
  ) {
    attack = attackSource.rawStats[attackStat];
  } else if (defender.hasAbility('Unaware')) {
    attack = attackSource.rawStats[attackStat];
    description.defenderAbility = defender.ability;
  } else {
    attack = attackSource.stats[attackStat];
    description.attackBoost = attackSource.boosts[attackStat];
  }

  // unlike all other attack modifiers, Hustle gets applied directly
  if (attacker.hasAbility('Hustle') && move.category === 'Physical') {
    attack = pokeRound((attack * 3) / 2);
    description.attackerAbility = attacker.ability;
  }

  const atMods = [];
  if (
    (defender.hasAbility('Thick Fat') && (move.type === 'Fire' || move.type === 'Ice')) ||
    (defender.hasAbility('Water Bubble') && move.type === 'Fire')
  ) {
    atMods.push(0x800);
    description.defenderAbility = defender.ability;
  }
  if (
    (attacker.hasAbility('Guts') &&
      !attacker.hasStatus('Healthy') &&
      move.category === 'Physical') ||
    (attacker.curHP <= attacker.maxHP() / 3 &&
      ((attacker.hasAbility('Overgrow') && move.type === 'Grass') ||
        (attacker.hasAbility('Blaze') && move.type === 'Fire') ||
        (attacker.hasAbility('Torrent') && move.type === 'Water') ||
        (attacker.hasAbility('Swarm') && move.type === 'Bug'))) ||
    (move.category === 'Special' && attacker.abilityOn && attacker.hasAbility('Plus', 'Minus'))
  ) {
    atMods.push(0x1800);
    description.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.type === 'Fire') {
    atMods.push(0x1800);
    description.attackerAbility = 'Flash Fire';
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
    description.attackerAbility = attacker.ability;
    description.weather = field.weather;
  } else if (
    (attacker.hasAbility('Defeatist') && attacker.curHP <= attacker.maxHP() / 2) ||
    (attacker.hasAbility('Slow Start') && attacker.abilityOn && move.category === 'Physical')
  ) {
    atMods.push(0x800);
    description.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Huge Power', 'Pure Power') && move.category === 'Physical') {
    atMods.push(0x2000);
    description.attackerAbility = attacker.ability;
  } else if (
    attacker.hasAbility('Stakeout') &&
    attacker.abilityOn &&
    move.category === 'Physical'
  ) {
    atMods.push(0x2000);
    description.attackerAbility = attacker.ability;
  }

  if (
    (attacker.hasItem('Thick Club') &&
      attacker.named('Cubone', 'Marowak', 'Marowak-Alola') &&
      move.category === 'Physical') ||
    (attacker.hasItem('Deep Sea Tooth') &&
      attacker.named('Clamperl') &&
      move.category === 'Special') ||
    (attacker.hasItem('Light Ball') && attacker.named('Pikachu') && !move.isZ)
  ) {
    atMods.push(0x2000);
    description.attackerItem = attacker.item;
  } else if (
    (gen < 7 &&
      attacker.hasItem('Soul Dew') &&
      attacker.named('Latios', 'Latias') &&
      move.category === 'Special') ||
    (!move.isZ &&
      ((attacker.hasItem('Choice Band') && move.category === 'Physical') ||
        (attacker.hasItem('Choice Specs') && move.category === 'Special')))
  ) {
    atMods.push(0x1800);
    description.attackerItem = attacker.item;
  }

  attack = Math.max(1, pokeRound((attack * chainMods(atMods)) / 0x1000));

  ////////////////////////////////
  ///////// (SP)DEFENSE //////////
  ////////////////////////////////
  let defense: number;
  const hitsPhysical = move.category === 'Physical' || move.dealsPhysicalDamage;
  const defenseStat = hitsPhysical ? 'def' : 'spd';
  description.defenseEVs =
    defender.evs[defenseStat] +
    (NATURES[defender.nature][0] === defenseStat
      ? '+'
      : NATURES[defender.nature][1] === defenseStat
      ? '-'
      : '') +
    ' ' +
    displayStat(defenseStat);
  if (
    defender.boosts[defenseStat] === 0 ||
    (isCritical && defender.boosts[defenseStat] > 0) ||
    move.ignoresDefenseBoosts
  ) {
    defense = defender.rawStats[defenseStat];
  } else if (attacker.hasAbility('Unaware')) {
    defense = defender.rawStats[defenseStat];
    description.attackerAbility = attacker.ability;
  } else {
    defense = defender.stats[defenseStat];
    description.defenseBoost = defender.boosts[defenseStat];
  }

  // unlike all other defense modifiers, Sandstorm SpD boost gets applied directly
  if (field.hasWeather('Sand') && defender.hasType('Rock') && !hitsPhysical) {
    defense = pokeRound((defense * 3) / 2);
    description.weather = field.weather;
  }

  const dfMods = [];
  if (defender.hasAbility('Marvel Scale') && defender.status !== 'Healthy' && hitsPhysical) {
    dfMods.push(0x1800);
    description.defenderAbility = defender.ability;
  } else if (
    defender.named('Cherrim') &&
    defender.hasAbility('Flower Gift') &&
    field.hasWeather('Sun', 'Harsh Sunshine') &&
    !hitsPhysical
  ) {
    dfMods.push(0x1800);
    description.defenderAbility = defender.ability;
    description.weather = field.weather;
  }

  if (field.terrain === 'Grassy' && defender.hasAbility('Grass Pelt') && hitsPhysical) {
    dfMods.push(0x1800);
    description.defenderAbility = defender.ability;
  }

  if (
    (gen < 7 &&
      !hitsPhysical &&
      defender.named('Latios', 'Latias') &&
      defender.hasItem('Soul Dew')) ||
    (defender.hasItem('Eviolite') && SPECIES[gen][defender.name].canEvolve) ||
    (!hitsPhysical && defender.hasItem('Assault Vest'))
  ) {
    dfMods.push(0x1800);
    description.defenderItem = defender.item;
  }

  if (
    (defender.hasItem('Metal Powder') && defender.named('Ditto') && hitsPhysical) ||
    (defender.hasItem('Deep Sea Scale') && defender.named('Clamperl') && !hitsPhysical)
  ) {
    dfMods.push(0x2000);
    description.defenderItem = defender.item;
  }

  if (defender.hasAbility('Fur Coat') && hitsPhysical) {
    dfMods.push(0x2000);
    description.defenderAbility = defender.ability;
  }

  defense = Math.max(1, pokeRound((defense * chainMods(dfMods)) / 0x1000));

  ////////////////////////////////
  //////////// DAMAGE ////////////
  ////////////////////////////////
  let baseDamage = getBaseDamage(attacker.level, basePower, attack, defense);
  if (field.gameType !== 'Singles' && move.isSpread) {
    baseDamage = pokeRound((baseDamage * 0xc00) / 0x1000);
  }
  if (
    (field.hasWeather('Sun', 'Harsh Sunshine') && move.type === 'Fire') ||
    (field.hasWeather('Rain', 'Heavy Rain') && move.type === 'Water')
  ) {
    baseDamage = pokeRound((baseDamage * 0x1800) / 0x1000);
    description.weather = field.weather;
  } else if (
    (field.hasWeather('Sun') && move.type === 'Water') ||
    (field.hasWeather('Rain') && move.type === 'Fire')
  ) {
    baseDamage = pokeRound((baseDamage * 0x800) / 0x1000);
    description.weather = field.weather;
  } else if (
    (field.hasWeather('Harsh Sunshine') && move.type === 'Water') ||
    (field.hasWeather('Heavy Rain') && move.type === 'Fire')
  ) {
    damage.push(0);
    return result;
  }
  if (isGrounded(attacker, field)) {
    if (field.terrain === 'Electric' && move.type === 'Electric') {
      baseDamage = pokeRound((baseDamage * 0x1800) / 0x1000);
      description.terrain = field.terrain;
    } else if (field.terrain === 'Grassy' && move.type === 'Grass') {
      baseDamage = pokeRound((baseDamage * 0x1800) / 0x1000);
      description.terrain = field.terrain;
    } else if (field.terrain === 'Psychic' && move.type === 'Psychic') {
      baseDamage = pokeRound((baseDamage * 0x1800) / 0x1000);
      description.terrain = field.terrain;
    }
  }
  if (isGrounded(defender, field)) {
    if (field.terrain === 'Misty' && move.type === 'Dragon') {
      baseDamage = pokeRound((baseDamage * 0x800) / 0x1000);
      description.terrain = field.terrain;
    } else if (field.terrain === 'Grassy' && ['Bulldoze', 'Earthquake'].indexOf(move.name) !== -1) {
      baseDamage = pokeRound((baseDamage * 0x800) / 0x1000);
      description.terrain = field.terrain;
    }
  }
  if (
    hasTerrainSeed(defender) &&
    field.terrain === defender.item!.substring(0, defender.item!.indexOf(' ')) &&
    SEED_BOOSTED_STAT[defender.item!] === defenseStat
  ) {
    // Last condition applies so the calc doesn't show a seed where it wouldn't affect the outcome (like Grassy Seed when being hit by a special move)
    description.defenderItem = defender.item;
  }
  if (isCritical) {
    baseDamage = Math.floor(baseDamage * (gen >= 6 ? 1.5 : 2));
    description.isCritical = isCritical;
  }
  // the random factor is applied between the crit mod and the stab mod, so don't apply anything below this until we're inside the loop
  let stabMod = 0x1000;
  if (isSTAB) {
    if (attacker.hasAbility('Adaptability')) {
      stabMod = 0x2000;
      description.attackerAbility = attacker.ability;
    } else {
      stabMod = 0x1800;
    }
  } else if (attacker.hasAbility('Protean')) {
    stabMod = 0x1800;
    description.attackerAbility = attacker.ability;
  }
  const applyBurn =
    attacker.hasStatus('Burned') &&
    move.category === 'Physical' &&
    !attacker.hasAbility('Guts') &&
    !move.ignoresBurn;
  description.isBurned = applyBurn;
  const finalMods = [];
  if (
    field.defenderSide.isReflect &&
    move.category === 'Physical' &&
    !isCritical &&
    !field.defenderSide.isAuroraVeil
  ) {
    // doesn't stack with Aurora Veil
    finalMods.push(field.gameType !== 'Singles' ? (gen >= 6 ? 0xaac : 0xa8f) : 0x800);
    description.isReflect = true;
  } else if (
    field.defenderSide.isLightScreen &&
    move.category === 'Special' &&
    !isCritical &&
    !field.defenderSide.isAuroraVeil
  ) {
    // doesn't stack with Aurora Veil
    finalMods.push(field.gameType !== 'Singles' ? (gen >= 6 ? 0xaac : 0xa8f) : 0x800);
    description.isLightScreen = true;
  }
  if (
    defender.hasAbility('Multiscale', 'Shadow Shield') &&
    defender.curHP === defender.maxHP() &&
    !field.defenderSide.isSR &&
    (!field.defenderSide.spikes || defender.hasType('Flying'))
  ) {
    finalMods.push(0x800);
    description.defenderAbility = defender.ability;
  }
  if (attacker.hasAbility('Tinted Lens') && typeEffectiveness < 1) {
    finalMods.push(0x2000);
    description.attackerAbility = attacker.ability;
  }
  if (attacker.hasAbility('Water Bubble') && move.type === 'Water') {
    finalMods.push(0x2000);
    description.attackerAbility = attacker.ability;
  }
  if (attacker.hasAbility('Steelworker') && move.type === 'Steel') {
    finalMods.push(0x1800);
    description.attackerAbility = attacker.ability;
  }
  if (field.defenderSide.isFriendGuard) {
    finalMods.push(0xc00);
    description.isFriendGuard = true;
  }
  if (field.defenderSide.isAuroraVeil && !isCritical) {
    // doesn't protect from critical hits
    finalMods.push(field.gameType !== 'Singles' ? 0xaac : 0x800); // 0.5x damage from physical and special attacks in singles, 0.66x damage in Doubles
    description.isAuroraVeil = true;
  }
  if (attacker.hasAbility('Sniper') && isCritical) {
    finalMods.push(0x1800);
    description.attackerAbility = attacker.ability;
  }
  if (defender.hasAbility('Solid Rock', 'Filter', 'Prism Armor') && typeEffectiveness > 1) {
    finalMods.push(0xc00);
    description.defenderAbility = defender.ability;
  }
  if (attacker.hasItem('Metronome') && (move.metronomeCount || 0) >= 1) {
    const metronomeCount = Math.floor(move.metronomeCount!);
    if (metronomeCount <= 4) {
      finalMods.push(0x1000 + metronomeCount * 0x333);
    } else {
      finalMods.push(0x2000);
    }
    description.attackerItem = attacker.item;
  }
  if (attacker.hasItem('Expert Belt') && typeEffectiveness > 1 && !move.isZ) {
    finalMods.push(0x1333);
    description.attackerItem = attacker.item;
  } else if (attacker.hasItem('Life Orb') && !move.isZ) {
    finalMods.push(0x14cc);
    description.attackerItem = attacker.item;
  }
  if (
    getBerryResistType(defender.item) === move.type &&
    (typeEffectiveness > 1 || move.type === 'Normal') &&
    !attacker.hasAbility('Unnerve')
  ) {
    finalMods.push(0x800);
    description.defenderItem = defender.item;
  }
  if (
    field.defenderSide.isProtected &&
    move.isZ &&
    attacker.item &&
    attacker.item.indexOf(' Z') !== -1
  ) {
    finalMods.push(0x400);
    description.isProtected = true;
  }
  const finalMod = chainMods(finalMods);

  for (let i = 0; i < 16; i++) {
    damage[i] = getFinalDamage(baseDamage, i, typeEffectiveness, applyBurn, stabMod, finalMod);
    // is 2nd hit half BP? half attack? half damage range? keeping it as a flat multiplier until I know the specifics
    if (
      attacker.ability === 'Parental Bond' &&
      move.hits === 1 &&
      (field.gameType === 'Singles' || !move.isSpread)
    ) {
      const bondFactor = gen < 7 ? 3 / 2 : 5 / 4; // in gen 7, 2nd hit was reduced from 50% to 25%
      damage[i] = Math.floor(damage[i] * bondFactor);
      description.attackerAbility = attacker.ability;
    }
  }
  if (move.dropsStats && (move.usedTimes || 0) > 1) {
    let simpleMultiplier = 1;
    if (attacker.hasAbility('Simple')) {
      simpleMultiplier = 2;
    }
    description.moveTurns = 'over ' + move.usedTimes + ' turns';
    const hasWhiteHerb = attacker.item === 'White Herb';
    let usedWhiteHerb = false;
    let dropCount = attacker.boosts[attackStat];
    for (let times = 0; times < move.usedTimes!; times++) {
      const newAttack = getModifiedStat(attack, dropCount);
      let damageMultiplier = 0;
      result.damage = damage.map(affectedAmount => {
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
        description.attackerAbility = attacker.ability;
      } else {
        dropCount = Math.max(-6, dropCount - move.dropsStats * simpleMultiplier);
        if (attacker.hasAbility('Simple')) {
          description.attackerAbility = attacker.ability;
        }
      }
      // the Pokémon hits THEN the stat rises / lowers
      if (hasWhiteHerb && attacker.boosts[attackStat] < 0 && !usedWhiteHerb) {
        dropCount += move.dropsStats * simpleMultiplier;
        usedWhiteHerb = true;
        description.attackerItem = attacker.item;
      }
    }
  }

  description.attackBoost = attacker.boosts[attackStat];
  return result;
}

function chainMods(mods: number[]) {
  let M = 0x1000;
  for (let i = 0; i < mods.length; i++) {
    if (mods[i] !== 0x1000) {
      M = (M * mods[i] + 0x800) >> 12;
    }
  }
  return M;
}

function checkSeedBoost(pokemon: Pokemon, field: Field) {
  if (!pokemon.item) return;
  if (field.terrain && pokemon.item.indexOf('Seed') !== -1) {
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

function hasTerrainSeed(pokemon: Pokemon) {
  return pokemon.hasItem('Electric Seed', 'Misty Seed', 'Grassy Seed', 'Psychic Seed');
}

function checkInfiltrator(pokemon: Pokemon, affectedSide: Side) {
  if (pokemon.hasAbility('Infiltrator')) {
    affectedSide.isReflect = false;
    affectedSide.isLightScreen = false;
    affectedSide.isAuroraVeil = false;
  }
}

function getBaseDamage(level: number, basePower: number, attack: number, defense: number) {
  return Math.floor(
    Math.floor((Math.floor((2 * level) / 5 + 2) * basePower * attack) / defense) / 50 + 2
  );
}

function getFinalDamage(
  baseAmount: number,
  i: number,
  effectiveness: number,
  isBurned: boolean,
  stabMod: number,
  finalMod: number
) {
  let damageAmount = Math.floor(
    pokeRound((Math.floor((baseAmount * (85 + i)) / 100) * stabMod) / 0x1000) * effectiveness
  );
  if (isBurned) {
    damageAmount = Math.floor(damageAmount / 2);
  }
  return pokeRound(Math.max(1, (damageAmount * finalMod) / 0x1000));
}

function getWeightFactor(pokemon: Pokemon) {
  return pokemon.hasAbility('Heavy Metal') ? 2 : pokemon.hasAbility('Light Metal') ? 0.5 : 1;
}
