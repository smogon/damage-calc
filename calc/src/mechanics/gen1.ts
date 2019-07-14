import { TYPE_CHART } from '../data/types';
import { RawDesc } from '../desc';
import { Field } from '../field';
import { Move } from '../move';
import { Pokemon } from '../pokemon';
import { AT, DF, SL, SP } from '../stats';
import { getModifiedStat, getFinalSpeed } from './util';

const RBY = 1;

export function calculateRBY(attacker: Pokemon, defender: Pokemon, move: Move, field: Field) {
  attacker.stats[AT] = getModifiedStat(attacker.rawStats[AT], attacker.boosts[AT], RBY);
  attacker.stats[DF] = getModifiedStat(attacker.rawStats[DF], attacker.boosts[DF], RBY);
  attacker.stats[SL] = getModifiedStat(attacker.rawStats[SL], attacker.boosts[SL], RBY);
  attacker.stats[SP] = getFinalSpeed(RBY, attacker, field, field.attackerSide);

  defender.stats[AT] = getModifiedStat(defender.rawStats[AT], defender.boosts[AT], RBY);
  defender.stats[DF] = getModifiedStat(defender.rawStats[DF], defender.boosts[DF], RBY);
  defender.stats[SL] = getModifiedStat(defender.rawStats[SL], defender.boosts[SL], RBY);
  defender.stats[SP] = getFinalSpeed(RBY, defender, field, field.defenderSide);

  const description: RawDesc = {
    attackerName: attacker.name,
    moveName: move.name,
    defenderName: defender.name,
  };

  if (move.bp === 0) return { damage: [0], description };

  let lv = attacker.level;
  if (move.name === 'Seismic Toss' || move.name === 'Night Shade') {
    return { damage: [lv], description };
  }

  const typeEffect1 = TYPE_CHART[RBY][move.type][defender.type1];
  const typeEffect2 = defender.type2 ? TYPE_CHART[RBY][move.type][defender.type2] : 1;
  const typeEffectiveness = typeEffect1 * typeEffect2;

  if (typeEffectiveness === 0) return { damage: [0], description };
  if (move.hits > 1) description.hits = move.hits;

  const isPhysical = TYPE_CHART[RBY][move.type].category === 'Physical';
  const attackStat = isPhysical ? AT : SL;
  const defenseStat = isPhysical ? DF : SL;
  let at = attacker.stats[attackStat];
  let df = defender.stats[defenseStat];

  if (move.isCrit) {
    lv *= 2;
    at = attacker.rawStats[attackStat];
    df = defender.rawStats[defenseStat];
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
  // If baseDamage >= 768, don't apply random factor? upokecenter says this, but nobody else does
  const damage = [];
  for (let i = 217; i <= 255; i++) {
    damage[i - 217] = Math.floor((baseDamage * i) / 255);
  }
  return { damage, description };
}
