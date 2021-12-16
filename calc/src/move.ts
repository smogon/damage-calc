import * as I from './data/interface';
import {State} from './state';
import {toID, extend} from './util';

const SPECIAL = ['Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Psychic', 'Dark', 'Dragon'];

export class Move implements State.Move {
  gen: I.Generation;
  name: I.MoveName;

  originalName: string;
  ability?: I.AbilityName;
  item?: I.ItemName;
  species?: I.SpeciesName;
  useZ?: boolean;
  useMax?: boolean;
  overrides?: Partial<I.Move>;

  hits: number;
  timesUsed?: number;
  timesUsedWithMetronome?: number;
  bp: number;
  type: I.TypeName;
  category: I.MoveCategory;
  flags: I.MoveFlags;
  secondaries: any;
  target: I.MoveTarget;
  recoil?: [number, number];
  hasCrashDamage: boolean;
  mindBlownRecoil: boolean;
  struggleRecoil: boolean;
  isCrit: boolean;
  drain?: [number, number];
  priority: number;
  dropsStats?: number;
  ignoreDefensive: boolean;
  overrideOffensiveStat?: I.StatIDExceptHP;
  overrideDefensiveStat?: I.StatIDExceptHP;
  overrideOffensivePokemon?: 'target' | 'source';
  overrideDefensivePokemon?: 'target' | 'source';
  breaksProtect: boolean;
  isZ: boolean;
  isMax: boolean;

  constructor(
    gen: I.Generation,
    name: string,
    options: Partial<State.Move> & {
      ability?: I.AbilityName;
      item?: I.ItemName;
      species?: I.SpeciesName;
    } = {}
  ) {
    name = options.name || name;
    this.originalName = name;
    let data: I.Move = extend(true, {name}, gen.moves.get(toID(name)), options.overrides);

    this.hits = 1;
    // If isZMove but there isn't a corresponding z-move, use the original move
    if (options.useMax && data.maxMove) {
      const maxMoveName: string = getMaxMoveName(
        data.type,
        options.species,
        !!(data.category === 'Status'),
        options.ability
      );
      const maxMove = gen.moves.get(toID(maxMoveName));
      const maxPower = () => {
        if (['G-Max Drum Solo', 'G-Max Fire Ball', 'G-Max Hydrosnipe'].includes(maxMoveName)) {
          return 160;
        }
        // TODO: checking basePower === 10 is fragile (what if the maxMove's basePower is
        // overridden?) and also fails for Max Flare, which is strangely 100 BP in the game data
        if (maxMove!.basePower === 10 || maxMoveName === 'Max Flare') {
          return data.maxMove!.basePower;
        }
        return maxMove!.basePower;
      };
      data = extend(true, {}, maxMove, {
        name: maxMoveName,
        basePower: maxPower(),
        category: data.category,
      });
    }
    if (options.useZ && data.zMove?.basePower) {
      const zMoveName: string = getZMoveName(data.name, data.type, options.item);
      const zMove = gen.moves.get(toID(zMoveName));
      data = extend(true, {}, zMove, {
        name: zMoveName,
        basePower: zMove!.basePower === 1 ? data.zMove.basePower : zMove!.basePower,
        category: data.category,
      });
    } else {
      if (data.multihit) {
        if (typeof data.multihit === 'number') {
          this.hits = data.multihit;
        } else if (options.hits) {
          this.hits = options.hits;
        } else {
          this.hits = (options.ability === 'Skill Link' || options.item === 'Grip Claw')
            ? data.multihit[1]
            : data.multihit[0] + 1;
        }
      }
      this.timesUsedWithMetronome = options.timesUsedWithMetronome;
    }
    this.gen = gen;
    this.name = data.name;
    this.ability = options.ability;
    this.item = options.item;
    this.useZ = options.useZ;
    this.useMax = options.useMax;
    this.overrides = options.overrides;
    this.species = options.species;

    this.bp = data.basePower;
    // These moves have a type, but the damage they deal is typeless so we override it
    const typelessDamage =
      (gen.num >= 2 && data.id === 'struggle') ||
      (gen.num <= 4 && ['futuresight', 'doomdesire'].includes(data.id));
    this.type = typelessDamage ? '???' : data.type;
    this.category = data.category ||
      (gen.num < 4 ? (SPECIAL.includes(data.type) ? 'Special' : 'Physical') : 'Status');

    const stat = this.category === 'Special' ? 'spa' : 'atk';
    if (data.self?.boosts && data.self.boosts[stat] && data.self.boosts[stat]! < 0) {
      this.dropsStats = Math.abs(data.self.boosts[stat]!);
    }
    this.timesUsed = (this.dropsStats && options.timesUsed) || 1;
    this.secondaries = data.secondaries;
    // For the purposes of the damage formula only 'allAdjacent' and 'allAdjacentFoes' matter, so we
    // simply default to 'any' for the others even though they may not actually be 'any'-target
    this.target = data.target || 'any';
    this.recoil = data.recoil;
    this.hasCrashDamage = !!data.hasCrashDamage;
    this.mindBlownRecoil = !!data.mindBlownRecoil;
    this.struggleRecoil = !!data.struggleRecoil;
    this.isCrit = !!options.isCrit || !!data.willCrit ||
      // These don't *always* crit (255/256 chance), but for the purposes of the calc they do
      gen.num === 1 && ['crabhammer', 'razorleaf', 'slash', 'karate chop'].includes(data.id);
    this.drain = data.drain;
    this.flags = data.flags;
    // The calc doesn't currently care about negative priority moves so we simply default to 0
    this.priority = data.priority || 0;

    this.ignoreDefensive = !!data.ignoreDefensive;
    this.overrideOffensiveStat = data.overrideOffensiveStat;
    this.overrideDefensiveStat = data.overrideDefensiveStat;
    this.overrideOffensivePokemon = data.overrideOffensivePokemon;
    this.overrideDefensivePokemon = data.overrideDefensivePokemon;
    this.breaksProtect = !!data.breaksProtect;
    this.isZ = !!data.isZ;
    this.isMax = !!data.isMax;

    if (!this.bp) {
      // Assume max happiness for these moves because the calc doesn't support happiness
      if (['return', 'frustration', 'pikapapow', 'veeveevolley'].includes(data.id)) {
        this.bp = 102;
      } else if (data.id === 'naturepower') {
        // Assume the 'Wi-Fi' default of Tri Attack
        this.bp = 80;
        if (gen.num >= 5) this.secondaries = true;
      }
    }
  }

  named(...names: string[]) {
    return names.includes(this.name);
  }

  hasType(...types: Array<(I.TypeName | undefined)>) {
    return types.includes(this.type);
  }

  clone() {
    return new Move(this.gen, this.originalName, {
      ability: this.ability,
      item: this.item,
      species: this.species,
      useZ: this.useZ,
      useMax: this.useMax,
      isCrit: this.isCrit,
      hits: this.hits,
      timesUsed: this.timesUsed,
      timesUsedWithMetronome: this.timesUsedWithMetronome,
      overrides: this.overrides,
    });
  }
}

export function getZMoveName(moveName: string, moveType: I.TypeName, item?: string) {
  item = item || '';
  if (moveName.includes('Hidden Power')) return 'Breakneck Blitz';
  if (moveName === 'Clanging Scales' && item === 'Kommonium Z') return 'Clangorous Soulblaze';
  if (moveName === 'Darkest Lariat' && item === 'Incinium Z') return 'Malicious Moonsault';
  if (moveName === 'Giga Impact' && item === 'Snorlium Z') return 'Pulverizing Pancake';
  if (moveName === 'Moongeist Beam' && item === 'Lunalium Z') return 'Menacing Moonraze Maelstrom';
  if (moveName === 'Photon Geyser' && item === 'Ultranecrozium Z') {
    return 'Light That Burns the Sky';
  }
  if (moveName === 'Play Rough' && item === 'Mimikium Z') return 'Let\'s Snuggle Forever';
  if (moveName === 'Psychic' && item === 'Mewnium Z') return 'Genesis Supernova';
  if (moveName === 'Sparkling Aria' && item === 'Primarium Z') return 'Oceanic Operetta';
  if (moveName === 'Spectral Thief' && item === 'Marshadium Z') {
    return 'Soul-Stealing 7-Star Strike';
  }
  if (moveName === 'Spirit Shackle' && item === 'Decidium Z') return 'Sinister Arrow Raid';
  if (moveName === 'Stone Edge' && item === 'Lycanium Z') return 'Splintered Stormshards';
  if (moveName === 'Sunsteel Strike' && item === 'Solganium Z') return 'Searing Sunraze Smash';
  if (moveName === 'Volt Tackle' && item === 'Pikanium Z') return 'Catastropika';
  if (moveName === 'Nature\'s Madness' && item === 'Tapunium Z') return 'Guardian of Alola';
  if (moveName === 'Thunderbolt') {
    if (item === 'Aloraichium Z') return 'Stoked Sparksurfer';
    if (item === 'Pikashunium Z') return '10,000,000 Volt Thunderbolt';
  }
  return ZMOVES_TYPING[moveType]!;
}

const ZMOVES_TYPING: {
  [type in I.TypeName]?: string;
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

export function getMaxMoveName(
  moveType: I.TypeName,
  pokemonSpecies?: string,
  isStatus?: boolean,
  pokemonAbility?: string
) {
  if (isStatus) return 'Max Guard';
  if (pokemonAbility === 'Normalize') return 'Max Strike';
  if (moveType === 'Fire') {
    if (pokemonSpecies === 'Charizard-Gmax') return 'G-Max Wildfire';
    if (pokemonSpecies === 'Centiskorch-Gmax') return 'G-Max Centiferno';
    if (pokemonSpecies === 'Cinderace-Gmax') return 'G-Max Fire Ball';
  }
  if (moveType === 'Normal') {
    if (pokemonSpecies === 'Eevee-Gmax') return 'G-Max Cuddle';
    if (pokemonSpecies === 'Meowth-Gmax') return 'G-Max Gold Rush';
    if (pokemonSpecies === 'Snorlax-Gmax') return 'G-Max Replenish';
    if (pokemonAbility === 'Pixilate') return 'Max Starfall';
    if (pokemonAbility === 'Aerilate') return 'Max Airstream';
    if (pokemonAbility === 'Refrigerate') return 'Max Hailstorm';
    if (pokemonAbility === 'Galvanize') return 'Max Lightning';
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
    if (pokemonSpecies?.startsWith('Toxtricity') &&
      pokemonSpecies?.endsWith('Gmax')) return 'G-Max Stun Shock';
  }
  if (moveType === 'Grass') {
    if (pokemonSpecies === 'Appletun-Gmax') return 'G-Max Sweetness';
    if (pokemonSpecies === 'Flapple-Gmax') return 'G-Max Tartness';
    if (pokemonSpecies === 'Rillaboom-Gmax') return 'G-Max Drum Solo';
    if (pokemonSpecies === 'Venusaur-Gmax') return 'G-Max Vine Lash';
  }
  if (moveType === 'Water') {
    if (pokemonSpecies === 'Blastoise-Gmax') return 'G-Max Cannonade';
    if (pokemonSpecies === 'Drednaw-Gmax') return 'G-Max Stonesurge';
    if (pokemonSpecies === 'Inteleon-Gmax') return 'G-Max Hydrosnipe';
    if (pokemonSpecies === 'Kingler-Gmax') return 'G-Max Foam Burst';
    if (pokemonSpecies === 'Urshifu-Rapid-Strike-Gmax') return 'G-Max Rapid Flow';
  }
  if (moveType === 'Dark') {
    if (pokemonSpecies === 'Grimmsnarl-Gmax') return 'G-Max Snooze';
    if (pokemonSpecies === 'Urshifu-Gmax') return 'G-Max One Blow';
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
  [type in I.TypeName]?: string;
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
