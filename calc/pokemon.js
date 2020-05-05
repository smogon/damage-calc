"use strict";
exports.__esModule = true;
var stats_1 = require("./stats");
var util_1 = require("./util");
var STATS = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
var SPC = new Set(['spc']);
var Pokemon = (function () {
    function Pokemon(gen, name, options) {
        if (options === void 0) { options = {}; }
        this.species = util_1.extend(true, {}, gen.species.get(util_1.toID(name)), options.overrides);
        this.gen = gen;
        this.name = options.name || name;
        this.types = this.species.types;
        this.weightkg = this.species.weightkg;
        this.level = options.level || 100;
        this.gender = options.gender || this.species.gender || 'M';
        this.ability =
            options.ability || (this.species.abilities && this.species.abilities[0]) || undefined;
        this.abilityOn = !!options.abilityOn;
        this.isDynamaxed = !!options.isDynamaxed;
        this.item = options.item;
        this.nature = options.nature || 'Serious';
        this.ivs = Pokemon.withDefault(gen, options.ivs, 31);
        this.evs = Pokemon.withDefault(gen, options.evs, gen.num >= 3 ? 0 : 252);
        this.boosts = Pokemon.withDefault(gen, options.boosts, 0);
        if (gen.num < 3) {
            this.ivs.hp = stats_1.Stats.DVToIV(stats_1.Stats.getHPDV({
                atk: this.ivs.atk,
                def: this.ivs.def,
                spe: this.ivs.spe,
                spc: this.ivs.spa
            }));
        }
        this.rawStats = {};
        this.stats = {};
        for (var _i = 0, STATS_1 = STATS; _i < STATS_1.length; _i++) {
            var stat = STATS_1[_i];
            var val = this.calcStat(gen, stat);
            this.rawStats[stat] = val;
            this.stats[stat] = val;
        }
        var curHP = options.curHP || options.originalCurHP;
        this.originalCurHP = curHP && curHP <= this.rawStats.hp ? curHP : this.rawStats.hp;
        this.status = options.status || '';
        this.toxicCounter = options.toxicCounter || 0;
        this.moves = options.moves || [];
    }
    Pokemon.prototype.maxHP = function (original) {
        if (original === void 0) { original = false; }
        return !original && this.isDynamaxed && this.species.baseStats.hp !== 1
            ? this.rawStats.hp * 2
            : this.rawStats.hp;
    };
    Pokemon.prototype.curHP = function (original) {
        if (original === void 0) { original = false; }
        return !original && this.isDynamaxed && this.species.baseStats.hp !== 1
            ? this.originalCurHP * 2
            : this.originalCurHP;
    };
    Pokemon.prototype.hasAbility = function () {
        var abilities = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            abilities[_i] = arguments[_i];
        }
        return !!(this.ability && abilities.includes(this.ability));
    };
    Pokemon.prototype.hasItem = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        return !!(this.item && items.includes(this.item));
    };
    Pokemon.prototype.hasStatus = function () {
        var statuses = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            statuses[_i] = arguments[_i];
        }
        return !!(this.status && statuses.includes(this.status));
    };
    Pokemon.prototype.hasType = function () {
        var types = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            types[_i] = arguments[_i];
        }
        for (var _a = 0, types_1 = types; _a < types_1.length; _a++) {
            var type = types_1[_a];
            if (this.types.includes(type))
                return true;
        }
        return false;
    };
    Pokemon.prototype.named = function () {
        var names = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            names[_i] = arguments[_i];
        }
        return names.includes(this.name);
    };
    Pokemon.prototype.clone = function () {
        return new Pokemon(this.gen, this.name, {
            level: this.level,
            ability: this.ability,
            abilityOn: this.abilityOn,
            isDynamaxed: this.isDynamaxed,
            item: this.item,
            gender: this.gender,
            nature: this.nature,
            ivs: util_1.extend(true, {}, this.ivs),
            evs: util_1.extend(true, {}, this.evs),
            boosts: util_1.extend(true, {}, this.boosts),
            originalCurHP: this.originalCurHP,
            status: this.status,
            toxicCounter: this.toxicCounter,
            moves: this.moves.slice(),
            overrides: this.species
        });
    };
    Pokemon.prototype.calcStat = function (gen, stat) {
        return stats_1.Stats.calcStat(gen, stat, this.species.baseStats[stat], this.ivs[stat], this.evs[stat], this.level, this.nature);
    };
    Pokemon.getForme = function (gen, speciesName, item, moveName) {
        var species = gen.species.get(util_1.toID(speciesName));
        if (!species || !species.otherFormes) {
            return speciesName;
        }
        var i = 0;
        if ((item &&
            ((item.indexOf('ite') !== -1 && item.indexOf('ite Y') === -1) ||
                (speciesName === 'Groudon' && item === 'Red Orb') ||
                (speciesName === 'Kyogre' && item === 'Blue Orb'))) ||
            (moveName && speciesName === 'Meloetta' && moveName === 'Relic Song') ||
            (speciesName === 'Rayquaza' && moveName === 'Dragon Ascent')) {
            i = 1;
        }
        else if (item && item.indexOf('ite Y') !== -1) {
            i = 2;
        }
        return i ? species.otherFormes[i - 1] : species.name;
    };
    Pokemon.withDefault = function (gen, current, val) {
        var cur = {};
        if (current) {
            util_1.assignWithout(cur, current, SPC);
            if (current.spc) {
                cur.spa = current.spc;
                cur.spd = current.spc;
            }
            if (gen.num <= 2 && current.spa !== current.spd) {
                throw new Error('Special Attack and Special Defense must match before Gen 3');
            }
        }
        return Object.assign({ hp: val, atk: val, def: val, spa: val, spd: val, spe: val }, cur);
    };
    return Pokemon;
}());
exports.Pokemon = Pokemon;
//# sourceMappingURL=pokemon.js.map