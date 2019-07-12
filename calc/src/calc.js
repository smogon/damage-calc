function calculate(gen, attacker, defender, move, field) {
	var MECHANICS = [
		function () {}, calculateRBY, calculateGSC, calculateADV,
		calculateDPP, calculateBW, calculateBW, calculateBW
	];
	return MECHANICS[gen](gen, attacker, defender, move, field);
}
