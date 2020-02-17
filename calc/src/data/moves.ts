import {extend} from '../util';
import {Type} from './types';

export type Category = 'Physical' | 'Special' | 'Status';
export type Recoil = boolean | number | 'crash' | 'Struggle';

export interface MoveData {
  readonly bp: number;
  readonly type: Type;
  readonly category?: Category;
  readonly hasSecondaryEffect?: boolean;
  readonly isSpread?: boolean | 'allAdjacent';
  readonly makesContact?: boolean;
  readonly hasRecoil?: Recoil;
  readonly alwaysCrit?: boolean;
  readonly givesHealth?: boolean;
  readonly percentHealed?: number;
  readonly ignoresBurn?: boolean;
  readonly isPunch?: boolean;
  readonly isBite?: boolean;
  readonly isBullet?: boolean;
  readonly isSound?: boolean;
  readonly isPulse?: boolean;
  readonly hasPriority?: boolean;
  readonly dropsStats?: number;
  readonly ignoresDefenseBoosts?: boolean;
  readonly dealsPhysicalDamage?: boolean;
  readonly bypassesProtect?: boolean;
  readonly isZ?: boolean;
  readonly isMax?: boolean;
  readonly usesHighestAttackStat?: boolean;
  readonly zp?: number;
  readonly maxPower?: number;
  readonly isMultiHit?: boolean;
  readonly isTwoHit?: boolean;
}

const RBY: {
  [name: string]: MoveData;
} = {
  '(No Move)': {
    bp: 0,
    type: 'Normal',
    category: 'Physical',
  },
  Acid: {
    bp: 40,
    type: 'Poison',
    category: 'Special',
    maxPower: 70,
  },
  Agility: {
    bp: 0,
    type: 'Psychic',
  },
  Amnesia: {
    bp: 0,
    type: 'Psychic',
  },
  'Aurora Beam': {
    bp: 65,
    type: 'Ice',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 120,
  },
  Barrier: {
    bp: 0,
    type: 'Psychic',
  },
  Bind: {
    bp: 15,
    type: 'Normal',
    maxPower: 90,
  },
  Blizzard: {
    bp: 120,
    type: 'Ice',
    category: 'Special',
    hasSecondaryEffect: true,
    isSpread: true,
    maxPower: 140,
  },
  'Body Slam': {
    bp: 85,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Bone Club': {
    bp: 65,
    type: 'Ground',
    category: 'Physical',
    hasSecondaryEffect: true,
    maxPower: 120,
  },
  'Bubble Beam': {
    bp: 65,
    type: 'Water',
    category: 'Special',
    maxPower: 120,
  },
  Clamp: {
    bp: 35,
    type: 'Water',
    maxPower: 90,
  },
  Crabhammer: {
    bp: 90,
    type: 'Water',
    category: 'Physical',
    makesContact: true,
    alwaysCrit: true,
    maxPower: 130,
  },
  'Comet Punch': {
    bp: 18,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    isMultiHit: true,
    isPunch: true,
    maxPower: 100,
  },
  'Confuse Ray': {
    bp: 0,
    type: 'Ghost',
  },
  Conversion: {
    bp: 0,
    type: 'Normal',
  },
  'Defense Curl': {
    bp: 0,
    type: 'Normal',
  },
  Dig: {
    bp: 100,
    type: 'Ground',
    makesContact: true,
    maxPower: 130,
  },
  Disable: {
    bp: 0,
    type: 'Normal',
  },
  'Double Kick': {
    bp: 30,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    isTwoHit: true,
    maxPower: 80,
  },
  'Double-Edge': {
    bp: 100,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    hasRecoil: 25,
    maxPower: 140,
  },
  'Double Team': {
    bp: 0,
    type: 'Normal',
  },
  'Dream Eater': {
    bp: 100,
    type: 'Psychic',
    category: 'Special',
    givesHealth: true,
    percentHealed: 0.5,
    maxPower: 130,
  },
  'Drill Peck': {
    bp: 80,
    type: 'Flying',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  Earthquake: {
    bp: 100,
    type: 'Ground',
    category: 'Physical',
    isSpread: 'allAdjacent',
    maxPower: 130,
  },
  Explosion: {
    bp: 170,
    type: 'Normal',
    category: 'Physical',
    isSpread: 'allAdjacent',
    maxPower: 150,
  },
  'Fire Blast': {
    bp: 120,
    type: 'Fire',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 140,
  },
  'Fire Punch': {
    bp: 75,
    type: 'Fire',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isPunch: true,
    maxPower: 130,
  },
  'Fire Spin': {
    bp: 15,
    type: 'Fire',
    category: 'Special',
    maxPower: 90,
  },
  Flamethrower: {
    bp: 95,
    type: 'Fire',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  Fly: {
    bp: 70,
    type: 'Flying',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Fury Swipes': {
    bp: 18,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    isMultiHit: true,
    maxPower: 100,
  },
  Glare: {
    bp: 0,
    type: 'Normal',
  },
  Gust: {
    bp: 40,
    type: 'Normal',
    category: 'Special',
    maxPower: 90,
  },
  Haze: {
    bp: 0,
    type: 'Ice',
  },
  'High Jump Kick': {
    bp: 85,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    hasRecoil: 'crash',
    maxPower: 95,
  },
  'Hydro Pump': {
    bp: 120,
    type: 'Water',
    category: 'Special',
    maxPower: 140,
  },
  'Hyper Beam': {
    bp: 150,
    type: 'Normal',
    category: 'Special',
    maxPower: 150,
  },
  'Hyper Fang': {
    bp: 80,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isBite: true,
    maxPower: 130,
  },
  'Ice Beam': {
    bp: 95,
    type: 'Ice',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Ice Punch': {
    bp: 75,
    type: 'Ice',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isPunch: true,
    maxPower: 130,
  },
  'Jump Kick': {
    bp: 70,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    hasRecoil: 'crash',
    maxPower: 90,
  },
  'Leech Life': {
    bp: 20,
    type: 'Bug',
    category: 'Physical',
    makesContact: true,
    givesHealth: true,
    percentHealed: 0.5,
    maxPower: 130,
  },
  'Leech Seed': {
    bp: 0,
    type: 'Grass',
  },
  'Light Screen': {
    bp: 0,
    type: 'Psychic',
  },
  'Lovely Kiss': {
    bp: 0,
    type: 'Normal',
  },
  'Mega Drain': {
    bp: 40,
    type: 'Grass',
    givesHealth: true,
    percentHealed: 0.5,
    maxPower: 90,
  },
  'Mirror Move': {
    bp: 0,
    type: 'Flying',
  },
  'Night Shade': {
    bp: 100,
    type: 'Ghost',
    category: 'Special',
    maxPower: 100,
  },
  'Pin Missile': {
    bp: 14,
    type: 'Bug',
    category: 'Physical',
    isMultiHit: true,
    maxPower: 130,
  },
  Psychic: {
    bp: 90,
    type: 'Psychic',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Quick Attack': {
    bp: 40,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    hasPriority: true,
    maxPower: 90,
  },
  'Razor Leaf': {
    bp: 55,
    type: 'Grass',
    category: 'Physical',
    alwaysCrit: true,
    maxPower: 110,
  },
  Recover: {
    bp: 0,
    type: 'Normal',
  },
  Reflect: {
    bp: 0,
    type: 'Psychic',
  },
  Rest: {
    bp: 0,
    type: 'Psychic',
  },
  Roar: {
    bp: 0,
    type: 'Normal',
  },
  'Rock Slide': {
    bp: 75,
    type: 'Rock',
    category: 'Physical',
    hasSecondaryEffect: true,
    isSpread: true,
    maxPower: 130,
  },
  'Rock Throw': {
    bp: 50,
    type: 'Rock',
    category: 'Physical',
    maxPower: 100,
  },
  'Seismic Toss': {
    bp: 100,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    maxPower: 75,
  },
  'Self-Destruct': {
    bp: 130,
    type: 'Normal',
    category: 'Physical',
    isSpread: 'allAdjacent',
    maxPower: 150,
  },
  Sing: {
    bp: 0,
    type: 'Normal',
  },
  'Sky Attack': {
    bp: 140,
    type: 'Flying',
    category: 'Physical',
    hasSecondaryEffect: true,
    maxPower: 140,
  },
  'Skull Bash': {
    bp: 100,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 140,
  },
  Slash: {
    bp: 70,
    type: 'Normal',
    alwaysCrit: true,
    makesContact: true,
    maxPower: 120,
  },
  'Sleep Powder': {
    bp: 0,
    type: 'Grass',
  },
  Sludge: {
    bp: 65,
    type: 'Poison',
    category: 'Special',
    maxPower: 85,
  },
  'Soft-Boiled': {
    bp: 0,
    type: 'Normal',
  },
  Spore: {
    bp: 0,
    type: 'Grass',
  },
  Struggle: {
    bp: 50,
    type: 'Normal',
    category: 'Physical',
    hasRecoil: 50,
    maxPower: 100,
  },
  'Stun Spore': {
    bp: 0,
    type: 'Grass',
  },
  Submission: {
    bp: 80,
    type: 'Fighting',
    makesContact: true,
    hasRecoil: 25,
    maxPower: 90,
  },
  Substitute: {
    bp: 0,
    type: 'Normal',
  },
  'Super Fang': {
    bp: 0,
    type: 'Normal',
    makesContact: true,
    maxPower: 100,
  },
  Surf: {
    bp: 95,
    type: 'Water',
    category: 'Special',
    isSpread: true,
    maxPower: 130,
  },
  Swift: {
    bp: 60,
    type: 'Normal',
    category: 'Special',
    isSpread: true,
    maxPower: 110,
  },
  'Swords Dance': {
    bp: 0,
    type: 'Normal',
  },
  Tackle: {
    bp: 35,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 90,
  },
  'Take Down': {
    bp: 90,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    hasRecoil: 25,
    maxPower: 130,
  },
  Thrash: {
    bp: 90,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 140,
  },
  Thunder: {
    bp: 120,
    type: 'Electric',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 140,
  },
  Thunderbolt: {
    bp: 95,
    type: 'Electric',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Thunder Punch': {
    bp: 75,
    type: 'Electric',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isPunch: true,
    maxPower: 130,
  },
  'Thunder Wave': {
    bp: 0,
    type: 'Electric',
  },
  Toxic: {
    bp: 0,
    type: 'Poison',
  },
  'Tri Attack': {
    bp: 80,
    type: 'Normal',
    category: 'Special',
    maxPower: 130,
  },
  Twineedle: {
    bp: 25,
    type: 'Bug',
    isTwoHit: true,
    maxPower: 100,
  },
  Waterfall: {
    bp: 80,
    type: 'Water',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Water Gun': {
    bp: 40,
    type: 'Water',
    category: 'Special',
    maxPower: 90,
  },
  'Wing Attack': {
    bp: 35,
    type: 'Flying',
    category: 'Physical',
    makesContact: true,
    maxPower: 110,
  },
  Wrap: {
    bp: 15,
    type: 'Normal',
    maxPower: 90,
  },
  Whirlwind: {
    bp: 0,
    type: 'Normal',
  },
};

const GSC: {
  [name: string]: MoveData;
} = extend(true, {}, RBY, {
  Aeroblast: {
    bp: 100,
    type: 'Flying',
    category: 'Special',
    maxPower: 130,
  },
  'Ancient Power': {
    bp: 60,
    type: 'Rock',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 110,
  },
  'Baton Pass': {
    bp: 0,
    type: 'Normal',
  },
  'Belly Drum': {
    bp: 0,
    type: 'Normal',
  },
  Bite: {
    bp: 60,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isBite: true,
    maxPower: 110,
  },
  'Bone Rush': {
    bp: 25,
    type: 'Ground',
    category: 'Physical',
    isMultiHit: true,
    maxPower: 130,
  },
  'Conversion 2': {
    bp: 0,
    type: 'Normal',
  },
  Crabhammer: {
    alwaysCrit: false,
    maxPower: 130,
  },
  'Cross Chop': {
    bp: 100,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    maxPower: 90,
  },
  Crunch: {
    bp: 80,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isBite: true,
    maxPower: 130,
  },
  Curse: {
    bp: 0,
    type: 'Ghost',
  },
  'Destiny Bond': {
    bp: 0,
    type: 'Ghost',
  },
  Dig: {
    bp: 60,
    maxPower: 130,
  },
  'Double-Edge': {
    bp: 120,
    maxPower: 140,
  },
  'Dynamic Punch': {
    bp: 100,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isPunch: true,
    maxPower: 90,
  },
  Encore: {
    bp: 0,
    type: 'Normal',
  },
  Endure: {
    bp: 0,
    type: 'Normal',
  },
  Explosion: {
    bp: 250,
    maxPower: 150,
  },
  'Extreme Speed': {
    bp: 80,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    hasPriority: true,
    maxPower: 130,
  },
  'Feint Attack': {
    bp: 60,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    maxPower: 110,
  },
  Flail: {
    bp: 1,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Flame Wheel': {
    bp: 60,
    type: 'Fire',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 110,
  },
  Frustration: {
    bp: 102,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Future Sight': {
    bp: 80,
    type: 'None',
    category: 'Special',
    maxPower: 140,
  },
  'Giga Drain': {
    bp: 60,
    type: 'Grass',
    category: 'Special',
    givesHealth: true,
    percentHealed: 0.5,
    maxPower: 130,
  },
  Gust: {
    type: 'Flying',
    maxPower: 90,
  },
  Headbutt: {
    bp: 70,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 120,
  },
  'Heal Bell': {
    bp: 0,
    type: 'Normal',
  },
  'Hidden Power Bug': {
    bp: 70,
    type: 'Bug',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Dark': {
    bp: 70,
    type: 'Dark',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Dragon': {
    bp: 70,
    type: 'Dragon',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Electric': {
    bp: 70,
    type: 'Electric',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Fighting': {
    bp: 70,
    type: 'Fighting',
    category: 'Special',
    maxPower: 80,
  },
  'Hidden Power Fire': {
    bp: 70,
    type: 'Fire',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Flying': {
    bp: 70,
    type: 'Flying',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Ghost': {
    bp: 70,
    type: 'Ghost',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Grass': {
    bp: 70,
    type: 'Grass',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Ground': {
    bp: 70,
    type: 'Ground',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Ice': {
    bp: 70,
    type: 'Ice',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Poison': {
    bp: 70,
    type: 'Poison',
    category: 'Special',
    maxPower: 80,
  },
  'Hidden Power Psychic': {
    bp: 70,
    type: 'Psychic',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Rock': {
    bp: 70,
    type: 'Rock',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Steel': {
    bp: 70,
    type: 'Steel',
    category: 'Special',
    maxPower: 110,
  },
  'Hidden Power Water': {
    bp: 70,
    type: 'Water',
    category: 'Special',
    maxPower: 110,
  },
  'Icy Wind': {
    bp: 55,
    type: 'Ice',
    category: 'Special',
    hasSecondaryEffect: true,
    isSpread: true,
    maxPower: 110,
  },
  'Iron Tail': {
    bp: 100,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Mach Punch': {
    bp: 40,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    isPunch: true,
    hasPriority: true,
    maxPower: 70,
  },
  Megahorn: {
    bp: 120,
    type: 'Bug',
    category: 'Physical',
    makesContact: true,
    maxPower: 140,
  },
  'Metal Claw': {
    bp: 50,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 100,
  },
  'Milk Drink': {
    bp: 0,
    type: 'Normal',
  },
  'Morning Sun': {
    bp: 0,
    type: 'Normal',
    category: 'Special',
  },
  Moonlight: {
    bp: 0,
    type: 'Normal',
  },
  Present: {
    bp: 40,
    type: 'Normal',
    category: 'Physical',
    maxPower: 100,
  },
  Protect: {
    bp: 0,
    type: 'Normal',
  },
  Pursuit: {
    bp: 40,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    maxPower: 90,
  },
  'Rapid Spin': {
    bp: 20,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 100,
  },
  'Razor Leaf': {
    alwaysCrit: false,
    maxPower: 110,
  },
  Return: {
    bp: 102,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  Reversal: {
    bp: 1,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    maxPower: 100,
  },
  'Rock Smash': {
    bp: 20,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 70,
  },
  'Sacred Fire': {
    bp: 100,
    type: 'Fire',
    category: 'Physical',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Self-Destruct': {
    bp: 200,
    maxPower: 150,
  },
  'Shadow Ball': {
    bp: 80,
    type: 'Ghost',
    category: 'Special',
    hasSecondaryEffect: true,
    isBullet: true,
    maxPower: 130,
  },
  Slash: {
    alwaysCrit: false,
    maxPower: 120,
  },
  'Sleep Talk': {
    bp: 0,
    type: 'Normal',
  },
  'Sludge Bomb': {
    bp: 90,
    type: 'Poison',
    category: 'Special',
    hasSecondaryEffect: true,
    isBullet: true,
    maxPower: 90,
  },
  'Solar Beam': {
    bp: 120,
    type: 'Grass',
    category: 'Special',
    maxPower: 140,
  },
  Spark: {
    bp: 65,
    type: 'Electric',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 120,
  },
  Spikes: {
    bp: 0,
    type: 'Ground',
  },
  'Steel Wing': {
    bp: 70,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 120,
  },
  Struggle: {
    type: 'None',
    hasRecoil: 25,
    maxPower: 100,
  },
  'Sunny Day': {
    bp: 0,
    type: 'Fire',
  },
  Swagger: {
    bp: 0,
    type: 'Normal',
  },
  Synthesis: {
    bp: 0,
    type: 'Grass',
  },
  Thief: {
    bp: 40,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    maxPower: 110,
  },
  'Tri Attack': {
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  Whirlpool: {
    bp: 15,
    type: 'Water',
    category: 'Special',
    maxPower: 90,
  },
  'Wing Attack': {
    bp: 60,
    maxPower: 110,
  },
  'Zap Cannon': {
    bp: 100,
    type: 'Electric',
    category: 'Special',
    hasSecondaryEffect: true,
    isBullet: true,
    maxPower: 140,
  },
});

delete GSC['Acid'];
delete GSC['Mega Drain'];

const ADV: {
  [name: string]: MoveData;
} = extend(true, {}, GSC, {
  'Aerial Ace': {
    bp: 60,
    type: 'Flying',
    category: 'Physical',
    makesContact: true,
    maxPower: 110,
  },
  'Air Cutter': {
    bp: 55,
    type: 'Flying',
    category: 'Special',
    isSpread: true,
    maxPower: 110,
  },
  Astonish: {
    bp: 30,
    type: 'Ghost',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 90,
  },
  Aromatherapy: {
    bp: 0,
    type: 'Grass',
  },
  'Blast Burn': {
    bp: 150,
    type: 'Fire',
    category: 'Special',
    maxPower: 150,
  },
  'Blaze Kick': {
    bp: 85,
    type: 'Fire',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  Bonemerang: {
    bp: 50,
    type: 'Ground',
    category: 'Physical',
    isTwoHit: true,
    maxPower: 130,
  },
  Bounce: {
    bp: 85,
    type: 'Flying',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Brick Break': {
    bp: 75,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    maxPower: 90,
  },
  'Bulk Up': {
    bp: 0,
    type: 'Fighting',
  },
  'Bullet Seed': {
    bp: 10,
    type: 'Grass',
    category: 'Physical',
    isMultiHit: true,
    isBullet: true,
    maxPower: 130,
  },
  'Calm Mind': {
    bp: 0,
    type: 'Psychic',
  },
  Covet: {
    bp: 40,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 110,
  },
  'Crush Claw': {
    bp: 75,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  Dive: {
    bp: 60,
    type: 'Water',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Doom Desire': {
    bp: 120,
    type: 'None',
    category: 'Special',
    maxPower: 140,
  },
  'Dragon Claw': {
    bp: 80,
    type: 'Dragon',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Dragon Dance': {
    bp: 0,
    type: 'Dragon',
  },
  'Double-Edge': {
    hasRecoil: 33,
    maxPower: 140,
  },
  Endeavor: {
    bp: 1,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  Eruption: {
    bp: 150,
    type: 'Fire',
    category: 'Special',
    isSpread: true,
    maxPower: 150,
  },
  Extrasensory: {
    bp: 80,
    type: 'Psychic',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  Facade: {
    bp: 70,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 120,
  },
  'Fake Out': {
    bp: 40,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    hasPriority: true,
    maxPower: 90,
  },
  'Focus Punch': {
    bp: 150,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    isPunch: true,
    maxPower: 100,
  },
  'Frenzy Plant': {
    bp: 150,
    type: 'Grass',
    category: 'Special',
    maxPower: 150,
  },
  'Heat Wave': {
    bp: 100,
    type: 'Fire',
    category: 'Special',
    hasSecondaryEffect: true,
    isSpread: true,
    maxPower: 130,
  },
  'Helping Hand': {
    bp: 0,
    type: 'Normal',
  },
  'Hydro Cannon': {
    bp: 150,
    type: 'Water',
    category: 'Special',
    maxPower: 150,
  },
  'Hyper Voice': {
    bp: 90,
    type: 'Normal',
    category: 'Special',
    isSound: true,
    isSpread: true,
    maxPower: 130,
  },
  'Icicle Spear': {
    bp: 10,
    type: 'Ice',
    category: 'Physical',
    isMultiHit: true,
    maxPower: 130,
  },
  Ingrain: {
    bp: 0,
    type: 'Grass',
  },
  'Iron Defense': {
    bp: 0,
    type: 'Steel',
  },
  'Knock Off': {
    bp: 20,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    maxPower: 120,
  },
  'Leaf Blade': {
    bp: 70,
    type: 'Grass',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Luster Purge': {
    bp: 70,
    type: 'Psychic',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 120,
  },
  'Low Kick': {
    bp: 1,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    maxPower: 100,
  },
  'Magical Leaf': {
    bp: 60,
    type: 'Grass',
    category: 'Special',
    maxPower: 110,
  },
  'Magic Coat': {
    bp: 0,
    type: 'Psychic',
  },
  'Meteor Mash': {
    bp: 100,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isPunch: true,
    maxPower: 130,
  },
  'Mist Ball': {
    bp: 70,
    type: 'Psychic',
    category: 'Special',
    hasSecondaryEffect: true,
    isBullet: true,
    maxPower: 120,
  },
  'Mud Shot': {
    bp: 55,
    type: 'Ground',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 110,
  },
  'Muddy Water': {
    bp: 95,
    type: 'Water',
    category: 'Special',
    hasSecondaryEffect: true,
    isSpread: true,
    maxPower: 130,
  },
  'Needle Arm': {
    bp: 60,
    type: 'Grass',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 110,
  },
  Overheat: {
    bp: 140,
    type: 'Fire',
    category: 'Special',
    dropsStats: 2,
    maxPower: 140,
  },
  'Poison Fang': {
    bp: 50,
    type: 'Poison',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isBite: true,
    maxPower: 75,
  },
  'Poison Tail': {
    bp: 50,
    type: 'Poison',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 75,
  },
  'Psycho Boost': {
    bp: 140,
    type: 'Psychic',
    category: 'Special',
    dropsStats: 2,
    maxPower: 140,
  },
  Recycle: {
    bp: 0,
    type: 'Normal',
  },
  Refresh: {
    bp: 0,
    type: 'Normal',
  },
  Revenge: {
    bp: 120,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    maxPower: 80,
  },
  'Rock Blast': {
    bp: 25,
    type: 'Rock',
    category: 'Physical',
    isMultiHit: true,
    maxPower: 130,
  },
  'Rock Tomb': {
    bp: 50,
    type: 'Rock',
    category: 'Physical',
    hasSecondaryEffect: true,
    maxPower: 110,
  },
  'Sand Tomb': {
    bp: 15,
    type: 'Ground',
    category: 'Physical',
    maxPower: 90,
  },
  'Secret Power': {
    bp: 70,
    type: 'Normal',
    category: 'Physical',
    hasSecondaryEffect: true,
    maxPower: 120,
  },
  'Shadow Punch': {
    bp: 60,
    type: 'Ghost',
    category: 'Physical',
    makesContact: true,
    isPunch: true,
    maxPower: 110,
  },
  'Sheer Cold': {
    bp: 1,
    type: 'Ice',
    category: 'Special',
    maxPower: 130,
  },
  'Shock Wave': {
    bp: 60,
    type: 'Electric',
    category: 'Special',
    maxPower: 110,
  },
  'Signal Beam': {
    bp: 75,
    type: 'Bug',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Silver Wind': {
    bp: 60,
    type: 'Bug',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 110,
  },
  'Sky Uppercut': {
    bp: 85,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    isPunch: true,
    maxPower: 90,
  },
  'Slack Off': {
    bp: 0,
    type: 'Normal',
  },
  Stockpile: {
    bp: 0,
    type: 'Normal',
  },
  Superpower: {
    bp: 120,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    dropsStats: 1,
    maxPower: 95,
  },
  'Tail Glow': {
    bp: 0,
    type: 'Bug',
  },
  Taunt: {
    bp: 0,
    type: 'Dark',
  },
  Trick: {
    bp: 0,
    type: 'Psychic',
  },
  Uproar: {
    bp: 50,
    type: 'Normal',
    category: 'Special',
    maxPower: 130,
  },
  'Volt Tackle': {
    bp: 120,
    type: 'Electric',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    hasRecoil: 33,
    maxPower: 140,
  },
  'Water Pulse': {
    bp: 60,
    type: 'Water',
    category: 'Special',
    hasSecondaryEffect: true,
    isPulse: true,
    maxPower: 110,
  },
  'Water Spout': {
    bp: 150,
    type: 'Water',
    category: 'Special',
    isSpread: true,
    maxPower: 150,
  },
  'Weather Ball': {
    bp: 50,
    type: 'Normal',
    category: 'Special',
    isBullet: true,
    maxPower: 130,
  },
  'Will-O-Wisp': {
    bp: 0,
    type: 'Fire',
  },
  Wish: {
    bp: 0,
    type: 'Normal',
  },
  Yawn: {
    bp: 0,
    type: 'Normal',
  },
});

const DPP: {
  [name: string]: MoveData;
} = extend(true, {}, ADV, {
  'Air Slash': {
    bp: 75,
    type: 'Flying',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Aqua Jet': {
    bp: 40,
    type: 'Water',
    category: 'Physical',
    makesContact: true,
    hasPriority: true,
    maxPower: 90,
  },
  'Aqua Tail': {
    bp: 90,
    type: 'Water',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Aqua Ring': {
    bp: 0,
    type: 'Water',
  },
  Assurance: {
    bp: 50,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    maxPower: 110,
  },
  'Attack Order': {
    bp: 90,
    type: 'Bug',
    category: 'Physical',
    maxPower: 130,
  },
  'Aura Sphere': {
    bp: 90,
    type: 'Fighting',
    category: 'Special',
    isBullet: true,
    isPulse: true,
    maxPower: 90,
  },
  Avalanche: {
    bp: 120,
    type: 'Ice',
    category: 'Physical',
    makesContact: true,
    maxPower: 110,
  },
  'Brave Bird': {
    bp: 120,
    type: 'Flying',
    category: 'Physical',
    makesContact: true,
    hasRecoil: 33,
    maxPower: 140,
  },
  Brine: {
    bp: 65,
    type: 'Water',
    category: 'Special',
    maxPower: 120,
  },
  'Bug Bite': {
    bp: 60,
    type: 'Bug',
    category: 'Physical',
    makesContact: true,
    maxPower: 110,
  },
  'Bug Buzz': {
    bp: 90,
    type: 'Bug',
    category: 'Special',
    hasSecondaryEffect: true,
    isSound: true,
    maxPower: 130,
  },
  'Bullet Punch': {
    bp: 40,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    isPunch: true,
    hasPriority: true,
    maxPower: 90,
  },
  'Charge Beam': {
    bp: 50,
    type: 'Electric',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 100,
  },
  Chatter: {
    bp: 60,
    type: 'Flying',
    category: 'Special',
    hasSecondaryEffect: true,
    isSound: true,
    maxPower: 120,
  },
  'Close Combat': {
    bp: 120,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    maxPower: 95,
  },
  Covet: {
    bp: 60,
    maxPower: 110,
  },
  'Cross Poison': {
    bp: 70,
    type: 'Poison',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 85,
  },
  'Crush Grip': {
    bp: 1,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 140,
  },
  'Dark Pulse': {
    bp: 80,
    type: 'Dark',
    category: 'Special',
    hasSecondaryEffect: true,
    isPulse: true,
    maxPower: 130,
  },
  'Dark Void': {
    bp: 0,
    type: 'Dark',
  },
  'Defend Order': {
    bp: 0,
    type: 'Bug',
  },
  Defog: {
    bp: 0,
    type: 'Flying',
  },
  Dig: {
    bp: 80,
    maxPower: 130,
  },
  Discharge: {
    bp: 80,
    type: 'Electric',
    category: 'Special',
    hasSecondaryEffect: true,
    isSpread: 'allAdjacent',
    maxPower: 130,
  },
  Dive: {
    bp: 80,
    maxPower: 130,
  },
  'Double Hit': {
    bp: 35,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    isTwoHit: true,
    maxPower: 120,
  },
  'Draco Meteor': {
    bp: 140,
    type: 'Dragon',
    category: 'Special',
    dropsStats: 2,
    maxPower: 140,
  },
  'Dragon Pulse': {
    bp: 90,
    type: 'Dragon',
    category: 'Special',
    isPulse: true,
    maxPower: 130,
  },
  'Dragon Rush': {
    bp: 100,
    type: 'Dragon',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Drain Punch': {
    bp: 60,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    isPunch: true,
    givesHealth: true,
    percentHealed: 0.5,
    maxPower: 90,
  },
  'Earth Power': {
    bp: 90,
    type: 'Ground',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Energy Ball': {
    bp: 80,
    type: 'Grass',
    category: 'Special',
    hasSecondaryEffect: true,
    isBullet: true,
    maxPower: 130,
  },
  Feint: {
    bp: 50,
    type: 'Normal',
    category: 'Physical',
    bypassesProtect: true,
    maxPower: 90,
  },
  'Fire Fang': {
    bp: 65,
    type: 'Fire',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isBite: true,
    maxPower: 120,
  },
  'Flare Blitz': {
    bp: 120,
    type: 'Fire',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    hasRecoil: 33,
    maxPower: 140,
  },
  'Flash Cannon': {
    bp: 80,
    type: 'Steel',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  Fling: {
    bp: 1,
    type: 'Dark',
    category: 'Physical',
    maxPower: 100,
  },
  Fly: {
    bp: 90,
    maxPower: 130,
  },
  'Focus Blast': {
    bp: 120,
    type: 'Fighting',
    category: 'Special',
    hasSecondaryEffect: true,
    isBullet: true,
    maxPower: 95,
  },
  'Force Palm': {
    bp: 60,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 80,
  },
  'Giga Impact': {
    bp: 150,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 150,
  },
  'Grass Knot': {
    bp: 1,
    type: 'Grass',
    category: 'Special',
    makesContact: true,
    maxPower: 130,
  },
  'Gunk Shot': {
    bp: 120,
    type: 'Poison',
    category: 'Physical',
    hasSecondaryEffect: true,
    maxPower: 95,
  },
  'Gyro Ball': {
    bp: 1,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    isBullet: true,
    maxPower: 130,
  },
  'Hammer Arm': {
    bp: 100,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    isPunch: true,
    maxPower: 90,
  },
  'Head Smash': {
    bp: 150,
    type: 'Rock',
    category: 'Physical',
    makesContact: true,
    hasRecoil: 50,
    maxPower: 150,
  },
  'Heal Order': {
    bp: 0,
    type: 'Bug',
  },
  'Healing Wish': {
    bp: 0,
    type: 'Psychic',
  },
  'High Jump Kick': {
    bp: 100,
    maxPower: 95,
  },
  'Ice Fang': {
    bp: 65,
    type: 'Ice',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isBite: true,
    maxPower: 120,
  },
  'Ice Shard': {
    bp: 40,
    type: 'Ice',
    category: 'Physical',
    hasPriority: true,
    maxPower: 90,
  },
  'Iron Head': {
    bp: 80,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  Judgment: {
    bp: 100,
    type: 'Normal',
    category: 'Special',
    maxPower: 130,
  },
  'Jump Kick': {
    bp: 85,
    maxPower: 90,
  },
  'Last Resort': {
    bp: 130,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 140,
  },
  'Lava Plume': {
    bp: 80,
    type: 'Fire',
    category: 'Special',
    hasSecondaryEffect: true,
    isSpread: 'allAdjacent',
    maxPower: 130,
  },
  'Leaf Blade': {
    bp: 90,
    maxPower: 130,
  },
  'Leaf Storm': {
    bp: 140,
    type: 'Grass',
    category: 'Special',
    dropsStats: 2,
    maxPower: 140,
  },
  'Lunar Dance': {
    bp: 0,
    type: 'Psychic',
  },
  'Magma Storm': {
    bp: 120,
    type: 'Fire',
    category: 'Special',
    maxPower: 130,
  },
  'Magnet Bomb': {
    bp: 60,
    type: 'Steel',
    category: 'Physical',
    isBullet: true,
    maxPower: 110,
  },
  'Magnet Rise': {
    bp: 0,
    type: 'Electric',
  },
  'Me First': {
    bp: 0,
    type: 'Normal',
  },
  'Mirror Shot': {
    bp: 65,
    type: 'Steel',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 120,
  },
  'Mud Bomb': {
    bp: 65,
    type: 'Ground',
    category: 'Special',
    isBullet: true,
    hasSecondaryEffect: true,
    maxPower: 120,
  },
  'Natural Gift': {
    bp: 1,
    type: 'Normal',
    category: 'Physical',
    maxPower: 130,
  },
  'Nature Power': {
    bp: 80,
    type: 'Normal',
    category: 'Special',
    hasSecondaryEffect: true,
  },
  'Nasty Plot': {
    bp: 0,
    type: 'Dark',
  },
  'Night Slash': {
    bp: 70,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    maxPower: 120,
  },
  'Ominous Wind': {
    bp: 60,
    type: 'Ghost',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 110,
  },
  Outrage: {
    bp: 120,
    type: 'Dragon',
    category: 'Physical',
    makesContact: true,
    maxPower: 140,
  },
  'Paleo Wave': {
    bp: 85,
    type: 'Rock',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  Payback: {
    bp: 50,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    maxPower: 100,
  },
  Pluck: {
    bp: 60,
    type: 'Flying',
    category: 'Physical',
    makesContact: true,
    maxPower: 110,
  },
  'Poison Jab': {
    bp: 80,
    type: 'Poison',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 90,
  },
  'Power Gem': {
    bp: 70,
    type: 'Rock',
    category: 'Special',
    maxPower: 130,
  },
  'Power Whip': {
    bp: 120,
    type: 'Grass',
    category: 'Physical',
    makesContact: true,
    maxPower: 140,
  },
  'Psycho Cut': {
    bp: 70,
    type: 'Psychic',
    category: 'Physical',
    maxPower: 120,
  },
  'Psycho Shift': {
    bp: 0,
    type: 'Psychic',
  },
  Punishment: {
    bp: 60,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Roar of Time': {
    bp: 150,
    type: 'Dragon',
    category: 'Special',
    maxPower: 150,
  },
  'Rock Climb': {
    bp: 90,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Rock Smash': {
    bp: 40,
    maxPower: 70,
  },
  'Rock Polish': {
    bp: 0,
    type: 'Rock',
  },
  'Rock Wrecker': {
    bp: 150,
    type: 'Rock',
    category: 'Physical',
    isBullet: true,
    maxPower: 150,
  },
  Roost: {
    bp: 0,
    type: 'Flying',
  },
  'Seed Bomb': {
    bp: 80,
    type: 'Grass',
    category: 'Physical',
    isBullet: true,
    maxPower: 130,
  },
  'Seed Flare': {
    bp: 120,
    type: 'Grass',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 140,
  },
  'Shadow Claw': {
    bp: 70,
    type: 'Ghost',
    category: 'Physical',
    makesContact: true,
    maxPower: 120,
  },
  'Shadow Force': {
    bp: 120,
    type: 'Ghost',
    category: 'Physical',
    makesContact: true,
    bypassesProtect: true,
    maxPower: 140,
  },
  'Shadow Sneak': {
    bp: 40,
    type: 'Ghost',
    category: 'Physical',
    makesContact: true,
    hasPriority: true,
    maxPower: 90,
  },
  'Shadow Strike': {
    bp: 80,
    type: 'Ghost',
    category: 'Physical',
    hasSecondaryEffect: true,
    makesContact: true,
    maxPower: 130,
  },
  'Spacial Rend': {
    bp: 100,
    type: 'Dragon',
    category: 'Special',
    maxPower: 130,
  },
  'Stealth Rock': {
    bp: 0,
    type: 'Rock',
  },
  'Stone Edge': {
    bp: 100,
    type: 'Rock',
    category: 'Physical',
    maxPower: 130,
  },
  Struggle: {
    hasRecoil: 'Struggle',
    maxPower: 100,
  },
  'Sucker Punch': {
    bp: 80,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    hasPriority: true,
    maxPower: 120,
  },
  Surf: {
    isSpread: 'allAdjacent',
    maxPower: 130,
  },
  Switcheroo: {
    bp: 0,
    type: 'Dark',
  },
  Tailwind: {
    bp: 0,
    type: 'Flying',
  },
  'Thunder Fang': {
    bp: 65,
    type: 'Electric',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isBite: true,
    maxPower: 120,
  },
  'Toxic Spikes': {
    bp: 0,
    type: 'Poison',
  },
  'Trick Room': {
    bp: 0,
    type: 'Psychic',
  },
  'U-turn': {
    bp: 70,
    type: 'Bug',
    category: 'Physical',
    makesContact: true,
    maxPower: 120,
  },
  'Vacuum Wave': {
    bp: 40,
    type: 'Fighting',
    category: 'Special',
    hasPriority: true,
    maxPower: 70,
  },
  'Wake-Up Slap': {
    bp: 60,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    maxPower: 85,
  },
  Waterfall: {
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Wood Hammer': {
    bp: 120,
    type: 'Grass',
    category: 'Physical',
    makesContact: true,
    hasRecoil: 33,
    maxPower: 140,
  },
  'Wring Out': {
    bp: 1,
    type: 'Normal',
    category: 'Special',
    makesContact: true,
    maxPower: 140,
  },
  'X-Scissor': {
    bp: 80,
    type: 'Bug',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Zap Cannon': {
    bp: 120,
    maxPower: 140,
  },
  'Zen Headbutt': {
    bp: 80,
    type: 'Psychic',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 130,
  },
});

const BW: {
  [name: string]: MoveData;
} = extend(true, {}, DPP, {
  'Acid Spray': {
    bp: 40,
    type: 'Poison',
    category: 'Special',
    hasSecondaryEffect: true,
    isBullet: true,
    maxPower: 70,
  },
  Acrobatics: {
    bp: 55,
    type: 'Flying',
    category: 'Physical',
    makesContact: true,
    maxPower: 110,
  },
  Autotomize: {
    bp: 0,
    type: 'Steel',
  },
  'Blue Flare': {
    bp: 130,
    type: 'Fire',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 140,
  },
  'Bolt Strike': {
    bp: 130,
    type: 'Electric',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 140,
  },
  Bulldoze: {
    bp: 60,
    type: 'Ground',
    category: 'Physical',
    hasSecondaryEffect: true,
    isSpread: 'allAdjacent',
    maxPower: 110,
  },
  'Bullet Seed': {
    bp: 25,
    maxPower: 130,
  },
  'Chip Away': {
    bp: 70,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    ignoresDefenseBoosts: true,
    maxPower: 120,
  },
  'Circle Throw': {
    bp: 60,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    maxPower: 80,
  },
  'Clear Smog': {
    bp: 50,
    type: 'Poison',
    category: 'Special',
    maxPower: 75,
  },
  Coil: {
    bp: 0,
    type: 'Poison',
  },
  'Cotton Guard': {
    bp: 0,
    type: 'Grass',
  },
  'Doom Desire': {
    bp: 140,
    type: 'Steel',
    maxPower: 140,
  },
  'Dragon Tail': {
    bp: 60,
    type: 'Dragon',
    category: 'Physical',
    makesContact: true,
    maxPower: 110,
  },
  'Drain Punch': {
    bp: 75,
    maxPower: 90,
  },
  'Drill Run': {
    bp: 80,
    type: 'Ground',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Dual Chop': {
    bp: 40,
    type: 'Dragon',
    category: 'Physical',
    makesContact: true,
    isTwoHit: true,
    maxPower: 130,
  },
  'Electro Ball': {
    bp: 1,
    type: 'Electric',
    category: 'Special',
    isBullet: true,
    maxPower: 130,
  },
  Electroweb: {
    bp: 55,
    type: 'Electric',
    category: 'Special',
    hasSecondaryEffect: true,
    isSpread: true,
    maxPower: 110,
  },
  Feint: {
    bp: 30,
    maxPower: 90,
  },
  'Fiery Dance': {
    bp: 80,
    type: 'Fire',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Final Gambit': {
    bp: 1,
    type: 'Fighting',
    category: 'Special',
    maxPower: 100,
  },
  'Fire Pledge': {
    bp: 50,
    type: 'Fire',
    category: 'Special',
    maxPower: 130,
  },
  'Fire Pledge (Grass Pledge Boosted)': {
    bp: 150,
    type: 'Fire',
    category: 'Special',
  },
  'Fire Pledge (Water Pledge Boosted)': {
    bp: 150,
    type: 'Fire',
    category: 'Special',
  },
  'Flame Burst': {
    bp: 70,
    type: 'Fire',
    category: 'Special',
    maxPower: 120,
  },
  'Flame Charge': {
    bp: 50,
    type: 'Fire',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 100,
  },
  'Foul Play': {
    bp: 95,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Freeze Shock': {
    bp: 140,
    type: 'Ice',
    category: 'Physical',
    hasSecondaryEffect: true,
    maxPower: 140,
  },
  'Frost Breath': {
    bp: 40,
    type: 'Ice',
    category: 'Special',
    alwaysCrit: true,
    maxPower: 110,
  },
  'Fusion Bolt': {
    bp: 100,
    type: 'Electric',
    category: 'Physical',
    maxPower: 130,
  },
  'Fusion Flare': {
    bp: 100,
    type: 'Fire',
    category: 'Special',
    maxPower: 130,
  },
  'Future Sight': {
    bp: 100,
    type: 'Psychic',
    maxPower: 140,
  },
  'Gear Grind': {
    bp: 50,
    type: 'Steel',
    category: 'Physical',
    isTwoHit: true,
    makesContact: true,
    maxPower: 130,
  },
  'Giga Drain': {
    bp: 75,
    maxPower: 130,
  },
  Glaciate: {
    bp: 65,
    type: 'Ice',
    category: 'Special',
    hasSecondaryEffect: true,
    isSpread: true,
    maxPower: 120,
  },
  'Grass Pledge': {
    bp: 50,
    type: 'Grass',
    category: 'Special',
    maxPower: 130,
  },
  'Grass Pledge (Fire Pledge Boosted)': {
    bp: 150,
    type: 'Grass',
    category: 'Special',
  },
  'Grass Pledge (Water Pledge Boosted)': {
    bp: 150,
    type: 'Grass',
    category: 'Special',
  },
  'Heal Pulse': {
    bp: 0,
    type: 'Psychic',
  },
  'Heart Stamp': {
    bp: 60,
    type: 'Psychic',
    category: 'Physical',
    hasSecondaryEffect: true,
    makesContact: true,
    maxPower: 110,
  },
  'Head Charge': {
    bp: 120,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    hasRecoil: 25,
    maxPower: 140,
  },
  'Heat Crash': {
    bp: 1,
    type: 'Fire',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Heavy Slam': {
    bp: 1,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  Hex: {
    bp: 50,
    type: 'Ghost',
    category: 'Special',
    maxPower: 120,
  },
  'High Jump Kick': {
    bp: 130,
    maxPower: 95,
  },
  'Hone Claws': {
    bp: 0,
    type: 'Dark',
  },
  'Horn Leech': {
    bp: 75,
    type: 'Grass',
    category: 'Physical',
    makesContact: true,
    givesHealth: true,
    percentHealed: 0.5,
    maxPower: 130,
  },
  Hurricane: {
    bp: 120,
    type: 'Flying',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 140,
  },
  'Ice Burn': {
    bp: 140,
    type: 'Ice',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 140,
  },
  'Icicle Crash': {
    bp: 85,
    type: 'Ice',
    category: 'Physical',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Icicle Spear': {
    bp: 25,
    maxPower: 130,
  },
  Incinerate: {
    bp: 30,
    type: 'Fire',
    category: 'Special',
    isSpread: true,
    maxPower: 110,
  },
  Inferno: {
    bp: 100,
    type: 'Fire',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Jump Kick': {
    bp: 100,
    maxPower: 90,
  },
  'Last Resort': {
    bp: 140,
    maxPower: 140,
  },
  'Leaf Tornado': {
    bp: 65,
    type: 'Grass',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 120,
  },
  'Low Sweep': {
    bp: 60,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 85,
  },
  'Night Daze': {
    bp: 85,
    type: 'Dark',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Petal Dance': {
    bp: 120,
    type: 'Grass',
    category: 'Special',
    makesContact: true,
    maxPower: 140,
  },
  Psyshock: {
    bp: 80,
    type: 'Psychic',
    category: 'Special',
    dealsPhysicalDamage: true,
    maxPower: 130,
  },
  Psystrike: {
    bp: 100,
    type: 'Psychic',
    category: 'Special',
    dealsPhysicalDamage: true,
    maxPower: 130,
  },
  'Quick Guard': {
    bp: 0,
    type: 'Fighting',
  },
  'Quiver Dance': {
    bp: 0,
    type: 'Bug',
  },
  'Rage Powder': {
    bp: 0,
    type: 'Bug',
  },
  'Razor Shell': {
    bp: 75,
    type: 'Water',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Reflect Type': {
    bp: 0,
    type: 'Normal',
  },
  'Relic Song': {
    bp: 75,
    type: 'Normal',
    category: 'Special',
    hasSecondaryEffect: true,
    isSound: true,
    isSpread: true,
    maxPower: 130,
  },
  Retaliate: {
    bp: 70,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    maxPower: 120,
  },
  Round: {
    bp: 60,
    type: 'Normal',
    category: 'Special',
    maxPower: 110,
  },
  'Sacred Sword': {
    bp: 90,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    ignoresDefenseBoosts: true,
    maxPower: 90,
  },
  'Sand Tomb': {
    bp: 35,
    maxPower: 90,
  },
  Scald: {
    bp: 80,
    type: 'Water',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Searing Shot': {
    bp: 100,
    type: 'Fire',
    category: 'Special',
    hasSecondaryEffect: true,
    isSpread: 'allAdjacent',
    isBullet: true,
    maxPower: 130,
  },
  'Secret Sword': {
    bp: 85,
    type: 'Fighting',
    category: 'Special',
    dealsPhysicalDamage: true,
    maxPower: 90,
  },
  'Shell Smash': {
    bp: 0,
    type: 'Normal',
  },
  'Shift Gear': {
    bp: 0,
    type: 'Steel',
  },
  'Sky Drop': {
    bp: 60,
    type: 'Flying',
    category: 'Physical',
    makesContact: true,
    maxPower: 110,
  },
  'Sludge Wave': {
    bp: 95,
    type: 'Poison',
    category: 'Special',
    hasSecondaryEffect: true,
    isSpread: 'allAdjacent',
    maxPower: 90,
  },
  'Smack Down': {
    bp: 50,
    type: 'Rock',
    category: 'Physical',
    maxPower: 100,
  },
  Snarl: {
    bp: 55,
    type: 'Dark',
    category: 'Special',
    hasSecondaryEffect: true,
    isSound: true,
    isSpread: true,
    maxPower: 110,
  },
  Soak: {
    bp: 0,
    type: 'Water',
  },
  Steamroller: {
    bp: 65,
    type: 'Bug',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 120,
  },
  'Stored Power': {
    bp: 20,
    type: 'Psychic',
    category: 'Special',
    maxPower: 130,
  },
  'Storm Throw': {
    bp: 40,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    alwaysCrit: true,
    maxPower: 80,
  },
  'Struggle Bug': {
    bp: 30,
    type: 'Bug',
    category: 'Special',
    isSpread: true,
    maxPower: 100,
  },
  Synchronoise: {
    bp: 70,
    type: 'Psychic',
    category: 'Special',
    isSpread: 'allAdjacent',
    maxPower: 140,
  },
  Tackle: {
    bp: 50,
    maxPower: 90,
  },
  'Tail Slap': {
    bp: 25,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    isMultiHit: true,
    maxPower: 130,
  },
  'Techno Blast': {
    bp: 85,
    type: 'Normal',
    category: 'Special',
    maxPower: 140,
  },
  Thrash: {
    bp: 120,
    maxPower: 140,
  },
  Uproar: {
    bp: 90,
    maxPower: 130,
  },
  'V-create': {
    bp: 180,
    type: 'Fire',
    category: 'Physical',
    makesContact: true,
    maxPower: 150,
  },
  Venoshock: {
    bp: 65,
    type: 'Poison',
    category: 'Special',
    maxPower: 85,
  },
  'Volt Switch': {
    bp: 70,
    type: 'Electric',
    category: 'Special',
    maxPower: 120,
  },
  'Water Pledge': {
    bp: 50,
    type: 'Water',
    category: 'Special',
    maxPower: 130,
  },
  'Water Pledge (Fire Pledge Boosted)': {
    bp: 150,
    type: 'Water',
    category: 'Special',
  },
  'Water Pledge (Grass Pledge Boosted)': {
    bp: 150,
    type: 'Water',
    category: 'Special',
  },
  Whirlpool: {
    bp: 35,
    maxPower: 90,
  },
  'Wide Guard': {
    bp: 0,
    type: 'Rock',
  },
  'Wild Charge': {
    bp: 90,
    type: 'Electric',
    category: 'Physical',
    makesContact: true,
    hasRecoil: 25,
    maxPower: 130,
  },
});

const XY: {
  [name: string]: MoveData;
} = extend(true, {}, BW, {
  'Air Cutter': {
    bp: 60,
    maxPower: 110,
  },
  'Arm Thrust': {
    bp: 15,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    isMultiHit: true,
    maxPower: 70,
  },
  Assurance: {
    bp: 60,
    maxPower: 110,
  },
  'Aura Sphere': {
    bp: 80,
    maxPower: 90,
  },
  Belch: {
    bp: 120,
    type: 'Poison',
    category: 'Special',
    maxPower: 95,
  },
  Blizzard: {
    bp: 110,
    maxPower: 140,
  },
  Boomburst: {
    bp: 140,
    type: 'Normal',
    category: 'Special',
    isSound: true,
    isSpread: 'allAdjacent',
    maxPower: 140,
  },
  Chatter: {
    bp: 65,
    maxPower: 120,
  },
  Crabhammer: {
    bp: 100,
    maxPower: 130,
  },
  'Dazzling Gleam': {
    bp: 80,
    type: 'Fairy',
    category: 'Special',
    isSpread: true,
    maxPower: 130,
  },
  'Diamond Storm': {
    bp: 100,
    type: 'Rock',
    category: 'Physical',
    hasSecondaryEffect: true,
    isSpread: true,
    maxPower: 130,
  },
  'Disarming Voice': {
    bp: 40,
    type: 'Fairy',
    category: 'Special',
    isSound: true,
    maxPower: 90,
  },
  'Draco Meteor': {
    bp: 130,
    maxPower: 140,
  },
  'Dragon Ascent': {
    bp: 120,
    type: 'Flying',
    category: 'Physical',
    makesContact: true,
    maxPower: 140,
  },
  'Dragon Pulse': {
    bp: 85,
    maxPower: 130,
  },
  'Draining Kiss': {
    bp: 50,
    type: 'Fairy',
    category: 'Special',
    makesContact: true,
    givesHealth: true,
    percentHealed: 0.75,
    maxPower: 100,
  },
  'Energy Ball': {
    bp: 90,
    maxPower: 130,
  },
  Facade: {
    ignoresBurn: true,
    maxPower: 120,
  },
  'Fell Stinger': {
    bp: 30,
    type: 'Bug',
    category: 'Physical',
    makesContact: true,
    maxPower: 100,
  },
  'Fire Blast': {
    bp: 110,
    maxPower: 140,
  },
  'Fire Pledge': {
    bp: 80,
    maxPower: 130,
  },
  Flamethrower: {
    bp: 90,
    maxPower: 130,
  },
  'Flying Press': {
    bp: 80,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    maxPower: 90,
  },
  "Forest's Curse": {
    bp: 0,
    type: 'Grass',
  },
  'Freeze-Dry': {
    bp: 70,
    type: 'Ice',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 120,
  },
  'Frost Breath': {
    bp: 60,
    maxPower: 110,
  },
  'Future Sight': {
    bp: 120,
    maxPower: 140,
  },
  Geomancy: {
    bp: 0,
    type: 'Fairy',
  },
  'Grass Pledge': {
    bp: 80,
    maxPower: 130,
  },
  'Heat Wave': {
    bp: 95,
    maxPower: 130,
  },
  Hex: {
    bp: 65,
    maxPower: 120,
  },
  'Hidden Power Bug': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Dark': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Dragon': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Electric': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Fighting': {
    bp: 60,
    maxPower: 80,
  },
  'Hidden Power Fire': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Flying': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Ghost': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Grass': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Ground': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Ice': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Poison': {
    bp: 60,
    maxPower: 80,
  },
  'Hidden Power Psychic': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Rock': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Steel': {
    bp: 60,
    maxPower: 110,
  },
  'Hidden Power Water': {
    bp: 60,
    maxPower: 110,
  },
  Hurricane: {
    bp: 110,
    maxPower: 140,
  },
  'Hydro Pump': {
    bp: 110,
    maxPower: 140,
  },
  'Hyperspace Fury': {
    bp: 100,
    type: 'Dark',
    category: 'Physical',
    bypassesProtect: true,
    maxPower: 130,
  },
  'Hyperspace Hole': {
    bp: 80,
    type: 'Psychic',
    category: 'Special',
    bypassesProtect: true,
    maxPower: 130,
  },
  'Ice Beam': {
    bp: 90,
    maxPower: 130,
  },
  Incinerate: {
    bp: 60,
    maxPower: 110,
  },
  Infestation: {
    bp: 20,
    type: 'Bug',
    category: 'Special',
    makesContact: true,
    maxPower: 90,
  },
  "King's Shield": {
    bp: 0,
    type: 'Steel',
  },
  'Knock Off': {
    bp: 65,
    maxPower: 120,
  },
  "Land's Wrath": {
    bp: 90,
    type: 'Ground',
    category: 'Physical',
    isSpread: true,
  },
  'Leaf Storm': {
    bp: 130,
    maxPower: 140,
  },
  'Light of Ruin': {
    bp: 140,
    type: 'Fairy',
    category: 'Special',
    hasRecoil: 50,
    maxPower: 140,
  },
  'Low Sweep': {
    bp: 65,
    maxPower: 85,
  },
  'Magma Storm': {
    bp: 100,
    maxPower: 130,
  },
  'Meteor Mash': {
    bp: 90,
    maxPower: 130,
  },
  Moonblast: {
    bp: 95,
    type: 'Fairy',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  Moonlight: {
    type: 'Fairy',
  },
  'Muddy Water': {
    bp: 90,
    maxPower: 130,
  },
  'Mystical Fire': {
    bp: 65,
    type: 'Fire',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  Nuzzle: {
    bp: 20,
    type: 'Electric',
    category: 'Physical',
    hasSecondaryEffect: true,
    makesContact: true,
    maxPower: 90,
  },
  'Oblivion Wing': {
    bp: 80,
    type: 'Flying',
    category: 'Special',
    givesHealth: true,
    percentHealed: 0.75,
    maxPower: 130,
  },
  'Origin Pulse': {
    bp: 110,
    type: 'Water',
    category: 'Special',
    isSpread: true,
    isPulse: true,
    maxPower: 140,
  },
  Overheat: {
    bp: 130,
    maxPower: 140,
  },
  'Parabolic Charge': {
    bp: 50,
    type: 'Electric',
    category: 'Special',
    givesHealth: true,
    percentHealed: 0.5,
    isSpread: 'allAdjacent',
    maxPower: 120,
  },
  'Petal Blizzard': {
    bp: 90,
    type: 'Grass',
    category: 'Physical',
    isSpread: 'allAdjacent',
    maxPower: 130,
  },
  'Phantom Force': {
    bp: 90,
    type: 'Ghost',
    category: 'Physical',
    makesContact: true,
    bypassesProtect: true,
    maxPower: 130,
  },
  'Pin Missile': {
    bp: 25,
    maxPower: 130,
  },
  'Play Rough': {
    bp: 90,
    type: 'Fairy',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Power Gem': {
    bp: 80,
    maxPower: 130,
  },
  'Power-Up Punch': {
    bp: 40,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isPunch: true,
    maxPower: 70,
  },
  'Precipice Blades': {
    bp: 120,
    type: 'Ground',
    category: 'Physical',
    isSpread: 'true',
    maxPower: 140,
  },
  'Rock Tomb': {
    bp: 60,
    maxPower: 110,
  },
  'Skull Bash': {
    bp: 130,
    maxPower: 140,
  },
  'Spiky Shield': {
    bp: 0,
    type: 'Grass',
  },
  'Steam Eruption': {
    bp: 110,
    type: 'Water',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 140,
  },
  'Sticky Web': {
    bp: 0,
    type: 'Bug',
  },
  'Storm Throw': {
    bp: 60,
    maxPower: 80,
  },
  'Struggle Bug': {
    bp: 50,
    maxPower: 100,
  },
  Surf: {
    bp: 90,
    maxPower: 130,
  },
  Synchronoise: {
    bp: 120,
    maxPower: 140,
  },
  'Techno Blast': {
    bp: 120,
    maxPower: 140,
  },
  Thief: {
    bp: 60,
    maxPower: 110,
  },
  'Thousand Arrows': {
    bp: 90,
    type: 'Ground',
    category: 'Physical',
    isSpread: 'true',
    maxPower: 130,
  },
  'Thousand Waves': {
    bp: 90,
    type: 'Ground',
    category: 'Physical',
    isSpread: 'true',
    maxPower: 130,
  },
  Thunder: {
    bp: 110,
    maxPower: 140,
  },
  Thunderbolt: {
    bp: 90,
    maxPower: 130,
  },
  'Trick-or-Treat': {
    bp: 0,
    type: 'Ghost',
  },
  'Wake-Up Slap': {
    bp: 70,
    maxPower: 85,
  },
  'Water Pledge': {
    bp: 80,
    maxPower: 130,
  },
  'Water Shuriken': {
    bp: 15,
    type: 'Water',
    category: 'Physical',
    isMultiHit: true,
    maxPower: 90,
  },
});

const SM: {
  [name: string]: MoveData;
} = extend(true, {}, XY, {
  '10,000,000 Volt Thunderbolt': {
    bp: 195,
    type: 'Electric',
    category: 'Special',
    isZ: true,
  },
  'Acid Downpour': {
    bp: 1,
    type: 'Poison',
    category: 'Physical',
    isZ: true,
    maxPower: 70,
  },
  'Acid Spray': {
    zp: 100,
    maxPower: 70,
  },
  Accelerock: {
    bp: 40,
    type: 'Rock',
    category: 'Physical',
    makesContact: true,
    hasPriority: true,
    zp: 100,
    maxPower: 90,
  },
  Acrobatics: {
    zp: 100,
    maxPower: 110,
  },
  'Aerial Ace': {
    zp: 120,
    maxPower: 110,
  },
  Aeroblast: {
    zp: 180,
    maxPower: 130,
  },
  'Air Cutter': {
    zp: 120,
    maxPower: 110,
  },
  'Air Slash': {
    zp: 140,
    maxPower: 130,
  },
  'All-Out Pummeling': {
    bp: 1,
    type: 'Fighting',
    category: 'Physical',
    isZ: true,
    maxPower: 70,
  },
  'Anchor Shot': {
    bp: 80,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    zp: 160,
    maxPower: 130,
  },
  'Ancient Power': {
    zp: 120,
    maxPower: 110,
  },
  'Aqua Jet': {
    zp: 100,
    maxPower: 90,
  },
  'Aqua Tail': {
    zp: 175,
    maxPower: 130,
  },
  'Arm Thrust': {
    zp: 100,
    maxPower: 70,
  },
  Assurance: {
    zp: 120,
    maxPower: 110,
  },
  Astonish: {
    zp: 100,
    maxPower: 90,
  },
  'Attack Order': {
    zp: 175,
    maxPower: 130,
  },
  'Aura Sphere': {
    zp: 160,
    maxPower: 90,
  },
  'Aurora Beam': {
    zp: 120,
    maxPower: 120,
  },
  Avalanche: {
    zp: 120,
    maxPower: 110,
  },
  'Beak Blast': {
    bp: 100,
    type: 'Flying',
    category: 'Physical',
    zp: 180,
    isBullet: true,
    maxPower: 130,
  },
  Belch: {
    zp: 190,
    maxPower: 95,
  },
  Bite: {
    zp: 120,
    maxPower: 110,
  },
  'Black Hole Eclipse': {
    bp: 1,
    type: 'Dark',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  'Blast Burn': {
    zp: 200,
    maxPower: 150,
  },
  'Blaze Kick': {
    zp: 160,
    maxPower: 130,
  },
  Blizzard: {
    zp: 185,
    maxPower: 140,
  },
  'Bloom Doom': {
    bp: 1,
    type: 'Grass',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  'Blue Flare': {
    zp: 195,
    maxPower: 140,
  },
  'Brave Bird': {
    zp: 190,
    maxPower: 140,
  },
  'Breakneck Blitz': {
    bp: 1,
    type: 'Normal',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  Brine: {
    zp: 120,
    maxPower: 120,
  },
  'Body Slam': {
    zp: 160,
    maxPower: 130,
  },
  'Bolt Strike': {
    zp: 195,
    maxPower: 140,
  },
  'Bone Club': {
    zp: 120,
    maxPower: 120,
  },
  'Bone Rush': {
    zp: 140,
    maxPower: 130,
  },
  Bonemerang: {
    zp: 100,
    maxPower: 130,
  },
  Boomburst: {
    zp: 200,
    maxPower: 140,
  },
  Bounce: {
    zp: 160,
    maxPower: 130,
  },
  'Brick Break': {
    zp: 140,
    maxPower: 90,
  },
  'Brutal Swing': {
    bp: 60,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    isSpread: 'allAdjacent',
    zp: 120,
    maxPower: 110,
  },
  'Bubble Beam': {
    zp: 120,
    maxPower: 120,
  },
  'Bug Bite': {
    zp: 120,
    maxPower: 110,
  },
  'Bug Buzz': {
    zp: 175,
    maxPower: 130,
  },
  Bulldoze: {
    zp: 120,
    maxPower: 110,
  },
  'Bullet Punch': {
    zp: 100,
    maxPower: 90,
  },
  'Bullet Seed': {
    zp: 140,
    maxPower: 130,
  },
  'Burn Up': {
    bp: 130,
    type: 'Fire',
    category: 'Special',
    zp: 195,
    maxPower: 140,
  },
  Catastropika: {
    bp: 210,
    type: 'Electric',
    category: 'Physical',
    isZ: true,
    makesContact: true,
    maxPower: 150,
  },
  'Charge Beam': {
    zp: 100,
    maxPower: 100,
  },
  Chatter: {
    zp: 120,
    maxPower: 120,
  },
  'Chip Away': {
    zp: 140,
    maxPower: 120,
  },
  'Circle Throw': {
    zp: 120,
    maxPower: 80,
  },
  'Clanging Scales': {
    bp: 110,
    type: 'Dragon',
    category: 'Special',
    isSound: true,
    isSpread: true,
    zp: 185,
    maxPower: 140,
  },
  'Clangorous Soulblaze': {
    bp: 185,
    type: 'Dragon',
    category: 'Special',
    isSound: true,
    isSpread: true,
    isZ: true,
    maxPower: 150,
  },
  'Clear Smog': {
    zp: 100,
    maxPower: 75,
  },
  'Close Combat': {
    zp: 190,
    maxPower: 95,
  },
  'Continental Crush': {
    bp: 1,
    type: 'Rock',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  'Core Enforcer': {
    bp: 100,
    type: 'Dragon',
    category: 'Special',
    isSpread: true,
    zp: 140,
    maxPower: 130,
  },
  'Corkscrew Crash': {
    bp: 1,
    type: 'Steel',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  Covet: {
    zp: 120,
    maxPower: 110,
  },
  Crabhammer: {
    zp: 180,
    maxPower: 130,
  },
  'Cross Chop': {
    zp: 180,
    maxPower: 90,
  },
  'Cross Poison': {
    zp: 140,
    maxPower: 85,
  },
  Crunch: {
    zp: 160,
    maxPower: 130,
  },
  'Crush Claw': {
    zp: 140,
    maxPower: 130,
  },
  'Dark Pulse': {
    zp: 160,
    maxPower: 130,
  },
  'Darkest Lariat': {
    bp: 85,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    zp: 160,
    ignoresDefenseBoosts: true,
    maxPower: 130,
  },
  'Dazzling Gleam': {
    zp: 160,
    maxPower: 130,
  },
  'Diamond Storm': {
    zp: 180,
    maxPower: 130,
  },
  Dig: {
    zp: 160,
    maxPower: 130,
  },
  Discharge: {
    zp: 160,
    maxPower: 130,
  },
  Dive: {
    zp: 160,
    maxPower: 130,
  },
  'Dragon Hammer': {
    bp: 90,
    type: 'Dragon',
    category: 'Physical',
    makesContact: true,
    zp: 175,
    maxPower: 130,
  },
  'Draining Kiss': {
    zp: 100,
    maxPower: 100,
  },
  'Drill Peck': {
    zp: 160,
    maxPower: 130,
  },
  'Devastating Drake': {
    bp: 1,
    type: 'Dragon',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  'Doom Desire': {
    zp: 200,
    maxPower: 140,
  },
  'Double-Edge': {
    zp: 190,
    maxPower: 140,
  },
  'Double Hit': {
    zp: 140,
    maxPower: 120,
  },
  'Double Iron Bash': {
    bp: 60,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    isPunch: true,
    isTwoHit: true,
    zp: 180,
    maxPower: 140,
  },
  'Double Kick': {
    zp: 100,
    maxPower: 80,
  },
  'Draco Meteor': {
    zp: 195,
    maxPower: 140,
  },
  'Dragon Ascent': {
    zp: 190,
    maxPower: 140,
  },
  'Dragon Claw': {
    zp: 160,
    maxPower: 130,
  },
  'Dragon Pulse': {
    zp: 160,
    maxPower: 130,
  },
  'Dragon Rush': {
    zp: 180,
    maxPower: 130,
  },
  'Dragon Tail': {
    zp: 120,
    maxPower: 110,
  },
  'Drain Punch': {
    zp: 140,
    maxPower: 90,
  },
  'Dream Eater': {
    zp: 180,
    maxPower: 130,
  },
  'Drill Run': {
    zp: 160,
    maxPower: 130,
  },
  'Dual Chop': {
    zp: 100,
    maxPower: 130,
  },
  'Dynamic Punch': {
    zp: 180,
    maxPower: 90,
  },
  'Earth Power': {
    zp: 175,
    maxPower: 130,
  },
  Earthquake: {
    zp: 180,
    maxPower: 130,
  },
  'Electro Ball': {
    zp: 160,
    maxPower: 130,
  },
  Electroweb: {
    zp: 100,
    maxPower: 110,
  },
  Endeavor: {
    zp: 160,
    maxPower: 130,
  },
  'Energy Ball': {
    zp: 175,
    maxPower: 130,
  },
  Eruption: {
    zp: 200,
    maxPower: 150,
  },
  Explosion: {
    zp: 200,
    maxPower: 150,
  },
  Extrasensory: {
    zp: 160,
    maxPower: 130,
  },
  'Extreme Speed': {
    zp: 160,
    maxPower: 130,
  },
  'Fake Out': {
    zp: 100,
    maxPower: 90,
  },
  Facade: {
    zp: 140,
    maxPower: 120,
  },
  Feint: {
    zp: 100,
    maxPower: 90,
  },
  'Feint Attack': {
    zp: 120,
    maxPower: 110,
  },
  'Fell Stinger': {
    bp: '50',
    zp: 100,
    maxPower: 100,
  },
  'Fiery Dance': {
    zp: 160,
    maxPower: 130,
  },
  'Final Gambit': {
    zp: 180,
    maxPower: 100,
  },
  'Fire Blast': {
    zp: 185,
    maxPower: 140,
  },
  'Fire Fang': {
    zp: 120,
    maxPower: 120,
  },
  'Fire Lash': {
    bp: 80,
    type: 'Fire',
    category: 'Physical',
    hasSecondaryEffect: true,
    makesContact: true,
    zp: 160,
    maxPower: 130,
  },
  'Fire Pledge': {
    zp: 160,
    maxPower: 130,
  },
  'Fire Punch': {
    zp: 140,
    maxPower: 130,
  },
  'Fire Spin': {
    zp: 100,
    maxPower: 90,
  },
  'First Impression': {
    bp: 90,
    type: 'Bug',
    category: 'Physical',
    makesContact: true,
    hasPriority: true,
    zp: 175,
    maxPower: 130,
  },
  Flail: {
    zp: 160,
    maxPower: 130,
  },
  Flamethrower: {
    zp: 175,
    maxPower: 130,
  },
  'Flame Burst': {
    zp: 140,
    maxPower: 120,
  },
  'Flame Charge': {
    zp: 100,
    maxPower: 100,
  },
  'Flame Wheel': {
    zp: 120,
    maxPower: 110,
  },
  'Flare Blitz': {
    zp: 190,
    maxPower: 140,
  },
  'Flash Cannon': {
    zp: 160,
    maxPower: 130,
  },
  'Fleur Cannon': {
    bp: 130,
    type: 'Fairy',
    category: 'Special',
    hasSecondaryEffect: true,
    zp: 195,
    dropsStats: 2,
    maxPower: 140,
  },
  Fling: {
    zp: 100,
    maxPower: 100,
  },
  Fly: {
    zp: 175,
    maxPower: 130,
  },
  'Flying Press': {
    bp: 100,
    zp: 170,
    maxPower: 90,
  },
  'Focus Blast': {
    zp: 190,
    maxPower: 95,
  },
  'Focus Punch': {
    zp: 200,
    maxPower: 100,
  },
  'Force Palm': {
    zp: 120,
    maxPower: 80,
  },
  'Foul Play': {
    zp: 175,
    maxPower: 130,
  },
  'Freeze Shock': {
    zp: 200,
    maxPower: 140,
  },
  'Freeze-Dry': {
    zp: 140,
    maxPower: 120,
  },
  'Frenzy Plant': {
    zp: 200,
    maxPower: 150,
  },
  'Frost Breath': {
    zp: 120,
    maxPower: 110,
  },
  Frustration: {
    zp: 160,
    maxPower: 130,
  },
  'Fury Swipes': {
    zp: 100,
    maxPower: 100,
  },
  'Fusion Bolt': {
    zp: 180,
    maxPower: 130,
  },
  'Fusion Flare': {
    zp: 180,
    maxPower: 130,
  },
  'Future Sight': {
    zp: 190,
    maxPower: 140,
  },
  'Gear Grind': {
    zp: 180,
    maxPower: 130,
  },
  'Genesis Supernova': {
    bp: 185,
    type: 'Psychic',
    category: 'Special',
    isZ: true,
    maxPower: 150,
  },
  'Giga Drain': {
    zp: 140,
    maxPower: 130,
  },
  'Giga Impact': {
    zp: 200,
    maxPower: 150,
  },
  'Gigavolt Havoc': {
    bp: 1,
    type: 'Electric',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  Glaciate: {
    zp: 120,
    maxPower: 120,
  },
  'Grass Knot': {
    zp: 160,
    maxPower: 130,
  },
  'Grass Pledge': {
    zp: 160,
    maxPower: 130,
  },
  'Gunk Shot': {
    zp: 190,
    maxPower: 95,
  },
  Gust: {
    zp: 100,
    maxPower: 90,
  },
  'Guardian of Alola': {
    bp: 1,
    type: 'Fairy',
    category: 'Special',
    isZ: true,
    maxPower: 100,
  },
  'Gyro Ball': {
    zp: 160,
    maxPower: 130,
  },
  'Hammer Arm': {
    zp: 180,
    maxPower: 90,
  },
  Headbutt: {
    zp: 140,
    maxPower: 120,
  },
  'Head Charge': {
    zp: 190,
    maxPower: 140,
  },
  'Head Smash': {
    zp: 200,
    maxPower: 150,
  },
  'Heart Stamp': {
    zp: 120,
    maxPower: 110,
  },
  'Heat Wave': {
    zp: 175,
    maxPower: 130,
  },
  'Heavy Slam': {
    zp: 160,
    maxPower: 130,
  },
  Hex: {
    zp: 160,
    maxPower: 120,
  },
  'Hidden Power Bug': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Dark': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Dragon': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Electric': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Fighting': {
    zp: 120,
    maxPower: 80,
  },
  'Hidden Power Fire': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Flying': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Ghost': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Grass': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Ground': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Ice': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Poison': {
    zp: 120,
    maxPower: 80,
  },
  'Hidden Power Psychic': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Rock': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Steel': {
    zp: 120,
    maxPower: 110,
  },
  'Hidden Power Water': {
    zp: 120,
    maxPower: 110,
  },
  'High Horsepower': {
    bp: 95,
    type: 'Ground',
    category: 'Physical',
    makesContact: true,
    zp: 175,
    maxPower: 130,
  },
  'High Jump Kick': {
    zp: 195,
    maxPower: 95,
  },
  'Horn Leech': {
    zp: 140,
    maxPower: 130,
  },
  Hurricane: {
    zp: 185,
    maxPower: 140,
  },
  'Hydro Cannon': {
    zp: 200,
    maxPower: 150,
  },
  'Hydro Pump': {
    zp: 185,
    maxPower: 140,
  },
  'Hydro Vortex': {
    bp: 1,
    type: 'Water',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  'Hyper Beam': {
    zp: 200,
    maxPower: 150,
  },
  'Hyper Voice': {
    zp: 175,
    maxPower: 130,
  },
  'Hyperspace Fury': {
    zp: 180,
    maxPower: 130,
  },
  'Hyperspace Hole': {
    zp: 160,
    maxPower: 130,
  },
  'Ice Beam': {
    zp: 175,
    maxPower: 130,
  },
  'Ice Burn': {
    zp: 200,
    maxPower: 140,
  },
  'Ice Fang': {
    zp: 120,
    maxPower: 120,
  },
  'Ice Hammer': {
    bp: 100,
    type: 'Ice',
    category: 'Physical',
    makesContact: true,
    isPunch: true,
    zp: 180,
    maxPower: 130,
  },
  'Ice Punch': {
    zp: 140,
    maxPower: 130,
  },
  'Ice Shard': {
    zp: 100,
    maxPower: 90,
  },
  'Icicle Crash': {
    zp: 160,
    maxPower: 130,
  },
  'Icicle Spear': {
    zp: 140,
    maxPower: 130,
  },
  'Icy Wind': {
    zp: 100,
    maxPower: 110,
  },
  Incinerate: {
    zp: 120,
    maxPower: 110,
  },
  Inferno: {
    zp: 180,
    maxPower: 130,
  },
  'Inferno Overdrive': {
    bp: 1,
    type: 'Fire',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  Infestation: {
    zp: 100,
    maxPower: 90,
  },
  'Iron Head': {
    zp: 160,
    maxPower: 130,
  },
  'Iron Tail': {
    zp: 180,
    maxPower: 130,
  },
  Judgment: {
    zp: 180,
    maxPower: 130,
  },
  'Jump Kick': {
    zp: 180,
    maxPower: 90,
  },
  'Knock Off': {
    zp: 120,
    maxPower: 120,
  },
  "Land's Wrath": {
    zp: 185,
  },
  'Last Resort': {
    zp: 200,
    maxPower: 140,
  },
  'Lava Plume': {
    zp: 160,
    maxPower: 130,
  },
  Leafage: {
    bp: 40,
    type: 'Grass',
    category: 'Physical',
    zp: 100,
    maxPower: 90,
  },
  'Leaf Blade': {
    zp: 175,
    maxPower: 130,
  },
  'Leaf Storm': {
    zp: 195,
    maxPower: 140,
  },
  'Leaf Tornado': {
    zp: 120,
    maxPower: 120,
  },
  'Leech Life': {
    bp: 80,
    zp: 160,
    maxPower: 130,
  },
  "Let's Snuggle Forever": {
    bp: 190,
    type: 'Fairy',
    category: 'Physical',
    makesContact: true,
    isZ: true,
  },
  'Light of Ruin': {
    zp: 200,
    maxPower: 140,
  },
  'Light That Burns the Sky': {
    bp: 200,
    type: 'Psychic',
    category: 'Special',
    usesHighestAttackStat: true,
    isZ: true,
    maxPower: 150,
  },
  Liquidation: {
    bp: 85,
    type: 'Water',
    category: 'Physical',
    hasSecondaryEffect: true,
    makesContact: true,
    zp: 160,
    maxPower: 130,
  },
  'Low Kick': {
    zp: 160,
    maxPower: 100,
  },
  'Low Sweep': {
    zp: 120,
    maxPower: 85,
  },
  Lunge: {
    bp: 80,
    type: 'Bug',
    category: 'Physical',
    hasSecondaryEffect: true,
    makesContact: true,
    zp: 160,
    maxPower: 130,
  },
  'Luster Purge': {
    zp: 140,
    maxPower: 120,
  },
  'Mach Punch': {
    zp: 100,
    maxPower: 70,
  },
  'Magical Leaf': {
    zp: 120,
    maxPower: 110,
  },
  'Magma Storm': {
    zp: 180,
    maxPower: 130,
  },
  'Magnet Bomb': {
    zp: 120,
    maxPower: 110,
  },
  'Malicious Moonsault': {
    bp: 180,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    isZ: true,
    maxPower: 150,
  },
  Megahorn: {
    zp: 190,
    maxPower: 140,
  },
  'Menacing Moonraze Maelstrom': {
    bp: 200,
    type: 'Ghost',
    category: 'Special',
    isZ: true,
    maxPower: 150,
  },
  'Metal Claw': {
    zp: 100,
    maxPower: 100,
  },
  'Meteor Mash': {
    zp: 175,
    maxPower: 130,
  },
  'Mind Blown': {
    bp: 150,
    type: 'Fire',
    category: 'Special',
    isSpread: 'allAdjacent',
    hasRecoil: true,
    zp: 200,
    maxPower: 150,
  },
  'Mirror Shot': {
    zp: 120,
    maxPower: 120,
  },
  'Mist Ball': {
    zp: 140,
    maxPower: 120,
  },
  Moonblast: {
    zp: 175,
    maxPower: 130,
  },
  'Moongeist Beam': {
    bp: 100,
    type: 'Ghost',
    category: 'Special',
    zp: 180,
    maxPower: 130,
  },
  'Muddy Water': {
    zp: 175,
    maxPower: 130,
  },
  'Mud Bomb': {
    zp: 120,
    maxPower: 120,
  },
  'Mud Shot': {
    zp: 100,
    maxPower: 110,
  },
  'Multi-Attack': {
    bp: 90,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    zp: 185,
    maxPower: 140,
  },
  'Mystical Fire': {
    bp: 75,
    zp: 140,
    maxPower: 130,
  },
  'Natural Gift': {
    zp: 160,
    maxPower: 130,
  },
  "Nature's Madness": {
    bp: 1,
    type: 'Fairy',
    category: 'Special',
    zp: 100,
  },
  'Needle Arm': {
    zp: 120,
    maxPower: 110,
  },
  'Never-Ending Nightmare': {
    bp: 1,
    type: 'Ghost',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  'Night Daze': {
    zp: 160,
    maxPower: 130,
  },
  'Night Shade': {
    zp: 100,
    maxPower: 100,
  },
  'Night Slash': {
    zp: 140,
    maxPower: 120,
  },
  Nuzzle: {
    zp: 100,
    maxPower: 90,
  },
  'Oblivion Wing': {
    zp: 160,
    maxPower: 130,
  },
  'Oceanic Operetta': {
    bp: 195,
    type: 'Water',
    category: 'Special',
    isZ: true,
    maxPower: 150,
  },
  'Ominous Wind': {
    zp: 120,
    maxPower: 110,
  },
  'Origin Pulse': {
    zp: 185,
    maxPower: 140,
  },
  Outrage: {
    zp: 190,
    maxPower: 140,
  },
  Overheat: {
    zp: 195,
    maxPower: 140,
  },
  'Paleo Wave': {
    zp: 160,
    maxPower: 130,
  },
  'Parabolic Charge': {
    bp: 65,
    zp: 120,
    maxPower: 120,
  },
  Payback: {
    zp: 100,
    maxPower: 100,
  },
  'Petal Blizzard': {
    zp: 175,
    maxPower: 130,
  },
  'Petal Dance': {
    zp: 190,
    maxPower: 140,
  },
  'Phantom Force': {
    zp: 175,
    maxPower: 130,
  },
  'Photon Geyser': {
    bp: 100,
    type: 'Psychic',
    category: 'Special',
    usesHighestAttackStat: true,
    zp: 180,
    maxPower: 130,
  },
  'Pin Missile': {
    zp: 140,
    maxPower: 130,
  },
  'Plasma Fists': {
    bp: 100,
    type: 'Electric',
    category: 'Physical',
    makesContact: true,
    isPunch: true,
    zp: 180,
    maxPower: 130,
  },
  'Play Rough': {
    zp: 175,
    maxPower: 130,
  },
  Pluck: {
    zp: 120,
    maxPower: 110,
  },
  'Poison Fang': {
    zp: 100,
    maxPower: 75,
  },
  'Poison Jab': {
    zp: 160,
    maxPower: 90,
  },
  'Poison Tail': {
    zp: 100,
    maxPower: 75,
  },
  'Pollen Puff': {
    bp: 90,
    type: 'Bug',
    category: 'Special',
    isBullet: true,
    zp: 175,
    maxPower: 130,
  },
  'Power Gem': {
    zp: 160,
    maxPower: 130,
  },
  'Power Trip': {
    bp: 20,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    zp: 160,
    maxPower: 130,
  },
  'Power Whip': {
    zp: 190,
    maxPower: 140,
  },
  'Power-Up Punch': {
    zp: 100,
    maxPower: 70,
  },
  'Prismatic Laser': {
    bp: 160,
    type: 'Psychic',
    category: 'Special',
    zp: 200,
    maxPower: 150,
  },
  'Precipice Blades': {
    zp: 190,
    maxPower: 140,
  },
  Psychic: {
    zp: 175,
    maxPower: 130,
  },
  'Psychic Fangs': {
    bp: 85,
    type: 'Psychic',
    category: 'Physical',
    makesContact: true,
    isBite: true,
    zp: 160,
    maxPower: 130,
  },
  'Psycho Boost': {
    zp: 200,
    maxPower: 140,
  },
  'Psycho Cut': {
    zp: 140,
    maxPower: 120,
  },
  Psyshock: {
    zp: 160,
    maxPower: 130,
  },
  Psystrike: {
    zp: 180,
    maxPower: 130,
  },
  'Pulverizing Pancake': {
    bp: 210,
    type: 'Normal',
    category: 'Physical',
    makesContact: true,
    isZ: true,
    maxPower: 150,
  },
  Punishment: {
    zp: 160,
    maxPower: 130,
  },
  Pursuit: {
    zp: 100,
    maxPower: 90,
  },
  'Quick Attack': {
    zp: 100,
    maxPower: 90,
  },
  'Rapid Spin': {
    zp: 100,
    maxPower: 100,
  },
  'Razor Leaf': {
    zp: 120,
    maxPower: 110,
  },
  'Razor Shell': {
    zp: 140,
    maxPower: 130,
  },
  'Relic Song': {
    zp: 140,
    maxPower: 130,
  },
  Retaliate: {
    zp: 140,
    maxPower: 120,
  },
  Return: {
    zp: 160,
    maxPower: 130,
  },
  'Revelation Dance': {
    bp: 90,
    type: 'Normal',
    category: 'Special',
    zp: 175,
    maxPower: 130,
  },
  Revenge: {
    zp: 120,
    maxPower: 80,
  },
  Reversal: {
    zp: 160,
    maxPower: 100,
  },
  'Roar of Time': {
    zp: 200,
    maxPower: 150,
  },
  'Rock Blast': {
    isBullet: true,
    zp: 140,
    maxPower: 130,
  },
  'Rock Climb': {
    zp: 175,
    maxPower: 130,
  },
  'Rock Slide': {
    zp: 140,
    maxPower: 130,
  },
  'Rock Smash': {
    zp: 100,
    maxPower: 70,
  },
  'Rock Throw': {
    zp: 100,
    maxPower: 100,
  },
  'Rock Tomb': {
    zp: 140,
    maxPower: 110,
  },
  'Rock Wrecker': {
    zp: 200,
    maxPower: 150,
  },
  Round: {
    zp: 120,
    maxPower: 110,
  },
  'Sacred Fire': {
    zp: 180,
    maxPower: 130,
  },
  'Sacred Sword': {
    zp: 175,
    maxPower: 90,
  },
  'Sand Tomb': {
    zp: 100,
    maxPower: 90,
  },
  'Savage Spin-Out': {
    bp: 1,
    type: 'Bug',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  Scald: {
    zp: 160,
    maxPower: 130,
  },
  'Searing Shot': {
    zp: 180,
    maxPower: 130,
  },
  'Searing Sunraze Smash': {
    bp: 200,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    isZ: true,
    maxPower: 150,
  },
  'Secret Power': {
    zp: 140,
    maxPower: 120,
  },
  'Secret Sword': {
    zp: 160,
    maxPower: 90,
  },
  'Seed Bomb': {
    zp: 160,
    maxPower: 130,
  },
  'Seed Flare': {
    zp: 190,
    maxPower: 140,
  },
  'Seismic Toss': {
    zp: 100,
    maxPower: 75,
  },
  'Self-Destruct': {
    zp: 200,
    maxPower: 150,
  },
  'Shadow Claw': {
    zp: 140,
    maxPower: 120,
  },
  'Shadow Force': {
    zp: 190,
    maxPower: 140,
  },
  'Shadow Sneak': {
    zp: 100,
    maxPower: 90,
  },
  'Shadow Strike': {
    zp: 160,
    maxPower: 130,
  },
  'Shattered Psyche': {
    bp: 1,
    type: 'Psychic',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  'Shadow Ball': {
    zp: 160,
    maxPower: 130,
  },
  'Shadow Bone': {
    bp: 85,
    type: 'Ghost',
    category: 'Physical',
    hasSecondaryEffect: true,
    zp: 160,
    maxPower: 130,
  },
  'Shadow Punch': {
    zp: 120,
    maxPower: 110,
  },
  'Sheer Cold': {
    zp: 180,
    maxPower: 130,
  },
  'Shell Trap': {
    bp: 150,
    type: 'Fire',
    category: 'Special',
    isSpread: true,
    zp: 200,
    maxPower: 150,
  },
  'Shock Wave': {
    zp: 120,
    maxPower: 110,
  },
  'Signal Beam': {
    zp: 140,
    maxPower: 130,
  },
  'Silver Wind': {
    zp: 120,
    maxPower: 110,
  },
  'Sinister Arrow Raid': {
    bp: 180,
    type: 'Ghost',
    category: 'Physical',
    isZ: true,
    maxPower: 150,
  },
  'Skull Bash': {
    zp: 195,
    maxPower: 140,
  },
  'Sky Attack': {
    zp: 200,
    maxPower: 140,
  },
  'Sky Drop': {
    zp: 120,
    maxPower: 110,
  },
  'Sky Uppercut': {
    zp: 160,
    maxPower: 90,
  },
  Slash: {
    zp: 140,
    maxPower: 120,
  },
  Sludge: {
    zp: 120,
    maxPower: 85,
  },
  'Sludge Bomb': {
    zp: 175,
    maxPower: 90,
  },
  'Sludge Wave': {
    zp: 175,
    maxPower: 90,
  },
  'Smack Down': {
    zp: 100,
    maxPower: 100,
  },
  'Smart Strike': {
    bp: 70,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    zp: 140,
    maxPower: 120,
  },
  Snarl: {
    zp: 100,
    maxPower: 110,
  },
  'Solar Beam': {
    zp: 190,
    maxPower: 140,
  },
  'Solar Blade': {
    bp: 125,
    type: 'Grass',
    category: 'Physical',
    makesContact: true,
    zp: 190,
    maxPower: 140,
  },
  'Soul-Stealing 7-Star Strike': {
    bp: 195,
    type: 'Ghost',
    category: 'Physical',
    isZ: true,
    maxPower: 150,
  },
  'Spacial Rend': {
    zp: 180,
    maxPower: 130,
  },
  Spark: {
    zp: 120,
    maxPower: 120,
  },
  'Sparkling Aria': {
    bp: 90,
    type: 'Water',
    category: 'Special',
    isSound: true,
    isSpread: 'allAdjacent',
    zp: 175,
    maxPower: 130,
  },
  'Spectral Thief': {
    bp: 90,
    type: 'Ghost',
    category: 'Physical',
    makesContact: true,
    zp: 175,
    maxPower: 130,
  },
  'Spirit Shackle': {
    bp: 80,
    type: 'Ghost',
    category: 'Physical',
    hasSecondaryEffect: true,
    zp: 160,
    maxPower: 130,
  },
  'Splintered Stormshards': {
    bp: 190,
    type: 'Rock',
    category: 'Physical',
    isZ: true,
    maxPower: 150,
  },
  'Steam Eruption': {
    zp: 185,
    maxPower: 140,
  },
  Steamroller: {
    zp: 120,
    maxPower: 120,
  },
  'Steel Wing': {
    zp: 140,
    maxPower: 120,
  },
  'Stoked Sparksurfer': {
    bp: 175,
    type: 'Electric',
    category: 'Special',
    isZ: true,
    maxPower: 150,
  },
  'Stomping Tantrum': {
    bp: 75,
    type: 'Ground',
    category: 'Physical',
    makesContact: true,
    zp: 140,
    maxPower: 130,
  },
  'Stone Edge': {
    zp: 180,
    maxPower: 130,
  },
  'Stored Power': {
    zp: 160,
    maxPower: 130,
  },
  'Storm Throw': {
    zp: 120,
    maxPower: 80,
  },
  'Struggle Bug': {
    zp: 100,
    maxPower: 100,
  },
  Submission: {
    zp: 160,
    maxPower: 90,
  },
  'Subzero Slammer': {
    bp: 1,
    type: 'Ice',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  'Sucker Punch': {
    bp: 70,
    zp: 140,
    maxPower: 120,
  },
  'Sunsteel Strike': {
    bp: 100,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    zp: 180,
    maxPower: 130,
  },
  'Super Fang': {
    zp: 100,
    maxPower: 100,
  },
  Superpower: {
    zp: 190,
    maxPower: 95,
  },
  'Supersonic Skystrike': {
    bp: 1,
    type: 'Flying',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  Surf: {
    zp: 175,
    maxPower: 130,
  },
  Swift: {
    zp: 120,
    maxPower: 110,
  },
  Synchronoise: {
    zp: 190,
    maxPower: 140,
  },
  Tackle: {
    bp: 40,
    zp: 100,
    maxPower: 90,
  },
  'Take Down': {
    zp: 160,
    maxPower: 130,
  },
  'Tail Slap': {
    zp: 140,
    maxPower: 130,
  },
  'Techno Blast': {
    zp: 190,
    maxPower: 140,
  },
  'Tectonic Rage': {
    bp: 1,
    type: 'Ground',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  Thief: {
    zp: 120,
    maxPower: 110,
  },
  'Thousand Arrows': {
    zp: 180,
    maxPower: 130,
  },
  'Thousand Waves': {
    zp: 175,
    maxPower: 130,
  },
  Thrash: {
    zp: 190,
    maxPower: 140,
  },
  'Throat Chop': {
    bp: 80,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    zp: 160,
    maxPower: 130,
  },
  Thunder: {
    zp: 185,
    maxPower: 140,
  },
  Thunderbolt: {
    zp: 175,
    maxPower: 130,
  },
  'Thunder Fang': {
    zp: 120,
    maxPower: 120,
  },
  'Thunder Punch': {
    zp: 140,
    maxPower: 130,
  },
  'Tri Attack': {
    zp: 160,
    maxPower: 130,
  },
  'Trop Kick': {
    bp: 70,
    type: 'Grass',
    category: 'Physical',
    hasSecondaryEffect: true,
    makesContact: true,
    zp: 140,
    maxPower: 120,
  },
  Twineedle: {
    zp: 100,
    maxPower: 100,
  },
  'Twinkle Tackle': {
    bp: 1,
    type: 'Fairy',
    category: 'Physical',
    isZ: true,
    maxPower: 90,
  },
  'U-turn': {
    zp: 140,
    maxPower: 120,
  },
  Uproar: {
    zp: 175,
    maxPower: 130,
  },
  'V-create': {
    zp: 220,
    maxPower: 150,
  },
  'Vacuum Wave': {
    zp: 100,
    maxPower: 70,
  },
  Venoshock: {
    zp: 120,
    maxPower: 85,
  },
  'Volt Switch': {
    zp: 140,
    maxPower: 120,
  },
  'Volt Tackle': {
    zp: 190,
    maxPower: 140,
  },
  'Wake-Up Slap': {
    zp: 140,
    maxPower: 85,
  },
  Waterfall: {
    zp: 160,
    maxPower: 130,
  },
  'Water Pledge': {
    zp: 160,
    maxPower: 130,
  },
  'Water Pulse': {
    zp: 120,
    maxPower: 110,
  },
  'Water Shuriken': {
    category: 'Special',
    zp: 100,
    maxPower: 90,
  },
  'Water Spout': {
    zp: 200,
    maxPower: 150,
  },
  'Weather Ball': {
    zp: 160,
    maxPower: 130,
  },
  Whirlpool: {
    zp: 100,
    maxPower: 90,
  },
  'Wild Charge': {
    zp: 175,
    maxPower: 130,
  },
  'Wing Attack': {
    zp: 120,
    maxPower: 110,
  },
  'Wood Hammer': {
    zp: 190,
    maxPower: 140,
  },
  'Wring Out': {
    zp: 190,
    maxPower: 140,
  },
  'X-Scissor': {
    zp: 160,
    maxPower: 130,
  },
  'Zap Cannon': {
    zp: 190,
    maxPower: 140,
  },
  'Zen Headbutt': {
    zp: 160,
    maxPower: 130,
  },
  'Zing Zap': {
    bp: 80,
    type: 'Electric',
    category: 'Physical',
    hasSecondaryEffect: true,
    makesContact: true,
    zp: 160,
    maxPower: 130,
  },
});

const ZMOVES_TYPING: {
  [type in Type]?: string;
} = {
  Bug: 'Savage Spin-Out',
  Dark: 'Black Hole Eclipse',
  Dragon: 'Devastating Drake',
  Electric: 'Gigavolt Havoc',
  Fairy: 'Twinkle Tackle',
  Fighting: 'All-Out Pummeling',
  Fire: 'Inferno Overdrive',
  Flying: 'Supersonic Skystrike',
  Ghost: 'Never-Ending Nightmare',
  Grass: 'Bloom Doom',
  Ground: 'Tectonic Rage',
  Ice: 'Subzero Slammer',
  Normal: 'Breakneck Blitz',
  Poison: 'Acid Downpour',
  Psychic: 'Shattered Psyche',
  Rock: 'Continental Crush',
  Steel: 'Corkscrew Crash',
  Water: 'Hydro Vortex',
};

export function getZMoveName(moveName: string, moveType: Type, item?: string) {
  item = item || '';
  if (moveName.indexOf('Hidden Power') !== -1) return 'Breakneck Blitz';
  if (moveName === 'Clanging Scales' && item === 'Kommonium Z') return 'Clangorous Soulblaze';
  if (moveName === 'Darkest Lariat' && item === 'Incinium Z') return 'Malicious Moonsault';
  if (moveName === 'Giga Impact' && item === 'Snorlium Z') return 'Pulverizing Pancake';
  if (moveName === 'Moongeist Beam' && item === 'Lunalium Z') return 'Menacing Moonraze Maelstrom';
  if (moveName === 'Photon Geyser' && item === 'Ultranecrozium Z') {
    return 'Light That Burns the Sky';
  }
  if (moveName === 'Play Rough' && item === 'Mimikium Z') return "Let's Snuggle Forever";
  if (moveName === 'Psychic' && item === 'Mewnium Z') return 'Genesis Supernova';
  if (moveName === 'Sparkling Aria' && item === 'Primarium Z') return 'Oceanic Operetta';
  if (moveName === 'Spectral Thief' && item === 'Marshadium Z') {
    return 'Soul-Stealing 7-Star Strike';
  }
  if (moveName === 'Spirit Shackle' && item === 'Decidium Z') return 'Sinister Arrow Raid';
  if (moveName === 'Stone Edge' && item === 'Lycanium Z') return 'Splintered Stormshards';
  if (moveName === 'Sunsteel Strike' && item === 'Solganium Z') return 'Searing Sunraze Smash';
  if (moveName === 'Volt Tackle' && item === 'Pikanium Z') return 'Catastropika';
  if (moveName === "Nature's Madness" && item === 'Tapunium Z') return 'Guardian of Alola';
  if (moveName === 'Thunderbolt') {
    if (item === 'Aloraichium Z') return 'Stoked Sparksurfer';
    if (item === 'Pikashunium Z') return '10,000,000 Volt Thunderbolt';
  }
  return ZMOVES_TYPING[moveType]!;
}

export function getMaxMoveName(moveType: Type, pokemonSpecies?: string, isStatus?: boolean) {
  if (isStatus) return 'Max Guard';
  if (moveType === 'Fire') {
    if (pokemonSpecies === 'Charizard-Gmax') return 'G-Max Wildfire';
    if (pokemonSpecies === 'Centiskorch-Gmax') return 'G-Max Centiferno';
  }
  if (moveType === 'Normal') {
    if (pokemonSpecies === 'Eevee-Gmax') return 'G-Max Cuddle';
    if (pokemonSpecies === 'Meowth-Gmax') return 'G-Max Gold Rush';
    if (pokemonSpecies === 'Snorlax-Gmax') return 'G-Max Replenish';
  }
  if (moveType === 'Fairy') {
    if (pokemonSpecies === 'Alcremie-Gmax') return 'G-Max Finale';
    if (pokemonSpecies === 'Hatterene-Gmax') return 'G-Max Smite';
  }
  if (moveType === 'Steel') {
    if (pokemonSpecies === 'Copperajah-Gmax') return 'G-Max Steelsurge';
    if (pokemonSpecies === 'Melmetal-Gmax') return 'G-Max Meltdown';
  }
  if (moveType === 'Electric') {
    if (pokemonSpecies === 'Pikachu-Gmax') return 'G-Max Volt Crash';
    if (pokemonSpecies === 'Toxtricity-Gmax') return 'G-Max Stun Shock';
  }
  if (moveType === 'Grass') {
    if (pokemonSpecies === 'Appletun-Gmax') return 'G-Max Sweetness';
    if (pokemonSpecies === 'Flapple-Gmax') return 'G-Max Tartness';
  }
  if (moveType === 'Water') {
    if (pokemonSpecies === 'Drednaw-Gmax') return 'G-Max Stonesurge';
    if (pokemonSpecies === 'Kingler-Gmax') return 'G-Max Foam Burst';
  }
  if (moveType === 'Poison' && pokemonSpecies === 'Garbodor-Gmax') return 'G-Max Malodor';
  if (moveType === 'Fighting' && pokemonSpecies === 'Machamp-Gmax') return 'G-Max Chi Strike';
  if (moveType === 'Ghost' && pokemonSpecies === 'Gengar-Gmax') return 'G-Max Terror';
  if (moveType === 'Ice' && pokemonSpecies === 'Lapras-Gmax') return 'G-Max Resonance';
  if (moveType === 'Flying' && pokemonSpecies === 'Corviknight-Gmax') return 'G-Max Wind Rage';
  if (moveType === 'Dragon' && pokemonSpecies === 'Duraludon-Gmax') return 'G-Max Depletion';
  if (moveType === 'Psychic' && pokemonSpecies === 'Orbeetle-Gmax') return 'G-Max Gravitas';
  if (moveType === 'Rock' && pokemonSpecies === 'Coalossal-Gmax') return 'G-Max Volcalith';
  if (moveType === 'Ground' && pokemonSpecies === 'Sandaconda-Gmax') return 'G-Max Sandblast';
  if (moveType === 'Dark' && pokemonSpecies === 'Grimmsnarl-Gmax') return 'G-Max Snooze';
  return 'Max ' + MAXMOVES_TYPING[moveType];
}

const MAXMOVES_TYPING: {
  [type in Type]?: string;
} = {
  Bug: 'Flutterby',
  Dark: 'Darkness',
  Dragon: 'Wyrmwind',
  Electric: 'Lightning',
  Fairy: 'Starfall',
  Fighting: 'Knuckle',
  Fire: 'Flare',
  Flying: 'Airstream',
  Ghost: 'Phantasm',
  Grass: 'Overgrowth',
  Ground: 'Quake',
  Ice: 'Hailstorm',
  Normal: 'Strike',
  Poison: 'Ooze',
  Psychic: 'Mindstorm',
  Rock: 'Rockfall',
  Steel: 'Steelspike',
  Water: 'Geyser',
};

const SS: {
  [name: string]: MoveData;
} = extend(true, {}, SM, {
  'Apple Acid': {
    bp: 80,
    type: 'Grass',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Aura Wheel': {
    bp: 110,
    type: 'Electric',
    category: 'Physical',
    hasSecondaryEffect: true,
    maxPower: 140,
  },
  'Behemoth Bash': {
    bp: 100,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Behemoth Blade': {
    bp: 100,
    type: 'Steel',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Body Press': {
    bp: 80,
    type: 'Fighting',
    category: 'Physical',
    makesContact: true,
    maxPower: 90,
  },
  'Bolt Beak': {
    bp: 85,
    type: 'Electric',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  Bonemerang: {
    maxPower: 130,
  },
  'Bone Rush': {
    maxPower: 130,
  },
  'Branch Poke': {
    bp: 40,
    type: 'Grass',
    category: 'Physical',
    makesContact: true,
    maxPower: 90,
  },
  'Breaking Swipe': {
    bp: 60,
    type: 'Dragon',
    category: 'Physical',
    makesContact: true,
    hasSecondaryEffect: true,
    isSpread: 'allAdjacent',
    maxPower: 110,
  },
  'Bullet Seed': {
    maxPower: 130,
  },
  'Clangorous Soul': {
    bp: 0,
    type: 'Dragon',
    category: 'Status',
    isSound: true,
  },
  'Comet Punch': {
    maxPower: 100,
  },
  Counter: {
    maxPower: 75,
  },
  'Court Change': {
    bp: 0,
    type: 'Normal',
    category: 'Status',
  },
  'Crush Grip': {
    maxPower: 140,
  },
  Decorate: {
    bp: 0,
    type: 'Fairy',
    category: 'Status',
  },
  'Double Hit': {
    maxPower: 120,
  },
  'Double Iron Bash': {
    maxPower: 140,
  },
  'Double Kick': {
    maxPower: 80,
  },
  'Dragon Darts': {
    bp: 50,
    type: 'Dragon',
    category: 'Physical',
    isTwoHit: true,
    maxPower: 130,
  },
  'Drum Beating': {
    bp: 80,
    type: 'Grass',
    category: 'Physical',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Dual Chop': {
    maxPower: 130,
  },
  'Dynamax Cannon': {
    bp: 100,
    type: 'Dragon',
    category: 'Special',
    maxPower: 130,
  },
  'Electro Ball': {
    maxPower: 130,
  },
  Endeavor: {
    maxPower: 130,
  },
  Eternabeam: {
    bp: 160,
    type: 'Dragon',
    category: 'Special',
    maxPower: 150,
  },
  'False Surrender': {
    bp: 80,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    maxPower: 130,
  },
  'Fishious Rend': {
    bp: 85,
    type: 'Water',
    category: 'Physical',
    makesContact: true,
    isBite: true,
    maxPower: 130,
  },
  Fissure: {
    maxPower: 130,
  },
  Flail: {
    maxPower: 130,
  },
  Frustration: {
    maxPower: 130,
  },
  'Fury Swipes': {
    maxPower: 100,
  },
  'Gear Grind': {
    maxPower: 130,
  },
  'G-Max Befuddle': {
    bp: 10,
    type: 'Bug',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Centiferno': {
    bp: 10,
    type: 'Fire',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Chi Strike': {
    bp: 10,
    type: 'Fighting',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Cuddle': {
    bp: 10,
    type: 'Normal',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Depletion': {
    bp: 10,
    type: 'Dragon',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Finale': {
    bp: 10,
    type: 'Fairy',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Foam Burst': {
    bp: 10,
    type: 'Water',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Gold Rush': {
    bp: 10,
    type: 'Normal',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Gravitas': {
    bp: 10,
    type: 'Psychic',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Malodor': {
    bp: 10,
    type: 'Poison',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Meltdown': {
    bp: 10,
    type: 'Steel',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Replenish': {
    bp: 10,
    type: 'Normal',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Resonance': {
    bp: 10,
    type: 'Ice',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Sandblast': {
    bp: 10,
    type: 'Ground',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Smite': {
    bp: 10,
    type: 'Fairy',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Snooze': {
    bp: 10,
    type: 'Dark',
    category: 'Physical',
    isMax: true,
  },
  'G-Max Steelsurge': {
    bp: 10,
    type: 'Steel',
    category: 'Physical',
    isMax: true,
  },
  'Grass Knot': {
    maxPower: 130,
  },
  'Grav Apple': {
    bp: 80,
    type: 'Grass',
    category: 'Physical',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  Guillotine: {
    maxPower: 130,
  },
  'Gyro Ball': {
    maxPower: 130,
  },
  'Heat Crash': {
    maxPower: 130,
  },
  'Heavy Slam': {
    maxPower: 130,
  },
  'Horn Drill': {
    maxPower: 130,
  },
  'Icicle Spear': {
    maxPower: 130,
  },
  'Jaw Lock': {
    bp: 80,
    type: 'Dark',
    category: 'Physical',
    makesContact: true,
    isBite: true,
    maxPower: 130,
  },
  'Life Dew': {
    bp: 0,
    type: 'Water',
    category: 'Status',
    givesHealth: true,
    percentHealed: 0.25,
  },
  'Magic Powder': {
    bp: 0,
    type: 'Psychic',
    category: 'Status',
  },
  Magnitude: {
    maxPower: 140,
  },
  'Max Airstream': {
    bp: 10,
    type: 'Flying',
    category: 'Physical',
    isMax: true,
  },
  'Max Darkness': {
    bp: 10,
    type: 'Dark',
    category: 'Physical',
    isMax: true,
  },
  'Max Flare': {
    bp: 10,
    type: 'Fire',
    category: 'Physical',
    isMax: true,
  },
  'Max Flutterby': {
    bp: 10,
    type: 'Bug',
    category: 'Physical',
    isMax: true,
  },
  'Max Geyser': {
    bp: 10,
    type: 'Water',
    category: 'Physical',
    isMax: true,
  },
  'Max Guard': {
    bp: 0,
    type: 'Normal',
    category: 'Status',
    hasPriority: true,
    isMax: true,
  },
  'Max Hailstorm': {
    bp: 10,
    type: 'Ice',
    category: 'Physical',
    isMax: true,
  },
  'Max Knuckle': {
    bp: 10,
    type: 'Fighting',
    category: 'Physical',
    isMax: true,
  },
  'Max Lightning': {
    bp: 10,
    type: 'Electric',
    category: 'Physical',
    isMax: true,
  },
  'Max Mindstorm': {
    bp: 10,
    type: 'Psychic',
    category: 'Physical',
    isMax: true,
  },
  'Max Ooze': {
    bp: 10,
    type: 'Poison',
    category: 'Physical',
    isMax: true,
  },
  'Max Overgrowth': {
    bp: 10,
    type: 'Grass',
    category: 'Physical',
    isMax: true,
  },
  'Max Phantasm': {
    bp: 10,
    type: 'Ghost',
    category: 'Physical',
    isMax: true,
  },
  'Max Quake': {
    bp: 10,
    type: 'Ground',
    category: 'Physical',
    isMax: true,
  },
  'Max Rockfall': {
    bp: 10,
    type: 'Rock',
    category: 'Physical',
    isMax: true,
  },
  'Max Starfall': {
    bp: 10,
    type: 'Fairy',
    category: 'Physical',
    isMax: true,
  },
  'Max Steelspike': {
    bp: 10,
    type: 'Steel',
    category: 'Physical',
    isMax: true,
  },
  'Max Strike': {
    bp: 10,
    type: 'Normal',
    category: 'Physical',
    isMax: true,
  },
  'Max Wyrmwind': {
    bp: 10,
    type: 'Dragon',
    category: 'Physical',
    isMax: true,
  },
  'Meteor Assault': {
    bp: 150,
    type: 'Fighting',
    category: 'Physical',
    maxPower: 100,
  },
  'Multi-Attack': {
    bp: 120,
  },
  'Natural Gift': {
    maxPower: 130,
  },
  'No Retreat': {
    bp: 0,
    type: 'Fighting',
    category: 'Status',
  },
  Obstruct: {
    bp: 0,
    type: 'Dark',
    category: 'Status',
    hasPriority: true,
  },
  Octolock: {
    bp: 0,
    type: 'Fighting',
    category: 'Status',
  },
  Overdrive: {
    bp: 80,
    type: 'Electric',
    category: 'Special',
    isSound: true,
    isSpread: 'allAdjacent',
    maxPower: 130,
  },
  'Pin Missile': {
    maxPower: 130,
  },
  'Power Trip': {
    maxPower: 130,
  },
  Punishment: {
    maxPower: 130,
  },
  'Pyro Ball': {
    bp: 120,
    type: 'Fire',
    category: 'Physical',
    hasSecondaryEffect: true,
    isBullet: true,
    maxPower: 140,
  },
  'Rapid Spin': {
    bp: 50,
  },
  Return: {
    maxPower: 130,
  },
  'Rock Blast': {
    maxPower: 130,
  },
  'Seismic Toss': {
    maxPower: 75,
  },
  'Sheer Cold': {
    maxPower: 130,
  },
  'Snap Trap': {
    bp: 35,
    type: 'Grass',
    category: 'Physical',
    makesContact: true,
    maxPower: 90,
  },
  'Snipe Shot': {
    bp: 80,
    type: 'Water',
    category: 'Special',
    maxPower: 130,
  },
  'Spike Cannon': {
    maxPower: 120,
  },
  'Spirit Break': {
    bp: 75,
    type: 'Fairy',
    category: 'Physical',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Steel Beam': {
    bp: 140,
    type: 'Steel',
    category: 'Special',
    isSpread: 'allAdjacent',
    maxPower: 140,
  },
  'Stored Power': {
    maxPower: 130,
  },
  'Strange Steam': {
    bp: 90,
    type: 'Fairy',
    category: 'Special',
    hasSecondaryEffect: true,
    maxPower: 130,
  },
  'Stuff Cheeks': {
    bp: 0,
    type: 'Normal',
    category: 'Status',
  },
  'Tail Slap': {
    maxPower: 130,
  },
  'Tar Shot': {
    bp: 0,
    type: 'Rock',
    category: 'Status',
  },
  Teatime: {
    bp: 0,
    type: 'Normal',
    category: 'Status',
  },
  'Triple Kick': {
    maxPower: 80,
  },
  'Trump Card': {
    maxPower: 130,
  },
  Twineedle: {
    maxPower: 100,
  },
  'Weather Ball': {
    maxPower: 130,
  },
  'Wring Out': {
    maxPower: 140,
  },
});

export const ZMOVES = Object.values(ZMOVES_TYPING) as string[];

export const MOVES = [{}, RBY, GSC, ADV, DPP, BW, XY, SM, SS];
