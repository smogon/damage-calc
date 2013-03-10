function $(id) {
   return document.getElementById(id);
}

function setMove(i) {
   var move = $('move'+i).value;
   var dets = getMoveDetails(move);
   $('move'+i+'pwr').value = dets[0];
   $('move'+i+'type').value = dets[1];
   $('move'+i+'cat').value = dets[2];
}

function setStat(stat, base, ivs, evs, level, nature, index) {
    $(base).value = validate($(base).value, 1, 255);
    $(ivs).value = validate($(ivs).value, 0, 31);
    $(evs).value = validate($(evs).value, 0, 255);
    $(level).value = validate($(level).value, 1, 100);
    $(stat).value = calcStat($(base).value, $(ivs).value, $(evs).value, $(level).value, calcNature(getNatureVals($(nature).value)[index]));
}

function setStatHP(stat, base, ivs, evs, level) {
	$(base).value = validate($(base).value, 1, 255);
	$(ivs).value = validate($(ivs).value, 0, 31);
	$(evs).value = validate($(evs).value, 0, 255);
	$(level).value = validate($(level).value, 1, 100);
	$(stat).value = calcHP($(base).value, $(ivs).value, $(evs).value, $(level).value);
}

function calcStat(base, ivs, evs, level, nature) {
   return Math.floor(Math.floor(Math.floor(2*base + 1*ivs + evs/4) * level/100 + 5) * nature);
}

function calcHP(base, ivs, evs, level) {
   if(base == 1) return 1; //shedinja
   else return Math.floor(Math.floor(2*base + 1*ivs + evs/4) * level/100 + 1*level + 10);
}

function validate(value, min, max) {
    return isNaN(parseInt(value)) ? min : Math.min(max, Math.max(min, parseInt(value)));
}

function getTier(tier) {
   return (tier == 'Uber') ? 0 : (tier == 'OU') ? 1 : (tier == 'UU' || tier == 'BL') ? 2 : 
          (tier == 'RU' || tier == 'BL2') ? 3 : (tier == 'NU' || tier == 'BL3') ? 4 : (tier == 'CAP' || tier == 'DW') ? 5 : 1;
}

function sortResultsUp(a, b) {
	return a.damage[0].max - b.damage[0].max;
}

function sortResultsDown(a, b) {
	return b.damage[0].max - a.damage[0].max;
}

function getFullSetName(set) {
    return set.pokemon + ' (' + set.meta + ' ' + set.set + ')';
}

function getCleanMoveName(move) {
    if (move.name) {
        return move.name.replace('Hidden Power', 'HP').replace('null', '(none)');
    } else {
        return '(none)';
    }
}

function objArrayToDropdown(array) {
    var out = '';
    for (var i in array) {
        out += '<option>'+i+'</option>';
    }
    return out;
}

function arrayToDropdown(array) {
    var out = '';
    for (var i = 0; i < array.length; i++) {
        out += '<option>'+array[i]+'</option>';
    }
    return out;
}

function getTypeOptions() {
    return objArrayToDropdown(ALL_TYPES);
}

function getTypeMatch(atkType, defType) {
    var atk = ALL_TYPES[atkType];
    if (atk.nve && atk.nve.indexOf(defType) !== -1) return 0.5;
    if (atk.se && atk.se.indexOf(defType) !== -1) return 2;
    if (atk.immune && atk.immune.indexOf(defType) !== -1) return 0;
    return 1;
}

function getMoveOptions() {
    var options = objArrayToDropdown(ALL_ATTACKS);
    var out = ['<option>(Move 1)</option>'+options, '<option>(Move 2)</option>'+options, '<option>(Move 3)</option>'+options, '<option>(Move 4)</option>'+options];
    return out;
}

function getMoveDetails(move) {
    var details = ALL_ATTACKS[move];
    return details ? details : [0,'Normal','Physical'];
}

function getItemOptions() {
    return '<option>(other)</option>' + arrayToDropdown(ALL_ITEMS);
}

function getAbilityOptions() {
    return '<option>(other)</option>' + arrayToDropdown(ALL_ABILITIES);
}

function calcNature(index) {
   return 1.1 - (0.1 * index);
}

function getNatureOptions() {
    return objArrayToDropdown(ALL_NATURES);
}

function getNatureVals(nature) {
    var natureVals = ALL_NATURES[nature];
    return natureVals ? natureVals : [1,1,1,1,1];
}

function getSignForNature(nature, index) {
    var value = getNatureVals(nature)[index];
    return value == 0 ? '+' : value == 2 ? '-' : '';
}

function cloneObj(obj) {
   var clone = {};
   for(var i in obj) {
      if(typeof(obj[i]) == 'object') {
         clone[i] = cloneObj(obj[i]);
      }
      else {
         clone[i] = obj[i];
      }
   }
   return clone;
}

var ALL_ATTACKS = {
    'Acrobatics':[55,'Flying','Physical'],
    'Aerial Ace':[60,'Flying','Physical'],
    'Aeroblast':[100,'Flying','Special'],
    'Air Slash':[75,'Flying','Special'],
    'AncientPower':[60,'Rock','Special'],
    'Aqua Jet':[40,'Water','Physical'],
    'Aqua Tail':[90,'Water','Physical'],
    'Assurance':[50,'Dark','Physical'],
    'Attack Order':[90,'Bug','Physical'],
    'Aura Sphere':[90,'Fighting','Special'],
    'Avalanche':[120,'Ice','Physical'],
    'Bite':[60,'Dark','Physical'],
    'Blaze Kick':[85,'Fire','Physical'],
    'Blizzard':[120,'Ice','Special'],
    'Blue Flare':[130,'Fire','Special'],
    'Body Slam':[85,'Normal','Physical'],
    'Bolt Strike':[130,'Electric','Physical'],
    'Bonemerang':[50,'Ground','Physical'],
    'Bounce':[85,'Flying','Physical'],
    'Brave Bird':[120,'Flying','Physical'],
    'Brick Break':[75,'Fighting','Physical'],
    'Bug Bite':[60,'Bug','Physical'],
    'Bug Buzz':[90,'Bug','Special'],
    'Bulldoze':[60,'Ground','Physical'],
    'Bullet Punch':[40,'Steel','Physical'],
    'Bullet Seed':[25,'Grass','Physical'],
    'Charge Beam':[50,'Electric','Special'],
    'Chatter':[60,'Flying','Special'],
    'Circle Throw':[60,'Fighting','Physical'],
    'Close Combat':[120,'Fighting','Physical'],
    'Crabhammer':[90,'Water','Physical'],
    'Cross Chop':[100,'Fighting','Physical'],
    'Cross Poison':[70,'Poison','Physical'],
    'Crunch':[80,'Dark','Physical'],
    'Dark Pulse':[80,'Dark','Special'],
    'Discharge':[80,'Electric','Special'],
    'Double Hit':[35,'Normal','Physical'],
    'Double-Edge':[120,'Normal','Physical'],
    'Draco Meteor':[140,'Dragon','Special'],
    'Dragon Claw':[80,'Dragon','Physical'],
    'Dragon Pulse':[90,'Dragon','Special'],
    'Dragon Rush':[100,'Dragon','Physical'],
    'Dragon Tail':[60,'Dragon','Physical'],
    'Drain Punch':[75,'Fighting','Physical'],
    'Drill Peck':[80,'Flying','Physical'],
    'Dual Chop':[40,'Dragon','Physical'],
    'DynamicPunch':[100,'Fighting','Physical'],
    'Earth Power':[90,'Ground','Special'],
    'Earthquake':[100,'Ground','Physical'],
    'Electro Ball':[1,'Electric','Special'],
    'Energy Ball':[80,'Grass','Special'],
    'Eruption':[150,'Fire','Special'],
    'Explosion':[250,'Normal','Physical'],
    'Extrasensory':[80,'Psychic','Special'],
    'ExtremeSpeed':[80,'Normal','Physical'],
    'Facade':[70,'Normal','Physical'],
    'Faint Attack':[60,'Dark','Physical'],
    'Fake Out':[40,'Normal','Physical'],
    'Feint':[30,'Normal','Physical'],
    'Fiery Dance':[80,'Fire','Special'],
    'Fire Blast':[120,'Fire','Special'],
    'Fire Fang':[65,'Fire','Physical'],
    'Fire Punch':[75,'Fire','Physical'],
    'Flame Charge':[50,'Fire','Physical'],
    'Flame Wheel':[60,'Fire','Physical'],
    'Flamethrower':[95,'Fire','Special'],
    'Flare Blitz':[120,'Fire','Physical'],
    'Flash Cannon':[80,'Steel','Special'],
    'Fling':[1,'Dark','Physical'],
    'Focus Blast':[120,'Fighting','Special'],
    'Focus Punch':[150,'Fighting','Physical'],
    'Force Palm':[60,'Fighting','Physical'],
    'Foul Play':[95,'Dark','Physical'],
    'Frustration':[102,'Normal','Physical'],
    'Fusion Bolt':[100,'Electric','Physical'],
    'Fusion Flare':[100,'Fire','Special'],
    'Gear Grind':[50,'Steel','Physical'],
    'Giga Drain':[75,'Grass','Special'],
    'Giga Impact':[150,'Normal','Physical'],
    'Glaciate':[65,'Ice','Special'],
    'Grass Knot':[1,'Grass','Special'],
    'Gunk Shot':[120,'Poison','Physical'],
    'Gyro Ball':[1,'Steel','Physical'],
    'Hammer Arm':[100,'Fighting','Physical'],
    'Head Charge':[120,'Normal','Physical'],
    'Head Smash':[150,'Rock','Physical'],
    'Headbutt':[70,'Normal','Physical'],
    'Heat Wave':[100,'Fire','Special'],
    'Heavy Slam':[1,'Steel','Physical'],
    'Hex':[50,'Ghost','Special'],
    'Hi Jump Kick':[130,'Fighting','Physical'],
    'Hidden Power Bug':[70,'Bug','Special'],
    'Hidden Power Dark':[70,'Dark','Special'],
    'Hidden Power Dragon':[70,'Dragon','Special'],
    'Hidden Power Electric':[70,'Electric','Special'],
    'Hidden Power Fighting':[70,'Fighting','Special'],
    'Hidden Power Fire':[70,'Fire','Special'],
    'Hidden Power Flying':[70,'Flying','Special'],
    'Hidden Power Ghost':[70,'Ghost','Special'],
    'Hidden Power Grass':[70,'Grass','Special'],
    'Hidden Power Ground':[70,'Ground','Special'],
    'Hidden Power Ice':[70,'Ice','Special'],
    'Hidden Power Poison':[70,'Poison','Special'],
    'Hidden Power Psychic':[70,'Psychic','Special'],
    'Hidden Power Rock':[70,'Rock','Special'],
    'Hidden Power Steel':[70,'Steel','Special'],
    'Hidden Power Water':[70,'Water','Special'],
    'Horn Leech':[75,'Grass','Physical'],
    'Hurricane':[120,'Flying','Special'],
    'Hydro Pump':[120,'Water','Special'],
    'Hyper Beam':[150,'Normal','Special'],
    'Hyper Voice':[90,'Normal','Special'],
    'Ice Beam':[95,'Ice','Special'],
    'Ice Fang':[65,'Ice','Physical'],
    'Ice Punch':[75,'Ice','Physical'],
    'Ice Shard':[40,'Ice','Physical'],
    'Icicle Crash':[85,'Ice','Physical'],
    'Icicle Spear':[25,'Ice','Physical'],
    'Icy Wind':[55,'Ice','Special'],
    'Iron Head':[80,'Steel','Physical'],
    'Iron Tail':[100,'Steel','Physical'],
    'Judgment':[100,'Normal','Special'],
    'Jump Kick':[100,'Fighting','Physical'],
    'Lava Plume':[80,'Fire','Special'],
    'Leaf Blade':[90,'Grass','Physical'],
    'Leaf Storm':[140,'Grass','Special'],
    'Low Kick':[1,'Fighting','Physical'],
    'Low Sweep':[60,'Fighting','Physical'],
    'Mach Punch':[40,'Fighting','Physical'],
    'Magma Storm':[120,'Fire','Special'],
    'Megahorn':[120,'Bug','Physical'],
    'Meteor Mash':[100,'Steel','Physical'],
    'Muddy Water':[95,'Water','Special'],
    'Natural Gift':[1,'Normal','Physical'],
    'Nature Power':[100,'Ground','Physical'],
    'Night Daze':[85,'Dark','Special'],
    'Night Shade':[100,'Ghost','Special'],
    'Night Slash':[70,'Dark','Physical'],
    'Outrage':[120,'Dragon','Physical'],
    'Overheat':[140,'Fire','Special'],
    'Payback':[50,'Dark','Physical'],
    'Petal Dance':[120,'Grass','Special'],
    'Pluck':[60,'Flying','Physical'],
    'Poison Jab':[80,'Poison','Physical'],
    'Power Gem':[70,'Rock','Special'],
    'Power Whip':[120,'Grass','Physical'],
    'Psychic':[90,'Psychic','Special'],
    'Psycho Boost':[140,'Psychic','Special'],
    'Psycho Cut':[70,'Psychic','Physical'],
    'Psyshock':[80,'Psychic','Special'],
    'Psystrike':[100,'Psychic','Special'],
    'Punishment':[60,'Dark','Physical'],
    'Pursuit':[40,'Dark','Physical'],
    'Quick Attack':[40,'Normal','Physical'],
    'Rapid Spin':[20,'Normal','Physical'],
    'Razor Shell':[75,'Water','Physical'],
    'Retaliate':[70,'Normal','Physical'],
    'Return':[102,'Normal','Physical'],
    'Revenge':[120,'Fighting','Physical'],
    'Rock Blast':[25,'Rock','Physical'],
    'Rock Climb':[90,'Normal','Physical'],
    'Rock Slide':[75,'Rock','Physical'],
    'Rock Smash':[40,'Fighting','Physical'],
    'Sacred Fire':[100,'Fire','Physical'],
    'Sacred Sword':[90,'Fighting','Physical'],
    'Scald':[80,'Water','Special'],
    'Searing Shot':[100,'Fire','Special'],
    'Secret Sword':[85,'Fighting','Special'],
    'Seed Bomb':[80,'Grass','Physical'],
    'Seed Flare':[120,'Grass','Special'],
    'Seismic Toss':[100,'Fighting','Physical'],
    'Selfdestruct':[200,'Normal','Physical'],
    'Shadow Ball':[80,'Ghost','Special'],
    'Shadow Claw':[70,'Ghost','Physical'],
    'Shadow Force':[120,'Ghost','Physical'],
    'Shadow Punch':[60,'Ghost','Physical'],
    'Shadow Sneak':[40,'Ghost','Physical'],
    'Shock Wave':[60,'Electric','Special'],
    'Sky Uppercut':[85,'Fighting','Physical'],
    'Signal Beam':[75,'Bug','Special'],
    'Sludge Bomb':[90,'Poison','Special'],
    'Sludge Wave':[95,'Poison','Special'],
    'Smack Down':[50,'Rock','Physical'],
    'Snarl':[55,'Dark','Special'],
    'SolarBeam':[120,'Grass','Special'],
    'Spacial Rend':[100,'Dragon','Special'],
    'Spark':[65,'Electric','Physical'],
    'Stomp':[65,'Normal','Physical'],
    'Stone Edge':[100,'Rock','Physical'],
    'Stored Power':[20,'Psychic','Special'],
    'Sucker Punch':[80,'Dark','Physical'],
    'Superpower':[120,'Fighting','Physical'],
    'Surf':[95,'Water','Special'],
    'Swift':[60,'Normal','Special'],
    'Tail Slap':[25,'Normal','Physical'],
    'Tackle':[50,'Normal','Physical'],
    'Thunder':[120,'Electric','Special'],
    'Thunder Fang':[65,'Electric','Physical'],
    'ThunderPunch':[75,'Electric','Physical'],
    'Thunderbolt':[95,'Electric','Special'],
    'Tri Attack':[80,'Normal','Special'],
    'U-turn':[70,'Bug','Physical'],
    'V-create':[180,'Fire','Physical'],
    'Vacuum Wave':[40,'Fighting','Special'],
    'Volt Switch':[70,'Electric','Special'],
    'Volt Tackle':[120,'Electric','Physical'],
    'Wake-Up Slap':[60,'Fighting','Physical'],
    'Water Pulse':[60,'Water','Special'],
    'Water Spout':[150,'Water','Special'],
    'Waterfall':[80,'Water','Physical'],
    'Weather Ball':[50,'Normal','Special'],
    'Wild Charge':[90,'Electric','Physical'],
    'Wood Hammer':[120,'Grass','Physical'],
    'X-Scissor':[80,'Bug','Physical'],
    'Zen Headbutt':[80,'Psychic','Physical']
};

var ALL_ITEMS = [
	'Adamant Orb', 'Air Balloon', 'Apicot Berry', 'Armor Fossil', 'Babiri Berry',
	'Belue Berry', 'Black Belt', 'Black Sludge', 'BlackGlasses', 'Bug Gem', 
	'Charcoal', 'Charti Berry', 'Chesto Berry', 'Chilan Berry', 'Choice Band', 
	'Choice Scarf', 'Choice Specs', 'Chople Berry', 'Claw Fossil', 'Coba Berry', 
	'Colbur Berry', 'Cover Fossil', 'Custap Berry', 'Dark Gem', 'DeepSeaScale', 
	'DeepSeaTooth', 'Dome Fossil', 'Draco Plate', 'Dragon Fang', 'Dragon Gem', 
	'Dread Plate', 'Durin Berry', 'Earth Plate', 'Electric Gem', 'Enigma Berry', 
	'Eviolite', 'Expert Belt', 'Fighting Gem', 'Fire Gem', 'Fist Plate', 'Flame Orb', 
	'Flame Plate', 'Flying Gem', 'Ganlon Berry', 'Ghost Gem', 'Griseous Orb', 
	'Grass Gem', 'Ground Gem', 'Haban Berry', 'Hard Stone', 'Helix Fossil', 'Ice Gem', 
	'Icicle Plate', 'Insect Plate', 'Iron Ball', 'Iron Plate', 'Jaboca Berry', 
	'Kasib Berry', 'Kebia Berry', "King's Rock", 'Lagging Tail', 'Lansat Berry', 
	'Leftovers', 'Leppa Berry', 'Liechi Berry', 'Life Orb', 'Light Ball', 
	'Lum Berry', 'Lustrous Orb', 'Macho Brace', 'Magnet', 'Meadow Plate', 
	'Metal Coat', 'Metal Powder', 'Micle Berry', 'Mind Plate', 'Miracle Seed', 
	'Muscle Band', 'Mystic Water', 'NeverMeltIce', 'Normal Gem', 'Occa Berry', 
	'Odd Incense', 'Old Amber', 'Oran Berry', 'Pamtre Berry', 'Passho Berry', 
	'Payapa Berry', 'Petaya Berry', 'Plume Fossil', 'Poison Barb', 'Poison Gem', 
	'Psychic Gem', 'Rare Bone', 'Rawst Berry', 'Razor Fang', 'Rindo Berry', 
	'Rock Gem', 'Rock Incense', 'Root Fossil', 'Rose Incense', 'Rowap Berry', 
	'Salac Berry', 'Sea Incense', 'Sharp Beak', 'Shuca Berry', 'Silk Scarf', 
	'SilverPowder', 'Sitrus Berry', 'Skull Fossil', 'Sky Plate', 'Soft Sand', 
	'Soul Dew', 'Spell Tag', 'Splash Plate', 'Spooky Plate', 'Starf Berry', 
	'Steel Gem', 'Stone Plate', 'Tanga Berry', 'Thick Club', 'Toxic Orb', 
	'Toxic Plate', 'TwistedSpoon', 'Wacan Berry', 'Water Gem', 'Watmel Berry', 
	'Wave Incense', 'Wise Glasses', 'Yache Berry', 'Zap Plate'
];

var ALL_ABILITIES = [
    'Adaptability', 'Air Lock', 'Analytic', 'Blaze', 'Clear Body', 'Cloud Nine', 
    'Contrary', 'Defeatist', 'Defiant', 'Download', 'Drizzle', 'Drought', 
    'Dry Skin', 'Filter', 'Flare Boost', 'Flash Fire', 'Flower Gift', 'Forecast', 
    'Guts', 'Heatproof', 'Huge Power', 'Hustle', 'Hyper Cutter', 'Ice Body', 
    'Infiltrator', 'Intimidate', 'Iron Fist', 'Klutz', 'Levitate', 'Lightningrod', 
    'Magic Guard', 'Marvel Scale', 'Mold Breaker', 'Motor Drive', 'Multiscale', 
    'Normalize', 'Overcoat', 'Overgrow', 'Poison Heal', 'Pure Power', 'Rain Dish', 
    'Reckless', 'Rivalry (+)', 'Rivalry (-)', 'Sand Force', 'Sand Rush', 
    'Sand Stream', 'Sand Veil', 'Sap Sipper', 'Scrappy', 'Sheer Force', 
    'Skill Link', 'Slow Start', 'Snow Cloak', 'Snow Warning', 'Solar Power', 
    'Solid Rock', 'Soundproof', 'Storm Drain', 'Swarm', 'Technician', 'Teravolt', 
    'Thick Fat', 'Tinted Lens', 'Torrent', 'Toxic Boost', 'Turboblaze', 'Unaware', 
    'Unnerve', 'Volt Absorb', 'Water Absorb', 'White Smoke', 'Wonder Guard'
];

var ALL_NATURES = {
    'Adamant':[0,1,2,1,1],
    'Bashful':[1,1,1,1,1],
    'Bold':[2,0,1,1,1],
    'Brave':[0,1,1,1,2],
    'Calm':[2,1,1,0,1],
    'Careful':[1,1,2,0,1],
    'Docile':[1,1,1,1,1],
    'Gentle':[1,2,1,0,1],
    'Hardy':[1,1,1,1,1],
    'Hasty':[1,2,1,1,0],
    'Impish':[1,0,2,1,1],
    'Jolly':[1,1,2,1,0],
    'Lax':[1,0,1,2,1],
    'Lonely':[0,2,1,1,1],
    'Mild':[1,2,0,1,1],
    'Modest':[2,1,0,1,1],
    'Naive':[1,1,1,2,0],
    'Naughty':[0,1,1,2,1],
    'Quiet':[1,1,0,1,2],
    'Quirky':[1,1,1,1,1],
    'Rash':[1,1,0,2,1],
    'Relaxed':[1,0,1,1,2],
    'Sassy':[1,1,1,0,2],
    'Serious':[1,1,1,1,1],
    'Timid':[2,1,1,1,0]
}

var ALL_TYPES = {
    'Normal':{
        'nve':['Rock','Steel'],
        'immune':['Ghost']
    },
    'Grass':{
        'nve':['Grass','Fire','Flying','Bug','Poison','Dragon','Steel'],
        'se':['Water','Ground','Rock']
    },
    'Fire':{
        'nve':['Fire','Water','Rock','Dragon'],
        'se':['Grass','Ice','Bug','Steel']
    },
    'Water':{
        'nve':['Grass','Water','Dragon'],
        'se':['Fire','Ground','Rock']
    },
    'Electric':{
        'nve':['Grass','Electric','Dragon'],
        'se':['Water','Flying'],
        'immune':['Ground']
    },
    'Ice':{
        'nve':['Fire','Water','Ice','Steel'],
        'se':['Grass','Flying','Ground','Dragon']
    },
    'Flying':{
        'nve':['Electric','Rock','Steel'],
        'se':['Grass','Fighting','Bug']
    },
    'Fighting':{
        'nve':['Flying','Bug','Poison','Psychic'],
        'se':['Normal','Ice','Rock','Dark','Steel'],
        'immune':['Ghost']
    },
    'Bug':{
        'nve':['Fire','Flying','Fighting','Poison','Ghost','Steel'],
        'se':['Grass','Psychic','Dark']
    },
    'Poison':{
        'nve':['Poison','Ground','Rock','Ghost'],
        'se':['Grass'],
        'immune':['Steel']
    },
    'Ground':{
        'nve':['Grass','Bug'],
        'se':['Fire','Electric','Poison','Rock','Steel'],
        'immune':['Flying']
    },
    'Rock':{
        'nve':['Fighting','Ground','Steel'],
        'se':['Fire','Ice','Flying','Bug']
    },
    'Psychic':{
        'nve':['Psychic','Steel'],
        'se':['Fighting','Poison'],
        'immune':['Dark']
    },
    'Ghost':{
        'nve':['Dark','Steel'],
        'se':['Psychic','Ghost'],
        'immune':['Normal']
    },
    'Dragon':{
        'nve':['Steel'],
        'se':['Dragon'],
    },
    'Dark':{
        'nve':['Fighting','Dark','Steel'],
        'se':['Psychic','Ghost']
    },
    'Steel':{
        'nve':['Fire','Water','Electric','Steel'],
        'se':['Ice','Rock']
    }
}