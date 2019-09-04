import {TYPE_CHART, Type} from '../data/types';
import {Field, Side, Weather} from '../field';
import {Generation} from '../gen';
import {Move} from '../move';
import {Pokemon} from '../pokemon';
import {STATS, StatsTable} from '../stats';

export function isGrounded(pokemon: Pokemon, field: Field) {
  return (
    field.isGravity ||
    (!pokemon.hasType('Flying') &&
      !pokemon.hasAbility('Levitate') &&
      !pokemon.hasItem('Air Balloon'))
  );
}

export function getModifiedStat(stat: number, mod: number, gen?: Generation) {
  const boostTable = [1, 1.5, 2, 2.5, 3, 3.5, 4];
  if (gen && gen < 3) {
    if (mod >= 0) {
      stat = Math.floor(stat * boostTable[mod]);
    } else {
      const numerators = [100, 66, 50, 40, 33, 28, 25];
      stat = Math.floor((stat * numerators[-mod]) / 100);
    }
    return Math.min(999, Math.max(1, stat));
  }

  if (mod >= 0) {
    stat = Math.floor(stat * boostTable[mod]);
  } else {
    stat = Math.floor(stat / boostTable[-mod]);
  }

  return stat;
}

export function getFinalSpeed(gen: Generation, pokemon: Pokemon, field: Field, side: Side) {
  const weather = field.weather || '';
  const terrain = field.terrain;
  let speed = getModifiedStat(pokemon.rawStats.spe, pokemon.boosts.spe, gen);

  if (pokemon.hasItem('Choice Scarf')) {
    speed = pokeRound(speed * 1.5);
  } else if (pokemon.hasItem('Macho Brace', 'Iron Ball')) {
    speed = pokeRound(speed / 2);
  } else if (pokemon.hasItem('Quick Powder') && pokemon.named('Ditto')) {
    speed *= 2;
  }
  if (
    (pokemon.hasAbility('Chlorophyll') && weather.indexOf('Sun') !== -1) ||
    (pokemon.hasAbility('Sand Rush') && weather === 'Sand') ||
    (pokemon.hasAbility('Swift Swim') && weather.indexOf('Rain') !== -1) ||
    (pokemon.hasAbility('Slush Rush') && weather === 'Hail')
  ) {
    speed *= 2;
  } else if (pokemon.hasAbility('Quick Feet') && !pokemon.hasStatus('Healthy')) {
    speed = pokeRound(speed * 1.5);
  } else if (pokemon.hasAbility('Slow Start') && pokemon.abilityOn) {
    speed = pokeRound(speed / 2);
  } else if (
    (pokemon.hasAbility('Surge Surfer') && terrain === 'Electric') ||
    (pokemon.hasAbility('Unburden') && pokemon.abilityOn)
  ) {
    speed *= 2;
  }

  if (side.isTailwind) speed *= 2;
  if (pokemon.hasStatus('Paralyzed') && !pokemon.hasAbility('Quick Feet')) {
    speed = pokeRound(speed * (gen < 7 ? 0.25 : 0.5));
  }

  if (gen <= 2) speed = Math.min(999, speed);
  return Math.max(1, speed);
}

// GameFreak rounds DOWN on .5
export function pokeRound(num: number) {
  return num % 1 > 0.5 ? Math.ceil(num) : Math.floor(num);
}

export function getMoveEffectiveness(
  gen: Generation,
  move: Move,
  type: Type,
  isGhostRevealed?: boolean,
  isGravity?: boolean
) {
  if (isGhostRevealed && type === 'Ghost' && ['Normal', 'Fighting'].indexOf(move.type) !== -1) {
    return 1;
  } else if (isGravity && type === 'Flying' && move.type === 'Ground') {
    return 1;
  } else if (move.name === 'Freeze-Dry' && type === 'Water') {
    return 2;
  } else if (move.name === 'Flying Press') {
    return TYPE_CHART[gen]['Fighting']![type]! * TYPE_CHART[gen]['Flying']![type]!;
  } else {
    return TYPE_CHART[gen][move.type]![type]!;
  }
}

export function checkAirLock(pokemon: Pokemon, field: Field) {
  if (pokemon.hasAbility('Air Lock', 'Cloud Nine')) {
    field.weather = undefined;
  }
}

export function checkForecast(pokemon: Pokemon, weather?: Weather) {
  if (pokemon.hasAbility('Forecast') && pokemon.named('Castform')) {
    switch (weather) {
      case 'Sun':
      case 'Harsh Sunshine':
        pokemon.type1 = 'Fire';
        break;
      case 'Rain':
      case 'Heavy Rain':
        pokemon.type1 = 'Water';
        break;
      case 'Hail':
        pokemon.type1 = 'Ice';
        break;
      default:
        pokemon.type1 = 'Normal';
    }
    pokemon.type2 = undefined;
  }
}

export function checkKlutz(pokemon: Pokemon) {
  if (pokemon.hasAbility('Klutz')) {
    pokemon.item = '';
  }
}

export function checkIntimidate(source: Pokemon, target: Pokemon) {
  if (
    source.ability === 'Intimidate' &&
    source.abilityOn &&
    !target.hasAbility('Clear Body', 'White Smoke', 'Hyper Cutter', 'Full Metal Body')
  ) {
    if (target.hasAbility('Contrary', 'Defiant')) {
      target.boosts.atk = Math.min(6, target.boosts.atk + 1);
    } else if (target.hasAbility('Simple')) {
      target.boosts.atk = Math.max(-6, target.boosts.atk - 2);
    } else {
      target.boosts.atk = Math.max(-6, target.boosts.atk - 1);
    }
  }
}

export function checkDownload(source: Pokemon, target: Pokemon) {
  if (source.hasAbility('Download')) {
    if (target.stats.spd <= target.stats.def) {
      source.boosts.spa = Math.min(6, source.boosts.spa + 1);
    } else {
      source.boosts.atk = Math.min(6, source.boosts.atk + 1);
    }
  }
}

export function countBoosts(gen: Generation, boosts: StatsTable<number>) {
  let sum = 0;
  // NOTE: starting from 1 because HP is not boostable
  for (let i = 1; i < STATS[gen].length; i++) {
    // Only positive boosts are counted
    const boost = boosts[STATS[gen][i]];
    if (boost && boost > 0) sum += boost;
  }
  return sum;
}
