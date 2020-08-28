import {calculate, Pokemon, Move} from '../adaptable';
import * as I from '../data/interface';

import * as calc from '../index';
import {Dex} from '@pkmn/dex';
import {Generations} from './gen';

const pkmn = {Generations: new Generations(Dex)};

const gens = [1, 2, 3, 4, 5, 6, 7, 8] as I.GenerationNum[];

describe('Generations', () => {
  test('abilities', () => {
    for (const gen of gens) {
      const p = Array.from(pkmn.Generations.get(gen).abilities);
      const c = new Map<I.ID, I.Ability>();
      for (const ability of calc.Generations.get(gen).abilities) c.set(ability.id, ability);

      expect(Array.from(c.values()).map(s => s.name).sort()).toEqual(p.map(s => s.name).sort());
      for (const ability of p) {
        expect(c.get(ability.id)).toEqual(ability);
        c.delete(ability.id);
      }
      expect(c.size).toBe(0);
    }
  });

  test('items', () => {
    for (const gen of gens) {
      const p = Array.from(pkmn.Generations.get(gen).items);
      const c = new Map<I.ID, I.Item>();
      for (const item of calc.Generations.get(gen).items) c.set(item.id, item);

      expect(Array.from(c.values()).map(s => s.name).sort()).toEqual(p.map(s => s.name).sort());
      for (const item of p) {
        expect(c.get(item.id)).toEqual(item);
        c.delete(item.id);
      }
      expect(c.size).toBe(0);
    }
  });

  test('moves', () => {
    for (const gen of gens) {
      const p = Array.from(pkmn.Generations.get(gen).moves);
      const c = new Map<I.ID, I.Move>();
      for (const move of calc.Generations.get(gen).moves) c.set(move.id, move);

      expect(Array.from(c.values()).map(s => s.name).sort()).toEqual(p.map(s => s.name).sort());
      for (const move of p) {
        expect(c.get(move.id)).toEqual(move);
        c.delete(move.id);
      }
      expect(c.size).toBe(0);
    }
  });

  test('species', () => {
    for (const gen of gens) {
      const p = Array.from(pkmn.Generations.get(gen).species);
      const c = new Map<I.ID, I.Specie>();
      for (const specie of calc.Generations.get(gen).species) c.set(specie.id, specie);
      expect(Array.from(c.values()).map(s => s.name).sort()).toEqual(p.map(s => s.name).sort());
      for (const specie of p) {
        expect(c.get(specie.id)).toEqual(specie);
        c.delete(specie.id);
      }
      expect(c.size).toBe(0);
    }
  });

  test('types', () => {
    for (const gen of gens) {
      const p = Array.from(pkmn.Generations.get(gen).types);
      const c = new Map<I.ID, I.Type>();
      for (const type of calc.Generations.get(gen).types) c.set(type.id, type);

      expect(Array.from(c.values()).map(s => s.name).sort()).toEqual(p.map(s => s.name).sort());
      for (const type of p) {
        expect(c.get(type.id)).toEqual(type);
        c.delete(type.id);
      }
      expect(c.size).toBe(0);
    }
  });

  test('natures', () => {
    for (const gen of gens) {
      const p = Array.from(pkmn.Generations.get(gen).natures);
      const c = new Map<I.ID, I.Nature>();
      for (const nature of calc.Generations.get(gen).natures) c.set(nature.id, nature);

      expect(Array.from(c.values()).map(s => s.name).sort()).toEqual(p.map(s => s.name).sort());
      for (const nature of p) {
        expect(c.get(nature.id)).toEqual(nature);
        c.delete(nature.id);
      }
      expect(c.size).toBe(0);
    }
  });
});

describe('Adaptable', () => {
  test('usage', () => {
    const gen = pkmn.Generations.get(5);
    const result = calculate(
      gen,
      new Pokemon(gen, 'Gengar', {
        item: 'Choice Specs' as I.ItemName,
        nature: 'Timid',
        evs: {spa: 252},
        boosts: {spa: 1},
      }),
      new Pokemon(gen, 'Chansey', {
        item: 'Eviolite' as I.ItemName,
        nature: 'Calm',
        evs: {hp: 252, spd: 252},
      }),
      new Move(gen, 'Focus Blast')
    );
    expect(result.range()).toEqual([274, 324]);
  });
});
