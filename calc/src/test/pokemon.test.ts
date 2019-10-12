import {Pokemon} from '../pokemon';
import {Stat} from '../stats';

describe('Pokemon', () => {
  test('defaults', () => {
    const p = new Pokemon(7, 'Gengar');

    expect(p.name).toBe('Gengar');
    expect(p.type1).toBe('Ghost');
    expect(p.type2).toBe('Poison');
    expect(p.weight).toBe(40.5);
    expect(p.level).toBe(100);
    expect(p.gender).toBe('male');
    expect(p.item).toBe(undefined);
    expect(p.ability).toBe('Cursed Body');
    expect(p.nature).toBe('Serious');
    expect(p.status).toBe('Healthy');
    expect(p.toxicCounter).toBe(0);
    expect(p.curHP).toBe(p.stats.hp);

    let stat: Stat;
    // tslint:disable-next-line:forin
    for (stat in p.ivs) {
      expect(p.ivs[stat]).toBe(31);
      expect(p.evs[stat]).toBe(0);
      expect(p.boosts[stat]).toBe(0);
    }

    expect(p.stats).toEqual({hp: 261, atk: 166, def: 156, spa: 296, spd: 186, spe: 256});
  });

  test('Pokemon full', () => {
    const p = new Pokemon(7, 'Suicune', {
      level: 50,
      ability: 'Inner Focus',
      item: 'Leftovers',
      nature: 'Bold',
      ivs: {spa: 30},
      evs: {spd: 4, def: 252, hp: 252},
      boosts: {atk: -1, spa: 2, spd: 1},
      curHP: 60,
      status: 'Badly Poisoned',
      toxicCounter: 2,
      moves: ['Surf', 'Rest', 'Curse', 'Sleep Talk'],
    });

    expect(p.name).toBe('Suicune');
    expect(p.type1).toBe('Water');
    expect(p.type2).toBe(undefined);
    expect(p.weight).toBe(187.0);
    expect(p.level).toBe(50);
    expect(p.gender).toBe('genderless');
    expect(p.item).toBe('Leftovers');
    expect(p.ability).toBe('Inner Focus');
    expect(p.nature).toBe('Bold');
    expect(p.status).toBe('Badly Poisoned');
    expect(p.toxicCounter).toBe(2);
    expect(p.curHP).toBe(60);

    expect(p.ivs).toEqual({hp: 31, atk: 31, def: 31, spa: 30, spd: 31, spe: 31});
    expect(p.evs).toEqual({hp: 252, atk: 0, def: 252, spa: 0, spd: 4, spe: 0});
    expect(p.boosts).toEqual({hp: 0, atk: -1, def: 0, spa: 2, spd: 1, spe: 0});
    expect(p.stats).toEqual({hp: 207, atk: 85, def: 183, spa: 110, spd: 136, spe: 105});

    expect(p.moves).toEqual(['Surf', 'Rest', 'Curse', 'Sleep Talk']);
  });

  test('gen1', () => {
    const p = new Pokemon(1, 'Tauros', {
      level: 100,
      ivs: {spc: 20, def: 16},
      evs: {atk: 200},
      curHP: 500,
    });

    // HP DV should be derived
    expect(p.ivs).toEqual({hp: 21, atk: 31, def: 16, spc: 20, spe: 31});
    expect(p.evs).toEqual({hp: 252, atk: 200, def: 252, spc: 252, spe: 252});
    expect(p.stats).toEqual({hp: 343, atk: 298, def: 274, spc: 228, spe: 318});

    // curHP capped to maxHP
    expect(p.curHP).toBe(p.maxHP());
  });

  test('getForme', () => {
    expect(Pokemon.getForme(1, 'Gengar')).toBe('Gengar');

    expect(Pokemon.getForme(7, 'Gengar', 'Black Sludge', 'Hypnosis')).toBe('Gengar');
    expect(Pokemon.getForme(7, 'Gengar', 'Gengarite', 'Hypnosis')).toBe('Gengar-Mega');

    expect(Pokemon.getForme(7, 'Charizard')).toBe('Charizard');
    expect(Pokemon.getForme(7, 'Charizard', 'Charizardite X')).toBe('Charizard-Mega-X');
    expect(Pokemon.getForme(7, 'Charizard', 'Charizardite Y')).toBe('Charizard-Mega-Y');
    expect(Pokemon.getForme(7, 'Mewtwo', 'Choice Specs', 'Psystrike')).toBe('Mewtwo');
    expect(Pokemon.getForme(7, 'Mewtwo', 'Mewtwonite X', 'Psystrike')).toBe('Mewtwo-Mega-X');
    expect(Pokemon.getForme(7, 'Mewtwo', 'Mewtwonite Y', 'Psystrike')).toBe('Mewtwo-Mega-Y');

    expect(Pokemon.getForme(7, 'Groudon', 'Choice Band', 'Earthquake')).toBe('Groudon');
    expect(Pokemon.getForme(7, 'Groudon', 'Red Orb', 'Earthquake')).toBe('Groudon-Primal');
    expect(Pokemon.getForme(7, 'Kyogre', 'Choice Specs', 'Surf')).toBe('Kyogre');
    expect(Pokemon.getForme(7, 'Kyogre', 'Blue Orb', 'Surf')).toBe('Kyogre-Primal');

    expect(Pokemon.getForme(7, 'Meloetta', 'Leftovers', 'Psychic')).toBe('Meloetta');
    expect(Pokemon.getForme(7, 'Meloetta', 'Leftovers', 'Relic Song')).toBe('Meloetta-Pirouette');
    expect(Pokemon.getForme(7, 'Rayquaza', undefined, 'Earthquake')).toBe('Rayquaza');
    expect(Pokemon.getForme(7, 'Rayquaza', undefined, 'Dragon Ascent')).toBe('Rayquaza-Mega');
  });

  test('hasType', () => {
    const p = new Pokemon(7, 'Gengar');
    expect(p.hasType('Ghost')).toBe(true);
    expect(p.hasType('Poison')).toBe(true);
    expect(p.hasType('Fire')).toBe(false);
    expect(p.hasType('Ice')).toBe(false);
  });
});
