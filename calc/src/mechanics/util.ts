import { Pokemon } from '../pokemon';
import { Field, Side } from '../field';
import { SP } from '../stats';

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

// TODO: switch to inline exports no longer relying on globals
export { isGrounded, getModifiedStat, getFinalSpeed, pokeRound };
