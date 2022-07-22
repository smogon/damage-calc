import {Generation, AbilityName, StatID, Terrain} from '../data/interface';
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
  checkItem,
  checkMultihitBoost,
  checkSeedBoost,
  checkWonderRoom,
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
  checkItem(attacker, field.isMagicRoom);
  checkItem(defender, field.isMagicRoom);
  checkWonderRoom(attacker, field.isWonderRoom);
  checkWonderRoom(defender, field.isWonderRoom);
  checkSeedBoost(attacker, field);
  checkSeedBoost(defender, field);
  checkDauntlessShield(attacker);
  checkDauntlessShield(defender);

  computeFinalStats(gen, attacker, defender, field, 'def', 'spd', 'spe');

  checkIntimidate(gen, attacker, defender);
  checkIntimidate(gen, defender, attacker);
  checkDownload(attacker, defender, field.isWonderRoom);
  checkDownload(defender, attacker, field.isWonderRoom);
  checkIntrepidSword(attacker);
  checkIntrepidSword(defender);

  computeFinalStats(gen, attacker, defender, field, 'atk', 'spa');

  checkInfiltrator(attacker, field.defenderSide);
  checkInfiltrator(defender, field.attackerSide);

  const desc: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
    isDefenderDynamaxed: defender.isDynamaxed,
    isWonderRoom: field.isWonderRoom,
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
  if (!defenderIgnoresAbility && !defender.hasAbility('Poison Heal')) {
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

  let type = move.type;
  if (move.named('Weather Ball')) {
    const holdingUmbrella = attacker.hasItem('Utility Umbrella');
    type =
      field.hasWeather('Sun', 'Harsh Sunshine') && !holdingUmbrella ? 'Fire'
      : field.hasWeather('Rain', 'Heavy Rain') && !holdingUmbrella ? 'Water'
      : field.hasWeather('Sand') ? 'Rock'
      : field.hasWeather('Hail') ? 'Ice'
      : 'Normal';
    desc.weather = field.weather;
    desc.moveType = type;
  } else if (move.named('Judgment') && attacker.item && attacker.item.includes('Plate')) {
    type = getItemBoostType(attacker.item)!;
  } else if (move.named('Techno Blast') && attacker.item && attacker.item.includes('Drive')) {
    type = getTechnoBlast(attacker.item)!;
  } else if (move.named('Multi-Attack') && attacker.item && attacker.item.includes('Memory')) {
    type = getMultiAttack(attacker.item)!;
  } else if (move.named('Natural Gift') && attacker.item && attacker.item.includes('Berry')) {
    const gift = getNaturalGift(gen, attacker.item)!;
    type = gift.t;
    desc.moveType = type;
    desc.attackerItem = attacker.item;
  } else if (
    move.named('Nature Power') ||
    (move.named('Terrain Pulse') && isGrounded(attacker, field))
  ) {
    type =
      field.hasTerrain('Electric') ? 'Electric'
      : field.hasTerrain('Grassy') ? 'Grass'
      : field.hasTerrain('Misty') ? 'Fairy'
      : field.hasTerrain('Psychic') ? 'Psychic'
      : 'Normal';
    desc.terrain = field.terrain;
    desc.moveType = type;
  } else if (move.named('Revelation Dance')) {
    type = attacker.types[0];
  } else if (move.named('Aura Wheel')) {
    if (attacker.named('Morpeko')) {
      type = 'Electric';
    } else if (attacker.named('Morpeko-Hangry')) {
      type = 'Dark';
    }
  }

  let hasAteAbilityTypeChange = false;
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
      type = 'Flying';
    } else if ((isGalvanize = attacker.hasAbility('Galvanize') && normal)) {
      type = 'Electric';
    } else if ((isLiquidVoice = attacker.hasAbility('Liquid Voice') && !!move.flags.sound)) {
      type = 'Water';
    } else if ((isPixilate = attacker.hasAbility('Pixilate') && normal)) {
      type = 'Fairy';
    } else if ((isRefrigerate = attacker.hasAbility('Refrigerate') && normal)) {
      type = 'Ice';
    } else if ((isNormalize = attacker.hasAbility('Normalize'))) { // Boosts any type
      type = 'Normal';
    }
    if (isGalvanize || isPixilate || isRefrigerate || isAerilate || isNormalize) {
      desc.attackerAbility = attacker.ability;
      hasAteAbilityTypeChange = true;
    } else if (isLiquidVoice) {
      desc.attackerAbility = attacker.ability;
    }
  }
  move.type = type;

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

  if (typeEffectiveness === 0 && move.named('Thousand Arrows')) {
    typeEffectiveness = 1;
  } else if (typeEffectiveness === 0 && move.hasType('Ground') &&
    defender.hasItem('Iron Ball') && !defender.hasAbility('Klutz')) {
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
      (move.named('Dream Eater') &&
        (!(defender.hasStatus('slp') || defender.hasAbility('Comatose')))) ||
      (move.named('Steel Roller') && !field.terrain) ||
      (move.named('Poltergeist') && !defender.item)
  ) {
    return result;
  }

  if (field.hasWeather('Strong Winds') && defender.hasType('Flying') &&
      gen.types.get(toID(move.type))!.effectiveness['Flying']! > 1) {
    typeEffectiveness /= 2;
    desc.weather = field.weather;
  }

  if ((defender.hasAbility('Wonder Guard') && typeEffectiveness <= 1) ||
      (move.hasType('Grass') && defender.hasAbility('Sap Sipper')) ||
      (move.hasType('Fire') && defender.hasAbility('Flash Fire')) ||
      (move.hasType('Water') && defender.hasAbility('Dry Skin', 'Storm Drain', 'Water Absorb')) ||
      (move.hasType('Electric') &&
        defender.hasAbility('Lightning Rod', 'Motor Drive', 'Volt Absorb')) ||
      (move.hasType('Ground') &&
        !field.isGravity && !move.named('Thousand Arrows') &&
        !defender.hasItem('Iron Ball') && defender.hasAbility('Levitate')) ||
      (move.flags.bullet && defender.hasAbility('Bulletproof')) ||
      (move.flags.sound && !move.named('Clangorous Soul') && defender.hasAbility('Soundproof')) ||
      (move.priority > 0 && defender.hasAbility('Queenly Majesty', 'Dazzling'))
  ) {
    desc.defenderAbility = defender.ability;
    return result;
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
    let stat: StatID;
    for (stat in defender.boosts) {
      if (defender.boosts[stat]) {
        attacker.boosts[stat] +=
          attacker.hasAbility('Contrary') ? -defender.boosts[stat]! : defender.boosts[stat]!;
        if (attacker.boosts[stat] > 6) attacker.boosts[stat] = 6;
        if (attacker.boosts[stat] < -6) attacker.boosts[stat] = -6;
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

  const basePower = calculateBasePowerSMSS(
    gen,
    attacker,
    defender,
    move,
    field,
    hasAteAbilityTypeChange,
    desc
  );
  if (basePower === 0) {
    return result;
  }

  // #endregion
  // #region (Special) Attack
  const attack = calculateAttackSMSS(gen, attacker, defender, move, field, desc, isCritical);
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
  // #endregion
  // #region (Special) Defense

  const defense = calculateDefenseSMSS(gen, attacker, defender, move, field, desc, isCritical);
  const hitsPhysical = move.overrideDefensiveStat === 'def' || move.category === 'Physical' ||
    (move.named('Shell Side Arm') && getShellSideArmCategory(attacker, defender) === 'Physical');
  const defenseStat = hitsPhysical ? 'def' : 'spd';

  // #endregion
  // #region Damage

  let baseDamage = getBaseDamage(attacker.level, basePower, attack, defense);

  const isSpread = field.gameType !== 'Singles' &&
     ['allAdjacent', 'allAdjacentFoes'].includes(move.target);
  if (isSpread) {
    baseDamage = pokeRound(OF32(baseDamage * 3072) / 4096);
  }

  if (attacker.hasAbility('Parental Bond (Child)')) {
    baseDamage = pokeRound(OF32(baseDamage * 1024) / 4096);
  }

  const noWeatherBoost = defender.hasItem('Utility Umbrella');
  if (!noWeatherBoost && (field.hasWeather('Sun', 'Harsh Sunshine') &&
        move.hasType('Fire')) ||
       (field.hasWeather('Rain', 'Heavy Rain') && move.hasType('Water'))) {
    baseDamage = pokeRound(OF32(baseDamage * 6144) / 4096);
    desc.weather = field.weather;
  } else if (!noWeatherBoost &&
    (field.hasWeather('Sun') && move.hasType('Water')) ||
    (field.hasWeather('Rain') && move.hasType('Fire'))
  ) {
    baseDamage = pokeRound(OF32(baseDamage * 2048) / 4096);
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
  let stabMod = 4096;
  if (attacker.hasType(move.type)) {
    if (attacker.hasAbility('Adaptability')) {
      stabMod = 8192;
      desc.attackerAbility = attacker.ability;
    } else {
      stabMod = 6144;
    }
  } else if (attacker.hasAbility('Protean', 'Libero')) {
    stabMod = 6144;
    desc.attackerAbility = attacker.ability;
  }

  const applyBurn =
    attacker.hasStatus('brn') &&
    move.category === 'Physical' &&
    !attacker.hasAbility('Guts') &&
    !move.named('Facade');
  desc.isBurned = applyBurn;
  const finalMods = calculateFinalModsSMSS(
    gen,
    attacker,
    defender,
    move,
    field,
    desc,
    isCritical,
    typeEffectiveness
  );

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

export function calculateBasePowerSMSS(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  hasAteAbilityTypeChange: boolean,
  desc: RawDesc
) {
  const turnOrder = attacker.stats.spe > defender.stats.spe ? 'first' : 'last';

  let basePower: number;

  switch (move.name) {
  case 'Payback':
    basePower = move.bp * (turnOrder === 'last' ? 2 : 1);
    desc.moveBP = basePower;
    break;
  case 'Bolt Beak':
  case 'Fishious Rend':
    basePower = move.bp * (turnOrder !== 'last' ? 2 : 1);
    desc.moveBP = basePower;
    break;
  case 'Pursuit':
    const switching = field.defenderSide.isSwitching === 'out';
    basePower = move.bp * (switching ? 2 : 1);
    if (switching) desc.isSwitching = 'out';
    desc.moveBP = basePower;
    break;
  case 'Electro Ball':
    const r = Math.floor(attacker.stats.spe / defender.stats.spe);
    basePower = r >= 4 ? 150 : r >= 3 ? 120 : r >= 2 ? 80 : r >= 1 ? 60 : 40;
    desc.moveBP = basePower;
    break;
  case 'Gyro Ball':
    basePower = Math.min(150, Math.floor((25 * defender.stats.spe) / attacker.stats.spe) + 1);
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
    basePower = move.bp * (attacker.hasItem('Flying Gem') || !attacker.item ? 2 : 1);
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
  case 'Smelling Salts':
    basePower = move.bp * (defender.hasStatus('par') ? 2 : 1);
    desc.moveBP = basePower;
    break;
  case 'Weather Ball':
    basePower = move.bp * (field.weather && !field.hasWeather('Strong Winds') ? 2 : 1);
    if (field.hasWeather('Sun', 'Harsh Sunshine', 'Rain', 'Heavy Rain') &&
      attacker.hasItem('Utility Umbrella')) basePower = move.bp;
    desc.moveBP = basePower;
    break;
  case 'Terrain Pulse':
    basePower = move.bp * (isGrounded(attacker, field) && field.terrain ? 2 : 1);
    desc.moveBP = basePower;
    break;
  case 'Rising Voltage':
    basePower = move.bp * ((isGrounded(defender, field) && field.hasTerrain('Electric')) ? 2 : 1);
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
  case 'Natural Gift':
    if (attacker.item?.includes('Berry')) {
      const gift = getNaturalGift(gen, attacker.item)!;
      basePower = gift.p;
      desc.attackerItem = attacker.item;
      desc.moveBP = move.bp;
    } else {
      basePower = move.bp;
    }
    break;
  case 'Nature Power':
    basePower =
        field.terrain && field.hasTerrain('Electric', 'Grassy', 'Psychic') ? 90
        : field.hasTerrain('Misty') ? 95
        : 80; // Tri Attack
    desc.moveBP = basePower;
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
  // Triple Kick's damage doubles after each consecutive hit (10, 20, 30), this is a hack
  case 'Triple Kick':
    basePower = move.hits === 2 ? 15 : move.hits === 3 ? 30 : 10;
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
    return 0;
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
  const bpMods = calculateBPModsSMSS(
    gen,
    attacker,
    defender,
    move,
    field,
    desc,
    basePower,
    hasAteAbilityTypeChange,
    turnOrder
  );
  basePower = OF16(Math.max(1, pokeRound((basePower * chainMods(bpMods)) / 4096)));
  return basePower;
}

export function calculateBPModsSMSS(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  basePower: number,
  hasAteAbilityTypeChange: boolean,
  turnOrder: string
) {
  const bpMods = [];

  // Move effects

  let resistedKnockOffDamage =
    !defender.item ||
    (defender.named('Giratina-Origin') && defender.hasItem('Griseous Orb')) ||
    (defender.name.includes('Arceus') && defender.item.includes('Plate')) ||
    (defender.name.includes('Genesect') && defender.item.includes('Drive')) ||
    (defender.named('Groudon', 'Groudon-Primal') && defender.hasItem('Red Orb')) ||
    (defender.named('Kyogre', 'Kyogre-Primal') && defender.hasItem('Blue Orb')) ||
    (defender.name.includes('Silvally') && defender.item.includes('Memory')) ||
    defender.item.includes(' Z') ||
    (defender.named('Zacian') && defender.hasItem('Rusted Sword')) ||
    (defender.named('Zamazenta') && defender.hasItem('Rusted Shield') ||
    (defender.named('Venomicon-Epilogue') && defender.hasItem('Vile Vial')));

  // The last case only applies when the Pokemon has the Mega Stone that matches its species
  // (or when it's already a Mega-Evolution)
  if (!resistedKnockOffDamage && defender.item) {
    const item = gen.items.get(toID(defender.item))!;
    resistedKnockOffDamage = !!item.megaEvolves && defender.name.includes(item.megaEvolves);
  }

  if ((move.named('Facade') && attacker.hasStatus('brn', 'par', 'psn', 'tox')) ||
    (move.named('Brine') && defender.curHP() <= defender.maxHP() / 2) ||
    (move.named('Venoshock') && defender.hasStatus('psn', 'tox')) ||
    (move.named('Lash Out') && (countBoosts(gen, attacker.boosts) < 0))
  ) {
    bpMods.push(8192);
    desc.moveBP = basePower * 2;
  } else if (
    move.named('Expanding Force') && isGrounded(attacker, field) && field.hasTerrain('Psychic')
  ) {
    move.target = 'allAdjacentFoes';
    bpMods.push(6144);
    desc.moveBP = basePower * 1.5;
  } else if ((move.named('Knock Off') && !resistedKnockOffDamage) ||
    (move.named('Misty Explosion') && isGrounded(attacker, field) && field.hasTerrain('Misty')) ||
    (move.named('Grav Apple') && field.isGravity)
  ) {
    bpMods.push(6144);
    desc.moveBP = basePower * 1.5;
  } else if (move.named('Solar Beam', 'Solar Blade') &&
      field.hasWeather('Rain', 'Heavy Rain', 'Sand', 'Hail')) {
    bpMods.push(2048);
    desc.moveBP = basePower / 2;
    desc.weather = field.weather;
  }

  if (field.attackerSide.isHelpingHand) {
    bpMods.push(6144);
    desc.isHelpingHand = true;
  }

  // Field effects

  const terrainMultiplier = gen.num > 7 ? 5325 : 6144;
  if (isGrounded(attacker, field)) {
    if ((field.hasTerrain('Electric') && move.hasType('Electric')) ||
        (field.hasTerrain('Grassy') && move.hasType('Grass')) ||
        (field.hasTerrain('Psychic') && move.hasType('Psychic'))
    ) {
      bpMods.push(terrainMultiplier);
      desc.terrain = field.terrain;
    }
  }
  if (isGrounded(defender, field)) {
    if ((field.hasTerrain('Misty') && move.hasType('Dragon')) ||
        (field.hasTerrain('Grassy') && move.named('Bulldoze', 'Earthquake'))
    ) {
      bpMods.push(2048);
      desc.terrain = field.terrain;
    }
  }

  // Abilities

  // Use BasePower after moves with custom BP to determine if Technician should boost
  if ((attacker.hasAbility('Technician') && basePower <= 60) ||
    (attacker.hasAbility('Flare Boost') &&
      attacker.hasStatus('brn') && move.category === 'Special') ||
    (attacker.hasAbility('Toxic Boost') &&
      attacker.hasStatus('psn', 'tox') && move.category === 'Physical') ||
    (attacker.hasAbility('Mega Launcher') && move.flags.pulse) ||
    (attacker.hasAbility('Strong Jaw') && move.flags.bite) ||
    (attacker.hasAbility('Steely Spirit') && move.hasType('Steel'))
  ) {
    bpMods.push(6144);
    desc.attackerAbility = attacker.ability;
  }

  const aura = `${move.type} Aura`;
  const isAttackerAura = attacker.hasAbility(aura);
  const isDefenderAura = defender.hasAbility(aura);
  const isUserAuraBreak = attacker.hasAbility('Aura Break') || defender.hasAbility('Aura Break');
  const isFieldAuraBreak = field.isAuraBreak;
  const isFieldFairyAura = field.isFairyAura && move.type === 'Fairy';
  const isFieldDarkAura = field.isDarkAura && move.type === 'Dark';
  const auraActive = isAttackerAura || isDefenderAura || isFieldFairyAura || isFieldDarkAura;
  const auraBreak = isFieldAuraBreak || isUserAuraBreak;
  if (auraActive) {
    if (auraBreak) {
      bpMods.push(3072);
      desc.attackerAbility = attacker.ability;
      desc.defenderAbility = defender.ability;
    } else {
      bpMods.push(5448);
      if (isAttackerAura) desc.attackerAbility = attacker.ability;
      if (isDefenderAura) desc.defenderAbility = defender.ability;
    }
  }

  // Sheer Force does not power up max moves or remove the effects (SadisticMystic)
  if ((attacker.hasAbility('Sheer Force') && move.secondaries && !move.isMax) ||
      (attacker.hasAbility('Sand Force') &&
        field.hasWeather('Sand') && move.hasType('Rock', 'Ground', 'Steel')) ||
      (attacker.hasAbility('Analytic') &&
        (turnOrder !== 'first' || field.defenderSide.isSwitching === 'out')) ||
      (attacker.hasAbility('Tough Claws') && move.flags.contact) ||
      (attacker.hasAbility('Punk Rock') && move.flags.sound)
  ) {
    bpMods.push(5325);
    desc.attackerAbility = attacker.ability;
  }

  if (field.attackerSide.isBattery && move.category === 'Special') {
    bpMods.push(5325);
    desc.isBattery = true;
  }

  if (field.attackerSide.isPowerSpot) {
    bpMods.push(5325);
    desc.isPowerSpot = true;
  }

  if (attacker.hasAbility('Rivalry') && ![attacker.gender, defender.gender].includes('N')) {
    if (attacker.gender === defender.gender) {
      bpMods.push(5120);
      desc.rivalry = 'buffed';
    } else {
      bpMods.push(3072);
      desc.rivalry = 'nerfed';
    }
    desc.attackerAbility = attacker.ability;
  }

  // The -ate abilities already changed move typing earlier, so most checks are done and desc is set
  // However, Max Moves also don't boost -ate Abilities
  if (!move.isMax && hasAteAbilityTypeChange) {
    bpMods.push(4915);
  }

  if ((attacker.hasAbility('Reckless') && (move.recoil || move.hasCrashDamage)) ||
      (attacker.hasAbility('Iron Fist') && move.flags.punch)
  ) {
    bpMods.push(4915);
    desc.attackerAbility = attacker.ability;
  }

  if (defender.hasAbility('Heatproof') && move.hasType('Fire')) {
    bpMods.push(2048);
    desc.defenderAbility = defender.ability;
  } else if (defender.hasAbility('Dry Skin') && move.hasType('Fire')) {
    bpMods.push(5120);
    desc.defenderAbility = defender.ability;
  }

  // Items

  if (attacker.hasItem(`${move.type} Gem`)) {
    bpMods.push(5325);
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
    (attacker.hasItem('Vile Vial') &&
     attacker.named('Venomicon-Epilogue') &&
     move.hasType('Poison', 'Flying')) ||
    (attacker.hasItem('Soul Dew') &&
     attacker.named('Latios', 'Latias', 'Latios-Mega', 'Latias-Mega') &&
     move.hasType('Psychic', 'Dragon')) ||
     attacker.item && move.hasType(getItemBoostType(attacker.item))
  ) {
    bpMods.push(4915);
    desc.attackerItem = attacker.item;
  } else if (
    (attacker.hasItem('Muscle Band') && move.category === 'Physical') ||
    (attacker.hasItem('Wise Glasses') && move.category === 'Special')
  ) {
    bpMods.push(4505);
    desc.attackerItem = attacker.item;
  }
  return bpMods;
}

export function calculateAttackSMSS(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  isCritical = false
) {
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
  const atMods = calculateAtModsSMSS(gen, attacker, defender, move, field, desc);
  attack = OF16(Math.max(1, pokeRound((attack * chainMods(atMods)) / 4096)));
  return attack;
}

export function calculateAtModsSMSS(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc
) {
  const atMods = [];

  // Slow Start also halves damage with special Z-moves
  if ((attacker.hasAbility('Slow Start') && attacker.abilityOn &&
       (move.category === 'Physical' || (move.category === 'Special' && move.isZ))) ||
      (attacker.hasAbility('Defeatist') && attacker.curHP() <= attacker.maxHP() / 2)
  ) {
    atMods.push(2048);
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
    atMods.push(6144);
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
    atMods.push(6144);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Flash Fire') && attacker.abilityOn && move.hasType('Fire')) {
    atMods.push(6144);
    desc.attackerAbility = 'Flash Fire';
  } else if (
    (attacker.hasAbility('Steelworker') && move.hasType('Steel')) ||
    (attacker.hasAbility('Dragon\'s Maw') && move.hasType('Dragon')) ||
    (attacker.hasAbility('Transistor') && move.hasType('Electric'))
  ) {
    atMods.push(6144);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Stakeout') && attacker.abilityOn) {
    atMods.push(8192);
    desc.attackerAbility = attacker.ability;
  } else if (
    (attacker.hasAbility('Water Bubble') && move.hasType('Water')) ||
    (attacker.hasAbility('Huge Power', 'Pure Power') && move.category === 'Physical')
  ) {
    atMods.push(8192);
    desc.attackerAbility = attacker.ability;
  }

  if ((defender.hasAbility('Thick Fat') && move.hasType('Fire', 'Ice')) ||
      (defender.hasAbility('Water Bubble') && move.hasType('Fire'))) {
    atMods.push(2048);
    desc.defenderAbility = defender.ability;
  }

  if ((attacker.hasItem('Thick Club') &&
       attacker.named('Cubone', 'Marowak', 'Marowak-Alola', 'Marowak-Alola-Totem') &&
       move.category === 'Physical') ||
      (attacker.hasItem('Deep Sea Tooth') &&
       attacker.named('Clamperl') &&
       move.category === 'Special') ||
      (attacker.hasItem('Light Ball') && attacker.name.includes('Pikachu') && !move.isZ)
  ) {
    atMods.push(8192);
    desc.attackerItem = attacker.item;
    // Choice Band/Scarf/Specs move lock and stat boosts are ignored during Dynamax (Anubis)
  } else if (!move.isZ && !move.isMax &&
    ((attacker.hasItem('Choice Band') && move.category === 'Physical') ||
      (attacker.hasItem('Choice Specs') && move.category === 'Special'))
  ) {
    atMods.push(6144);
    desc.attackerItem = attacker.item;
  }
  return atMods;
}

export function calculateDefenseSMSS(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  isCritical = false
) {
  let defense: number;
  const hitsPhysical = move.overrideDefensiveStat === 'def' || move.category === 'Physical' ||
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

  const dfMods = calculateDfModsSMSS(
    gen,
    attacker,
    defender,
    move,
    field,
    desc,
    isCritical,
    hitsPhysical
  );

  return OF16(Math.max(1, pokeRound((defense * chainMods(dfMods)) / 4096)));
}

export function calculateDfModsSMSS(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  isCritical = false,
  hitsPhysical = false
) {
  const dfMods = [];
  if (defender.hasAbility('Marvel Scale') && defender.status && hitsPhysical) {
    dfMods.push(6144);
    desc.defenderAbility = defender.ability;
  } else if (
    defender.named('Cherrim') &&
    defender.hasAbility('Flower Gift') &&
    field.hasWeather('Sun', 'Harsh Sunshine') &&
    !hitsPhysical
  ) {
    dfMods.push(6144);
    desc.defenderAbility = defender.ability;
    desc.weather = field.weather;
  } else if (
    defender.hasAbility('Grass Pelt') &&
    field.hasTerrain('Grassy') &&
    hitsPhysical
  ) {
    dfMods.push(6144);
    desc.defenderAbility = defender.ability;
  } else if (defender.hasAbility('Fur Coat') && hitsPhysical) {
    dfMods.push(8192);
    desc.defenderAbility = defender.ability;
  }

  if ((defender.hasItem('Eviolite') && gen.species.get(toID(defender.name))?.nfe) ||
      (!hitsPhysical && defender.hasItem('Assault Vest'))) {
    dfMods.push(6144);
    desc.defenderItem = defender.item;
  } else if (
    (defender.hasItem('Metal Powder') && defender.named('Ditto') && hitsPhysical) ||
    (defender.hasItem('Deep Sea Scale') && defender.named('Clamperl') && !hitsPhysical)
  ) {
    dfMods.push(8192);
    desc.defenderItem = defender.item;
  }
  return dfMods;
}

export function calculateFinalModsSMSS(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  desc: RawDesc,
  isCritical = false,
  typeEffectiveness: number
) {
  const finalMods = [];

  if (field.defenderSide.isReflect && move.category === 'Physical' &&
      !isCritical && !field.defenderSide.isAuroraVeil) {
    // doesn't stack with Aurora Veil
    finalMods.push(field.gameType !== 'Singles' ? 2732 : 2048);
    desc.isReflect = true;
  } else if (
    field.defenderSide.isLightScreen && move.category === 'Special' &&
    !isCritical && !field.defenderSide.isAuroraVeil
  ) {
    // doesn't stack with Aurora Veil
    finalMods.push(field.gameType !== 'Singles' ? 2732 : 2048);
    desc.isLightScreen = true;
  }
  if (field.defenderSide.isAuroraVeil && !isCritical) {
    finalMods.push(field.gameType !== 'Singles' ? 2732 : 2048);
    desc.isAuroraVeil = true;
  }

  if (attacker.hasAbility('Neuroforce') && typeEffectiveness > 1) {
    finalMods.push(5120);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Sniper') && isCritical) {
    finalMods.push(6144);
    desc.attackerAbility = attacker.ability;
  } else if (attacker.hasAbility('Tinted Lens') && typeEffectiveness < 1) {
    finalMods.push(8192);
    desc.attackerAbility = attacker.ability;
  }

  if (defender.isDynamaxed && move.named('Dynamax Cannon', 'Behemoth Blade', 'Behemoth Bash')) {
    finalMods.push(8192);
  }

  if (defender.hasAbility('Multiscale', 'Shadow Shield') &&
      defender.curHP() === defender.maxHP() &&
      !field.defenderSide.isSR && (!field.defenderSide.spikes || defender.hasType('Flying')) &&
      !attacker.hasAbility('Parental Bond (Child)')
  ) {
    finalMods.push(2048);
    desc.defenderAbility = defender.ability;
  }

  if (defender.hasAbility('Fluffy') && move.flags.contact && !attacker.hasAbility('Long Reach')) {
    finalMods.push(2048);
    desc.defenderAbility = defender.ability;
  } else if (
    (defender.hasAbility('Punk Rock') && move.flags.sound) ||
    (defender.hasAbility('Ice Scales') && move.category === 'Special')
  ) {
    finalMods.push(2048);
    desc.defenderAbility = defender.ability;
  }

  if (defender.hasAbility('Solid Rock', 'Filter', 'Prism Armor') && typeEffectiveness > 1) {
    finalMods.push(3072);
    desc.defenderAbility = defender.ability;
  }

  if (field.defenderSide.isFriendGuard) {
    finalMods.push(3072);
    desc.isFriendGuard = true;
  }

  if (defender.hasAbility('Fluffy') && move.hasType('Fire')) {
    finalMods.push(8192);
    desc.defenderAbility = defender.ability;
  }

  if (attacker.hasItem('Expert Belt') && typeEffectiveness > 1 && !move.isZ) {
    finalMods.push(4915);
    desc.attackerItem = attacker.item;
  } else if (attacker.hasItem('Life Orb')) {
    finalMods.push(5324);
    desc.attackerItem = attacker.item;
  } else if (attacker.hasItem('Metronome') && move.timesUsedWithMetronome! >= 1) {
    const timesUsedWithMetronome = Math.floor(move.timesUsedWithMetronome!);
    if (timesUsedWithMetronome <= 4) {
      finalMods.push(4096 + timesUsedWithMetronome * 819);
    } else {
      finalMods.push(8192);
    }
    desc.attackerItem = attacker.item;
  }

  if (move.hasType(getBerryResistType(defender.item)) &&
      (typeEffectiveness > 1 || move.hasType('Normal')) &&
      !attacker.hasAbility('Unnerve', 'As One (Glastrier)', 'As One (Spectrier)')) {
    finalMods.push(2048);
    desc.defenderItem = defender.item;
  }

  return finalMods;
}

function hasTerrainSeed(pokemon: Pokemon) {
  return pokemon.hasItem('Electric Seed', 'Misty Seed', 'Grassy Seed', 'Psychic Seed');
}
