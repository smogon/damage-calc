function calculateDamage(gen, attacker, defender, move, field) {
	var MECHANICS = [
		function () {}, CALCULATE_DAMAGE_RBY, CALCULATE_DAMAGE_GSC, CALCULATE_DAMAGE_ADV,
		CALCULATE_DAMAGE_DPP, CALCULATE_DAMAGE_BW, CALCULATE_DAMAGE_BW, CALCULATE_DAMAGE_BW
	];
	return MECHANICS[gen](gen, attacker, defender, move, field);
}
