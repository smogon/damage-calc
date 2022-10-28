"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
exports.__esModule = true;

function toID(s) {
    return ('' + s).toLowerCase().replace(/[^a-z0-9]+/g, '');
}
exports.toID = toID;
var GENERATIONS = Object.create(null);
var Generations = (function () {
    function Generations(dex) {
        this.dex = dex;
    }
    Generations.prototype.get = function (gen) {
        if (GENERATIONS[gen])
            return GENERATIONS[gen];
        return (GENERATIONS[gen] = new Generation(this.dex.forGen(gen)));
    };
    return Generations;
}());
exports.Generations = Generations;
var Generation = (function () {
    function Generation(dex) {
        this.dex = dex;
        this.abilities = new Abilities(dex);
        this.items = new Items(dex);
        this.moves = new Moves(dex);
        this.species = new Species(dex);
        this.types = new Types(dex);
        this.natures = new Natures(dex);
        this.num = this.dex.gen;
    }
    return Generation;
}());
var Abilities = (function () {
    function Abilities(dex) {
        this.dex = dex;
    }
    Abilities.prototype.get = function (name) {
        var ability = this.dex.getAbility(name);
        if (ability.isNonstandard === 'CAP' && this.dex.gen < 4)
            return undefined;
        return exists(ability, this.dex.gen) ? new Ability(ability) : undefined;
    };
    Abilities.prototype[Symbol.iterator] = function () {
        var _a, _b, _i, id, a;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in this.dex.data.Abilities)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    id = _a[_i];
                    a = this.get(id);
                    if (!a) return [3, 3];
                    return [4, a];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    };
    return Abilities;
}());
var Ability = (function () {
    function Ability(ability) {
        this.kind = 'Ability';
        this.id = ability.id;
        this.name = ability.name;
    }
    return Ability;
}());
var Items = (function () {
    function Items(dex) {
        this.dex = dex;
    }
    Items.prototype.get = function (name) {
        if (this.dex.gen < 2)
            return undefined;
        var item = this.dex.getItem(name);
        if (this.dex.gen === 3 && item.id === 'enigmaberry') {
            item = this.dex.forGen(4).getItem('enigmaberry');
        }
        return exists(item, this.dex.gen) ? new Item(item, this.dex.gen) : undefined;
    };
    Items.prototype[Symbol.iterator] = function () {
        var _a, _b, _i, id, i;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in this.dex.data.Items)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    id = _a[_i];
                    i = this.get(id);
                    if (!i) return [3, 3];
                    return [4, i];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    };
    return Items;
}());
var Item = (function () {
    function Item(item, gen) {
        this.kind = 'Item';
        this.id = item.id;
        this.name = item.name;
        this.megaEvolves = item.megaEvolves;
        this.isBerry = item.isBerry;
        this.naturalGift = item.naturalGift && {
            basePower: item.naturalGift.basePower - (gen === 2 ? 20 : 0),
            type: item.naturalGift.type
        };
    }
    return Item;
}());
var Moves = (function () {
    function Moves(dex) {
        this.dex = dex;
    }
    Moves.prototype.get = function (name) {
        var move = this.dex.getMove(name);
        return exists(move, this.dex.gen) ? new Move(move, this.dex) : undefined;
    };
    Moves.prototype[Symbol.iterator] = function () {
        var _a, _b, _i, id, m;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4, NoMove(this.dex)];
                case 1:
                    _c.sent();
                    _a = [];
                    for (_b in this.dex.data.Moves)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3, 5];
                    id = _a[_i];
                    m = this.get(id);
                    if (!m) return [3, 4];
                    return [4, m];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4:
                    _i++;
                    return [3, 2];
                case 5: return [2];
            }
        });
    };
    return Moves;
}());
var Move = (function () {
    function Move(move, dex) {
        var _a, _b, _c;
        this.kind = 'Move';
        this.id = move.id === 'hiddenpower' ? toID(move.name) : move.id;
        this.name = move.name;
        this.basePower = move.basePower;
        this.type = move.type;
        if (move.category === 'Status' || dex.gen >= 4) {
            this.category = move.category;
        }
        if (move.recoil)
            this.recoil = move.recoil;
        if (move.hasCrashDamage)
            this.hasCrashDamage = move.hasCrashDamage;
        if (move.mindBlownRecoil)
            this.mindBlownRecoil = move.mindBlownRecoil;
        if (move.struggleRecoil)
            this.struggleRecoil = move.struggleRecoil;
        var stat = move.category === 'Special' ? 'spa' : 'atk';
        if (((_a = move.self) === null || _a === void 0 ? void 0 : _a.boosts) && move.self.boosts[stat] && move.self.boosts[stat] < 0) {
            this.self = move.self;
        }
        if (move.multihit)
            this.multihit = move.multihit;
        if (move.drain)
            this.drain = move.drain;
        if (move.willCrit)
            this.willCrit = move.willCrit;
        if (move.priority > 0)
            this.priority = move.priority;
        this.flags = {};
        if (dex.gen >= 2) {
            if (move.breaksProtect)
                this.breaksProtect = move.breaksProtect;
        }
        if (dex.gen >= 3) {
            if (move.flags.contact)
                this.flags.contact = move.flags.contact;
            if (move.flags.sound)
                this.flags.sound = move.flags.sound;
            if (['allAdjacent', 'allAdjacentFoes'].includes(move.target)) {
                this.target = move.target;
            }
        }
        if (dex.gen >= 4) {
            if (move.flags.punch)
                this.flags.punch = move.flags.punch;
            if (move.flags.bite)
                this.flags.bite = move.flags.bite;
        }
        if (dex.gen >= 5) {
            if (move.ignoreDefensive)
                this.ignoreDefensive = move.ignoreDefensive;
            if (move.defensiveCategory && move.defensiveCategory !== move.category) {
                this.defensiveCategory = move.defensiveCategory;
            }
            if ('secondaries' in move && ((_b = move.secondaries) === null || _b === void 0 ? void 0 : _b.length)) {
                this.secondaries = true;
            }
        }
        if (dex.gen >= 6) {
            if (move.flags.bullet)
                this.flags.bullet = move.flags.bullet;
            if (move.flags.pulse)
                this.flags.pulse = move.flags.pulse;
        }
        if (dex.gen >= 7) {
            if (move.isZ)
                this.isZ = true;
            if ((_c = move.zMove) === null || _c === void 0 ? void 0 : _c.basePower)
                this.zMove = { basePower: move.zMove.basePower };
        }
        if (dex.gen >= 8) {
            if (move.isMax)
                this.isMax = true;
            if (move.maxMove)
                this.maxMove = { basePower: move.maxMove.basePower };
        }
    }
    return Move;
}());
var Species = (function () {
    function Species(dex) {
        this.dex = dex;
    }
    Species.prototype.get = function (name) {
        var species = this.dex.getSpecies(name);
        if (this.dex.gen >= 6 && species.id === 'aegislashboth')
            return AegislashBoth(this.dex);
        return exists(species, this.dex.gen) ? new Specie(species, this.dex) : undefined;
    };
    Species.prototype[Symbol.iterator] = function () {
        var _a, _b, _i, id, s;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in this.dex.data.Species)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 6];
                    id = _a[_i];
                    s = this.get(id);
                    if (!s) return [3, 5];
                    if (!(id === 'aegislash')) return [3, 3];
                    return [4, AegislashBoth(this.dex)];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3: return [4, s];
                case 4:
                    _c.sent();
                    _c.label = 5;
                case 5:
                    _i++;
                    return [3, 1];
                case 6: return [2];
            }
        });
    };
    return Species;
}());
function NoMove(dex) {
    return new Move({
        id: 'nomove',
        name: '(No Move)',
        basePower: 0,
        type: 'Normal',
        category: 'Status',
        target: 'any',
        flags: {},
        gen: 1,
        priority: 0
    }, dex);
}
var Specie = (function () {
    function Specie(species, dex) {
        var _a, _b;
        this.kind = 'Species';
        this.id = (species.id === 'aegislash' ? 'aegislashshield' : species.id);
        this.name = (species.name === 'Aegislash' ? 'Aegislash-Shield' : species.name);
        this.types = species.types;
        this.baseStats = species.baseStats;
        this.weightkg = species.weightkg;
        var nfe = !!((_a = species.evos) === null || _a === void 0 ? void 0 : _a.some(function (s) { return exists(dex.getSpecies(s), dex.gen); }));
        if (nfe)
            this.nfe = nfe;
        if (species.gender === 'N' && dex.gen > 1)
            this.gender = species.gender;
        var formes = (_b = species.otherFormes) === null || _b === void 0 ? void 0 : _b.filter(function (s) { return exists(dex.getSpecies(s), dex.gen); });
        if (species.id.startsWith('aegislash')) {
            if (species.id === 'aegislashblade') {
                this.otherFormes = ['Aegislash-Shield', 'Aegislash-Both'];
            }
            else {
                this.baseSpecies = 'Aegislash-Blade';
            }
        }
        else if (species.id === 'toxtricity') {
            this.otherFormes = [
                'Toxtricity-Gmax', 'Toxtricity-Low-Key', 'Toxtricity-Low-Key-Gmax',
            ];
        }
        else if (species.id === 'toxtricitylowkey') {
            this.baseSpecies = 'Toxtricity';
        }
        else if (species.id === 'urshifu') {
            this.otherFormes = [
                'Urshifu-Gmax', 'Urshifu-Rapid-Strike', 'Urshifu-Rapid-Strike-Gmax',
            ];
        }
        else if (species.id === 'eternatus') {
            this.otherFormes = ['Eternatus-Eternamax'];
        }
        else if (formes === null || formes === void 0 ? void 0 : formes.length) {
            this.otherFormes = __spread(formes).sort();
        }
        else if (species.baseSpecies !== this.name) {
            this.baseSpecies = species.baseSpecies;
        }
        if (dex.gen === 8 && species.canGigantamax &&
            !(species.id.startsWith('toxtricity') || species.id.startsWith('urshifu'))) {
            var formes_1 = this.otherFormes || [];
            var gmax = dex.getSpecies(species.name + "-Gmax");
            if (exists(gmax, dex.gen))
                this.otherFormes = __spread(formes_1, [gmax.name]).sort();
        }
        if (dex.gen > 2)
            this.abilities = { 0: species.abilities[0] };
    }
    return Specie;
}());
function AegislashBoth(dex) {
    var shield = dex.getSpecies('aegislash');
    var blade = dex.getSpecies('aegislashblade');
    var baseStats = {
        hp: shield.baseStats.hp,
        atk: blade.baseStats.atk,
        def: shield.baseStats.def,
        spa: blade.baseStats.spa,
        spd: shield.baseStats.spd,
        spe: shield.baseStats.spe
    };
    return new Specie(__assign(__assign({}, shield), { baseStats: baseStats, id: 'aegislashboth', name: 'Aegislash-Both' }), dex);
}
var DAMAGE_TAKEN = [1, 2, 0.5, 0];
var Types = (function () {
    function Types(dex) {
        this.dex = dex;
        var unknown = {
            kind: 'Type',
            id: '',
            name: '???',
            effectiveness: {}
        };
        this.byID = {};
        for (var t1 in this.dex.data.Types) {
            var id = toID(t1);
            var name_1 = t1;
            var effectiveness = { '???': 1 };
            for (var t2 in this.dex.data.Types) {
                var t = t2;
                effectiveness[t] = DAMAGE_TAKEN[this.dex.data.Types[t].damageTaken[name_1]];
            }
            unknown.effectiveness[name_1] = 1;
            this.byID[id] = { kind: 'Type', id: id, name: name_1, effectiveness: effectiveness };
        }
        this.byID[unknown.id] = unknown;
    }
    Types.prototype.get = function (name) {
        return this.byID[toID(name)];
    };
    Types.prototype[Symbol.iterator] = function () {
        var _a, _b, _i, id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in this.byID)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    id = _a[_i];
                    return [4, this.byID[id]];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    };
    return Types;
}());
exports.Types = Types;
var Natures = (function () {
    function Natures(dex) {
        this.dex = dex;
    }
    Natures.prototype.get = function (name) {
        var nature = this.dex.getNature(name);
        return nature.exists ? new Nature(nature) : undefined;
    };
    Natures.prototype[Symbol.iterator] = function () {
        var _a, _b, _i, id, n;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in this.dex.data.Natures)
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    id = _a[_i];
                    n = this.get(id);
                    if (!n) return [3, 3];
                    return [4, n];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3, 1];
                case 4: return [2];
            }
        });
    };
    return Natures;
}());
exports.Natures = Natures;
var Nature = (function () {
    function Nature(nature) {
        this.kind = 'Nature';
        this.id = nature.id;
        this.name = nature.name;
        switch (nature.id) {
            case 'hardy':
                this.plus = 'atk';
                this.minus = 'atk';
                break;
            case 'docile':
                this.plus = 'def';
                this.minus = 'def';
                break;
            case 'bashful':
                this.plus = 'spa';
                this.minus = 'spa';
                break;
            case 'quirky':
                this.plus = 'spd';
                this.minus = 'spd';
                break;
            case 'serious':
                this.plus = 'spe';
                this.minus = 'spe';
                break;
            default:
                this.plus = nature.plus;
                this.minus = nature.minus;
        }
    }
    return Nature;
}());
var NATDEX_BANNED = [
    'Pikachu-Cosplay',
    'Pikachu-Rock-Star',
    'Pikachu-Belle',
    'Pikachu-Pop-Star',
    'Pikachu-PhD',
    'Pikachu-Libre',
    'Pichu-Spiky-eared',
    'Floette-Eternal',
    'Magearna-Original',
];
function exists(val, gen) {
    if (!val.exists || val.id === 'noability')
        return false;
    if (gen === 7 && val.isNonstandard === 'LGPE')
        return true;
    if (gen === 8 && val.isNonstandard === 'Past' && !NATDEX_BANNED.includes(val.name))
        return true;
    if (gen === 8 && ['eternatuseternamax', 'zarude', 'zarudedada'].includes(val.id))
        return true;
    if (val.isNonstandard && !['CAP', 'Unobtainable', 'Gigantamax'].includes(val.isNonstandard)) {
        return false;
    }
    return !('tier' in val && ['Illegal', 'Unreleased'].includes(val.tier));
}
//# sourceMappingURL=gen.js.map