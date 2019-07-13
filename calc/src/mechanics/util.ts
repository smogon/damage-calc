import { Pokemon } from '../pokemon';
import { Move } from '../move';
import { Field, Side, Weather } from '../field';
import { AT, DF, SA, SD, SP } from '../stats';
import { TYPE_CHART, Type } from '../data/types';

function isGrounded(pokemon: Pokemon, field: Field) {
  return (
    field.isGravity ||
    (!pokemon.hasType('Flying') &&
      !pokemon.hasAbility('Levitate') &&
      !pokemon.hasItem('Air Balloon'))
  );
}

function getModifiedStat(stat: number, mod: number, gen?: 1 | 2 | 3 | 4 | 5 | 6 | 7) {
  if (mod > 0) {
    stat = Math.floor((stat * (2 + mod)) / 2);
  } else if (mod < 0) {
    stat = Math.floor((stat * 2) / (2 - mod));
  } else {
    stat = stat;
  }

  return gen && gen < 3 ? Math.min(999, Math.max(1, stat)) : stat;
}

function getFinalSpeed(gen: 1 | 2 | 3 | 4 | 5 | 6 | 7, pokemon: Pokemon, field: Field, side: Side) {
  const weather = field.weather;
  const terrain = field.terrain;
  let speed = getModifiedStat(pokemon.rawStats[SP], pokemon.boosts[SP]);

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
function pokeRound(num: number) {
  return num % 1 > 0.5 ? Math.ceil(num) : Math.floor(num);
}

function getMoveEffectiveness(
  gen: 1 | 2 | 3 | 4 | 5 | 6 | 7,
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
    return TYPE_CHART[gen]['Fighting'][type] * TYPE_CHART[gen]['Flying'][type];
  } else {
    return TYPE_CHART[gen][move.type][type];
  }
}

function checkAirLock(pokemon: Pokemon, field: Field) {
  if (pokemon.hasAbility('Air Lock', 'Cloud Nine')) {
    field.weather = '';
  }
}

function checkForecast(pokemon: Pokemon, weather: Weather) {
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

function checkKlutz(pokemon: Pokemon) {
  if (pokemon.hasAbility('Klutz')) {
    pokemon.item = '';
  }
}

function checkIntimidate(source: Pokemon, target: Pokemon) {
  if (
    source.ability === 'Intimidate' &&
    source.abilityOn &&
    !target.hasAbility('Clear Body', 'White Smoke', 'Hyper Cutter', 'Full Metal Body')
  ) {
    if (target.hasAbility('Contrary', 'Defiant')) {
      target.boosts[AT] = Math.min(6, target.boosts[AT] + 1);
    } else if (target.hasAbility('Simple')) {
      target.boosts[AT] = Math.max(-6, target.boosts[AT] - 2);
    } else {
      target.boosts[AT] = Math.max(-6, target.boosts[AT] - 1);
    }
  }
}

function checkDownload(source: Pokemon, target: Pokemon) {
  if (source.hasAbility('Download')) {
    if (target.stats[SD] <= target.stats[DF]) {
      source.boosts[SA] = Math.min(6, source.boosts[SA] + 1);
    } else {
      source.boosts[AT] = Math.min(6, source.boosts[AT] + 1);
    }
  }
}

// TODO: switch to inline exports no longer relying on globals
export {
  isGrounded,
  getModifiedStat,
  getFinalSpeed,
  pokeRound,
  getMoveEffectiveness,
  checkAirLock,
  checkForecast,
  checkKlutz,
  checkIntimidate,
  checkDownload,
};
