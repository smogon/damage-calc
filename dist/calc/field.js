"use strict";
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
exports.__esModule = true;

var Field = (function () {
    function Field(field) {
        if (field === void 0) { field = {}; }
        this.gameType = field.gameType || 'Singles';
        this.terrain = field.terrain;
        this.weather = field.weather;
        this.isMagicRoom = !!field.isMagicRoom;
        this.isWonderRoom = !!field.isWonderRoom;
        this.isGravity = !!field.isGravity;
        this.isAuraBreak = field.isAuraBreak || false;
        this.isFairyAura = field.isFairyAura || false;
        this.isDarkAura = field.isDarkAura || false;
        this.isBeadsOfRuin = field.isBeadsOfRuin || false;
        this.isSwordOfRuin = field.isSwordOfRuin || false;
        this.isTabletsOfRuin = field.isTabletsOfRuin || false;
        this.isVesselOfRuin = field.isVesselOfRuin || false;
        this.attackerSide = new Side(field.attackerSide || {});
        this.defenderSide = new Side(field.defenderSide || {});
    }
    Field.prototype.hasWeather = function () {
        var weathers = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            weathers[_i] = arguments[_i];
        }
        return !!(this.weather && weathers.includes(this.weather));
    };
    Field.prototype.hasTerrain = function () {
        var terrains = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            terrains[_i] = arguments[_i];
        }
        return !!(this.terrain && terrains.includes(this.terrain));
    };
    Field.prototype.swap = function () {
        var _a;
        _a = __read([this.defenderSide, this.attackerSide], 2), this.attackerSide = _a[0], this.defenderSide = _a[1];
        return this;
    };
    Field.prototype.clone = function () {
        return new Field({
            gameType: this.gameType,
            weather: this.weather,
            terrain: this.terrain,
            isMagicRoom: this.isMagicRoom,
            isWonderRoom: this.isWonderRoom,
            isGravity: this.isGravity,
            attackerSide: this.attackerSide,
            defenderSide: this.defenderSide,
            isAuraBreak: this.isAuraBreak,
            isDarkAura: this.isDarkAura,
            isFairyAura: this.isFairyAura,
            isBeadsOfRuin: this.isBeadsOfRuin,
            isSwordOfRuin: this.isSwordOfRuin,
            isTabletsOfRuin: this.isTabletsOfRuin,
            isVesselOfRuin: this.isVesselOfRuin
        });
    };
    return Field;
}());
exports.Field = Field;
var Side = (function () {
    function Side(side) {
        if (side === void 0) { side = {}; }
        this.spikes = side.spikes || 0;
        this.steelsurge = !!side.steelsurge;
        this.vinelash = !!side.vinelash;
        this.wildfire = !!side.wildfire;
        this.cannonade = !!side.cannonade;
        this.volcalith = !!side.volcalith;
        this.isSR = !!side.isSR;
        this.isReflect = !!side.isReflect;
        this.isLightScreen = !!side.isLightScreen;
        this.isProtected = !!side.isProtected;
        this.isSeeded = !!side.isSeeded;
        this.isForesight = !!side.isForesight;
        this.isTailwind = !!side.isTailwind;
        this.isHelpingHand = !!side.isHelpingHand;
        this.isFlowerGift = !!side.isFlowerGift;
        this.isFriendGuard = !!side.isFriendGuard;
        this.isAuroraVeil = !!side.isAuroraVeil;
        this.isBattery = !!side.isBattery;
        this.isPowerSpot = !!side.isPowerSpot;
        this.isSteelySpirit = !!side.isSteelySpirit;
        this.isSwitching = side.isSwitching;
    }
    Side.prototype.clone = function () {
        return new Side(this);
    };
    return Side;
}());
exports.Side = Side;
//# sourceMappingURL=field.js.map