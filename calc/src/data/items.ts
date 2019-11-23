import {Generation} from '../gen';
import {Stat} from '../stats';
import {Type} from './types';

const RBY: string[] = [];

const GSC = [
  'Berry',
  'Berry Juice',
  'Black Belt',
  'Black Glasses',
  'Bright Powder',
  'Charcoal',
  'Dragon Fang',
  'Focus Band',
  'Gold Berry',
  'Hard Stone',
  "King's Rock",
  'Leftovers',
  'Light Ball',
  'Magnet',
  'Metal Coat',
  'Metal Powder',
  'Miracle Seed',
  'Mystic Water',
  'Never-Melt Ice',
  'Pink Bow',
  'Poison Barb',
  'Polkadot Bow',
  'Sharp Beak',
  'Silver Powder',
  'Soft Sand',
  'Soothe Bell',
  'Spell Tag',
  'Stick',
  'Thick Club',
  'Twisted Spoon',
];

const ADV = GSC.concat([
  'Aguav Berry',
  'Apicot Berry',
  'Aspear Berry',
  'Belue Berry',
  'Bluk Berry',
  'Cheri Berry',
  'Chesto Berry',
  'Choice Band',
  'Cornn Berry',
  'Deep Sea Scale',
  'Deep Sea Tooth',
  'Durin Berry',
  'Enigma Berry',
  'Figy Berry',
  'Ganlon Berry',
  'Grepa Berry',
  'Hondew Berry',
  'Iapapa Berry',
  'Kelpsy Berry',
  'Lansat Berry',
  'Lax Incense',
  'Leppa Berry',
  'Liechi Berry',
  'Lum Berry',
  'Mago Berry',
  'Magost Berry',
  'Mental Herb',
  'Nanab Berry',
  'Nomel Berry',
  'Oran Berry',
  'Pamtre Berry',
  'Pecha Berry',
  'Persim Berry',
  'Petaya Berry',
  'Pinap Berry',
  'Pomeg Berry',
  'Qualot Berry',
  'Rabuta Berry',
  'Rawst Berry',
  'Razz Berry',
  'Salac Berry',
  'Sea Incense',
  'Shell Bell',
  'Silk Scarf',
  'Sitrus Berry',
  'Soul Dew',
  'Spelon Berry',
  'Starf Berry',
  'Tamato Berry',
  'Watmel Berry',
  'Wepear Berry',
  'White Herb',
  'Wiki Berry',
]);

ADV.splice(ADV.indexOf('Berry'), 1);
ADV.splice(ADV.indexOf('Gold Berry'), 1);
ADV.splice(ADV.indexOf('Pink Bow'), 1);
ADV.splice(ADV.indexOf('Polkadot Bow'), 1);

const DPP = ADV.concat([
  'Adamant Orb',
  'Babiri Berry',
  'Black Sludge',
  'Big Root',
  'Charti Berry',
  'Chilan Berry',
  'Choice Scarf',
  'Choice Specs',
  'Chople Berry',
  'Coba Berry',
  'Colbur Berry',
  'Custap Berry',
  'Damp Rock',
  'Destiny Knot',
  'Draco Plate',
  'Dread Plate',
  'Earth Plate',
  'Expert Belt',
  'Fist Plate',
  'Flame Orb',
  'Flame Plate',
  'Focus Sash',
  'Full Incense',
  'Grip Claw',
  'Griseous Orb',
  'Haban Berry',
  'Heat Rock',
  'Icicle Plate',
  'Icy Rock',
  'Insect Plate',
  'Iron Ball',
  'Iron Plate',
  'Jaboca Berry',
  'Kasib Berry',
  'Kebia Berry',
  'Lagging Tail',
  'Life Orb',
  'Lustrous Orb',
  'Macho Brace',
  'Meadow Plate',
  'Metronome',
  'Micle Berry',
  'Mind Plate',
  'Muscle Band',
  'Occa Berry',
  'Odd Incense',
  'Passho Berry',
  'Payapa Berry',
  'Quick Powder',
  'Razor Fang',
  'Reaper Cloth',
  'Rindo Berry',
  'Rock Incense',
  'Rose Incense',
  'Rowap Berry',
  'Shed Shell',
  'Shuca Berry',
  'Sky Plate',
  'Smooth Rock',
  'Splash Plate',
  'Spooky Plate',
  'Sticky Barb',
  'Stone Plate',
  'Tanga Berry',
  'Toxic Orb',
  'Toxic Plate',
  'Wacan Berry',
  'Wave Incense',
  'Wide Lens',
  'Wise Glasses',
  'Yache Berry',
  'Zap Plate',
  'Zoom Lens',
]);

const BW = DPP.concat([
  'Absorb Bulb',
  'Air Balloon',
  'Binding Band',
  'Bug Gem',
  'Burn Drive',
  'Cell Battery',
  'Chill Drive',
  'Dark Gem',
  'Dragon Gem',
  'Douse Drive',
  'Electric Gem',
  'Eviolite',
  'Fighting Gem',
  'Fire Gem',
  'Float Stone',
  'Flying Gem',
  'Ghost Gem',
  'Grass Gem',
  'Ground Gem',
  'Ice Gem',
  'Normal Gem',
  'Poison Gem',
  'Psychic Gem',
  'Red Card',
  'Ring Target',
  'Rock Gem',
  'Shock Drive',
  'Steel Gem',
  'Water Gem',
]);

export const MEGA_STONES: {[species: string]: string} = {
  Absolite: 'Absol',
  Abomasite: 'Abomasnow',
  Aerodactylite: 'Aerodactyl',
  Aggronite: 'Aggron',
  Alakazite: 'Alakazam',
  Altarianite: 'Altaria',
  Ampharosite: 'Ampharos',
  Audinite: 'Audino',
  Banettite: 'Banette',
  Beedrillite: 'Beedrill',
  Blastoisinite: 'Blastoise',
  Blazikenite: 'Blaziken',
  Cameruptite: 'Camerupt',
  'Charizardite X': 'Charizard',
  'Charizardite Y': 'Charizard',
  Crucibellite: 'Crucibelle',
  Diancite: 'Diancie',
  Galladite: 'Gallade',
  Garchompite: 'Garchomp',
  Gardevoirite: 'Gardevoir',
  Gengarite: 'Gengar',
  Glalitite: 'Glalie',
  Gyaradosite: 'Gyarados',
  Heracronite: 'Heracross',
  Houndoominite: 'Houndoom',
  Kangaskhanite: 'Kangaskhan',
  Latiasite: 'Latias',
  Latiosite: 'Latios',
  Lopunnite: 'Lopunny',
  Lucarionite: 'Lucario',
  Manectite: 'Manectric',
  Mawilite: 'Mawile',
  Medichamite: 'Medicham',
  Metagrossite: 'Metagross',
  'Mewtwonite X': 'Mewtwo',
  'Mewtwonite Y': 'Mewtwo',
  Pidgeotite: 'Pidgeot',
  Pinsirite: 'Pinsir',
  Sablenite: 'Sableye',
  Salamencite: 'Salamence',
  Sceptilite: 'Sceptile',
  Scizorite: 'Scizor',
  Sharpedonite: 'Sharpedo',
  Slowbronite: 'Slowbro',
  Steelixite: 'Steelix',
  Swampertite: 'Swampert',
  Tyranitarite: 'Tyranitar',
  Venusaurite: 'Venusaur',
};

const XY = BW.concat(
  [
    ...Object.keys(MEGA_STONES),
    'Assault Vest',
    'Fairy Gem',
    'Kee Berry',
    'Maranga Berry',
    'Pixie Plate',
    'Power Herb',
    'Roseli Berry',
    'Safety Goggles',
    'Weakness Policy',
  ].sort()
);

const SM = XY.concat([
  'Adrenaline Orb',
  'Aloraichium Z',
  'Bug Memory',
  'Buginium Z',
  'Dark Memory',
  'Darkinium Z',
  'Decidium Z',
  'Dragon Memory',
  'Dragonium Z',
  'Eevium Z',
  'Electric Memory',
  'Electric Seed',
  'Electrium Z',
  'Enigmatic Card',
  'Fairium Z',
  'Fairy Memory',
  'Fighting Memory',
  'Fightinium Z',
  'Fire Memory',
  'Firium Z',
  'Flying Memory',
  'Flyinium Z',
  'Ghost Memory',
  'Ghostium Z',
  'Grass Memory',
  'Grassium Z',
  'Grassy Seed',
  'Ground Memory',
  'Groundium Z',
  'Ice Memory',
  'Icium Z',
  'Incinium Z',
  'Kommonium Z',
  'Lunalium Z',
  'Lycanium Z',
  'Marshadium Z',
  'Mewnium Z',
  'Mimikium Z',
  'Misty Seed',
  'Normalium Z',
  'Pikanium Z',
  'Pikashunium Z',
  'Pink Nectar',
  'Poison Memory',
  'Poisonium Z',
  'Primarium Z',
  'Protective Pads',
  'Psychic Memory',
  'Psychic Seed',
  'Psychium Z',
  'Purple Nectar',
  'Red Nectar',
  'Rock Memory',
  'Rockium Z',
  'Snorlium Z',
  'Solganium Z',
  'Steel Memory',
  'Steelium Z',
  'Tapunium Z',
  'Ultranecrozium Z',
  'Water Memory',
  'Waterium Z',
  'Yellow Nectar',
]);

const SS = SM.concat([
  'Berry Sweet',
  'Blunder Policy',
  'Chipped Pot',
  'Clover Sweet',
  'Cracked Pot',
  'Eject Pack',
  'Flower Sweet',
  'Heavy-Duty Boots',
  'Love Sweet',
  'Ribbon Sweet',
  'Room Service',
  'Rusted Shield',
  'Rusted Sword',
  'Star Sweet',
  'Strawberry Sweet',
  'Sweet Apple',
  'Tart Apple',
  'Throat Spray',
]);

const BERRIES: {[berry: string]: {t: Type; p: number}} = {
  'Aguav Berry': {t: 'Dragon', p: 80},
  'Apicot Berry': {t: 'Ground', p: 100},
  'Aspear Berry': {t: 'Ice', p: 80},
  'Babiri Berry': {t: 'Steel', p: 80},
  'Belue Berry': {t: 'Electric', p: 100},
  'Bluk Berry': {t: 'Fire', p: 90},
  'Charti Berry': {t: 'Rock', p: 80},
  'Cheri Berry': {t: 'Fire', p: 80},
  'Chesto Berry': {t: 'Water', p: 80},
  'Chilan Berry': {t: 'Normal', p: 80},
  'Chople Berry': {t: 'Fighting', p: 80},
  'Coba Berry': {t: 'Flying', p: 80},
  'Colbur Berry': {t: 'Dark', p: 80},
  'Cornn Berry': {t: 'Bug', p: 90},
  'Custap Berry': {t: 'Ghost', p: 100},
  'Durin Berry': {t: 'Water', p: 100},
  'Enigma Berry': {t: 'Bug', p: 100},
  'Figy Berry': {t: 'Bug', p: 80},
  'Ganlon Berry': {t: 'Ice', p: 100},
  'Grepa Berry': {t: 'Flying', p: 90},
  'Haban Berry': {t: 'Dragon', p: 80},
  'Hondew Berry': {t: 'Ground', p: 90},
  'Iapapa Berry': {t: 'Dark', p: 80},
  'Jaboca Berry': {t: 'Dragon', p: 100},
  'Kasib Berry': {t: 'Ghost', p: 80},
  'Kebia Berry': {t: 'Poison', p: 80},
  'Kee Berry': {t: 'Fairy', p: 100},
  'Kelpsy Berry': {t: 'Fighting', p: 90},
  'Lansat Berry': {t: 'Flying', p: 100},
  'Leppa Berry': {t: 'Fighting', p: 80},
  'Liechi Berry': {t: 'Grass', p: 100},
  'Lum Berry': {t: 'Flying', p: 80},
  'Mago Berry': {t: 'Ghost', p: 80},
  'Magost Berry': {t: 'Rock', p: 90},
  'Maranga Berry': {t: 'Dark', p: 100},
  'Micle Berry': {t: 'Rock', p: 100},
  'Nanab Berry': {t: 'Water', p: 90},
  'Nomel Berry': {t: 'Dragon', p: 90},
  'Occa Berry': {t: 'Fire', p: 80},
  'Oran Berry': {t: 'Poison', p: 80},
  'Pamtre Berry': {t: 'Steel', p: 90},
  'Passho Berry': {t: 'Water', p: 80},
  'Payapa Berry': {t: 'Psychic', p: 80},
  'Pecha Berry': {t: 'Electric', p: 80},
  'Persim Berry': {t: 'Ground', p: 80},
  'Petaya Berry': {t: 'Poison', p: 100},
  'Pinap Berry': {t: 'Grass', p: 90},
  'Pomeg Berry': {t: 'Ice', p: 90},
  'Qualot Berry': {t: 'Poison', p: 90},
  'Rabuta Berry': {t: 'Ghost', p: 90},
  'Rawst Berry': {t: 'Grass', p: 80},
  'Razz Berry': {t: 'Steel', p: 80},
  'Rindo Berry': {t: 'Grass', p: 80},
  'Roseli Berry': {t: 'Fairy', p: 80},
  'Rowap Berry': {t: 'Dark', p: 100},
  'Salac Berry': {t: 'Fighting', p: 100},
  'Shuca Berry': {t: 'Ground', p: 80},
  'Sitrus Berry': {t: 'Psychic', p: 80},
  'Spelon Berry': {t: 'Dark', p: 90},
  'Starf Berry': {t: 'Psychic', p: 100},
  'Tamato Berry': {t: 'Psychic', p: 90},
  'Tanga Berry': {t: 'Bug', p: 80},
  'Wacan Berry': {t: 'Electric', p: 80},
  'Watmel Berry': {t: 'Fire', p: 100},
  'Wepear Berry': {t: 'Electric', p: 90},
  'Wiki Berry': {t: 'Rock', p: 80},
  'Yache Berry': {t: 'Ice', p: 80},
};

export const SEED_BOOSTED_STAT: {[item: string]: Stat} = {
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
  'Lustrous Orb',
  'Macho Brace',
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
  'Magnet',
  'Metal Coat',
  'Miracle Seed',
  'Mystic Water',
  'Never-Melt Ice',
  'Razor Fang',
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
  let t: Type = 'Normal';
  let p = 1;

  const gift = BERRIES[item];
  if (gift) {
    t = gift.t;
    p = gen < 6 ? gift.p - 20 : gift.p;
  }

  return {t, p};
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
    return item.substring(0, item.indexOf(' ')) as Type;
  }
  return undefined;
}

export const ITEMS = [[], RBY, GSC, ADV, DPP, BW, XY, SM, SS];
