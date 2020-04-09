import {Generation, TypeName, StatName, ID} from './data/interface';
import {toID} from './util';

export const SEED_BOOSTED_STAT: {[item: string]: StatName} = {
  'Electric Seed': 'def',
  'Grassy Seed': 'def',
  'Misty Seed': 'spd',
  'Psychic Seed': 'spd',
};

export function getItemBoostType(item: string | undefined) {
  switch (item) {
    case 'Draco Plate':
    case 'Dragon Fang':
      return 'Dragon';
    case 'Dread Plate':
    case 'Black Glasses':
      return 'Dark';
    case 'Earth Plate':
    case 'Soft Sand':
      return 'Ground';
    case 'Fist Plate':
    case 'Black Belt':
      return 'Fighting';
    case 'Flame Plate':
    case 'Charcoal':
      return 'Fire';
    case 'Icicle Plate':
    case 'Never-Melt Ice':
      return 'Ice';
    case 'Insect Plate':
    case 'Silver Powder':
      return 'Bug';
    case 'Iron Plate':
    case 'Metal Coat':
      return 'Steel';
    case 'Meadow Plate':
    case 'Rose Incense':
    case 'Miracle Seed':
      return 'Grass';
    case 'Mind Plate':
    case 'Odd Incense':
    case 'Twisted Spoon':
      return 'Psychic';
    case 'Pixie Plate':
      return 'Fairy';
    case 'Sky Plate':
    case 'Sharp Beak':
      return 'Flying';
    case 'Splash Plate':
    case 'Sea Incense':
    case 'Wave Incense':
    case 'Mystic Water':
      return 'Water';
    case 'Spooky Plate':
    case 'Spell Tag':
      return 'Ghost';
    case 'Stone Plate':
    case 'Rock Incense':
    case 'Hard Stone':
      return 'Rock';
    case 'Toxic Plate':
    case 'Poison Barb':
      return 'Poison';
    case 'Zap Plate':
    case 'Magnet':
      return 'Electric';
    case 'Silk Scarf':
    case 'Pink Bow':
    case 'Polkadot Bow':
      return 'Normal';
    default:
      return undefined;
  }
}

export function getBerryResistType(berry: string | undefined) {
  switch (berry) {
    case 'Chilan Berry':
      return 'Normal';
    case 'Occa Berry':
      return 'Fire';
    case 'Passho Berry':
      return 'Water';
    case 'Wacan Berry':
      return 'Electric';
    case 'Rindo Berry':
      return 'Grass';
    case 'Yache Berry':
      return 'Ice';
    case 'Chople Berry':
      return 'Fighting';
    case 'Kebia Berry':
      return 'Poison';
    case 'Shuca Berry':
      return 'Ground';
    case 'Coba Berry':
      return 'Flying';
    case 'Payapa Berry':
      return 'Psychic';
    case 'Tanga Berry':
      return 'Bug';
    case 'Charti Berry':
      return 'Rock';
    case 'Kasib Berry':
      return 'Ghost';
    case 'Haban Berry':
      return 'Dragon';
    case 'Colbur Berry':
      return 'Dark';
    case 'Babiri Berry':
      return 'Steel';
    case 'Roseli Berry':
      return 'Fairy';
    default:
      return undefined;
  }
}

const FLING_80 = new Set([
  'Assault Vest',
  'Blunder Policy',
  'Chipped Pot',
  'Cracked Pot',
  'Heavy-Duty Boots',
  'Weakness Policy',
]);

const FLING_60 = new Set([
  'Adamant Orb',
  'Damp Rock',
  'Heat Rock',
  'Leek',
  'Lustrous Orb',
  'Macho Brace',
  'Rocky Helmet',
  'Stick',
]);
const FLING_30 = new Set([
  'Absorb Bulb',
  'Black Belt',
  'Black Sludge',
  'Black Glasses',
  'Cell Battery',
  'Charcoal',
  'Deep Sea Scale',
  'Flame Orb',
  "King's Rock",
  'Life Orb',
  'Light Ball',
  'Light Clay',
  'Magnet',
  'Metal Coat',
  'Miracle Seed',
  'Mystic Water',
  'Never-Melt Ice',
  'Razor Fang',
  'Scope Lens',
  'Soul Dew',
  'Spell Tag',
  'Sweet Apple',
  'Tart Apple',
  'Throat Spray',
  'Toxic Orb',
  'Twisted Spoon',
]);
const FLING_10 = new Set([
  'Air Balloon',
  'Berry Sweet',
  'Choice Band',
  'Choice Scarf',
  'Choice Specs',
  'Clover Sweet',
  'Destiny Knot',
  'Electric Seed',
  'Expert Belt',
  'Flower Sweet',
  'Focus Band',
  'Focus Sash',
  'Full Incense',
  'Grassy Seed',
  'Lagging Tail',
  'Lax Incense',
  'Leftovers',
  'Love Sweet',
  'Mental Herb',
  'Metal Powder',
  'Mint Berry',
  'Miracle Berry',
  'Misty Seed',
  'Muscle Band',
  'Power Herb',
  'Psychic Seed',
  'Odd Incense',
  'Quick Powder',
  'Reaper Cloth',
  'Red Card',
  'Ribbon Sweet',
  'Ring Target',
  'Rock Incense',
  'Rose Incense',
  'Sea Incense',
  'Shed Shell',
  'Silk Scarf',
  'Silver Powder',
  'Smooth Rock',
  'Soft Sand',
  'Soothe Bell',
  'Star Sweet',
  'Strawberry Sweet',
  'Wave Incense',
  'White Herb',
  'Wide Lens',
  'Wise Glasses',
  'Zoom Lens',
]);

export function getFlingPower(item?: string) {
  if (!item) return 0;
  if (item === 'Iron Ball') return 130;
  if (['Hard Stone', 'Room Service'].indexOf(item) !== -1) return 100;
  if (item.indexOf('Plate') !== -1 || ['Deep Sea Tooth', 'Thick Club'].indexOf(item) !== -1) {
    return 90;
  }
  if (FLING_80.has(item)) return 80;
  if (['Poison Barb', 'Dragon Fang'].indexOf(item) !== -1) return 70;
  if (FLING_60.has(item)) return 60;
  if (['Eject Pack', 'Sharp Beak'].indexOf(item) !== -1) return 50;
  if (['Icy Rock', 'Eviolite'].indexOf(item) !== -1) return 40;
  if (FLING_30.has(item)) return 30;
  if (item.indexOf('Berry') !== -1 || FLING_10.has(item)) return 10;
  return 0;
}

export function getNaturalGift(gen: Generation, item: string) {
  const gift = gen.items.get(toID(item))?.naturalGift;
  return gift ? {t: gift.type, p: gift.basePower} : {t: 'Normal' as TypeName, p: 1};
}

export function getTechnoBlast(item: string) {
  switch (item) {
    case 'Burn Drive':
      return 'Fire';
    case 'Chill Drive':
      return 'Ice';
    case 'Douse Drive':
      return 'Water';
    case 'Shock Drive':
      return 'Electric';
    default:
      return undefined;
  }
}

export function getMultiAttack(item: string) {
  if (item.indexOf('Memory') !== -1) {
    return item.substring(0, item.indexOf(' ')) as TypeName;
  }
  return undefined;
}
