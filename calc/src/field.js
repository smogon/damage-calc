function Field(
	format, isGravity, isSR, weather, spikes, terrain, isReflect,
	isLightScreen, isProtected, isSeeded, isForesight, isHelpingHand,
	isTailwind, isFriendGuard, isAuroraVeil, isBattery
) {
	this.getWeather = function () {
		return weather;
	};
	this.clearWeather = function () {
		weather = "";
	};
	this.getSide = function (i) {
		return new Side(
			format, terrain, weather, isGravity, isSR[i], spikes[i], isReflect[i],
			isLightScreen[i], isProtected[i], isSeeded[1 - i], isSeeded[i], isForesight[i],
			isHelpingHand[i], isTailwind[i], isFriendGuard[i], isAuroraVeil[i], isBattery[i]);
	};
}

function Side(
	format, terrain, weather, isGravity, isSR, spikes, isReflect, isLightScreen,
	isProtected, isAttackerSeeded, isDefenderSeeded, isForesight, isHelpingHand,
	isTailwind, isFriendGuard, isAuroraVeil, isBattery
) {
	this.format = format;
	this.terrain = terrain;
	this.weather = weather;
	this.isGravity = isGravity;
	this.isSR = isSR;
	this.spikes = spikes;
	this.isReflect = isReflect;
	this.isLightScreen = isLightScreen;
	this.isProtected = isProtected;
	this.isAttackerSeeded = isAttackerSeeded;
	this.isDefenderSeeded = isDefenderSeeded;
	this.isForesight = isForesight;
	this.isHelpingHand = isHelpingHand;
	this.isTailwind = isTailwind;
	this.isFriendGuard = isFriendGuard;
	this.isAuroraVeil = isAuroraVeil;
	this.isBattery = isBattery;
	this.hasWeather = function (weather) {
		for (var i = 0; i < arguments.length; i++) {
			if (this.weather === arguments[i]) {
				return true;
			}
		}
		return false;
	};
}
