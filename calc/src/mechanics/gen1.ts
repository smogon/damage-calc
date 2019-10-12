import {TYPE_CHART} from '../data/types';
import {RawDesc} from '../desc';
import {Field} from '../field';
import {Move} from '../move';
import {Pokemon} from '../pokemon';
import {Result} from '../result';
import {getModifiedStat, getFinalSpeed} from './util';

const RBY = 1;

export function calculateRBY(attacker: Pokemon, defender: Pokemon, move: Move, field: Field) {
  attacker.stats.atk = getModifiedStat(attacker.rawStats.atk, attacker.boosts.atk, RBY);
  attacker.stats.def = getModifiedStat(attacker.rawStats.def, attacker.boosts.def, RBY);
  attacker.stats.spc = getModifiedStat(attacker.rawStats.spc!, attacker.boosts.spc!, RBY);
  attacker.stats.spe = getFinalSpeed(RBY, attacker, field, field.attackerSide);

  defender.stats.atk = getModifiedStat(defender.rawStats.atk, defender.boosts.atk, RBY);
  defender.stats.def = getModifiedStat(defender.rawStats.def, defender.boosts.def, RBY);
  defender.stats.spc = getModifiedStat(defender.rawStats.spc!, defender.boosts.spc!, RBY);
  defender.stats.spe = getFinalSpeed(RBY, defender, field, field.defenderSide);

  const description: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
  };

  const damage: number[] = [];
  const result = new Result(RBY, attacker, defender, move, field, damage, description);

  if (move.bp === 0) {
    damage.push(0);
    return result;
  }

  let lv = attacker.level;
  if (move.name === 'Seismic Toss' || move.name === 'Night Shade') {
    damage.push(lv);
    return result;
  }

  const typeEffect1 = TYPE_CHART[RBY][move.type]![defender.type1]!;
  const typeEffect2 = defender.type2 ? TYPE_CHART[RBY][move.type]![defender.type2]! : 1;
  const typeEffectiveness = typeEffect1 * typeEffect2;

  if (typeEffectiveness === 0) {
    damage.push(0);
    return result;
  }
  if (move.hits > 1) description.hits = move.hits;

  const isPhysical = TYPE_CHART[RBY][move.type]!.category === 'Physical';
  const attackStat = isPhysical ? 'atk' : 'spc';
  const defenseStat = isPhysical ? 'def' : 'spc';
  let at = attacker.stats[attackStat]!;
  let df = defender.stats[defenseStat]!;

  if (move.isCrit) {
    lv *= 2;
    at = attacker.rawStats[attackStat]!;
    df = defender.rawStats[defenseStat]!;
    description.isCritical = true;
  } else {
    if (attacker.boosts[attackStat] !== 0) {
      description.attackBoost = attacker.boosts[attackStat];
    }
    if (defender.boosts[defenseStat] !== 0) {
      description.defenseBoost = defender.boosts[defenseStat];
    }
    if (isPhysical && attacker.hasStatus('Burned')) {
      at = Math.floor(at / 2);
      description.isBurned = true;
    }
  }

  if (move.name === 'Explosion' || move.name === 'Self-Destruct') {
    df = Math.floor(df / 2);
  }

  if (!move.isCrit) {
    if (isPhysical && field.defenderSide.isReflect) {
      df *= 2;
      description.isReflect = true;
    } else if (!isPhysical && field.defenderSide.isLightScreen) {
      df *= 2;
      description.isLightScreen = true;
    }
  }

  if (at > 255 || df > 255) {
    at = Math.floor(at / 4) % 256;
    df = Math.floor(df / 4) % 256;
  }

  let baseDamage =
    Math.min(
      997,
      Math.floor(
        Math.floor((Math.floor((2 * lv) / 5 + 2) * Math.max(1, at) * move.bp) / Math.max(1, df)) /
          50
      )
    ) + 2;
  if (move.type === attacker.type1 || move.type === attacker.type2) {
    baseDamage = Math.floor(baseDamage * 1.5);
  }
  baseDamage = Math.floor(baseDamage * typeEffectiveness);
  for (let i = 217; i <= 255; i++) {
    damage[i - 217] = Math.floor((baseDamage * i) / 255);
  }
  return result;
}
