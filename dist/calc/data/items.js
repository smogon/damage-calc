"use strict";
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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var e_1, _a, e_2, _b;
exports.__esModule = true;

var util_1 = require("../util");
var RBY = [];
var GSC = [
    'Berry Juice',
    'Berry',
    'Berserk Gene',
    'Bitter Berry',
    'Black Belt',
    'Black Glasses',
    'Bright Powder',
    'Burnt Berry',
    'Charcoal',
    'Dragon Fang',
    'Dragon Scale',
    'Energy Powder',
    'Fast Ball',
    'Fire Stone',
    'Focus Band',
    'Friend Ball',
    'Gold Berry',
    'Great Ball',
    'Hard Stone',
    'Heavy Ball',
    'Ice Berry',
    'King\'s Rock',
    'Leaf Stone',
    'Leftovers',
    'Level Ball',
    'Light Ball',
    'Love Ball',
    'Lucky Punch',
    'Lure Ball',
    'Magnet',
    'Mail',
    'Master Ball',
    'Metal Coat',
    'Metal Powder',
    'Mint Berry',
    'Miracle Berry',
    'Miracle Seed',
    'Moon Ball',
    'Moon Stone',
    'Mystery Berry',
    'Mystic Water',
    'Never-Melt Ice',
    'Pink Bow',
    'Poison Barb',
    'Poke Ball',
    'Polkadot Bow',
    'PRZ Cure Berry',
    'PSN Cure Berry',
    'Quick Claw',
    'Safari Ball',
    'Scope Lens',
    'Sharp Beak',
    'Silver Powder',
    'Soft Sand',
    'Spell Tag',
    'Sport Ball',
    'Stick',
    'Sun Stone',
    'Thick Club',
    'Thunder Stone',
    'Twisted Spoon',
    'Ultra Ball',
    'Up-Grade',
    'Water Stone',
];
var GSC_ONLY = [
    'Berry',
    'Berserk Gene',
    'Bitter Berry',
    'Burnt Berry',
    'Ice Berry',
    'Mint Berry',
    'Miracle Berry',
    'Mystery Berry',
    'PRZ Cure Berry',
    'Gold Berry',
    'Pink Bow',
    'Polkadot Bow',
    'PSN Cure Berry',
    'Enigma Berry',
];
var ADV = GSC.filter(function (i) { return !GSC_ONLY.includes(i); }).concat([
    'Aguav Berry',
    'Apicot Berry',
    'Aspear Berry',
    'Belue Berry',
    'Bluk Berry',
    'Cheri Berry',
    'Chesto Berry',
    'Choice Band',
    'Claw Fossil',
    'Cornn Berry',
    'Deep Sea Scale',
    'Deep Sea Tooth',
    'Dive Ball',
    'Dome Fossil',
    'Durin Berry',
    'Enigma Berry',
    'Figy Berry',
    'Ganlon Berry',
    'Grepa Berry',
    'Helix Fossil',
    'Hondew Berry',
    'Iapapa Berry',
    'Kelpsy Berry',
    'Lansat Berry',
    'Lax Incense',
    'Leppa Berry',
    'Liechi Berry',
    'Lum Berry',
    'Luxury Ball',
    'Macho Brace',
    'Mago Berry',
    'Magost Berry',
    'Mental Herb',
    'Nanab Berry',
    'Nest Ball',
    'Net Ball',
    'Nomel Berry',
    'Old Amber',
    'Oran Berry',
    'Pamtre Berry',
    'Pecha Berry',
    'Persim Berry',
    'Petaya Berry',
    'Pinap Berry',
    'Pomeg Berry',
    'Premier Ball',
    'Qualot Berry',
    'Rabuta Berry',
    'Rawst Berry',
    'Razz Berry',
    'Repeat Ball',
    'Root Fossil',
    'Salac Berry',
    'Sea Incense',
    'Shell Bell',
    'Silk Scarf',
    'Sitrus Berry',
    'Soul Dew',
    'Spelon Berry',
    'Starf Berry',
    'Tamato Berry',
    'Timer Ball',
    'Watmel Berry',
    'Wepear Berry',
    'White Herb',
    'Wiki Berry',
]);
var DPP = ADV.concat([
    'Adamant Orb',
    'Armor Fossil',
    'Babiri Berry',
    'Big Root',
    'Black Sludge',
    'Charti Berry',
    'Cherish Ball',
    'Chilan Berry',
    'Choice Scarf',
    'Choice Specs',
    'Chople Berry',
    'Coba Berry',
    'Colbur Berry',
    'Custap Berry',
    'Damp Rock',
    'Dawn Stone',
    'Destiny Knot',
    'Draco Plate',
    'Dread Plate',
    'Dubious Disc',
    'Dusk Ball',
    'Dusk Stone',
    'Earth Plate',
    'Electirizer',
    'Expert Belt',
    'Fist Plate',
    'Flame Orb',
    'Flame Plate',
    'Focus Sash',
    'Full Incense',
    'Grip Claw',
    'Griseous Orb',
    'Haban Berry',
    'Heal Ball',
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
    'Light Clay',
    'Lustrous Orb',
    'Magmarizer',
    'Meadow Plate',
    'Metronome',
    'Micle Berry',
    'Mind Plate',
    'Muscle Band',
    'Occa Berry',
    'Odd Incense',
    'Oval Stone',
    'Park Ball',
    'Passho Berry',
    'Payapa Berry',
    'Power Anklet',
    'Power Band',
    'Power Belt',
    'Power Bracer',
    'Power Herb',
    'Power Lens',
    'Power Weight',
    'Protector',
    'Quick Ball',
    'Quick Powder',
    'Rare Bone',
    'Razor Claw',
    'Razor Fang',
    'Reaper Cloth',
    'Rindo Berry',
    'Rock Incense',
    'Rose Incense',
    'Rowap Berry',
    'Shed Shell',
    'Shiny Stone',
    'Shuca Berry',
    'Skull Fossil',
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
var BW = DPP.concat([
    'Absorb Bulb',
    'Air Balloon',
    'Binding Band',
    'Bug Gem',
    'Burn Drive',
    'Cell Battery',
    'Chill Drive',
    'Cover Fossil',
    'Dark Gem',
    'Douse Drive',
    'Dragon Gem',
    'Dream Ball',
    'Eject Button',
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
    'Plume Fossil',
    'Poison Gem',
    'Prism Scale',
    'Psychic Gem',
    'Red Card',
    'Ring Target',
    'Rock Gem',
    'Rocky Helmet',
    'Shock Drive',
    'Steel Gem',
    'Water Gem',
]);
exports.MEGA_STONES = {
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
    Venusaurite: 'Venusaur'
};
var XY = BW.concat(__spread(Object.keys(exports.MEGA_STONES), [
    'Assault Vest',
    'Blue Orb',
    'Fairy Gem',
    'Jaw Fossil',
    'Kee Berry',
    'Luminous Moss',
    'Maranga Berry',
    'Pixie Plate',
    'Red Orb',
    'Roseli Berry',
    'Sachet',
    'Safety Goggles',
    'Sail Fossil',
    'Snowball',
    'Weakness Policy',
    'Whipped Dream',
]).sort());
var SM = XY.filter(function (i) { return i !== 'Old Amber'; }).concat([
    'Adrenaline Orb',
    'Aloraichium Z',
    'Beast Ball',
    'Bottle Cap',
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
    'Gold Bottle Cap',
    'Grass Memory',
    'Grassium Z',
    'Grassy Seed',
    'Ground Memory',
    'Groundium Z',
    'Ice Memory',
    'Ice Stone',
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
    'Poison Memory',
    'Poisonium Z',
    'Primarium Z',
    'Protective Pads',
    'Psychic Memory',
    'Psychic Seed',
    'Psychium Z',
    'Rock Memory',
    'Rockium Z',
    'Snorlium Z',
    'Solganium Z',
    'Steel Memory',
    'Steelium Z',
    'Tapunium Z',
    'Terrain Extender',
    'Ultranecrozium Z',
    'Water Memory',
    'Waterium Z',
]);
var SS = SM.concat([
    'Berry Sweet',
    'Blunder Policy',
    'Chipped Pot',
    'Clover Sweet',
    'Cracked Pot',
    'Eject Pack',
    'Flower Sweet',
    'Fossilized Bird',
    'Fossilized Dino',
    'Fossilized Drake',
    'Fossilized Fish',
    'Galarica Cuff',
    'Galarica Wreath',
    'Heavy-Duty Boots',
    'Leek',
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
for (var i = 0; i < 100; i++) {
    SS.push("TR" + (i < 10 ? "0" + i : i));
}
SS.push('Utility Umbrella');
SS.push.apply(SS, __spread(GSC_ONLY, ['Old Amber']));
var BERRIES = {
    'Aguav Berry': { t: 'Dragon', p: 80 },
    'Apicot Berry': { t: 'Ground', p: 100 },
    'Aspear Berry': { t: 'Ice', p: 80 },
    'Babiri Berry': { t: 'Steel', p: 80 },
    'Belue Berry': { t: 'Electric', p: 100 },
    Berry: { t: 'Poison', p: 80 },
    'Bitter Berry': { t: 'Ground', p: 80 },
    'Bluk Berry': { t: 'Fire', p: 90 },
    'Burnt Berry': { t: 'Ice', p: 80 },
    'Charti Berry': { t: 'Rock', p: 80 },
    'Cheri Berry': { t: 'Fire', p: 80 },
    'Chesto Berry': { t: 'Water', p: 80 },
    'Chilan Berry': { t: 'Normal', p: 80 },
    'Chople Berry': { t: 'Fighting', p: 80 },
    'Coba Berry': { t: 'Flying', p: 80 },
    'Colbur Berry': { t: 'Dark', p: 80 },
    'Cornn Berry': { t: 'Bug', p: 90 },
    'Custap Berry': { t: 'Ghost', p: 100 },
    'Durin Berry': { t: 'Water', p: 100 },
    'Enigma Berry': { t: 'Bug', p: 100 },
    'Figy Berry': { t: 'Bug', p: 80 },
    'Ganlon Berry': { t: 'Ice', p: 100 },
    'Gold Berry': { t: 'Psychic', p: 80 },
    'Grepa Berry': { t: 'Flying', p: 90 },
    'Haban Berry': { t: 'Dragon', p: 80 },
    'Hondew Berry': { t: 'Ground', p: 90 },
    'Iapapa Berry': { t: 'Dark', p: 80 },
    'Ice Berry': { t: 'Grass', p: 80 },
    'Jaboca Berry': { t: 'Dragon', p: 100 },
    'Kasib Berry': { t: 'Ghost', p: 80 },
    'Kebia Berry': { t: 'Poison', p: 80 },
    'Kee Berry': { t: 'Fairy', p: 100 },
    'Kelpsy Berry': { t: 'Fighting', p: 90 },
    'Lansat Berry': { t: 'Flying', p: 100 },
    'Leppa Berry': { t: 'Fighting', p: 80 },
    'Liechi Berry': { t: 'Grass', p: 100 },
    'Lum Berry': { t: 'Flying', p: 80 },
    'Mago Berry': { t: 'Ghost', p: 80 },
    'Magost Berry': { t: 'Rock', p: 90 },
    'Maranga Berry': { t: 'Dark', p: 100 },
    'Micle Berry': { t: 'Rock', p: 100 },
    'Mint Berry': { t: 'Water', p: 80 },
    'Miracle Berry': { t: 'Flying', p: 80 },
    'Mystery Berry': { t: 'Fighting', p: 80 },
    'Nanab Berry': { t: 'Water', p: 90 },
    'Nomel Berry': { t: 'Dragon', p: 90 },
    'Occa Berry': { t: 'Fire', p: 80 },
    'Oran Berry': { t: 'Poison', p: 80 },
    'Pamtre Berry': { t: 'Steel', p: 90 },
    'Passho Berry': { t: 'Water', p: 80 },
    'Payapa Berry': { t: 'Psychic', p: 80 },
    'Pecha Berry': { t: 'Electric', p: 80 },
    'Persim Berry': { t: 'Ground', p: 80 },
    'Petaya Berry': { t: 'Poison', p: 100 },
    'Pinap Berry': { t: 'Grass', p: 90 },
    'Pomeg Berry': { t: 'Ice', p: 90 },
    'PRZ Cure Berry': { t: 'Fire', p: 80 },
    'PSN Cure Berry': { t: 'Electric', p: 80 },
    'Qualot Berry': { t: 'Poison', p: 90 },
    'Rabuta Berry': { t: 'Ghost', p: 90 },
    'Rawst Berry': { t: 'Grass', p: 80 },
    'Razz Berry': { t: 'Steel', p: 80 },
    'Rindo Berry': { t: 'Grass', p: 80 },
    'Roseli Berry': { t: 'Fairy', p: 80 },
    'Rowap Berry': { t: 'Dark', p: 100 },
    'Salac Berry': { t: 'Fighting', p: 100 },
    'Shuca Berry': { t: 'Ground', p: 80 },
    'Sitrus Berry': { t: 'Psychic', p: 80 },
    'Spelon Berry': { t: 'Dark', p: 90 },
    'Starf Berry': { t: 'Psychic', p: 100 },
    'Tamato Berry': { t: 'Psychic', p: 90 },
    'Tanga Berry': { t: 'Bug', p: 80 },
    'Wacan Berry': { t: 'Electric', p: 80 },
    'Watmel Berry': { t: 'Fire', p: 100 },
    'Wepear Berry': { t: 'Electric', p: 90 },
    'Wiki Berry': { t: 'Rock', p: 80 },
    'Yache Berry': { t: 'Ice', p: 80 }
};
exports.ITEMS = [[], RBY, GSC, ADV, DPP, BW, XY, SM, SS];
var Items = (function () {
    function Items(gen) {
        this.gen = gen;
    }
    Items.prototype.get = function (id) {
        return ITEMS_BY_ID[this.gen][id];
    };
    Items.prototype[Symbol.iterator] = function () {
        var _a, _b, _i, id;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [];
                    for (_b in ITEMS_BY_ID[this.gen])
                        _a.push(_b);
                    _i = 0;
                    _c.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3, 4];
                    id = _a[_i];
                    return [4, this.get(id)];
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
exports.Items = Items;
var Item = (function () {
    function Item(name, gen) {
        this.kind = 'Item';
        this.id = util_1.toID(name);
        this.name = name;
        this.megaEvolves = exports.MEGA_STONES[name];
        var berry = BERRIES[name];
        if (berry) {
            this.isBerry = true;
            this.naturalGift = {
                basePower: gen < 6 ? berry.p - 20 : berry.p,
                type: berry.t
            };
        }
    }
    return Item;
}());
var ITEMS_BY_ID = [];
var gen = 0;
try {
    for (var ITEMS_1 = __values(exports.ITEMS), ITEMS_1_1 = ITEMS_1.next(); !ITEMS_1_1.done; ITEMS_1_1 = ITEMS_1.next()) {
        var items = ITEMS_1_1.value;
        var map = {};
        try {
            for (var items_1 = (e_2 = void 0, __values(items)), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
                var item = items_1_1.value;
                var i = new Item(item, gen);
                map[i.id] = i;
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (items_1_1 && !items_1_1.done && (_b = items_1["return"])) _b.call(items_1);
            }
            finally { if (e_2) throw e_2.error; }
        }
        ITEMS_BY_ID.push(map);
        gen++;
    }
}
catch (e_1_1) { e_1 = { error: e_1_1 }; }
finally {
    try {
        if (ITEMS_1_1 && !ITEMS_1_1.done && (_a = ITEMS_1["return"])) _a.call(ITEMS_1);
    }
    finally { if (e_1) throw e_1.error; }
}
//# sourceMappingURL=items.js.map