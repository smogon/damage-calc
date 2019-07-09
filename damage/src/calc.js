function CALCULATE_DAMAGE(gen, attacker, defender, move, field, attackerSideNum) {
	var MECHANICS = [
		CALCULATE_DAMAGE_RBY, CALCULATE_DAMAGE_GSC, CALCULATE_DAMAGE_ADV, CALCULATE_DAMAGE_DPP,
		CALCULATE_DAMAGE_BW, CALCULATE_DAMAGE_BW, CALCULATE_DAMAGE_BW
	];
	return MECHANICS[gen - 1](attacker, defender, move, field, attackerSideNum);
}
