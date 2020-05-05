"use strict";
exports.__esModule = true;
var util_1 = require("./util");
var SPECIAL = ['Fire', 'Water', 'Grass', 'Electric', 'Ice', 'Psychic', 'Dark', 'Dragon'];
var Move = (function () {
    function Move(gen, name, options) {
        if (options === void 0) { options = {}; }
        var _a, _b;
        name = options.name || name;
        this.originalName = name;
        var data = util_1.extend(true, { name: name }, gen.moves.get(util_1.toID(name)), options.overrides);
        this.hits = 1;
        if (options.useMax && data.maxMove) {
            var maxMoveName = getMaxMoveName(data.type, options.species, !!(data.category === 'Status'));
            var maxMove = gen.moves.get(util_1.toID(maxMoveName));
            data = util_1.extend(true, {}, maxMove, {
                name: maxMoveName,
                basePower: maxMove.basePower === 10 ? data.maxMove.basePower : maxMove.basePower,
                category: data.category
            });
        }
        if (options.useZ && ((_a = data.zMove) === null || _a === void 0 ? void 0 : _a.basePower)) {
            var zMoveName = getZMoveName(data.name, data.type, options.item);
            var zMove = gen.moves.get(util_1.toID(zMoveName));
            data = util_1.extend(true, {}, zMove, {
                name: zMoveName,
                basePower: zMove.basePower === 1 ? data.zMove.basePower : zMove.basePower,
                category: data.category
            });
        }
        else {
            if (data.multihit) {
                if (typeof data.multihit === 'number') {
                    this.hits = data.multihit;
                }
                else if (options.hits) {
                    this.hits = options.hits;
                }
                else {
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
        this.bp = data.basePower;
        var typelessDamage = gen.num >= 2 && gen.num <= 4 &&
            ['futuresight', 'doomdesire', 'struggle'].includes(data.id);
        this.type = typelessDamage ? '???' : data.type;
        this.category = data.category ||
            (gen.num < 4 ? (SPECIAL.includes(data.type) ? 'Special' : 'Physical') : 'Status');
        var stat = this.category === 'Special' ? 'spa' : 'atk';
        if (((_b = data.self) === null || _b === void 0 ? void 0 : _b.boosts) && data.self.boosts[stat] && data.self.boosts[stat] < 0) {
            this.dropsStats = Math.abs(data.self.boosts[stat]);
        }
        this.timesUsed = (this.dropsStats && options.timesUsed) || 1;
        this.secondaries = data.secondaries;
        this.target = data.target || 'any';
        this.recoil = data.recoil;
        this.hasCrashDamage = !!data.hasCrashDamage;
        this.mindBlownRecoil = !!data.mindBlownRecoil;
        this.struggleRecoil = !!data.struggleRecoil;
        this.isCrit = !!options.isCrit || !!data.willCrit ||
            gen.num === 1 && ['crabhammer', 'razorleaf', 'slash'].includes(data.id);
        this.drain = data.drain;
        this.flags = data.flags;
        this.priority = data.priority || 0;
        this.ignoreDefensive = !!data.ignoreDefensive;
        this.defensiveCategory = data.defensiveCategory || this.category;
        this.breaksProtect = !!data.breaksProtect;
        this.isZ = !!data.isZ;
        this.isMax = !!data.isMax;
        if (!this.bp) {
            if (['return', 'frustration', 'pikapapow', 'veeveevolley'].includes(data.id)) {
                this.bp = 102;
            }
            else if (data.id === 'naturepower') {
                this.bp = 80;
                if (gen.num >= 5)
                    this.secondaries = true;
            }
        }
    }
    ;
    Move.prototype.named = function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        return names.includes(this.name);
    };
    Move.prototype.hasType = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        return types.includes(this.type);
    };
    Move.prototype.clone = function () {
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
            overrides: this.overrides
        });
    };
    return Move;
}());
exports.Move = Move;
function getZMoveName(moveName, moveType, item) {
    item = item || '';
    if (moveName.indexOf('Hidden Power') !== -1)
        return 'Breakneck Blitz';
    if (moveName === 'Clanging Scales' && item === 'Kommonium Z')
        return 'Clangorous Soulblaze';
    if (moveName === 'Darkest Lariat' && item === 'Incinium Z')
        return 'Malicious Moonsault';
    if (moveName === 'Giga Impact' && item === 'Snorlium Z')
        return 'Pulverizing Pancake';
    if (moveName === 'Moongeist Beam' && item === 'Lunalium Z')
        return 'Menacing Moonraze Maelstrom';
    if (moveName === 'Photon Geyser' && item === 'Ultranecrozium Z') {
        return 'Light That Burns the Sky';
    }
    if (moveName === 'Play Rough' && item === 'Mimikium Z')
        return "Let's Snuggle Forever";
    if (moveName === 'Psychic' && item === 'Mewnium Z')
        return 'Genesis Supernova';
    if (moveName === 'Sparkling Aria' && item === 'Primarium Z')
        return 'Oceanic Operetta';
    if (moveName === 'Spectral Thief' && item === 'Marshadium Z') {
        return 'Soul-Stealing 7-Star Strike';
    }
    if (moveName === 'Spirit Shackle' && item === 'Decidium Z')
        return 'Sinister Arrow Raid';
    if (moveName === 'Stone Edge' && item === 'Lycanium Z')
        return 'Splintered Stormshards';
    if (moveName === 'Sunsteel Strike' && item === 'Solganium Z')
        return 'Searing Sunraze Smash';
    if (moveName === 'Volt Tackle' && item === 'Pikanium Z')
        return 'Catastropika';
    if (moveName === "Nature's Madness" && item === 'Tapunium Z')
        return 'Guardian of Alola';
    if (moveName === 'Thunderbolt') {
        if (item === 'Aloraichium Z')
            return 'Stoked Sparksurfer';
        if (item === 'Pikashunium Z')
            return '10,000,000 Volt Thunderbolt';
    }
    return ZMOVES_TYPING[moveType];
}
exports.getZMoveName = getZMoveName;
var ZMOVES_TYPING = {
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
    Water: 'Hydro Vortex'
};
function getMaxMoveName(moveType, pokemonSpecies, isStatus) {
    if (isStatus)
        return 'Max Guard';
    if (moveType === 'Fire') {
        if (pokemonSpecies === 'Charizard-Gmax')
            return 'G-Max Wildfire';
        if (pokemonSpecies === 'Centiskorch-Gmax')
            return 'G-Max Centiferno';
    }
    if (moveType === 'Normal') {
        if (pokemonSpecies === 'Eevee-Gmax')
            return 'G-Max Cuddle';
        if (pokemonSpecies === 'Meowth-Gmax')
            return 'G-Max Gold Rush';
        if (pokemonSpecies === 'Snorlax-Gmax')
            return 'G-Max Replenish';
    }
    if (moveType === 'Fairy') {
        if (pokemonSpecies === 'Alcremie-Gmax')
            return 'G-Max Finale';
        if (pokemonSpecies === 'Hatterene-Gmax')
            return 'G-Max Smite';
    }
    if (moveType === 'Steel') {
        if (pokemonSpecies === 'Copperajah-Gmax')
            return 'G-Max Steelsurge';
        if (pokemonSpecies === 'Melmetal-Gmax')
            return 'G-Max Meltdown';
    }
    if (moveType === 'Electric') {
        if (pokemonSpecies === 'Pikachu-Gmax')
            return 'G-Max Volt Crash';
        if (pokemonSpecies === 'Toxtricity-Gmax')
            return 'G-Max Stun Shock';
    }
    if (moveType === 'Grass') {
        if (pokemonSpecies === 'Appletun-Gmax')
            return 'G-Max Sweetness';
        if (pokemonSpecies === 'Flapple-Gmax')
            return 'G-Max Tartness';
    }
    if (moveType === 'Water') {
        if (pokemonSpecies === 'Drednaw-Gmax')
            return 'G-Max Stonesurge';
        if (pokemonSpecies === 'Kingler-Gmax')
            return 'G-Max Foam Burst';
    }
    if (moveType === 'Poison' && pokemonSpecies === 'Garbodor-Gmax')
        return 'G-Max Malodor';
    if (moveType === 'Fighting' && pokemonSpecies === 'Machamp-Gmax')
        return 'G-Max Chi Strike';
    if (moveType === 'Ghost' && pokemonSpecies === 'Gengar-Gmax')
        return 'G-Max Terror';
    if (moveType === 'Ice' && pokemonSpecies === 'Lapras-Gmax')
        return 'G-Max Resonance';
    if (moveType === 'Flying' && pokemonSpecies === 'Corviknight-Gmax')
        return 'G-Max Wind Rage';
    if (moveType === 'Dragon' && pokemonSpecies === 'Duraludon-Gmax')
        return 'G-Max Depletion';
    if (moveType === 'Psychic' && pokemonSpecies === 'Orbeetle-Gmax')
        return 'G-Max Gravitas';
    if (moveType === 'Rock' && pokemonSpecies === 'Coalossal-Gmax')
        return 'G-Max Volcalith';
    if (moveType === 'Ground' && pokemonSpecies === 'Sandaconda-Gmax')
        return 'G-Max Sandblast';
    if (moveType === 'Dark' && pokemonSpecies === 'Grimmsnarl-Gmax')
        return 'G-Max Snooze';
    return 'Max ' + MAXMOVES_TYPING[moveType];
}
exports.getMaxMoveName = getMaxMoveName;
var MAXMOVES_TYPING = {
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
    Water: 'Geyser'
};
//# sourceMappingURL=move.js.map