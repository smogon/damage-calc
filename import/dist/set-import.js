"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const data_1 = require("@pkmn/data");
const dex_1 = require("@pkmn/dex");
const sim_1 = require("@pkmn/sim");
const VALIDATORS = {};
const UNSUPPORTED = {
    'gen9almostanyability': '[Gen 9] Almost Any Ability',
};
const SHORT_STAT_FORM = { 'hp': 'hp', 'atk': 'at', 'def': 'df', 'spa': 'sa', 'spd': 'sd', 'spe': 'sp' };
const USELESS_NATURES = ['Bashful', 'Docile', 'Hardy', 'Quirky', 'Serious'];
const CROWNED = { 'Zacian-Crowned': 'Behemoth Blade', 'Zamazenta-Crowned': 'Behemoth Bash' };
const TIER_RANKINGS = {
    ou: 0,
    ubers: 1,
    uu: 2,
    ru: 3,
    nu: 4,
    pu: 5,
    lc: 6,
    doublesou: 7,
    vgc: 8,
    bss: 9,
    monotype: 10,
    nationaldex: 11,
    nationaldexubers: 12,
    nationaldexuu: 13,
    nationaldexru: 14,
    nationaldexmonotype: 15,
    anythinggoes: 16,
    '1v1': 17,
    balancedhackmons: 18,
    purehackmons: 19,
    almostanyability: 20,
    zu: 21,
    cap: 22,
    tradebacksou: 23,
};
function first(v) {
    return Array.isArray(v) ? v[0] : v;
}
function top(weighted, n = 1) {
    if (n === 0)
        return undefined;
    if (n === 1) {
        let max;
        for (const key in weighted) {
            if (!max || weighted[max] < weighted[key])
                max = key;
        }
        return max;
    }
    return Object.entries(weighted)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n)
        .map(x => x[0]);
}
function getTierRanking(tier) {
    var _a;
    const isVGC = tier.startsWith('vgc');
    const isBSS = tier.startsWith('battlestadium') || tier.startsWith('battlespot');
    return (_a = TIER_RANKINGS[isVGC ? 'vgc' : isBSS ? 'bss' : tier]) !== null && _a !== void 0 ? _a : 100;
}
function toCalcStatsTable(stats, ignoreVal) {
    const calcStatsTable = {};
    let isEmpty = true;
    let stat;
    for (stat in stats) {
        if (stats[stat] === ignoreVal)
            continue;
        if (stat in SHORT_STAT_FORM) {
            calcStatsTable[SHORT_STAT_FORM[stat]] = stats[stat];
            isEmpty = false;
        }
    }
    return isEmpty ? undefined : calcStatsTable;
}
function getUsageThreshold(formatID, count) {
    if (count < 100)
        return Infinity;
    if (count < 400)
        return 0.05;
    return /uber|anythinggoes|doublesou|gen1nu|gen1pu/.test(formatID) ? 0.03 : 0.01;
}
function fromSpread(spread) {
    const [nature, revs] = spread.split(':');
    const evs = {};
    const stats = sim_1.Dex.stats.ids();
    for (const [i, rev] of revs.split('/').entries()) {
        const ev = Number(rev);
        if (ev)
            evs[stats[i]] = ev;
    }
    return { nature, evs };
}
function expectedHP(ivs) {
    ivs = sim_1.TeamValidator.fillStats(ivs, 31);
    const atkDV = Math.floor(ivs.atk / 2);
    const defDV = Math.floor(ivs.def / 2);
    const speDV = Math.floor(ivs.spe / 2);
    const spcDV = Math.floor(ivs.spa / 2);
    return 2 * ((atkDV % 2) * 8 + (defDV % 2) * 4 + (speDV % 2) * 2 + (spcDV % 2));
}
function getLevel(formatID) {
    if (formatID.includes('lc')) {
        return 5;
    }
    if (formatID.includes('vgc') || formatID.includes('battlestadium')) {
        return 50;
    }
    return 100;
}
function getSpecie(gen, specieName) {
    var _a;
    return (_a = gen.species.get(specieName)) !== null && _a !== void 0 ? _a : dex_1.Dex.forGen(gen.num).species.get(specieName);
}
function toPSFormat(formatID) {
    if (formatID === 'gen9vgc2024') {
        return `${formatID}regh`;
    }
    if (formatID === 'gen9battlestadiumsingles') {
        return 'gen9bssregh';
    }
    return formatID;
}
function dexToPset(gen, formatID, specie, dset) {
    var _a, _b, _c, _d, _e, _f, _g;
    const pset = {
        name: '',
        species: specie.name,
        item: (_a = first(dset.item)) !== null && _a !== void 0 ? _a : '',
        ability: (_b = first(dset.ability)) !== null && _b !== void 0 ? _b : specie.abilities[0],
        moves: dset.moves.map(first),
        nature: (_c = first(dset.nature)) !== null && _c !== void 0 ? _c : '',
        gender: '',
        evs: sim_1.TeamValidator.fillStats((_d = first(dset.evs)) !== null && _d !== void 0 ? _d : null, gen.num < 3 ? 252 : 0),
        ivs: sim_1.TeamValidator.fillStats((_e = first(dset.ivs)) !== null && _e !== void 0 ? _e : null, gen.num === 2 ? 30 : 31),
        level: (_f = first(dset.level)) !== null && _f !== void 0 ? _f : getLevel(formatID),
        teraType: first(dset.teratypes),
    };
    const hp = (_g = pset.moves) === null || _g === void 0 ? void 0 : _g.find(m => m.startsWith('Hidden Power'));
    if (!hp) {
        return pset;
    }
    const dex = gen.dex;
    const type = hp.slice(13);
    if (type && dex.getHiddenPower(pset.ivs).type !== type) {
        if (dex.gen >= 7 && pset.level === 100) {
            pset.hpType = type;
        }
        else if (dex.gen === 2) {
            const dvs = Object.assign({}, dex.types.get(type).HPdvs);
            let stat;
            for (stat in dvs) {
                dvs[stat] *= 2;
            }
            pset.ivs = Object.assign(pset.ivs, dvs);
            pset.ivs.hp = expectedHP(pset.ivs);
        }
        else {
            pset.ivs = Object.assign(pset.ivs, dex.types.get(type).HPivs);
        }
    }
    return pset;
}
function usageToPset(gen, formatID, specieName, uset) {
    var _a;
    const { nature, evs } = fromSpread(top(uset.spreads));
    const item = top(uset.items);
    const ability = top(uset.abilities);
    const teraType = top(uset.teraTypes);
    const pset = {
        name: '',
        species: specieName,
        item: !item || item === 'Nothing' ? '' : item,
        ability: !ability || ability === 'No Ability' ? '' : ability,
        moves: top(uset.moves, 4).filter(m => m !== 'Nothing'),
        nature,
        teraType: !teraType || teraType === 'Nothing' ? '' : teraType,
        gender: '',
        evs: sim_1.TeamValidator.fillStats(evs !== null && evs !== void 0 ? evs : null, gen.num < 3 ? 252 : 0),
        ivs: sim_1.TeamValidator.fillStats(null, gen.num === 2 ? 30 : 31),
        level: getLevel(formatID),
    };
    const hp = (_a = pset.moves) === null || _a === void 0 ? void 0 : _a.find(m => m.startsWith('Hidden Power'));
    if (!hp) {
        return pset;
    }
    const dex = gen.dex;
    const type = hp.slice(13);
    if (type && dex.getHiddenPower(pset.ivs).type !== type) {
        if (dex.gen >= 7 && pset.level === 100) {
            pset.hpType = type;
        }
        else if (dex.gen === 2) {
            const dvs = Object.assign({}, dex.types.get(type).HPdvs);
            let stat;
            for (stat in dvs) {
                dvs[stat] *= 2;
            }
            pset.ivs = Object.assign(pset.ivs, dvs);
            pset.ivs.hp = expectedHP(pset.ivs);
        }
        else {
            pset.ivs = Object.assign(pset.ivs, dex.types.get(type).HPivs);
        }
    }
    return pset;
}
function psetToCalcSet(genNum, pset) {
    return {
        level: pset.level === 100 ? undefined : pset.level,
        ability: pset.ability || undefined,
        item: pset.item || undefined,
        nature: !pset.nature || USELESS_NATURES.includes(pset.nature) ? undefined : pset.nature,
        teraType: pset.teraType || undefined,
        ivs: toCalcStatsTable(pset.ivs, genNum === 2 ? 30 : 31),
        evs: toCalcStatsTable(pset.evs, genNum > 2 ? 0 : 252),
        moves: pset.moves,
    };
}
function validatePSet(format, pset, type) {
    let validator = VALIDATORS[format.id];
    if (!validator) {
        validator = VALIDATORS[format.id] = new sim_1.TeamValidator(format);
    }
    const species = pset.species;
    const ability = pset.ability;
    let invalid = validator.validateSet(pset, {});
    if (species in CROWNED) {
        const ironhead = pset.moves.indexOf('ironhead');
        if (ironhead > -1) {
            pset.moves[ironhead] = CROWNED[species];
        }
    }
    pset.ability = ability;
    if (!invalid)
        return true;
    if (invalid.length === 1 && invalid[0].includes('must be shiny')) {
        pset.shiny = true;
        invalid = validator.validateSet(pset, {});
        if (!invalid)
            return true;
    }
    if (invalid.length === 1 && invalid[0].includes('has exactly 0 EVs - did you forget to EV it?')) {
        pset.evs.hp = 1;
        invalid = validator.validateSet(pset, {});
        if (!invalid)
            return true;
    }
    if (format.id === 'gen4ubers' && invalid.includes(`${pset.name} is banned.`)) {
        return true;
    }
    const title = `${format.name}: ${pset.name}`;
    const details = `${JSON.stringify(pset)} = ${invalid.join(', ')}`;
    console.log(`[${type.toUpperCase()}] Invalid set ${title}: ${details}`);
    return false;
}
function similarFormes(pset, specie, item, format, genNum) {
    const similar = {
        formes: [], abilityChange: false,
    };
    if (specie.isMega && item.megaStone) {
        similar.formes = [specie.baseSpecies];
        similar.abilityChange = true;
        return similar;
    }
    if (specie.name === item.megaEvolves) {
        similar.formes = [item.megaStone];
        similar.abilityChange = true;
        return similar;
    }
    if (pset.ability === 'Power Construct' && pset.species.startsWith('Zygarde')) {
        similar.formes = ['Zygarde-Complete'];
        return similar;
    }
    if (pset.ability === 'Battle Bond' && pset.species.startsWith('Greninja') &&
        (genNum === 7 || (genNum === 8 && (format === null || format === void 0 ? void 0 : format.id.includes('nationaldex'))))) {
        similar.formes = ['Greninja-Ash'];
        return similar;
    }
    if (pset.species === 'Rayquaza' && format && pset.moves.includes('Dragon Ascent')) {
        const ruleTable = sim_1.Dex.formats.getRuleTable(format);
        const isMrayAllowed = genNum === 6 || genNum === 7
            ? !ruleTable.has('megarayquazaclause') && !format.banlist.includes('Rayquaza-Mega')
            : format.id.includes('nationaldex') &&
                (!ruleTable.has('megarayquazaclause') && !format.banlist.includes('Rayquaza-Mega'));
        if (isMrayAllowed) {
            similar.formes = ['Rayquaza-Mega'];
            similar.abilityChange = true;
            return similar;
        }
        return similar;
    }
    if (pset.species === 'Rayquaza-Mega' && format &&
        (!format.id.includes('balancedhackmons') && !format.id.includes('bh'))) {
        similar.formes = ['Rayquaza'];
        similar.abilityChange = true;
        return similar;
    }
    if ((pset.species === 'Groudon' || pset.species === 'Groudon-Primal') &&
        pset.item === 'Red Orb') {
        similar.formes = [pset.species === 'Groudon' ? 'Groudon-Primal' : 'Groudon'];
        similar.abilityChange = true;
        return similar;
    }
    if ((pset.species === 'Kyogre' || pset.species === 'Kyogre-Primal') &&
        pset.item === 'Blue Orb') {
        similar.formes = [pset.species === 'Kyogre' ? 'Kyogre-Primal' : 'Kyogre'];
        similar.abilityChange = true;
        return similar;
    }
    if (pset.species === 'Darmanitan-Galar' && pset.ability === 'Zen Mode') {
        similar.formes = ['Darmanitan-Galar-Zen'];
        return similar;
    }
    if (pset.species === 'Darmanitan-Galar-Zen') {
        similar.formes = ['Darmanitan-Galar'];
        return similar;
    }
    if (pset.species === 'Meloetta' && pset.moves.includes('Relic Song')) {
        similar.formes = ['Meloetta-Pirouette'];
        return similar;
    }
    if (pset.species === 'Meloetta-Pirouette') {
        similar.formes = ['Meloetta'];
        return similar;
    }
    switch (specie.name) {
        case 'Aegislash':
            similar.formes = ['Aegislash-Blade', 'Aegislash-Shield', 'Aegislash-Both'];
            break;
        case 'Keldeo':
            similar.formes = ['Keldeo-Resolute'];
            break;
        case 'Minior':
            similar.formes = ['Minior-Meteor'];
            break;
        case 'Palafin':
            similar.formes = ['Palafin-Hero'];
            break;
        case 'Terapagos':
            similar.formes = ['Terapagos-Stellar', 'Terapagos-Terastal'];
            similar.abilityChange = true;
            break;
        case 'Sirfetch\'d':
            similar.formes = ['Sirfetch’d'];
            break;
        case 'Wishiwashi':
            similar.formes = ['Wishiwashi-School'];
    }
    return similar;
}
function fetchDexSets(genNum) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://data.pkmn.cc/sets/gen${genNum}.json`;
        console.log(`Fetching ${url}...`);
        const resp = yield fetch(url);
        if (resp.status === 404)
            return {};
        return resp.json();
    });
}
function fetchStats(formatID) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = `https://data.pkmn.cc/stats/${formatID}.json`;
        console.log(`Fetching ${url}...`);
        const resp = yield fetch(url);
        if (resp.status === 404)
            return false;
        return resp.json();
    });
}
function importGen(gen) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        const calcSets = {};
        const dexSets = yield fetchDexSets(gen.num);
        const formatIDs = new Set();
        const statsIgnore = {};
        for (const [specieName, formats] of Object.entries(dexSets)) {
            for (let [formatID, sets] of Object.entries(formats).sort((a, b) => getTierRanking(a[0]) - getTierRanking(b[0]))) {
                formatID = `gen${gen.num}${formatID}`;
                const psFormat = toPSFormat(formatID);
                const format = UNSUPPORTED[psFormat] ? null : sim_1.Dex.formats.get(psFormat);
                if (format && !format.exists) {
                    continue;
                }
                formatIDs.add(formatID);
                const formatName = (_a = format === null || format === void 0 ? void 0 : format.name) !== null && _a !== void 0 ? _a : UNSUPPORTED[psFormat];
                const specie = getSpecie(gen, specieName);
                for (const [name, set] of Object.entries(sets)) {
                    const pset = dexToPset(gen, formatID, specie, set);
                    if (format && !validatePSet(format, pset, 'dex'))
                        continue;
                    const calcSet = psetToCalcSet(gen.num, pset);
                    const setName = `${formatName.slice(formatName.indexOf(']') + 2)} ${name}`;
                    if (!calcSets[specieName])
                        calcSets[specieName] = {};
                    calcSets[specieName][setName] = calcSet;
                    if (!statsIgnore[specieName])
                        statsIgnore[specieName] = new Set();
                    statsIgnore[specieName].add(formatID);
                    const item = (_b = gen.items.get(pset.item)) !== null && _b !== void 0 ? _b : dex_1.Dex.forGen(gen.num).items.get(pset.item);
                    const copyTo = similarFormes(pset, specie, item, format, gen.num);
                    for (const forme of copyTo.formes) {
                        if (!statsIgnore[forme])
                            statsIgnore[forme] = new Set();
                        statsIgnore[forme].add(formatID);
                        if (!calcSets[forme])
                            calcSets[forme] = {};
                        if (copyTo.abilityChange) {
                            const formeSpecie = getSpecie(gen, forme);
                            calcSets[forme][setName] = Object.assign(Object.assign({}, calcSet), { ability: formeSpecie.abilities[0] });
                        }
                        else {
                            calcSets[forme][setName] = calcSet;
                        }
                    }
                }
            }
        }
        for (const formatID of [...formatIDs].sort((a, b) => getTierRanking(a[0]) - getTierRanking(b[0]))) {
            const psFormat = toPSFormat(formatID);
            const format = UNSUPPORTED[psFormat] ? null : sim_1.Dex.formats.get(psFormat);
            if (format && !format.exists) {
                continue;
            }
            const formatName = format ? format.name : UNSUPPORTED[psFormat];
            let stats = false;
            try {
                stats = yield fetchStats(formatID);
            }
            catch (err) { }
            if (!stats) {
                console.log(`${formatName} has no stats page`);
                continue;
            }
            const threshold = getUsageThreshold(formatID, stats.battles);
            const pokemon = Object.entries(stats.pokemon);
            for (const [specieName, uset] of pokemon) {
                if ((_c = statsIgnore[specieName]) === null || _c === void 0 ? void 0 : _c.has(formatID)) {
                    continue;
                }
                if (uset.usage.weighted < threshold)
                    continue;
                const specie = getSpecie(gen, specieName);
                const pset = usageToPset(gen, formatID, specie.name, uset);
                if (format && !validatePSet(format, pset, 'stats'))
                    continue;
                const calcSet = psetToCalcSet(gen.num, pset);
                if (!calcSets[specieName])
                    calcSets[specieName] = {};
                const setName = `${formatName.slice(formatName.indexOf(']') + 2)} Showdown Usage`;
                calcSets[specieName][setName] = calcSet;
                const item = (_d = gen.items.get(pset.item)) !== null && _d !== void 0 ? _d : dex_1.Dex.forGen(gen.num).items.get(pset.item);
                const copyTo = similarFormes(pset, specie, item, format, gen.num);
                for (const forme of copyTo.formes) {
                    if ((_e = statsIgnore[forme]) === null || _e === void 0 ? void 0 : _e.has(formatID)) {
                        continue;
                    }
                    if (!calcSets[forme])
                        calcSets[forme] = {};
                    if (copyTo.abilityChange) {
                        const formeSpecie = getSpecie(gen, forme);
                        calcSets[forme][setName] = Object.assign(Object.assign({}, calcSet), { ability: formeSpecie.abilities[0] });
                    }
                    else {
                        calcSets[forme][setName] = calcSet;
                    }
                }
            }
        }
        return calcSets;
    });
}
function stringifyCalcSets(calcSets) {
    const buf = [];
    const space = (n = 2) => ' '.repeat(n);
    for (const [specie, sets] of Object.entries(calcSets)) {
        buf.push(`${space()}"${specie}": {`);
        const setsBuf = [];
        for (const [setName, set] of Object.entries(sets)) {
            setsBuf.push(`${space(4)}${JSON.stringify(setName)}: ${JSON.stringify(set)}`);
        }
        buf.push(setsBuf.join(',\n'));
        buf.push(`${space()}},`);
    }
    return buf.join('\n').slice(0, -1);
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    sim_1.Dex.includeData();
    const gens = new data_1.Generations(dex_1.Dex);
    const outDir = process.argv[2];
    if (!fs.statSync(outDir).isDirectory()) {
        console.log(`${outDir} is not a directory`);
        process.exit(1);
    }
    const genNames = ['RBY', 'GSC', 'ADV', 'DPP', 'BW', 'XY', 'SM', 'SS', 'SV'];
    for (const [i, genName] of genNames.entries()) {
        const calcSets = yield importGen(gens.get(i + 1));
        const path = `${outDir}/gen${i + 1}.js`;
        console.log(`Writing ${path}...`);
        fs.writeFileSync(path, `var SETDEX_${genName} = {\n${stringifyCalcSets(calcSets)}\n};\n`);
    }
    process.exit(0);
}))().catch((err) => {
    throw err;
});
//# sourceMappingURL=set-import.js.map