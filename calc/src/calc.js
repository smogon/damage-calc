function calculate(gen, attacker, defender, move, field) {
	var MECHANICS = [
		function () {}, calculateRBY, calculateGSC, calculateADV,
		calculateDPP, calculateBW, calculateXY, calculateSM
	];
	return MECHANICS[gen](attacker, defender, move, field);
}
