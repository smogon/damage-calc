"use strict";
exports.__esModule = true;
exports.Generations = void 0;
var abilities_1 = require("./abilities");
var items_1 = require("./items");
var moves_1 = require("./moves");
var species_1 = require("./species");
var types_1 = require("./types");
var natures_1 = require("./natures");
exports.Generations = new ((function () {
    function class_1() {
    }
    class_1.prototype.get = function (gen) {
        return new Generation(gen);
    };
    return class_1;
}()))();
var Generation = (function () {
    function Generation(num) {
        this.num = num;
        this.abilities = new abilities_1.Abilities(num);
        this.items = new items_1.Items(num);
        this.moves = new moves_1.Moves(num);
        this.species = new species_1.Species(num);
        this.types = new types_1.Types(num);
        this.natures = new natures_1.Natures();
    }
    return Generation;
}());
//# sourceMappingURL=index.js.map