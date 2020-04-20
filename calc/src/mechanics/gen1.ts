import {Generation} from '../data/interface';
import {toID} from '../util';
import {RawDesc} from '../desc';
import {Field} from '../field';
import {Move} from '../move';
import {Pokemon} from '../pokemon';
import {Result} from '../result';
import {computeFinalStats} from './util';

export function calculateRBY(
  gen: Generation,
  attacker: Pokemon,
  defender: Pokemon,
  move: Move,
  field: Field
) {
  computeFinalStats(gen, attacker, defender, field, 'atk', 'def', 'spc', 'spe');

  const desc: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
  };

  const damage: number[] = [];
  const result = new Result(gen, attacker, defender, move, field, damage, desc);

  if (move.bp === 0) {
    damage.push(0);
    return result;
  }

  let lv = attacker.level;
  if (move.named('Seismic Toss', 'Night Shade')) {
    damage.push(lv);
    return result;
  } else if (move.named('Sonic Boom')) {
    damage.push(20);
    return result;
  } else if (move.named('Dragon Rage')) {
    damage.push(40);
    return result;
  }

  const moveType = gen.types.get(toID(move.type))!;

  const type1Effectiveness = moveType.effectiveness[defender.type1]!;
  const type2Effectiveness = defender.type2 ? moveType.effectiveness[defender.type2]! : 1;
  const typeEffectiveness = type1Effectiveness * type2Effectiveness;

  if (typeEffectiveness === 0) {
    damage.push(0);
    return result;
  }

  if (move.hits > 1) {
    desc.hits = move.hits;
  }

  const isPhysical = moveType.category === 'Physical';
  const attackStat = isPhysical ? 'atk' : 'spc';
  const defenseStat = isPhysical ? 'def' : 'spc';
  let at = attacker.stats[attackStat]!;
  let df = defender.stats[defenseStat]!;

  if (move.isCrit) {
    lv *= 2;
    at = attacker.rawStats[attackStat]!;
    df = defender.rawStats[defenseStat]!;
    desc.isCritical = true;
  } else {
    if (attacker.boosts[attackStat] !== 0) desc.attackBoost = attacker.boosts[attackStat];
    if (defender.boosts[defenseStat] !== 0) desc.defenseBoost = defender.boosts[defenseStat];
    if (isPhysical && attacker.hasStatus('brn')) {
      at = Math.floor(at / 2);
      desc.isBurned = true;
    }
  }

  if (move.named('Explosion', 'Self-Destruct')) {
    df = Math.floor(df / 2);
  }

  if (!move.isCrit) {
    if (isPhysical && field.defenderSide.isReflect) {
      df *= 2;
      desc.isReflect = true;
    } else if (!isPhysical && field.defenderSide.isLightScreen) {
      df *= 2;
      desc.isLightScreen = true;
    }
  }

  if (at > 255 || df > 255) {
    at = Math.floor(at / 4) % 256;
    df = Math.floor(df / 4) % 256;
  }

  let baseDamage = Math.floor(
    Math.floor((Math.floor((2 * lv) / 5 + 2) * Math.max(1, at) * move.bp) / Math.max(1, df)) / 50
  );
  baseDamage = Math.min(997, baseDamage) + 2;

  if (move.hasType(attacker.type1, attacker.type2)) {
    baseDamage = Math.floor(baseDamage * 1.5);
  }

  baseDamage = Math.floor(baseDamage * typeEffectiveness);
  for (let i = 217; i <= 255; i++) {
    damage[i - 217] = Math.floor((baseDamage * i) / 255);
  }

  return result;
}
