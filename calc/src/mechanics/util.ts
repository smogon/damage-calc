import { Pokemon } from '../pokemon';
import { Field } from '../field';

function isGrounded(pokemon: Pokemon, field: Field) {
  return (
    field.isGravity ||
    (!pokemon.hasType('Flying') &&
      !pokemon.hasAbility('Levitate') &&
      !pokemon.hasItem('Air Balloon'))
  );
}

// TODO: switch to inline exports no longer relying on globals
export { isGrounded };
