import { TYPE_CHART, Type } from './data/types';
import { Field, Terrain, Weather } from './field';
import { isGrounded } from './mechanics/util';
import { Move } from './move';
import { Pokemon } from './pokemon';
import { error } from './util';

export interface RawDesc {
  HPEVs?: string;
  attackBoost?: number;
  attackEVs?: string;
  attackerAbility?: string;
  attackerItem?: string;
  attackerName: string;
  defenderAbility?: string;
  defenderItem?: string;
  defenderName: string;
  defenseBoost?: number;
  defenseEVs?: string;
  hits?: number;
  isAuroraVeil?: boolean;
  isFriendGuard?: boolean;
  isHelpingHand?: boolean;
  isCritical?: boolean;
  isLightScreen?: boolean;
  isBurned?: boolean;
  isProtected?: boolean;
  isReflect?: boolean;
  isBattery?: boolean;
  moveBP?: number;
  moveName: string;
  moveTurns?: string;
  moveType?: Type;
  rivalry?: 'buffed' | 'nerfed';
  terrain?: Terrain;
  weather?: Weather;
}

export function buildDescription(description: RawDesc) {
  let output = '';
  if (description.attackBoost) {
    if (description.attackBoost > 0) {
      output += '+';
    }
    output += description.attackBoost + ' ';
  }
  output = appendIfSet(output, description.attackEVs);
  output = appendIfSet(output, description.attackerItem);
  output = appendIfSet(output, description.attackerAbility);
  output = appendIfSet(output, description.rivalry);
  if (description.isBurned) {
    output += 'burned ';
  }
  output += description.attackerName + ' ';
  if (description.isHelpingHand) {
    output += 'Helping Hand ';
  }
  if (description.isBattery) {
    output += ' Battery boosted ';
  }
  output += description.moveName + ' ';
  if (description.moveBP && description.moveType) {
    output += '(' + description.moveBP + ' BP ' + description.moveType + ') ';
  } else if (description.moveBP) {
    output += '(' + description.moveBP + ' BP) ';
  } else if (description.moveType) {
    output += '(' + description.moveType + ') ';
  }
  if (description.hits) {
    output += '(' + description.hits + ' hits) ';
  }
  output = appendIfSet(output, description.moveTurns);
  output += 'vs. ';
  if (description.defenseBoost) {
    if (description.defenseBoost > 0) {
      output += '+';
    }
    output += description.defenseBoost + ' ';
  }
  output = appendIfSet(output, description.HPEVs);
  if (description.defenseEVs) {
    output += ' / ' + description.defenseEVs + ' ';
  }
  output = appendIfSet(output, description.defenderItem);
  output = appendIfSet(output, description.defenderAbility);
  if (description.isProtected) {
    output += 'protected ';
  }
  output += description.defenderName;
  if (description.weather && description.terrain) {
    // do nothing
  } else if (description.weather) {
    output += ' in ' + description.weather;
  } else if (description.terrain) {
    output += ' in ' + description.terrain + ' Terrain';
  }
  if (description.isReflect) {
    output += ' through Reflect';
  } else if (description.isLightScreen) {
    output += ' through Light Screen';
  }
  if (description.isFriendGuard) {
    output += " with an ally's Friend Guard";
  }
  if (description.isAuroraVeil) {
    output += " with an ally's Aurora Veil";
  }
  if (description.isCritical) {
    output += ' on a critical hit';
  }
  return output;
}

function appendIfSet(str: string, toAppend?: string) {
  return toAppend ? `${str}${toAppend} ` : str;
}

export function getKOChanceText(
  gen: 1 | 2 | 3 | 4 | 5 | 6 | 7,
  damage: number[],
  attacker: Pokemon,
  defender: Pokemon,
  field: Field,
  move: Move,
  hits: number,
  isBadDreams: boolean,
  err = true
) {
  if (isNaN(damage[0])) {
    return 'something broke; please tell Austin';
  }
  if (damage[damage.length - 1] === 0) {
    return 'aim for the horn next time';
  }
  //Code doesn't really work if these aren't set.
  if (move.usedTimes === undefined) {
    move.usedTimes = 1;
  }
  if (move.metronomeCount === undefined) {
    move.metronomeCount = 1;
  }
  if (damage[0] >= defender.maxHP && (move.usedTimes === 1 && move.metronomeCount === 1)) {
    return 'guaranteed OHKO';
  }

  let hazards = 0;
  const hazardText = [];
  if (field.defenderSide.isSR && !defender.hasAbility('Magic Guard', 'Mountaineer')) {
    const effectiveness =
      TYPE_CHART[gen]['Rock']![defender.type1]! *
      (defender.type2 ? TYPE_CHART[gen]['Rock']![defender.type2]! : 1);
    hazards += Math.floor((effectiveness * defender.maxHP) / 8);
    hazardText.push('Stealth Rock');
  }
  if (
    !defender.hasType('Flying') &&
    !defender.hasAbility('Magic Guard', 'Levitate') &&
    !defender.hasItem('Air Balloon')
  ) {
    if (field.defenderSide.spikes === 1) {
      hazards += Math.floor(defender.maxHP / 8);
      if (gen === 2) {
        hazardText.push('Spikes');
      } else {
        hazardText.push('1 layer of Spikes');
      }
    } else if (field.defenderSide.spikes === 2) {
      hazards += Math.floor(defender.maxHP / 6);
      hazardText.push('2 layers of Spikes');
    } else if (field.defenderSide.spikes === 3) {
      hazards += Math.floor(defender.maxHP / 4);
      hazardText.push('3 layers of Spikes');
    }
  }
  if (isNaN(hazards)) {
    hazards = 0;
  }

  let eot = 0;
  const eotText = [];
  if (field.hasWeather('Sun', 'Harsh Sunshine')) {
    if (defender.hasAbility('Dry Skin', 'Solar Power')) {
      eot -= Math.floor(defender.maxHP / 8);
      eotText.push(defender.ability + ' damage');
    }
  } else if (field.hasWeather('Rain', 'Heavy Rain')) {
    if (defender.hasAbility('Dry Skin')) {
      eot += Math.floor(defender.maxHP / 8);
      eotText.push('Dry Skin recovery');
    } else if (defender.hasAbility('Rain Dish')) {
      eot += Math.floor(defender.maxHP / 16);
      eotText.push('Rain Dish recovery');
    }
  } else if (field.hasWeather('Sand')) {
    if (
      defender.hasType('Rock', 'Ground', 'Steel') &&
      defender.hasAbility('Magic Guard', 'Overcoat', 'Sand Force', 'Sand Rush', 'Sand Veil') &&
      defender.hasItem('Safety Goggles')
    ) {
      eot -= Math.floor(defender.maxHP / 16);
      eotText.push('sandstorm damage');
    }
  } else if (field.hasWeather('Hail')) {
    if (defender.hasAbility('Ice Body')) {
      eot += Math.floor(defender.maxHP / 16);
      eotText.push('Ice Body recovery');
    } else if (
      defender.hasType('Ice') &&
      defender.hasAbility('Magic Guard', 'Overcoat', 'Snow Cloak') &&
      defender.item !== 'Safety Goggles'
    ) {
      eot -= Math.floor(defender.maxHP / 16);
      eotText.push('hail damage');
    }
  }
  const loseItem = move.name === 'Knock Off' && !defender.hasAbility('Sticky Hold');
  if (defender.item === 'Leftovers' && !loseItem) {
    eot += Math.floor(defender.maxHP / 16);
    eotText.push('Leftovers recovery');
  } else if (defender.hasItem('Black Sludge') && !loseItem) {
    if (defender.hasType('Poison')) {
      eot += Math.floor(defender.maxHP / 16);
      eotText.push('Black Sludge recovery');
    } else if (!defender.hasAbility('Magic Guard', 'Klutz')) {
      eot -= Math.floor(defender.maxHP / 8);
      eotText.push('Black Sludge damage');
    }
  } else if (defender.hasItem('Sticky Barb')) {
    eot -= Math.floor(defender.maxHP / 8);
    eotText.push('Sticky Barb damage');
  }
  if (field.defenderSide.isSeeded) {
    if (!defender.hasAbility('Magic Guard')) {
      eot -= gen >= 2 ? Math.floor(defender.maxHP / 8) : Math.floor(defender.maxHP / 16); // 1/16 in gen 1, 1/8 in gen 2 onwards
      eotText.push('Leech Seed damage');
    }
  }
  if (field.attackerSide.isSeeded && !attacker.hasAbility('Magic Guard')) {
    if (attacker.hasAbility('Liquid Ooze')) {
      eot -= gen >= 2 ? Math.floor(attacker.maxHP / 8) : Math.floor(attacker.maxHP / 16);
      eotText.push('Liquid Ooze damage');
    } else {
      eot += gen >= 2 ? Math.floor(attacker.maxHP / 8) : Math.floor(attacker.maxHP / 16);
      eotText.push('Leech Seed recovery');
    }
  }
  if (field.terrain === 'Grassy') {
    if (isGrounded(defender, field)) {
      eot += Math.floor(defender.maxHP / 16);
      eotText.push('Grassy Terrain recovery');
    }
  }
  let toxicCounter = 0;
  if (defender.hasStatus('Poisoned')) {
    if (defender.hasAbility('Poison Heal')) {
      eot += Math.floor(defender.maxHP / 8);
      eotText.push('Poison Heal');
    } else if (!defender.hasAbility('Magic Guard')) {
      eot -= Math.floor(defender.maxHP / 8);
      eotText.push('poison damage');
    }
  } else if (defender.hasStatus('Badly Poisoned')) {
    if (defender.hasAbility('Poison Heal')) {
      eot += Math.floor(defender.maxHP / 8);
      eotText.push('Poison Heal');
    } else if (!defender.hasAbility('Magic Guard')) {
      eotText.push('toxic damage');
      toxicCounter = defender.toxicCounter;
    }
  } else if (defender.hasStatus('Burned')) {
    if (defender.hasAbility('Heatproof')) {
      eot -= gen > 6 ? Math.floor(defender.maxHP / 32) : Math.floor(defender.maxHP / 16);
      eotText.push('reduced burn damage');
    } else if (!defender.hasAbility('Magic Guard')) {
      eot -= gen > 6 ? Math.floor(defender.maxHP / 16) : Math.floor(defender.maxHP / 8);
      eotText.push('burn damage');
    }
  } else if (
    (defender.hasStatus('Asleep') || defender.hasAbility('Comatose')) &&
    isBadDreams &&
    !defender.hasAbility('Magic Guard')
  ) {
    eot -= Math.floor(defender.maxHP / 8);
    eotText.push('Bad Dreams');
  }
  if (
    [
      'Bind',
      'Clamp',
      'Fire Spin',
      'Infestation',
      'Magma Storm',
      'Sand Tomb',
      'Whirlpool',
      'Wrap',
    ].indexOf(move.name) !== -1 &&
    !defender.hasAbility('Magic Guard')
  ) {
    if (attacker.hasItem('Binding Band')) {
      eot -= gen > 5 ? Math.floor(defender.maxHP / 6) : Math.floor(defender.maxHP / 8);
      eotText.push('trapping damage');
    } else {
      eot -= gen > 5 ? Math.floor(defender.maxHP / 8) : Math.floor(defender.maxHP / 16);
      eotText.push('trapping damage');
    }
  }
  if (
    (move.name === 'Fire Pledge (Grass Pledge Boosted)' ||
      move.name === 'Grass Pledge (Fire Pledge Boosted)') &&
    !defender.hasType('Fire') &&
    !defender.hasAbility('Magic Guard')
  ) {
    eot -= Math.floor(defender.maxHP / 8);
    eotText.push('Sea of Fire damage');
  }
  // multi-hit moves have too many possibilities for brute-forcing to work, so reduce it to an approximate distribution
  let qualifier = '';
  if (hits > 1) {
    qualifier = 'approx. ';
    damage = squashMultihit(gen, damage, hits, err);
  }
  const afterText =
    hazardText.length > 0 || eotText.length > 0
      ? ' after ' + serializeText(hazardText.concat(eotText))
      : '';
  if ((move.usedTimes === 1 && move.metronomeCount === 1) || move.isZ) {
    const c = getKOChance(damage, defender.curHP - hazards, 0, 1, 1, defender.maxHP, toxicCounter);
    if (c === 1) {
      return 'guaranteed OHKO' + afterText;
    } else if (c > 0) {
      return qualifier + Math.round(c * 1000) / 10 + '% chance to OHKO' + afterText;
    }

    for (let i = 2; i <= 4; i++) {
      const c = getKOChance(
        damage,
        defender.curHP - hazards,
        eot,
        i,
        1,
        defender.maxHP,
        toxicCounter
      );
      if (c === 1) {
        return 'guaranteed ' + i + 'HKO' + afterText;
      } else if (c > 0) {
        return qualifier + Math.round(c * 1000) / 10 + '% chance to ' + i + 'HKO' + afterText;
      }
    }

    for (let i = 5; i <= 9; i++) {
      if (
        predictTotal(damage[0], eot, i, 1, toxicCounter, defender.maxHP) >=
        defender.curHP - hazards
      ) {
        return 'guaranteed ' + i + 'HKO' + afterText;
      } else if (
        predictTotal(damage[damage.length - 1], eot, i, 1, toxicCounter, defender.maxHP) >=
        defender.curHP - hazards
      ) {
        return 'possible ' + i + 'HKO' + afterText;
      }
    }
  } else {
    const c = getKOChance(
      damage,
      defender.maxHP - hazards,
      eot,
      move.usedTimes || 1,
      move.usedTimes || 1,
      defender.maxHP,
      toxicCounter
    );
    if (c === 1) {
      return 'guaranteed KO in ' + move.usedTimes + ' turns' + afterText;
    } else if (c > 0) {
      return (
        qualifier + Math.round(c * 1000) / 10 + '% chance to ' + move.usedTimes + 'HKO' + afterText
      );
    }
    if (
      predictTotal(damage[0], eot, move.usedTimes, move.usedTimes, toxicCounter, defender.maxHP) >=
      defender.curHP - hazards
    ) {
      return 'guaranteed KO in ' + move.usedTimes + ' turns' + afterText;
    } else if (
      predictTotal(
        damage[damage.length - 1],
        eot,
        move.usedTimes,
        move.usedTimes,
        toxicCounter,
        defender.maxHP
      ) >=
      defender.curHP - hazards
    ) {
      return 'possible KO in ' + move.usedTimes + ' turns' + afterText;
    }
    return 'not a KO';
  }

  return 'possibly the worst move ever';
}

function getKOChance(
  damage: number[],
  hp: number,
  eot: number,
  hits: number,
  moveHits: number,
  maxHP: number,
  toxicCounter: number
) {
  const n = damage.length;
  const minDamage = damage[0];
  const maxDamage = damage[n - 1];
  if (hits === 1) {
    for (let i = 0; i < n; i++) {
      if (damage[i] >= hp) {
        return (n - i) / n;
      }
    }
  } else {
    for (let j = 0; j < n; j++) {
      if (damage[j] >= hp) {
        return j / n;
      }
    }
  }
  if (predictTotal(maxDamage, eot, hits, moveHits, toxicCounter, maxHP) < hp) {
    return 0;
  } else if (predictTotal(minDamage, eot, hits, moveHits, toxicCounter, maxHP) >= hp) {
    return 1;
  }
  let toxicDamage = 0;
  if (toxicCounter > 0) {
    toxicDamage = Math.floor((toxicCounter * maxHP) / 16);
    toxicCounter++;
  }
  let sum = 0;
  for (let i = 0; i < n; i++) {
    const c = getKOChance(
      damage,
      hp - damage[i] + eot - toxicDamage,
      eot,
      hits - 1,
      moveHits,
      maxHP,
      toxicCounter
    );
    if (c === 1) {
      sum += n - i;
      break;
    } else {
      sum += c;
    }
  }
  return sum / n;
}

function predictTotal(
  damage: number,
  eot: number,
  hits: number,
  moveHits: number,
  toxicCounter: number,
  maxHP: number
) {
  let toxicDamage = 0;
  if (toxicCounter > 0) {
    for (let i = 0; i < hits - 1; i++) {
      toxicDamage += Math.floor(((toxicCounter + i) * maxHP) / 16);
    }
  }
  let total = 0;
  if (hits > 1 && moveHits === 1) {
    total = damage * hits - eot * (hits - 1) + toxicDamage;
  } else {
    total = damage - eot * (hits - 1) + toxicDamage;
  }
  return total;
}

function squashMultihit(gen: 1 | 2 | 3 | 4 | 5 | 6 | 7, d: number[], hits: number, err = true) {
  if (d.length === 1) {
    return [d[0] * hits];
  } else if (gen === 1) {
    const r = [];
    for (let i = 0; i < d.length; i++) {
      r[i] = d[i] * hits;
    }
    return r;
  } else if (d.length === 16) {
    switch (hits) {
      case 2:
        return [
          2 * d[0],
          d[2] + d[3],
          d[4] + d[4],
          d[4] + d[5],
          d[5] + d[6],
          d[6] + d[6],
          d[6] + d[7],
          d[7] + d[7],
          d[8] + d[8],
          d[8] + d[9],
          d[9] + d[9],
          d[9] + d[10],
          d[10] + d[11],
          d[11] + d[11],
          d[12] + d[13],
          2 * d[15],
        ];
      case 3:
        return [
          3 * d[0],
          d[3] + d[3] + d[4],
          d[4] + d[4] + d[5],
          d[5] + d[5] + d[6],
          d[5] + d[6] + d[6],
          d[6] + d[6] + d[7],
          d[6] + d[7] + d[7],
          d[7] + d[7] + d[8],
          d[7] + d[8] + d[8],
          d[8] + d[8] + d[9],
          d[8] + d[9] + d[9],
          d[9] + d[9] + d[10],
          d[9] + d[10] + d[10],
          d[10] + d[11] + d[11],
          d[11] + d[12] + d[12],
          3 * d[15],
        ];
      case 4:
        return [
          4 * d[0],
          4 * d[4],
          d[4] + d[5] + d[5] + d[5],
          d[5] + d[5] + d[6] + d[6],
          4 * d[6],
          d[6] + d[6] + d[7] + d[7],
          4 * d[7],
          d[7] + d[7] + d[7] + d[8],
          d[7] + d[8] + d[8] + d[8],
          4 * d[8],
          d[8] + d[8] + d[9] + d[9],
          4 * d[9],
          d[9] + d[9] + d[10] + d[10],
          d[10] + d[10] + d[10] + d[11],
          4 * d[11],
          4 * d[15],
        ];
      case 5:
        return [
          5 * d[0],
          d[4] + d[4] + d[4] + d[5] + d[5],
          d[5] + d[5] + d[5] + d[5] + d[6],
          d[5] + d[6] + d[6] + d[6] + d[6],
          d[6] + d[6] + d[6] + d[6] + d[7],
          d[6] + d[6] + d[7] + d[7] + d[7],
          5 * d[7],
          d[7] + d[7] + d[7] + d[8] + d[8],
          d[7] + d[7] + d[8] + d[8] + d[8],
          5 * d[8],
          d[8] + d[8] + d[8] + d[9] + d[9],
          d[8] + d[9] + d[9] + d[9] + d[9],
          d[9] + d[9] + d[9] + d[9] + d[10],
          d[9] + d[10] + d[10] + d[10] + d[10],
          d[10] + d[10] + d[11] + d[11] + d[11],
          5 * d[15],
        ];
      default:
        error(err, `Unexpected # of hits: ${hits}`);
        return d;
    }
  } else if (d.length === 39) {
    switch (hits) {
      case 2:
        return [
          2 * d[0],
          2 * d[7],
          2 * d[10],
          2 * d[12],
          2 * d[14],
          d[15] + d[16],
          2 * d[17],
          d[18] + d[19],
          d[19] + d[20],
          2 * d[21],
          d[22] + d[23],
          2 * d[24],
          2 * d[26],
          2 * d[28],
          2 * d[31],
          2 * d[38],
        ];
      case 3:
        return [
          3 * d[0],
          3 * d[9],
          3 * d[12],
          3 * d[13],
          3 * d[15],
          3 * d[16],
          3 * d[17],
          3 * d[18],
          3 * d[20],
          3 * d[21],
          3 * d[22],
          3 * d[23],
          3 * d[25],
          3 * d[26],
          3 * d[29],
          3 * d[38],
        ];
      case 4:
        return [
          4 * d[0],
          2 * d[10] + 2 * d[11],
          4 * d[13],
          4 * d[14],
          2 * d[15] + 2 * d[16],
          2 * d[16] + 2 * d[17],
          2 * d[17] + 2 * d[18],
          2 * d[18] + 2 * d[19],
          2 * d[19] + 2 * d[20],
          2 * d[20] + 2 * d[21],
          2 * d[21] + 2 * d[22],
          2 * d[22] + 2 * d[23],
          4 * d[24],
          4 * d[25],
          2 * d[27] + 2 * d[28],
          4 * d[38],
        ];
      case 5:
        return [
          5 * d[0],
          5 * d[11],
          5 * d[13],
          5 * d[15],
          5 * d[16],
          5 * d[17],
          5 * d[18],
          5 * d[19],
          5 * d[19],
          5 * d[20],
          5 * d[21],
          5 * d[22],
          5 * d[23],
          5 * d[25],
          5 * d[27],
          5 * d[38],
        ];
      default:
        error(err, `Unexpected # of hits: ${hits}`);
        return d;
    }
  } else {
    error(err, `Unexpected # of possible damage values: ${d.length}`);
    return d;
  }
}

function serializeText(arr: string[]) {
  if (arr.length === 0) {
    return '';
  } else if (arr.length === 1) {
    return arr[0];
  } else if (arr.length === 2) {
    return arr[0] + ' and ' + arr[1];
  } else {
    let text = '';
    for (let i = 0; i < arr.length - 1; i++) {
      text += arr[i] + ', ';
    }
    return text + 'and ' + arr[arr.length - 1];
  }
}
