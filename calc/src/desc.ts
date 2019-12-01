import {TYPE_CHART, Type} from './data/types';
import {Field, Terrain, Weather, Side} from './field';
import {Generation} from './gen';
import {isGrounded} from './mechanics/util';
import {Move} from './move';
import {Pokemon} from './pokemon';
import {error} from './util';

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

export function display(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  damage: number[],
  rawDesc: RawDesc,
  notation = '%',
  err = true
) {
  const minDamage = damage[0] * move.hits;
  const maxDamage = damage[damage.length - 1] * move.hits;

  const minDisplay = toDisplay(notation, minDamage, defender.maxHP());
  const maxDisplay = toDisplay(notation, maxDamage, defender.maxHP());

  const desc = buildDescription(rawDesc);
  const damageText = `${minDamage}-${maxDamage} (${minDisplay} - ${maxDisplay}${notation})`;

  if (move.bp === 0) return `${desc}: ${damageText}`;
  const koChanceText = getKOChance(gen, attacker, defender, move, field, damage, err).text;
  return koChanceText ? `${desc}: ${damageText} -- ${koChanceText}` : `${desc}: ${damageText}`;
}

export function displayMove(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  damage: number[],
  notation = '%'
) {
  const minDamage = damage[0] * move.hits;
  const maxDamage = damage[damage.length - 1] * move.hits;

  const minDisplay = toDisplay(notation, minDamage, defender.maxHP());
  const maxDisplay = toDisplay(notation, maxDamage, defender.maxHP());

  const recoveryText = getRecovery(gen, attacker, defender, move, damage, notation).text;
  const recoilText = getRecoil(gen, attacker, defender, move, damage, notation).text;

  return `${minDisplay} - ${maxDisplay}${notation}${recoveryText &&
    ` (${recoveryText})`}${recoilText && ` (${recoilText})`}`;
}

export function getRecovery(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  damage: number[],
  notation = '%'
) {
  const minDamage = damage[0] * move.hits;
  const maxDamage = damage[damage.length - 1] * move.hits;

  const recovery = [0, 0];
  let text = '';

  const ignoresShellBell =
    gen === 3 && (move.name === 'Doom Desire' || move.name === 'Future Sight');
  if (attacker.hasItem('Shell Bell') && !ignoresShellBell) {
    const max = defender.maxHP() / 8;
    recovery[0] += Math.min(minDamage / 8, max);
    recovery[1] += Math.min(maxDamage / 8, max);
  }

  if (move.givesHealth) {
    const max = defender.maxHP() * move.percentHealed!;
    recovery[0] += Math.min(minDamage * move.percentHealed!, max);
    recovery[1] += Math.min(maxDamage * move.percentHealed!, max);
  }

  if (recovery[1] === 0) return {recovery, text};

  const minHealthRecovered = toDisplay(notation, recovery[0], attacker.maxHP());
  const maxHealthRecovered = toDisplay(notation, recovery[1], attacker.maxHP());

  recovery[0] = Math.floor(recovery[0]);
  recovery[1] = Math.floor(recovery[1]);

  text = `${minHealthRecovered} - ${maxHealthRecovered}${notation} recovered`;
  return {recovery, text};
}

// TODO: return recoil damage as exact HP
export function getRecoil(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  damage: number[],
  notation = '%'
) {
  const minDamage = damage[0] * move.hits;
  const maxDamage = damage[damage.length - 1] * move.hits;

  let recoil: [number, number] | number = [0, 0];
  let text = '';

  const damageOverflow = minDamage > defender.curHP || maxDamage > defender.curHP;
  if (typeof move.hasRecoil === 'number') {
    let minRecoilDamage, maxRecoilDamage;
    if (damageOverflow) {
      minRecoilDamage = toDisplay(notation, defender.curHP * move.hasRecoil, attacker.maxHP(), 100);
      maxRecoilDamage = toDisplay(notation, defender.curHP * move.hasRecoil, attacker.maxHP(), 100);
    } else {
      minRecoilDamage = toDisplay(
        notation,
        Math.min(minDamage, defender.curHP) * move.hasRecoil,
        attacker.maxHP(),
        100
      );
      maxRecoilDamage = toDisplay(
        notation,
        Math.min(maxDamage, defender.curHP) * move.hasRecoil,
        attacker.maxHP(),
        100
      );
    }
    if (!attacker.hasAbility('Rock Head')) {
      recoil = [minRecoilDamage, maxRecoilDamage];
      text = `${minRecoilDamage} - ${maxRecoilDamage}${notation} recoil damage`;
    }
  } else if (move.hasRecoil === 'crash') {
    const genMultiplier = gen === 2 ? 12.5 : gen >= 3 ? 50 : 1;

    let minRecoilDamage, maxRecoilDamage;
    if (damageOverflow && gen !== 2) {
      minRecoilDamage = toDisplay(notation, defender.curHP * genMultiplier, attacker.maxHP(), 100);
      maxRecoilDamage = toDisplay(notation, defender.curHP * genMultiplier, attacker.maxHP(), 100);
    } else {
      minRecoilDamage = toDisplay(
        notation,
        Math.min(minDamage, defender.maxHP()) * genMultiplier,
        attacker.maxHP(),
        100
      );
      maxRecoilDamage = toDisplay(
        notation,
        Math.min(maxDamage, defender.maxHP()) * genMultiplier,
        attacker.maxHP(),
        100
      );
    }

    recoil = [minRecoilDamage, maxRecoilDamage];
    switch (gen) {
      case 1:
        recoil = toDisplay(notation, 1, attacker.maxHP());
        text = '1hp damage on miss';
        break;
      case 2:
      case 3:
      case 4:
        if (defender.hasType('Ghost')) {
          if (gen === 4) {
            const gen4CrashDamage = Math.floor(((defender.maxHP() * 0.5) / attacker.maxHP()) * 100);
            recoil = notation === '%' ? gen4CrashDamage : Math.floor((gen4CrashDamage / 100) * 48);
            text = `${gen4CrashDamage}% crash damage`;
          } else {
            recoil = 0;
            text = 'no crash damage on Ghost types';
          }
        } else {
          text = `${minRecoilDamage} - ${maxRecoilDamage}${notation} crash damage on miss`;
        }
        break;
      case 4:
        text = `${minRecoilDamage} - ${maxRecoilDamage}${notation} crash damage on miss`;
        break;
      default:
        recoil = notation === '%' ? 24 : 50;
        text = '50% crash damage';
    }
  } else if (move.hasRecoil === 'Struggle') {
    recoil = notation === '%' ? 12 : 25;
    text = '25% struggle damage';
  } else if (move.hasRecoil) {
    recoil = notation === '%' ? 24 : 50;
    text = '50% recoil damage';
  }

  return {recoil, text};
}

export function getKOChance(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field,
  damage: number[],
  err = true
) {
  if (isNaN(damage[0])) {
    error(err, 'damage[0] must be a number.');
    return {chance: 0, n: 0, text: ''};
  }
  if (damage[damage.length - 1] === 0) {
    error(err, 'damage[damage.length - 1] === 0.');
    return {chance: 0, n: 0, text: ''};
  }

  // Code doesn't really work if these aren't set.
  if (move.usedTimes === undefined) move.usedTimes = 1;
  if (move.metronomeCount === undefined) move.metronomeCount = 1;

  if (damage[0] >= defender.maxHP() && move.usedTimes === 1 && move.metronomeCount === 1) {
    return {chance: 1, n: 1, text: 'guaranteed OHKO'};
  }

  const hazards = getHazards(gen, defender, field.defenderSide);
  const eot = getEndOfTurn(gen, attacker, defender, move, field);
  const toxicCounter =
    defender.status === 'Badly Poisoned' && defender.ability !== 'Magic Guard'
      ? defender.toxicCounter
      : 0;

  // multi-hit moves have too many possibilities for brute-forcing to work, so reduce it to an approximate distribution
  let qualifier = '';
  if (move.hits > 1) {
    qualifier = 'approx. ';
    damage = squashMultihit(gen, damage, move.hits, err);
  }

  const afterText =
    hazards.texts.length > 0 || eot.texts.length > 0
      ? ' after ' + serializeText(hazards.texts.concat(eot.texts))
      : '';

  if ((move.usedTimes === 1 && move.metronomeCount === 1) || move.isZ) {
    const chance = computeKOChance(
      damage,
      defender.curHP - hazards.damage,
      0,
      1,
      1,
      defender.maxHP(),
      toxicCounter
    );
    if (chance === 1) {
      return {chance, n: 1, text: `guaranteed OHKO${afterText}`};
    } else if (chance > 0) {
      return {
        chance,
        n: 1,
        text: qualifier + Math.round(chance * 1000) / 10 + `% chance to OHKO${afterText}`,
      };
    }

    for (let i = 2; i <= 4; i++) {
      const chance = computeKOChance(
        damage,
        defender.curHP - hazards.damage,
        eot.damage,
        i,
        1,
        defender.maxHP(),
        toxicCounter
      );
      if (chance === 1) {
        return {chance, n: i, text: `guaranteed ${i}HKO${afterText}`};
      } else if (chance > 0) {
        return {
          chance,
          n: i,
          text: qualifier + Math.round(chance * 1000) / 10 + `% chance to ${i}HKO${afterText}`,
        };
      }
    }

    for (let i = 5; i <= 9; i++) {
      if (
        predictTotal(damage[0], eot.damage, i, 1, toxicCounter, defender.maxHP()) >=
        defender.curHP - hazards.damage
      ) {
        return {chance: 1, n: i, text: `guaranteed ${i}HKO${afterText}`};
      } else if (
        predictTotal(damage[damage.length - 1], eot.damage, i, 1, toxicCounter, defender.maxHP()) >=
        defender.curHP - hazards.damage
      ) {
        return {n: i, text: `possible ${i}HKO${afterText}`};
      }
    }
  } else {
    const chance = computeKOChance(
      damage,
      defender.maxHP() - hazards.damage,
      eot.damage,
      move.usedTimes || 1,
      move.usedTimes || 1,
      defender.maxHP(),
      toxicCounter
    );
    if (chance === 1) {
      return {
        chance,
        n: move.usedTimes,
        text: `guaranteed KO in ${move.usedTimes} turns${afterText}`,
      };
    } else if (chance > 0) {
      return {
        chance,
        n: move.usedTimes,
        text:
          qualifier +
          Math.round(chance * 1000) / 10 +
          `% chance to ${move.usedTimes}HKO${afterText}`,
      };
    }
    if (
      predictTotal(
        damage[0],
        eot.damage,
        move.usedTimes,
        move.usedTimes,
        toxicCounter,
        defender.maxHP()
      ) >=
      defender.curHP - hazards.damage
    ) {
      return {
        chance: 1,
        n: move.usedTimes,
        text: `guaranteed KO in ${move.usedTimes} turns${afterText}`,
      };
    } else if (
      predictTotal(
        damage[damage.length - 1],
        eot.damage,
        move.usedTimes,
        move.usedTimes,
        toxicCounter,
        defender.maxHP()
      ) >=
      defender.curHP - hazards.damage
    ) {
      return {n: move.usedTimes, text: `possible KO in ${move.usedTimes} turns${afterText}`};
    }
    return {n: move.usedTimes, text: 'not a KO'};
  }

  return {chance: 0, n: 0, text: ''};
}

function getHazards(gen: Generation, defender: Pokemon, defenderSide: Side) {
  let damage = 0;
  const texts: string[] = [];

  if (defender.hasItem('Heavy-Duty Boots')) {
    return {damage, texts};
  }
  if (defenderSide.isSR && !defender.hasAbility('Magic Guard', 'Mountaineer')) {
    const effectiveness =
      TYPE_CHART[gen]['Rock']![defender.type1]! *
      (defender.type2 ? TYPE_CHART[gen]['Rock']![defender.type2]! : 1);
    damage += Math.floor((effectiveness * defender.maxHP()) / 8);
    texts.push('Stealth Rock');
  }
  if (defenderSide.steelsurge && !defender.hasAbility('Magic Guard', 'Mountaineer')) {
    const effectiveness =
      TYPE_CHART[gen]['Steel']![defender.type1]! *
      (defender.type2 ? TYPE_CHART[gen]['Steel']![defender.type2]! : 1);
    damage += Math.floor((effectiveness * defender.maxHP()) / 8);
    texts.push('Steelsurge');
  }
  if (
    !defender.hasType('Flying') &&
    !defender.hasAbility('Magic Guard', 'Levitate') &&
    !defender.hasItem('Air Balloon')
  ) {
    if (defenderSide.spikes === 1) {
      damage += Math.floor(defender.maxHP() / 8);
      if (gen === 2) {
        texts.push('Spikes');
      } else {
        texts.push('1 layer of Spikes');
      }
    } else if (defenderSide.spikes === 2) {
      damage += Math.floor(defender.maxHP() / 6);
      texts.push('2 layers of Spikes');
    } else if (defenderSide.spikes === 3) {
      damage += Math.floor(defender.maxHP() / 4);
      texts.push('3 layers of Spikes');
    }
  }
  if (isNaN(damage)) {
    damage = 0;
  }

  return {damage, texts};
}

function getEndOfTurn(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field
) {
  let damage = 0;
  const texts = [];

  if (field.hasWeather('Sun', 'Harsh Sunshine')) {
    if (defender.hasAbility('Dry Skin', 'Solar Power')) {
      damage -= Math.floor(defender.maxHP() / 8);
      texts.push(defender.ability + ' damage');
    }
  } else if (field.hasWeather('Rain', 'Heavy Rain')) {
    if (defender.hasAbility('Dry Skin')) {
      damage += Math.floor(defender.maxHP() / 8);
      texts.push('Dry Skin recovery');
    } else if (defender.hasAbility('Rain Dish')) {
      damage += Math.floor(defender.maxHP() / 16);
      texts.push('Rain Dish recovery');
    }
  } else if (field.hasWeather('Sand')) {
    if (
      !defender.hasType('Rock', 'Ground', 'Steel') &&
      !defender.hasAbility('Magic Guard', 'Overcoat', 'Sand Force', 'Sand Rush', 'Sand Veil') &&
      !defender.hasItem('Safety Goggles')
    ) {
      damage -= Math.floor(defender.maxHP() / (gen === 2 ? 8 : 16));
      texts.push('sandstorm damage');
    }
  } else if (field.hasWeather('Hail')) {
    if (defender.hasAbility('Ice Body')) {
      damage += Math.floor(defender.maxHP() / 16);
      texts.push('Ice Body recovery');
    } else if (
      !defender.hasType('Ice') &&
      !defender.hasAbility('Magic Guard', 'Overcoat', 'Snow Cloak') &&
      !defender.hasItem('Safety Goggles')
    ) {
      damage -= Math.floor(defender.maxHP() / 16);
      texts.push('hail damage');
    }
  }
  const loseItem = move.name === 'Knock Off' && !defender.hasAbility('Sticky Hold');
  if (defender.item === 'Leftovers' && !loseItem) {
    damage += Math.floor(defender.maxHP() / 16);
    texts.push('Leftovers recovery');
  } else if (defender.hasItem('Black Sludge') && !loseItem) {
    if (defender.hasType('Poison')) {
      damage += Math.floor(defender.maxHP() / 16);
      texts.push('Black Sludge recovery');
    } else if (!defender.hasAbility('Magic Guard', 'Klutz')) {
      damage -= Math.floor(defender.maxHP() / 8);
      texts.push('Black Sludge damage');
    }
  } else if (defender.hasItem('Sticky Barb')) {
    damage -= Math.floor(defender.maxHP() / 8);
    texts.push('Sticky Barb damage');
  }
  if (field.defenderSide.isSeeded) {
    if (!defender.hasAbility('Magic Guard')) {
      damage -= Math.floor(defender.maxHP() / (gen >= 2 ? 8 : 16)); // 1/16 in gen 1, 1/8 in gen 2 onwards
      texts.push('Leech Seed damage');
    }
  }
  if (field.attackerSide.isSeeded && !attacker.hasAbility('Magic Guard')) {
    if (attacker.hasAbility('Liquid Ooze')) {
      damage -= Math.floor(attacker.maxHP() / (gen >= 2 ? 8 : 16));
      texts.push('Liquid Ooze damage');
    } else {
      damage += Math.floor(attacker.maxHP() / (gen >= 2 ? 8 : 16));
      texts.push('Leech Seed recovery');
    }
  }
  if (field.terrain === 'Grassy') {
    if (isGrounded(defender, field)) {
      damage += Math.floor(defender.maxHP() / 16);
      texts.push('Grassy Terrain recovery');
    }
  }
  if (defender.hasStatus('Poisoned')) {
    if (defender.hasAbility('Poison Heal')) {
      damage += Math.floor(defender.maxHP() / 8);
      texts.push('Poison Heal');
    } else if (!defender.hasAbility('Magic Guard')) {
      damage -= Math.floor(defender.maxHP() / (gen === 1 ? 16 : 8));
      texts.push('poison damage');
    }
  } else if (defender.hasStatus('Badly Poisoned')) {
    if (defender.hasAbility('Poison Heal')) {
      damage += Math.floor(defender.maxHP() / 8);
      texts.push('Poison Heal');
    } else if (!defender.hasAbility('Magic Guard')) {
      texts.push('toxic damage');
    }
  } else if (defender.hasStatus('Burned')) {
    if (defender.hasAbility('Heatproof')) {
      damage -= Math.floor(defender.maxHP() / (gen > 6 ? 32 : 16));
      texts.push('reduced burn damage');
    } else if (!defender.hasAbility('Magic Guard')) {
      damage -= Math.floor(defender.maxHP() / (gen === 1 || gen > 6 ? 16 : 8));
      texts.push('burn damage');
    }
  } else if (
    (defender.hasStatus('Asleep') || defender.hasAbility('Comatose')) &&
    attacker.hasAbility('isBadDreams') &&
    !defender.hasAbility('Magic Guard')
  ) {
    damage -= Math.floor(defender.maxHP() / 8);
    texts.push('Bad Dreams');
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
      damage -= gen > 5 ? Math.floor(defender.maxHP() / 6) : Math.floor(defender.maxHP() / 8);
      texts.push('trapping damage');
    } else {
      damage -= gen > 5 ? Math.floor(defender.maxHP() / 8) : Math.floor(defender.maxHP() / 16);
      texts.push('trapping damage');
    }
  }
  if (
    (move.name === 'Fire Pledge (Grass Pledge Boosted)' ||
      move.name === 'Grass Pledge (Fire Pledge Boosted)') &&
    !defender.hasType('Fire') &&
    !defender.hasAbility('Magic Guard')
  ) {
    damage -= Math.floor(defender.maxHP() / 8);
    texts.push('Sea of Fire damage');
  }

  return {damage, texts};
}

function computeKOChance(
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
    const c = computeKOChance(
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

function squashMultihit(gen: Generation, d: number[], hits: number, err = true) {
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

function buildDescription(description: RawDesc) {
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
    output += '/ ' + description.defenseEVs + ' ';
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

function appendIfSet(str: string, toAppend?: string) {
  return toAppend ? `${str}${toAppend} ` : str;
}

function toDisplay(notation: string, a: number, b: number, f = 1) {
  return notation === '%' ? Math.floor((a * (1000 / f)) / b) / 10 : Math.floor((a * (48 / f)) / b);
}
