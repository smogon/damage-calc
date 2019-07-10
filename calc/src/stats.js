var HP = "hp", AT = "at", DF = "df", SA = "sa", SD = "sd", SP = "sp", SL = "sl";
var STATS_RBY = [AT, DF, SL, SP];
var STATS_GSC = [AT, DF, SA, SD, SP];

function toSmogonStat(stat) {
	return stat === AT ? "Atk" :
		stat === DF ? "Def" :
			stat === SA ? "SpA" :
				stat === SD ? "SpD" :
					stat === SP ? "Spe" :
						"wtf";
}

function calcStatRBYFromDV(stat, base, dv, level) {
	if (stat === HP) {
		return Math.floor(((base + dv) * 2 + 63) * level / 100) + level + 10;
	} else {
		return Math.floor(((base + dv) * 2 + 63) * level / 100) + 5;
	}
}

function calcStatRBY(stat, base, iv, ev, level, nature) {
	return calcStatRBYFromDV(stat, base, IVToDV(iv), level);
}

function calcStatADV(stat, base, iv, ev, level, nature) {
	if (stat === HP) {
		return base === 1 ?
			base :
			Math.floor((base * 2 + iv + Math.floor(ev / 4)) * level / 100) + level +
            10;
	} else {
		var mods = nature ? NATURES[nature] : [undefined, undefined];
		var n;
		if (mods) {
			n = (mods[0] === stat ? 1.1 : mods[1] === stat ? 0.9 : 1);
		} else {
			n = 1;
		}

		return Math.floor(
			(Math.floor((base * 2 + iv + Math.floor(ev / 4)) * level / 100) + 5) *
        n);
	}
}

function getHPDV(ivs) {
	return (IVToDV(ivs.atk) % 2) * 8 + (IVToDV(ivs.def) % 2) * 4 +
      (IVToDV(ivs.spe) % 2) * 2 + (IVToDV(ivs.spc) % 2);
}

function IVToDV(iv) {
	return Math.floor(iv / 2);
}

function DVToIV(dv) {
	return dv * 2 + 1;
}

var STATS = [[], STATS_RBY, STATS_GSC, STATS_GSC, STATS_GSC, STATS_GSC, STATS_GSC, STATS_GSC];
