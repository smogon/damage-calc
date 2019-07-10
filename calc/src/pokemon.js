function Pokemon(
	name, type1, type2, rawStats, boosts, stats, evs, level, HPEVs,
	maxHP, curHP, nature, ability, abilityOn, item, status, toxicCounter,
	moves, weight, gender
) {
	this.name = name;
	this.type1 = type1;
	this.type2 = type2;
	this.rawStats = rawStats;
	this.boosts = boosts;
	this.stats = stats;
	this.evs = evs;
	this.level = level;
	this.HPEVs = HPEVs;
	this.maxHP = maxHP;
	this.curHP = curHP;
	this.nature = nature;
	this.ability = ability;
	this.abilityOn = abilityOn;
	this.item = item;
	this.status = status;
	this.toxicCounter = toxicCounter;
	this.moves = moves;
	this.weight = weight;
	this.gender = gender;

	this.hasAbility = function (ability) {
		for (var i = 0; i < arguments.length; i++) {
			if (this.ability === arguments[i]) {
				return true;
			}
		}
		return false;
	};
	this.hasItem = function (item) {
		for (var i = 0; i < arguments.length; i++) {
			if (this.item === arguments[i]) {
				return true;
			}
		}
		return false;
	};
	this.hasStatus = function (status) {
		for (var i = 0; i < arguments.length; i++) {
			if (this.status === arguments[i]) {
				return true;
			}
		}
		return false;
	};
	this.hasType = function (type) {
		return this.type1 === type || this.type2 === type;
	};
	this.named = function (name) {
		for (var i = 0; i < arguments.length; i++) {
			if (this.name === arguments[i]) {
				return true;
			}
		}
		return false;
	};
}
