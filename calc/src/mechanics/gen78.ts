import {Generation, AbilityName, StatName, Terrain} from '../data/interface';
import {toID} from '../util';
import {
  getBerryResistType,
  getFlingPower,
  getItemBoostType,
  getMultiAttack,
  getNaturalGift,
  getTechnoBlast,
  SEED_BOOSTED_STAT,
} from '../items';
import {RawDesc} from '../desc';
import {Field} from '../field';
import {Move} from '../move';
import {Pokemon} from '../pokemon';
import {Result} from '../result';
import {
  chainMods,
  checkAirLock,
  checkDauntlessShield,
  checkDownload,
  checkForecast,
  checkInfiltrator,
  checkIntimidate,
  checkIntrepidSword,
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
  getShellSideArmCategory,
  getWeightFactor,
  handleFixedDamageMoves,
  isGrounded,
  OF16, OF32,
  pokeRound,
} from './util';

export function calculateSMSS(
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
  checkIntrepidSword(attacker);
  checkIntrepidSword(defender);
  checkDauntlessShield(attacker);
  checkDauntlessShield(defender);

  computeFinalStats(gen, attacker, defender, field, 'atk', 'spa');

  checkInfiltrator(attacker, field.defenderSide);
  checkInfiltrator(defender, field.attackerSide);

  const desc: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
    isDefenderDynamaxed: defender.isDynamaxed,
  };

  const result = new Result(gen, attacker, defender, move, field, 0, desc);

  if (move.category === 'Status' && !move.named('Nature Power')) {
    return result;
  }

  const breaksProtect = move.breaksProtect || move.isZ || attacker.isDynamaxed ||
  (attacker.hasAbility('Unseen Fist') && move.flags.contact);

  if (field.defenderSide.isProtected && !breaksProtect) {
    desc.isProtected = true;
    return result;
  }

  const defenderIgnoresAbility = defender.hasAbility(
    'Full Metal Body',
    'Neutralizing Gas',
    'Prism Armor',
    'Shadow Shield'
  );

  const attackerIgnoresAbility = attacker.hasAbility('Mold Breaker', 'Teravolt', 'Turboblaze');
  const moveIgnoresAbility = move.named(
    'G-Max Drum Solo',
    'G-Max Fire Ball',
    'G-Max Hydrosnipe',
    'Light That Burns the Sky',
    'Menacing Moonraze Maelstrom',
    'Moongeist Beam',
    'Photon Geyser',
    'Searing Sunraze Smash',
    'Sunsteel Strike'
  );
  if (!defenderIgnoresAbility) {
    if (attackerIgnoresAbility) {
      defender.ability = '' as AbilityName;
      desc.attackerAbility = attacker.ability;
    }
    if (moveIgnoresAbility) {
      defender.ability = '' as AbilityName;
    }
  }

  // Merciless does not ignore Shell Armor, damage dealt to a poisoned Pokemon with Shell Armor
  // will not be a critical hit (UltiMario)
  const isCritical = !defender.hasAbility('Battle Armor', 'Shell Armor') &&
    (move.isCrit || (attacker.hasAbility('Merciless') && defender.hasStatus('psn', 'tox'))) &&
    move.timesUsed === 1;

  if (move.named('Weather Ball')) {
    const holdingUmbrella = attacker.hasItem('Utility Umbrella');
    move.type =
      field.hasWeather('Sun', 'Harsh Sunshine') && !holdingUmbrella ? 'Fire'
      : field.hasWeather('Rain', 'Heavy Rain') && !holdingUmbrella ? 'Water'
      : field.hasWeather('Sand') ? 'Rock'
      : field.hasWeather('Hail') ? 'Ice'
      : 'Normal';
    desc.weather = field.weather;
    desc.moveType = move.type;
  } else if (move.named('Judgment') && attacker.item && attacker.item.includes('Plate')) {
    move.type = getItemBoostType(attacker.item)!;
  } else if (move.named('Techno Blast') && attacker.item && attacker.item.includes('Drive')) {
    move.type = getTechnoBlast(attacker.item)!;
  } else if (move.named('Multi-Attack') && attacker.item && attacker.item.includes('Memory')) {
    move.type = getMultiAttack(attacker.item)!;
  } else if (move.named('Natural Gift') && attacker.item && attacker.item.includes('Berry')) {
    const gift = getNaturalGift(gen, attacker.item)!;
    move.type = gift.t;
    move.bp = gift.p;
    desc.attackerItem = attacker.item;
    desc.moveBP = move.bp;
    desc.moveType = move.type;
  } else if (move.named('Nature Power', 'Terrain Pulse')) {
    move.type =
      field.hasTerrain('Electric') ? 'Electric'
      : field.hasTerrain('Grassy') ? 'Grass'
      : field.hasTerrain('Misty') ? 'Fairy'
      : field.hasTerrain('Psychic') ? 'Psychic'
      : 'Normal';
  } else if (move.named('Revelation Dance')) {
    move.type = attacker.types[0];
  } else if (move.named('Aura Wheel')) {
    if (attacker.named('Morpeko')) {
      move.type = 'Electric';
    } else if (attacker.named('Morpeko-Hangry')) {
      move.type = 'Dark';
    }
  }

  let isAerilate = false;
  let isPixilate = false;
  let isRefrigerate = false;
  let isGalvanize = false;
  let isLiquidVoice = false;
  let isNormalize = false;
  const noTypeChange = move.named(
    'Revelation Dance',
    'Judgment',
    'Nature Power',
    'Techno Blast',
    'Multi Attack',
    'Natural Gift',
    'Weather Ball',
    'Terrain Pulse',
  );

  if (!move.isZ && !noTypeChange) {
    const normal = move.hasType('Normal');
    if ((isAerilate = attacker.hasAbility('Aerilate') && normal)) {
      move.type = 'Flying';
    } else if ((isGalvanize = attacker.hasAbility('Galvanize') && normal)) {
      move.type = 'Electric';
    } else if ((isLiquidVoice = attacker.hasAbility('Liquid Voice') && !!move.flags.sound)) {
      move.type = 'Water';
    } else if ((isPixilate = attacker.hasAbility('Pixilate') && normal)) {
      move.type = 'Fairy';
    } else if ((isRefrigerate = attacker.hasAbility('Refrigerate') && normal)) {
      move.type = 'Ice';
    } else if ((isNormalize = attacker.hasAbility('Normalize'))) { // Boosts any type
      move.type = 'Normal';
    }
    if (isGalvanize || isLiquidVoice || isPixilate || isRefrigerate || isAerilate || isNormalize) {
      desc.attackerAbility = attacker.ability;
    }
  }

  // FIXME: this is incorrect, should be move.flags.heal, not move.drain
  if ((attacker.hasAbility('Triage') && move.drain) ||
      (attacker.hasAbility('Gale Wings') &&
       move.hasType('Flying') &&
       attacker.curHP() === attacker.maxHP())) {
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
    (defender.named('Kyogre', 'Kyogre-Primal') && defender.hasItem('Blue Orb')) ||
    (defender.name.includes('Silvally') && defender.item.includes('Memory')) ||
    defender.item.includes(' Z') ||
    (defender.named('Zacian') && defender.hasItem('Rusted Sword'));

  // The last case only applies when the Pokemon is holding the Mega Stone that matches its species
  // (or when it's already a Mega-Evolution)
  if (!resistedKnockOffDamage && defender.item) {
    const item = gen.items.get(toID(defender.item))!;
    resistedKnockOffDamage = !!item.megaEvolves && defender.name.includes(item.megaEvolves);
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
      (move.named('Dream Eater') && !(defender.hasStatus('slp') || defender.hasAbility('Comatose')))
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
      (move.flags.sound && !move.named('Clangorous Soul') && defender.hasAbility('Soundproof')) ||
      (move.priority > 0 && defender.hasAbility('Queenly Majesty', 'Dazzling'))
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

  const weightBasedMove = move.named('Heat Crash', 'Heavy Slam', 'Low Kick', 'Grass Knot');
  if (defender.isDynamaxed && weightBasedMove) {
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

  if (move.named('Guardian of Alola')) {
    let zLostHP = Math.floor((defender.curHP() * 3) / 4);
    if (field.defenderSide.isProtected && attacker.item && attacker.item.includes(' Z')) {
      zLostHP = Math.ceil(zLostHP / 4 - 0.5);
    }
    result.damage = zLostHP;
    return result;
  }

  if (move.named('Nature\'s Madness')) {
    const lostHP = field.defenderSide.isProtected ? 0 : Math.floor(defender.curHP() / 2);
    result.damage = lostHP;
    return result;
  }

  if (move.named('Spectral Thief')) {
    let stat: StatName;
    for (stat in defender.boosts) {
      if (defender.boosts[stat]) {
        attacker.boosts[stat] +=
          attacker.hasAbility('Contrary') ? -defender.boosts[stat]! : defender.boosts[stat]!;
        attacker.stats[stat] = getModifiedStat(attacker.rawStats[stat]!, attacker.boosts[stat]!);
      }
    }
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
  case 'Bolt Beak':
  case 'Fishious Rend':
    basePower = move.bp * (turnOrder !== 'last' ? 2 : 1);
    desc.moveBP = basePower;
    break;
  case 'Electro Ball':
    const r = Math.floor(attacker.stats.spe / defender.stats.spe);
    basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : r >= 1 ? 60 : 40;
    desc.moveBP = basePower;
    break;
  case 'Expanding Force':
    const isTerrainBoosted =
      isGrounded(attacker, field) && field.hasTerrain('Psychic');
    basePower = move.bp * (isTerrainBoosted ? 1.5 : 1);
    move.target = isTerrainBoosted ? 'allAdjacentFoes' : 'normal';
    desc.moveBP = basePower;
    break;
  case 'Misty Explosion':
    basePower = move.bp * (field.hasTerrain('Misty') ? 1.5 : 1);
    desc.moveBP = basePower;
    break;
  case 'Rising Voltage':
    basePower = isGrounded(defender, field) && field.hasTerrain('Electric') ? move.bp * 2 : move.bp;
    desc.moveBP = basePower;
    break;
  case 'Gyro Ball':
    basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe));
    desc.moveBP = basePower;
    break;
  case 'Poltergeist':
    basePower = move.bp * (!defender.item ? 0 : 1);
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
    // Hex deals double damage to Pokemon with Comatose (ih8ih8sn0w)
    basePower = move.bp * (defender.status || defender.hasAbility('Comatose') ? 2 : 1);
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
  case 'Grav Apple':
    basePower = move.bp * (field.isGravity ? 1.5 : 1);
    desc.moveBP = basePower;
    break;
  case 'Steel Roller':
    basePower = move.bp * (field.terrain ? 1 : 0);
    desc.moveBP = basePower;
    break;
  case 'Assurance':
    basePower = move.bp * (defender.hasAbility('Parental Bond (Child)') ? 2 : 1);
    // NOTE: desc.attackerAbility = 'Parental Bond' will already reflect this boost
    break;
  case 'Wake-Up Slap':
    // Wake-Up Slap deals double damage to Pokemon with Comatose (ih8ih8sn0w)
    basePower = move.bp * (defender.hasStatus('slp') || defender.hasAbility('Comatose') ? 2 : 1);
    desc.moveBP = basePower;
    break;
  case 'Weather Ball':
    basePower = field.weather && !field.hasWeather('Strong Winds') ? 100 : 50;
    if (field.hasWeather('Sun', 'Harsh Sunshine', 'Rain', 'Heavy Rain') &&
      attacker.hasItem('Utility Umbrella')) basePower = 50;
    desc.moveBP = basePower;
    break;
  case 'Terrain Pulse':
    basePower = move.bp * (field.terrain ? 2 : 1);
    desc.moveBP = basePower;
    break;
  case 'Fling':
    basePower = getFlingPower(attacker.item);
    desc.moveBP = basePower;
    desc.attackerItem = attacker.item;
    break;
  case 'Dragon Energy':
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
  // Triple Axel's damage doubles after each consecutive hit (20, 40, 60), this is a hack
  case 'Triple Axel':
    basePower = move.hits === 2 ? 30 : move.hits === 3 ? 40 : 20;
    desc.moveBP = basePower;
    break;
  case 'Lash Out':
    basePower = move.bp * (countBoosts(gen, attacker.boosts) < 0 ? 2 : 1);
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

  // Research from DaWoblefet and Anubis show that the Technician modifier is calculated at the
  // very beginning in Gen 8 as opposed to later on after several mods have been applied like Gen 7
  // https://smogon.com/forums/threads/sword-shield-battle-mechanics-research.3655528/post-8433978
  if (gen.num === 8 && attacker.hasAbility('Technician') && basePower <= 60) {
    bpMods.push(0x1800);
    desc.attackerAbility = attacker.ability;
  }

  const aura = `${move.type} Aura`;
  const isAttackerAura = attacker.hasAbility(aura);
  const isDefenderAura = defender.hasAbility(aura);
  const auraActive = isAttackerAura || isDefenderAura;
  const auraBreak = attacker.hasAbility('Aura Break') || defender.hasAbility('Aura Break');
  if (auraActive && auraBreak) {
    bpMods.push(0x0c00);
    desc.attackerAbility = attacker.ability;
    desc.defenderAbility = defender.ability;
  }

  if (attacker.hasAbility('Rivalry') && ![attacker.gender, defender.gender].includes('N')) {
    if (attacker.gender === defender.gender) {
      bpMods.push(0xC00);
      desc.rivalry = 'buffed';
    } else {
      bpMods.push(0xCCD);
      desc.rivalry = 'nerfed';
    }
    desc.attackerAbility = attacker.ability;
  }

  if (!move.isZ && !move.isMax &&
      (isAerilate || isPixilate || isRefrigerate || isGalvanize || isNormalize)) {
    bpMods.push(0x1333);
    desc.attackerAbility = attacker.ability;
  } else if (
    (attacker.hasAbility('Reckless') && (move.recoil || move.hasCrashDamage)) ||
    (attacker.hasAbility('Iron Fist') && move.flags.punch)
  ) {
    bpMods.push(0x1333);
    desc.attackerAbility = attacker.ability;
  }

  if (field.attackerSide.isBattery && move.category === 'Special') {
    bpMods.push(0x14CD);
    desc.isBattery = true;
  }

  // Sheer Force does not power up max moves or remove the effects (SadisticMystic)
  const analyticBoost = attacker.hasAbility('Analytic') &&
        (turnOrder !== 'first' || field.defenderSide.isSwitching === 'out');
  if (attacker.hasAbility('Sheer Force') && move.secondaries && !move.isMax) {
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
  } else if (analyticBoost) {
    bpMods.push(0x14cd);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Tough Claws') && move.flags.contact) {
    bpMods.push(0x14cd);
    desc.attackerAbility = attacker.ability;
  }

  if (auraActive && !auraBreak) {
    bpMods.push(0x1548);
    if (isAttackerAura) {
      desc.attackerAbility = attacker.ability;
    }
    if (isDefenderAura) {
      desc.defenderAbility = defender.ability;
    }
  }

  if (attacker.hasAbility('Steely Spirit') && move.hasType('Steel')) {
    bpMods.push(0x1800);
    desc.attackerAbility = attacker.ability;
  }

  if (gen.num === 7) {
    // Apply bpMods to determine whether the base power at this point in time triggers Technician
    const bp = pokeRound((basePower * chainMods(bpMods)) / 0x1000);
    if (attacker.hasAbility('Technician') && bp <= 60) {
      bpMods.push(0x1800);
      desc.attackerAbility = attacker.ability;
    }
  }

  if ((attacker.hasAbility('Flare Boost') &&
       attacker.hasStatus('brn') && move.category === 'Special') ||
      (attacker.hasAbility('Toxic Boost') &&
       attacker.hasStatus('psn', 'tox') && move.category === 'Physical') ||
      (attacker.hasAbility('Mega Launcher') && move.flags.pulse) ||
      (attacker.hasAbility('Strong Jaw') && move.flags.bite)
  ) {
    bpMods.push(0x1800);
    desc.attackerAbility = attacker.ability;
  }

  if (defender.hasAbility('Heatproof') && move.hasType('Fire')) {
    bpMods.push(0x800);
    desc.defenderAbility = defender.ability;
  } else if (defender.hasAbility('Dry Skin') && move.hasType('Fire')) {
    bpMods.push(0x1400);
    desc.defenderAbility = defender.ability;
  }

  if (attacker.item && move.hasType(getItemBoostType(attacker.item))) {
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
     move.hasType('Ghost', 'Dragon')) ||
    (attacker.hasItem('Soul Dew') &&
     attacker.named('Latios', 'Latias', 'Latios-Mega', 'Latias-Mega') &&
     move.hasType('Psychic', 'Dragon'))
  ) {
    bpMods.push(0x1333);
    desc.attackerItem = attacker.item;
  } else if (attacker.hasItem(`${move.type} Gem`)) {
    bpMods.push(0x14cd);
    desc.attackerItem = attacker.item;
  }

  if (move.named('Solar Beam', 'Solar Blade') &&
      field.hasWeather('Rain', 'Heavy Rain', 'Sand', 'Hail')) {
    bpMods.push(0x800);
    desc.moveBP = basePower / 2;
    desc.weather = field.weather;
  } else if (move.named('Knock Off') && !resistedKnockOffDamage) {
    bpMods.push(0x1800);
    desc.moveBP = basePower * 1.5;
  }

  if (field.attackerSide.isHelpingHand) {
    bpMods.push(0x1800);
    desc.isHelpingHand = true;
  }

  if ((move.named('Facade') && attacker.hasStatus('brn', 'par', 'psn', 'tox')) ||
      (move.named('Brine') && defender.curHP() <= defender.maxHP() / 2) ||
      (move.named('Venoshock') && defender.hasStatus('psn', 'tox'))
  ) {
    bpMods.push(0x2000);
    desc.moveBP = basePower * 2;
  }

  const terrainMultiplier = gen.num > 7 ? 0x14cd : 0x1800;
  if (isGrounded(attacker, field)) {
    if (field.hasTerrain('Electric') && move.hasType('Electric')) {
      bpMods.push(terrainMultiplier);
      desc.terrain = field.terrain;
    } else if (field.hasTerrain('Grassy') && move.hasType('Grass')) {
      bpMods.push(terrainMultiplier);
      desc.terrain = field.terrain;
    } else if (field.hasTerrain('Psychic') && move.hasType('Psychic')) {
      bpMods.push(terrainMultiplier);
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

  if (move.named(
    'Breakneck Blitz', 'Bloom Doom', 'Inferno Overdrive', 'Hydro Vortex', 'Gigavolt Havoc',
    'Subzero Slammer', 'Supersonic Skystrike', 'Savage Spin-Out', 'Acid Downpour', 'Tectonic Rage',
    'Continental Crush', 'All-Out Pummeling', 'Shattered Psyche', 'Never-Ending Nightmare',
    'Devastating Drake', 'Black Hole Eclipse', 'Corkscrew Crash', 'Twinkle Tackle'
  )) {
    // show z-move power in description
    desc.moveBP = move.bp;
  }

  basePower = OF16(Math.max(1, pokeRound((basePower * chainMods(bpMods)) / 0x1000)));

  // #endregion
  // #region (Special) Attack

  let attack: number;
  const attackSource = move.named('Foul Play') ? defender : attacker;
  if (move.named('Photon Geyser', 'Light That Burns The Sky')) {
    move.category = attackSource.stats.atk > attackSource.stats.spa ? 'Physical' : 'Special';
  }
  const attackStat =
    move.named('Shell Side Arm') &&
    getShellSideArmCategory(attacker, defender) === 'Physical'
      ? 'atk'
      : move.named('Body Press')
        ? 'def'
        : move.category === 'Special'
          ? 'spa'
          : 'atk';
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

  // Slow Start also halves damage with special Z-moves
  if ((attacker.hasAbility('Slow Start') && attacker.abilityOn &&
       (move.category === 'Physical' || (move.category === 'Special' && move.isZ))) ||
      (attacker.hasAbility('Defeatist') && attacker.curHP() <= attacker.maxHP() / 2)
  ) {
    atMods.push(0x800);
    desc.attackerAbility = attacker.ability;
  } else if (
    (attacker.hasAbility('Solar Power') &&
     field.hasWeather('Sun', 'Harsh Sunshine') &&
     move.category === 'Special') ||
    (attacker.named('Cherrim') &&
     attacker.hasAbility('Flower Gift') &&
     field.hasWeather('Sun', 'Harsh Sunshine') &&
     move.category === 'Physical') ||
    // Gorilla Tactics has no effect during Dynamax (Anubis)
    (attacker.hasAbility('Gorilla Tactics') && move.category === 'Physical' &&
     !attacker.isDynamaxed)) {
    atMods.push(0x1800);
    desc.attackerAbility = attacker.ability;
    desc.weather = field.weather;
  } else if (
    (attacker.hasAbility('Guts') && attacker.status && move.category === 'Physical') ||
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
    (attacker.hasAbility('Steelworker') && move.hasType('Steel')) ||
    (attacker.hasAbility('Dragon\'s Maw') && move.hasType('Dragon')) ||
    (attacker.hasAbility('Transistor') && move.hasType('Electric'))
  ) {
    atMods.push(0x1800);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Stakeout') && attacker.abilityOn) {
    atMods.push(0x2000);
    desc.attackerAbility = attacker.ability;
  } else if (
    (attacker.hasAbility('Water Bubble') && move.hasType('Water')) ||
    (attacker.hasAbility('Huge Power', 'Pure Power') && move.category === 'Physical')
  ) {
    atMods.push(0x2000);
    desc.attackerAbility = attacker.ability;
  }

  if ((defender.hasAbility('Thick Fat') && move.hasType('Fire', 'Ice')) ||
      (defender.hasAbility('Water Bubble') && move.hasType('Fire'))) {
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

  if ((attacker.hasItem('Thick Club') &&
       attacker.named('Cubone', 'Marowak', 'Marowak-Alola', 'Marowak-Alola-Totem') &&
       move.category === 'Physical') ||
      (attacker.hasItem('Deep Sea Tooth') &&
       attacker.named('Clamperl') &&
       move.category === 'Special') ||
      (attacker.hasItem('Light Ball') && attacker.named('Pikachu') && !move.isZ)
  ) {
    atMods.push(0x2000);
    desc.attackerItem = attacker.item;
    // Choice Band/Scarf/Specs move lock and stat boosts are ignored during Dynamax (Anubis)
  } else if (!move.isZ && !move.isMax &&
    ((attacker.hasItem('Choice Band') && move.category === 'Physical') ||
      (attacker.hasItem('Choice Specs') && move.category === 'Special'))
  ) {
    atMods.push(0x1800);
    desc.attackerItem = attacker.item;
  }

  attack = OF16(Math.max(1, pokeRound((attack * chainMods(atMods)) / 0x1000)));

  // #endregion
  // #region (Special) Defense

  let defense: number;
  const hitsPhysical = move.defensiveCategory === 'Physical' ||
    (move.named('Shell Side Arm') && getShellSideArmCategory(attacker, defender) === 'Physical');
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
  } else if (
    defender.hasAbility('Grass Pelt') &&
    field.hasTerrain('Grassy') &&
    hitsPhysical
  ) {
    dfMods.push(0x1800);
    desc.defenderAbility = defender.ability;
  } else if (defender.hasAbility('Fur Coat') && hitsPhysical) {
    dfMods.push(0x2000);
    desc.defenderAbility = defender.ability;
  }

  if ((defender.hasItem('Eviolite') && gen.species.get(toID(defender.name))?.nfe) ||
      (!hitsPhysical && defender.hasItem('Assault Vest'))) {
    dfMods.push(0x1800);
    desc.defenderItem = defender.item;
  } else if (
    (defender.hasItem('Metal Powder') && defender.named('Ditto') && hitsPhysical) ||
    (defender.hasItem('Deep Sea Scale') && defender.named('Clamperl') && !hitsPhysical)
  ) {
    dfMods.push(0x2000);
    desc.defenderItem = defender.item;
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
    baseDamage = pokeRound(OF32(baseDamage * 0x400) / 0x1000);
  }

  const noWeatherBoost = defender.hasItem('Utility Umbrella');
  if (!noWeatherBoost && (field.hasWeather('Sun', 'Harsh Sunshine') &&
       move.hasType('Fire')) ||
      (field.hasWeather('Rain', 'Heavy Rain') && move.hasType('Water'))) {
    baseDamage = pokeRound(OF32(baseDamage * 0x1800) / 0x1000);
    desc.weather = field.weather;
  } else if (!noWeatherBoost &&
    (field.hasWeather('Sun') && move.hasType('Water')) ||
    (field.hasWeather('Rain') && move.hasType('Fire'))
  ) {
    baseDamage = pokeRound(OF32(baseDamage * 0x800) / 0x1000);
    desc.weather = field.weather;
  } else if (!noWeatherBoost &&
    (field.hasWeather('Harsh Sunshine') && move.hasType('Water')) ||
    (field.hasWeather('Heavy Rain') && move.hasType('Fire'))
  ) {
    return result;
  }

  if (hasTerrainSeed(defender) &&
      field.hasTerrain(defender.item!.substring(0, defender.item!.indexOf(' ')) as Terrain) &&
      SEED_BOOSTED_STAT[defender.item!] === defenseStat) {
    // Last condition applies so the calc doesn't show a seed where it wouldn't affect the outcome
    // (like Grassy Seed when being hit by a special move)
    desc.defenderItem = defender.item;
  }

  if (isCritical) {
    baseDamage = Math.floor(OF32(baseDamage * 1.5));
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
  } else if (attacker.hasAbility('Protean', 'Libero')) {
    stabMod = 0x1800;
    desc.attackerAbility = attacker.ability;
  }

  const applyBurn =
    attacker.hasStatus('brn') &&
    move.category === 'Physical' &&
    !attacker.hasAbility('Guts') &&
    !move.named('Facade');
  desc.isBurned = applyBurn;
  const finalMods = [];

  if (field.defenderSide.isReflect && move.category === 'Physical' &&
      !isCritical && !field.defenderSide.isAuroraVeil) {
    // doesn't stack with Aurora Veil
    finalMods.push(field.gameType !== 'Singles' ? 0xaac : 0x800);
    desc.isReflect = true;
  } else if (
    field.defenderSide.isLightScreen && move.category === 'Special' &&
    !isCritical && !field.defenderSide.isAuroraVeil
  ) {
    // doesn't stack with Aurora Veil
    finalMods.push(field.gameType !== 'Singles' ? 0xaac : 0x800);
    desc.isLightScreen = true;
  }
  if (field.defenderSide.isAuroraVeil && !isCritical) {
    finalMods.push(field.gameType !== 'Singles' ? 0xaac : 0x800);
    desc.isAuroraVeil = true;
  }

  if (attacker.hasAbility('Neuroforce') && typeEffectiveness > 1) {
    bpMods.push(0x1400);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Sniper') && isCritical) {
    finalMods.push(0x1800);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Tinted Lens') && typeEffectiveness < 1) {
    finalMods.push(0x2000);
    desc.attackerAbility = attacker.ability;
  }

  if (defender.isDynamaxed && move.named('Dynamax Cannon', 'Behemoth Blade', 'Behemoth Bash')) {
    finalMods.push(0x2000);
  }

  if (defender.hasAbility('Multiscale', 'Shadow Shield') &&
      defender.curHP() === defender.maxHP() &&
      !field.defenderSide.isSR && (!field.defenderSide.spikes || defender.hasType('Flying')) &&
      !attacker.hasAbility('Parental Bond (Child)')
  ) {
    finalMods.push(0x800);
    desc.defenderAbility = defender.ability;
  }

  if (defender.hasAbility('Fluffy') && move.flags.contact && !attacker.hasAbility('Long Reach')) {
    finalMods.push(0x800);
    desc.defenderAbility = defender.ability;
  } else if (
    (defender.hasAbility('Punk Rock') && move.flags.sound) ||
    (defender.hasAbility('Ice Scales') && move.category === 'Special')
  ) {
    finalMods.push(0x800);
    desc.defenderAbility = defender.ability;
  }

  if (move.flags.sound && attacker.hasAbility('Punk Rock')) {
    finalMods.push(0x14cd);
    desc.attackerAbility = attacker.ability;
  }

  if (defender.hasAbility('Solid Rock', 'Filter', 'Prism Armor') && typeEffectiveness > 1) {
    finalMods.push(0xc00);
    desc.defenderAbility = defender.ability;
  }

  if (field.defenderSide.isFriendGuard) {
    finalMods.push(0xc00);
    desc.isFriendGuard = true;
  }

  if (defender.hasAbility('Fluffy') && move.hasType('Fire')) {
    finalMods.push(0x2000);
    desc.defenderAbility = defender.ability;
  }

  if (attacker.hasItem('Expert Belt') && typeEffectiveness > 1 && !move.isZ) {
    finalMods.push(0x1333);
    desc.attackerItem = attacker.item;
  } else if (attacker.hasItem('Life Orb')) {
    finalMods.push(0x14cc);
    desc.attackerItem = attacker.item;
  } else if (attacker.hasItem('Metronome') && move.timesUsedWithMetronome! >= 1) {
    const timesUsedWithMetronome = Math.floor(move.timesUsedWithMetronome!);
    if (timesUsedWithMetronome <= 4) {
      finalMods.push(0x1000 + timesUsedWithMetronome * 0x333);
    } else {
      finalMods.push(0x2000);
    }
    desc.attackerItem = attacker.item;
  }

  if (move.hasType(getBerryResistType(defender.item)) &&
      (typeEffectiveness > 1 || move.hasType('Normal')) &&
      !attacker.hasAbility('Unnerve', 'As One (Glastrier)', 'As One (Spectrier)')) {
    finalMods.push(0x800);
    desc.defenderItem = defender.item;
  }

  let protect = false;
  if (field.defenderSide.isProtected &&
    (attacker.isDynamaxed || (move.isZ && attacker.item && attacker.item.includes(' Z')))) {
    protect = true;
    desc.isProtected = true;
  }

  const finalMod = chainMods(finalMods);

  let childDamage: number[] | undefined;
  if (attacker.hasAbility('Parental Bond') && move.hits === 1 && !isSpread) {
    const child = attacker.clone();
    child.ability = 'Parental Bond (Child)' as AbilityName;
    checkMultihitBoost(gen, child, defender, move, field, desc);
    childDamage = calculateSMSS(gen, child, defender, move, field).damage as number[];
    desc.attackerAbility = attacker.ability;
  }

  let damage = [];
  for (let i = 0; i < 16; i++) {
    damage[i] =
      getFinalDamage(baseDamage, i, typeEffectiveness, applyBurn, stabMod, finalMod, protect);
  }

  if (move.dropsStats && move.timesUsed! > 1) {
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
            finalMod,
            protect
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

function hasTerrainSeed(pokemon: Pokemon) {
  return pokemon.hasItem('Electric Seed', 'Misty Seed', 'Grassy Seed', 'Psychic Seed');
}
