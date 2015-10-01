var MOVES_RBY = {
    '(No Move)': {
        bp: 0,
        type: 'Normal',
        category: 'Physical'
    },
    'Acid': {
        bp: 40,
        type: 'Poison'
    },
    'Bind': {
        bp: 15,
        type: 'Normal'
    },
    'Blizzard': {
        bp: 120,
        type: 'Ice',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Body Slam': {
        bp: 85,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Bone Club': {
        bp: 65,
        type: 'Ground',
        category: 'Physical',
        hasSecondaryEffect: true
    },
    'BubbleBeam': {
        bp: 65,
        type: 'Water'
    },
    'Clamp': {
        bp: 35,
        type: 'Water'
    },
    'Crabhammer': {
        bp: 90,
        type: 'Water',
        category: 'Physical',
        makesContact: true,
        alwaysCrit: true
    },
    'Dig': {
        bp: 100,
        type: 'Ground'
    },
    'Double Kick': {
        bp: 30,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        isTwoHit: true
    },
    'Double-Edge': {
        bp: 100,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        hasRecoil: true
    },
    'Drill Peck': {
        bp: 80,
        type: 'Flying',
        category: 'Physical',
        makesContact: true
    },
    'Earthquake': {
        bp: 100,
        type: 'Ground',
        category: 'Physical',
        isSpread: true
    },
    'Explosion': {
        bp: 170,
        type: 'Normal',
        category: 'Physical',
        isSpread: true
    },
    'Fire Blast': {
        bp: 120,
        type: 'Fire',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Fire Punch': {
        bp: 75,
        type: 'Fire',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isPunch: true
    },
    'Fire Spin': {
        bp: 15,
        type: 'Fire'
    },
    'Flamethrower': {
        bp: 95,
        type: 'Fire',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Hi Jump Kick': {
        bp: 85,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        hasRecoil: true
    },
    'Hydro Pump': {
        bp: 120,
        type: 'Water',
        category: 'Special'
    },
    'Hyper Beam': {
        bp: 150,
        type: 'Normal',
        category: 'Special'
    },
    'Ice Beam': {
        bp: 95,
        type: 'Ice',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Ice Punch': {
        bp: 75,
        type: 'Ice',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isPunch: true
    },
    'Mega Drain': {
        bp: 40,
        type: 'Grass'
    },
    'Night Shade': {
        bp: 100,
        type: 'Ghost',
        category: 'Special'
    },
    'Pin Missile': {
        bp: 14,
        type: 'Bug',
        category: 'Physical',
        isMultiHit: true
    },
    'Psychic': {
        bp: 90,
        type: 'Psychic',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Quick Attack': {
        bp: 40,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Razor Leaf': {
        bp: 55,
        type: 'Grass',
        category: 'Special',
        alwaysCrit: true
    },
    'Rock Slide': {
        bp: 75,
        type: 'Rock',
        category: 'Physical',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Seismic Toss': {
        bp: 100,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Selfdestruct': {
        bp: 130,
        type: 'Normal',
        category: 'Physical',
        isSpread: true
    },
    'Sky Attack': {
        bp: 140,
        type: 'Flying',
        category: 'Physical',
        hasSecondaryEffect: true
    },
    'Slash': {
        bp: 70,
        type: 'Normal',
        alwaysCrit: true
    },
    'Sludge': {
        bp: 65,
        type: 'Poison'
    },
    'Submission': {
        bp: 80,
        type: 'Fighting'
    },
    'Surf': {
        bp: 95,
        type: 'Water',
        category: 'Special',
        isSpread: true
    },
    'Tackle': {
        bp: 35,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Thunder': {
        bp: 120,
        type: 'Electric',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'ThunderPunch': {
        bp: 75,
        type: 'Electric',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isPunch: true
    },
    'Thunderbolt': {
        bp: 95,
        type: 'Electric',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Twineedle': {
        bp: 25,
        type: 'Bug',
        isTwoHit: true
    },
    'Wrap': {
        bp: 15,
        type: 'Normal'
    }
};

var MOVES_GSC = $.extend(true, {}, MOVES_RBY, {
    'Aeroblast': {
        bp: 100,
        type: 'Flying',
        category: 'Special'
    },
    'AncientPower': {
        bp: 60,
        type: 'Rock',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Bite': {
        bp: 60,
        type: 'Dark',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isBite: true
    },
    'Crabhammer': { alwaysCrit: false },
    'Cross Chop': {
        bp: 100,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Crunch': {
        bp: 80,
        type: 'Dark',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isBite: true
    },
    'Double-Edge': { bp: 120 },
    'DynamicPunch': {
        bp: 100,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isPunch: true
    },
    'Explosion': { bp: 250 },
    'ExtremeSpeed': {
        bp: 80,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Faint Attack': {
        bp: 60,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Flail': {
        bp: 1,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Flame Wheel': {
        bp: 60,
        type: 'Fire',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Frustration': {
        bp: 102,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Giga Drain': {
        bp: 60,
        type: 'Grass',
        category: 'Special'
    },
    'Headbutt': {
        bp: 70,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Hidden Power Bug': {
        bp: 70,
        type: 'Bug',
        category: 'Special'
    },
    'Hidden Power Dark': {
        bp: 70,
        type: 'Dark',
        category: 'Special'
    },
    'Hidden Power Dragon': {
        bp: 70,
        type: 'Dragon',
        category: 'Special'
    },
    'Hidden Power Electric': {
        bp: 70,
        type: 'Electric',
        category: 'Special'
    },
    'Hidden Power Fighting': {
        bp: 70,
        type: 'Fighting',
        category: 'Special'
    },
    'Hidden Power Fire': {
        bp: 70,
        type: 'Fire',
        category: 'Special'
    },
    'Hidden Power Flying': {
        bp: 70,
        type: 'Flying',
        category: 'Special'
    },
    'Hidden Power Ghost': {
        bp: 70,
        type: 'Ghost',
        category: 'Special'
    },
    'Hidden Power Grass': {
        bp: 70,
        type: 'Grass',
        category: 'Special'
    },
    'Hidden Power Ground': {
        bp: 70,
        type: 'Ground',
        category: 'Special'
    },
    'Hidden Power Ice': {
        bp: 70,
        type: 'Ice',
        category: 'Special'
    },
    'Hidden Power Poison': {
        bp: 70,
        type: 'Poison',
        category: 'Special'
    },
    'Hidden Power Psychic': {
        bp: 70,
        type: 'Psychic',
        category: 'Special'
    },
    'Hidden Power Rock': {
        bp: 70,
        type: 'Rock',
        category: 'Special'
    },
    'Hidden Power Steel': {
        bp: 70,
        type: 'Steel',
        category: 'Special'
    },
    'Hidden Power Water': {
        bp: 70,
        type: 'Water',
        category: 'Special'
    },
    'Icy Wind': {
        bp: 55,
        type: 'Ice',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Iron Tail': {
        bp: 100,
        type: 'Steel',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Mach Punch': {
        bp: 40,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        isPunch: true
    },
    'Megahorn': {
        bp: 120,
        type: 'Bug',
        category: 'Physical',
        makesContact: true
    },
    'Pursuit': {
        bp: 40,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Rapid Spin': {
        bp: 20,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Razor Leaf': { alwaysCrit: false },
    'Return': {
        bp: 102,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Reversal': {
        bp: 1,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Rollout': {
        bp: 30,
        type: 'Rock',
        category: 'Physical',
        makesContact: true,
        isMultiHit: true
    },
    'Sacred Fire': {
        bp: 100,
        type: 'Fire',
        category: 'Physical',
        hasSecondaryEffect: true
    },
    'Selfdestruct': { bp: 200 },
    'Shadow Ball': {
        bp: 80,
        type: 'Ghost',
        category: 'Special',
        hasSecondaryEffect: true,
        isBullet: true
    },
    'Sludge Bomb': {
        bp: 90,
        type: 'Poison',
        category: 'Special',
        hasSecondaryEffect: true,
        isBullet: true
    },
    'SolarBeam': {
        bp: 120,
        type: 'Grass',
        category: 'Special'
    },
    'Steel Wing': {
        bp: 70,
        type: 'Steel',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Thief': {
        bp: 40,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Zap Cannon': {
        bp: 100,
        type: 'Electric',
        category: 'Special',
        hasSecondaryEffect: true
    }
});

delete MOVES_GSC['Acid'];
delete MOVES_GSC['Bind'];
delete MOVES_GSC['Clamp'];
delete MOVES_GSC['Dig'];
delete MOVES_GSC['Fire Spin'];
delete MOVES_GSC['Mega Drain'];
delete MOVES_GSC['Slash'];
delete MOVES_GSC['Sludge'];
delete MOVES_GSC['Wrap'];

var MOVES_ADV = $.extend(true, {}, MOVES_GSC, {
    'Aerial Ace': {
        bp: 60,
        type: 'Flying',
        category: 'Physical',
        makesContact: true
    },
    'Air Cutter': {
        bp: 55,
        type: 'Flying',
        category: 'Special',
        isSpread: true
    },
    'Blaze Kick': {
        bp: 85,
        type: 'Fire',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Bonemerang': {
        bp: 50,
        type: 'Ground',
        category: 'Physical',
        isTwoHit: true
    },
    'Bounce': {
        bp: 85,
        type: 'Flying',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Brick Break': {
        bp: 75,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Doom Desire': {
        bp: 120,
        type: 'Steel',
        category: 'Special'
    },
    'Dragon Claw': {
        bp: 80,
        type: 'Dragon',
        category: 'Physical',
        makesContact: true
    },
    'Eruption': {
        bp: 150,
        type: 'Fire',
        category: 'Special',
        isSpread: true
    },
    'Extrasensory': {
        bp: 80,
        type: 'Psychic',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Facade': {
        bp: 70,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Fake Out': {
        bp: 40,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Focus Punch': {
        bp: 150,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        isPunch: true
    },
    'Heat Wave': {
        bp: 100,
        type: 'Fire',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Ice Ball': {
        bp: 30,
        type: 'Ice',
        category: 'Physical',
        makesContact: true,
        isMultiHit: true
    },
    'Knock Off': {
        bp: 20,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Leaf Blade': {
        bp: 70,
        type: 'Grass',
        category: 'Physical',
        makesContact: true
    },
    'Low Kick': {
        bp: 1,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Meteor Mash': {
        bp: 100,
        type: 'Steel',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isPunch: true
    },
    'Muddy Water': {
        bp: 95,
        type: 'Water',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Overheat': {
        bp: 140,
        type: 'Fire',
        category: 'Special'
    },
    'Poison Fang': {
        bp: 50,
        type: 'Poison',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isBite: true
    },
    'Psycho Boost': {
        bp: 140,
        type: 'Psychic',
        category: 'Special'
    },
    'Revenge': {
        bp: 120,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Rock Blast': {
        bp: 25,
        type: 'Rock',
        category: 'Physical',
        isMultiHit: true
    },
    'Rock Tomb': {
        bp: 50,
        type: 'Rock',
        category: 'Physical',
        hasSecondaryEffect: true
    },
    'Shadow Punch': {
        bp: 60,
        type: 'Ghost',
        category: 'Physical',
        makesContact: true,
        isPunch: true
    },
    'Shock Wave': {
        bp: 60,
        type: 'Electric',
        category: 'Special'
    },
    'Signal Beam': {
        bp: 75,
        type: 'Bug',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Silver Wind': {
        bp: 60,
        type: 'Bug',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Sky Uppercut': {
        bp: 85,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        isPunch: true
    },
    'Spark': {
        bp: 65,
        type: 'Electric',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Superpower': {
        bp: 120,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Volt Tackle': {
        bp: 120,
        type: 'Electric',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        hasRecoil: true
    },
    'Water Pulse': {
        bp: 60,
        type: 'Water',
        category: 'Special',
        hasSecondaryEffect: true,
        isPulse: true
    },
    'Water Spout': {
        bp: 150,
        type: 'Water',
        category: 'Special',
        isSpread: true
    },
    'Weather Ball': {
        bp: 50,
        type: 'Normal',
        category: 'Special',
        isBullet: true
    }
});

delete MOVES_ADV['BubbleBeam'];
delete MOVES_ADV['Submission'];

var MOVES_DPP = $.extend(true, {}, MOVES_ADV, {
    'Air Slash': {
        bp: 75,
        type: 'Flying',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Aqua Jet': {
        bp: 40,
        type: 'Water',
        category: 'Physical',
        makesContact: true
    },
    'Aqua Tail': {
        bp: 90,
        type: 'Water',
        category: 'Physical',
        makesContact: true
    },
    'Assurance': {
        bp: 50,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Aura Sphere': {
        bp: 90,
        type: 'Fighting',
        category: 'Special',
        isBullet: true,
        isPulse: true
    },
    'Avalanche': {
        bp: 120,
        type: 'Ice',
        category: 'Physical',
        makesContact: true
    },
    'Brave Bird': {
        bp: 120,
        type: 'Flying',
        category: 'Physical',
        makesContact: true,
        hasRecoil: true
    },
    'Bug Bite': {
        bp: 60,
        type: 'Bug',
        category: 'Physical',
        makesContact: true
    },
    'Bug Buzz': {
        bp: 90,
        type: 'Bug',
        category: 'Special',
        hasSecondaryEffect: true,
        isSound: true
    },
    'Bullet Punch': {
        bp: 40,
        type: 'Steel',
        category: 'Physical',
        makesContact: true,
        isPunch: true
    },
    'Charge Beam': {
        bp: 50,
        type: 'Electric',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Chatter': {
        bp: 60,
        type: 'Flying',
        category: 'Special',
        hasSecondaryEffect: true,
        isSound: true
    },
    'Close Combat': {
        bp: 120,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Cross Poison': {
        bp: 70,
        type: 'Poison',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Dark Pulse': {
        bp: 80,
        type: 'Dark',
        category: 'Special',
        hasSecondaryEffect: true,
        isPulse: true
    },
    'Discharge': {
        bp: 80,
        type: 'Electric',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Double Hit': {
        bp: 35,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        isTwoHit: true
    },
    'Draco Meteor': {
        bp: 140,
        type: 'Dragon',
        category: 'Special'
    },
    'Dragon Pulse': {
        bp: 90,
        type: 'Dragon',
        category: 'Special',
        isPulse: true
    },
    'Dragon Rush': {
        bp: 100,
        type: 'Dragon',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Drain Punch': {
        bp: 60,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        isPunch: true
    },
    'Earth Power': {
        bp: 90,
        type: 'Ground',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Energy Ball': {
        bp: 80,
        type: 'Grass',
        category: 'Special',
        hasSecondaryEffect: true,
        isBullet: true
    },
    'Fire Fang': {
        bp: 65,
        type: 'Fire',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isBite: true
    },
    'Flare Blitz': {
        bp: 120,
        type: 'Fire',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        hasRecoil: true
    },
    'Flash Cannon': {
        bp: 80,
        type: 'Steel',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Fling': {
        bp: 1,
        type: 'Dark',
        category: 'Physical'
    },
    'Focus Blast': {
        bp: 120,
        type: 'Fighting',
        category: 'Special',
        hasSecondaryEffect: true,
        isBullet: true
    },
    'Force Palm': {
        bp: 60,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Giga Impact': {
        bp: 150,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Grass Knot': {
        bp: 1,
        type: 'Grass',
        category: 'Special',
        makesContact: true
    },
    'Gunk Shot': {
        bp: 120,
        type: 'Poison',
        category: 'Physical',
        hasSecondaryEffect: true
    },
    'Gyro Ball': {
        bp: 1,
        type: 'Steel',
        category: 'Physical',
        makesContact: true,
        isBullet: true
    },
    'Hammer Arm': {
        bp: 100,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        isPunch: true
    },
    'Head Smash': {
        bp: 150,
        type: 'Rock',
        category: 'Physical',
        makesContact: true,
        hasRecoil: true
    },
    'Hi Jump Kick': { bp: 100 },
    'Hyper Voice': {
        bp: 90,
        type: 'Normal',
        category: 'Special',
        isSound: true,
        isSpread: true
    },
    'Ice Fang': {
        bp: 65,
        type: 'Ice',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isBite: true
    },
    'Ice Shard': {
        bp: 40,
        type: 'Ice',
        category: 'Physical'
    },
    'Iron Head': {
        bp: 80,
        type: 'Steel',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Judgment': {
        bp: 100,
        type: 'Normal',
        category: 'Special'
    },
    'Jump Kick': {
        bp: 85,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        hasRecoil: true
    },
    'Last Resort': {
        bp: 130,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Lava Plume': {
        bp: 80,
        type: 'Fire',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Leaf Blade': { bp: 90 },
    'Leaf Storm': {
        bp: 140,
        type: 'Grass',
        category: 'Special'
    },
    'Magma Storm': {
        bp: 120,
        type: 'Fire',
        category: 'Special'
    },
    'Natural Gift': {
        bp: 1,
        type: 'Normal',
        category: 'Physical'
    },
    'Nature Power': {
        bp: 80,
        type: 'Normal',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Night Slash': {
        bp: 70,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Outrage': {
        bp: 120,
        type: 'Dragon',
        category: 'Physical',
        makesContact: true
    },
    'Payback': {
        bp: 50,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Pluck': {
        bp: 60,
        type: 'Flying',
        category: 'Physical',
        makesContact: true
    },
    'Poison Jab': {
        bp: 80,
        type: 'Poison',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Power Gem': {
        bp: 70,
        type: 'Rock',
        category: 'Special'
    },
    'Power Whip': {
        bp: 120,
        type: 'Grass',
        category: 'Physical',
        makesContact: true
    },
    'Psycho Cut': {
        bp: 70,
        type: 'Psychic',
        category: 'Physical'
    },
    'Punishment': {
        bp: 60,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Rock Climb': {
        bp: 90,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Rock Smash': {
        bp: 40,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Seed Bomb': {
        bp: 80,
        type: 'Grass',
        category: 'Physical',
        isBullet: true
    },
    'Seed Flare': {
        bp: 120,
        type: 'Grass',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Shadow Claw': {
        bp: 70,
        type: 'Ghost',
        category: 'Physical',
        makesContact: true
    },
    'Shadow Force': {
        bp: 120,
        type: 'Ghost',
        category: 'Physical',
        makesContact: true
    },
    'Shadow Sneak': {
        bp: 40,
        type: 'Ghost',
        category: 'Physical',
        makesContact: true
    },
    'Spacial Rend': {
        bp: 100,
        type: 'Dragon',
        category: 'Special'
    },
    'Stone Edge': {
        bp: 100,
        type: 'Rock',
        category: 'Physical'
    },
    'Sucker Punch': {
        bp: 80,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Swift': {
        bp: 60,
        type: 'Normal',
        category: 'Special',
        isSpread: true
    },
    'Thunder Fang': {
        bp: 65,
        type: 'Electric',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isBite: true
    },
    'Tri Attack': {
        bp: 80,
        type: 'Normal',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'U-turn': {
        bp: 70,
        type: 'Bug',
        category: 'Physical',
        makesContact: true
    },
    'Vacuum Wave': {
        bp: 40,
        type: 'Fighting',
        category: 'Special'
    },
    'Wake-Up Slap': {
        bp: 60,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Waterfall': {
        bp: 80,
        type: 'Water',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Wood Hammer': {
        bp: 120,
        type: 'Grass',
        category: 'Physical',
        makesContact: true,
        hasRecoil: true
    },
    'X-Scissor': {
        bp: 80,
        type: 'Bug',
        category: 'Physical',
        makesContact: true
    },
    'Zen Headbutt': {
        bp: 80,
        type: 'Psychic',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    }
});

delete MOVES_DPP['Razor Leaf'];
delete MOVES_DPP['Twineedle'];
delete MOVES_DPP['Zap Cannon'];

var MOVES_BW = $.extend(true, {}, MOVES_DPP, {
    'Acid Spray': {
        bp: 40,
        type: 'Poison',
        category: 'Special',
        hasSecondaryEffect: true,
        isBullet: true
    },
    'Acrobatics': {
        bp: 55,
        type: 'Flying',
        category: 'Physical',
        makesContact: true
    },
    'Attack Order': {
        bp: 90,
        type: 'Bug',
        category: 'Physical'
    },
    'Blue Flare': {
        bp: 130,
        type: 'Fire',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Bolt Strike': {
        bp: 130,
        type: 'Electric',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Bulldoze': {
        bp: 60,
        type: 'Ground',
        category: 'Physical',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Bullet Seed': {
        bp: 25,
        type: 'Grass',
        category: 'Physical',
        isMultiHit: true,
        isBullet: true
    },
    'Circle Throw': {
        bp: 60,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Clear Smog': {
        bp: 50,
        type: 'Poison',
        category: 'Special'
    },
    'Doom Desire': { bp: 140 },
    'Dragon Tail': {
        bp: 60,
        type: 'Dragon',
        category: 'Physical',
        makesContact: true
    },
    'Drain Punch': { bp: 75 },
    'Drill Run': {
        bp: 80,
        type: 'Ground',
        category: 'Physical',
        makesContact: true
    },
    'Dual Chop': {
        bp: 40,
        type: 'Dragon',
        category: 'Physical',
        makesContact: true,
        isTwoHit: true
    },
    'Electro Ball': {
        bp: 1,
        type: 'Electric',
        category: 'Special',
        isBullet: true
    },
    'Feint': {
        bp: 30,
        type: 'Normal',
        category: 'Physical'
    },
    'Fiery Dance': {
        bp: 80,
        type: 'Fire',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Final Gambit': {
        bp: 1,
        type: 'Fighting',
        category: 'Special'
    },
    'Flame Charge': {
        bp: 50,
        type: 'Fire',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Foul Play': {
        bp: 95,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Freeze Shock': {
        bp: 140,
        type: 'Ice',
        category: 'Physical',
        hasSecondaryEffect: true
    },
    'Frost Breath': {
        bp: 40,
        type: 'Ice',
        category: 'Special',
        alwaysCrit: true
    },
    'Fusion Bolt': {
        bp: 100,
        type: 'Electric',
        category: 'Physical'
    },
    'Fusion Flare': {
        bp: 100,
        type: 'Fire',
        category: 'Special'
    },
    'Gear Grind': {
        bp: 50,
        type: 'Steel',
        category: 'Physical',
        isTwoHit: true
    },
    'Giga Drain': { bp: 75 },
    'Glaciate': {
        bp: 65,
        type: 'Ice',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Head Charge': {
        bp: 120,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        hasRecoil: true
    },
    'Heavy Slam': {
        bp: 1,
        type: 'Steel',
        category: 'Physical',
        makesContact: true
    },
    'Hex': {
        bp: 50,
        type: 'Ghost',
        category: 'Special'
    },
    'Hi Jump Kick': { bp: 130 },
    'Horn Leech': {
        bp: 75,
        type: 'Grass',
        category: 'Physical',
        makesContact: true
    },
    'Hurricane': {
        bp: 120,
        type: 'Flying',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Icicle Crash': {
        bp: 85,
        type: 'Ice',
        category: 'Physical',
        hasSecondaryEffect: true
    },
    'Icicle Spear': {
        bp: 25,
        type: 'Ice',
        category: 'Physical',
        isMultiHit: true
    },
    'Incinerate': {
        bp: 30,
        type: 'Fire',
        category: 'Special',
        isSpread: true
    },
    'Jump Kick': { bp: 100 },
    'Last Resort': { bp: 140 },
    'Low Sweep': {
        bp: 60,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Nature Power': {
        bp: 100,
        type: 'Ground',
        category: 'Physical',
        hasSecondaryEffect: false,
        isSpread: true
    },
    'Night Daze': {
        bp: 85,
        type: 'Dark',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Petal Dance': {
        bp: 120,
        type: 'Grass',
        category: 'Special',
        makesContact: true
    },
    'Psyshock': {
        bp: 80,
        type: 'Psychic',
        category: 'Special',
        dealsPhysicalDamage: true
    },
    'Psystrike': {
        bp: 100,
        type: 'Psychic',
        category: 'Special',
        dealsPhysicalDamage: true
    },
    'Razor Shell': {
        bp: 75,
        type: 'Water',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Relic Song': {
        bp: 75,
        type: 'Normal',
        category: 'Special',
        hasSecondaryEffect: true,
        isSound: true,
        isSpread: true
    },
    'Retaliate': {
        bp: 70,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Sacred Sword': {
        bp: 90,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        ignoresDefenseBoosts: true
    },
    'Scald': {
        bp: 80,
        type: 'Water',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Searing Shot': {
        bp: 100,
        type: 'Fire',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Secret Sword': {
        bp: 85,
        type: 'Fighting',
        category: 'Special',
        dealsPhysicalDamage: true
    },
    'Sludge Wave': {
        bp: 95,
        type: 'Poison',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Smack Down': {
        bp: 50,
        type: 'Rock',
        category: 'Physical'
    },
    'Snarl': {
        bp: 55,
        type: 'Dark',
        category: 'Special',
        hasSecondaryEffect: true,
        isSound: true,
        isSpread: true
    },
    'Stored Power': {
        bp: 20,
        type: 'Psychic',
        category: 'Special'
    },
    'Storm Throw': {
        bp: 40,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        alwaysCrit: true
    },
    'Tackle': { bp: 50 },
    'Tail Slap': {
        bp: 25,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        isMultiHit: true
    },
    'Thrash': {
        bp: 120,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'V-create': {
        bp: 180,
        type: 'Fire',
        category: 'Physical',
        makesContact: true
    },
    'Volt Switch': {
        bp: 70,
        type: 'Electric',
        category: 'Special'
    },
    'Wild Charge': {
        bp: 90,
        type: 'Electric',
        category: 'Physical',
        makesContact: true,
        hasRecoil: true
    },
    'Venoshock': {
        bp: 65,
        type: 'Poison',
        category: 'Special'
    }
});

var MOVES_XY = $.extend(true, {}, MOVES_BW, {
    'Air Cutter': { bp: 60 },
    'Arm Thrust': {
        bp: 15,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        isMultiHit: true
    },
    'Assurance': { bp: 60 },
    'Aura Sphere': { bp: 80 },
    'Blizzard': { bp: 110 },
    'Boomburst': {
        bp: 140,
        type: 'Normal',
        category: 'Special',
        isSound: true,
        isSpread: true
    },
    'Chatter': { bp: 65 },
    'Crabhammer': { bp: 100 },
    'Dazzling Gleam': {
        bp: 80,
        type: 'Fairy',
        category: 'Special',
        isSpread: true
    },
    'Diamond Storm': {
        bp: 100,
        type: 'Rock',
        category: 'Physical',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Draco Meteor': { bp: 130 },
    'Dragon Ascent': {
        bp: 120,
        type: 'Flying',
        category: 'Physical',
        makesContact: true
    },
    'Dragon Pulse': { bp: 85 },
    'Energy Ball': { bp: 90 },
    'Facade': { ignoresBurn: true },
    'Fire Blast': { bp: 110 },
    'Flamethrower': { bp: 90 },
    'Flying Press': {
        bp: 80,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Freeze-Dry': {
        bp: 70,
        type: 'Ice',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Frost Breath': { bp: 60 },
    'Heat Wave': { bp: 95 },
    'Hex': { bp: 65 },
    'Hidden Power Bug': { bp: 60 },
    'Hidden Power Dark': { bp: 60 },
    'Hidden Power Dragon': { bp: 60 },
    'Hidden Power Electric': { bp: 60 },
    'Hidden Power Fighting': { bp: 60 },
    'Hidden Power Fire': { bp: 60 },
    'Hidden Power Flying': { bp: 60 },
    'Hidden Power Ghost': { bp: 60 },
    'Hidden Power Grass': { bp: 60 },
    'Hidden Power Ground': { bp: 60 },
    'Hidden Power Ice': { bp: 60 },
    'Hidden Power Poison': { bp: 60 },
    'Hidden Power Psychic': { bp: 60 },
    'Hidden Power Rock': { bp: 60 },
    'Hidden Power Steel': { bp: 60 },
    'Hidden Power Water': { bp: 60 },
    'Hurricane': { bp: 110 },
    'Hydro Pump': { bp: 110 },
    'Hyperspace Fury': {
        bp: 100,
        type: 'Dark',
        category: 'Physical'
    },
    'Hyperspace Hole': {
        bp: 80,
        type: 'Psychic',
        category: 'Special'
    },
    'Ice Beam': { bp: 90 },
    'Incinerate': { bp: 60 },
    'Knock Off': { bp: 65 },
    'Land\'s Wrath': {
        bp: 90,
        type: 'Ground',
        category: 'Physical',
        isSpread: true
    },
    'Leaf Storm': { bp: 130 },
    'Light of Ruin': {
        bp: 140,
        type: 'Fairy',
        category: 'Special',
        hasRecoil: true
    },
    'Low Sweep': { bp: 65 },
    'Magma Storm': { bp: 100 },
    'Meteor Mash': { bp: 90 },
    'Moonblast': {
        bp: 95,
        type: 'Fairy',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Muddy Water': { bp: 90 },
    'Nature Power': {
        bp: 80,
        type: 'Normal',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: false
    },
    'Oblivion Wing': {
        bp: 80,
        type: 'Flying',
        category: 'Special'
    },
    'Origin Pulse': {
        bp: 110,
        type: 'Water',
        category: 'Special',
        isSpread: true
    },
    'Overheat': { bp: 130 },
    'Phantom Force': {
        bp: 90,
        type: 'Ghost',
        category: 'Physical',
        makesContact: true
    },
    'Pin Missile': { bp: 25 },
    'Play Rough': {
        bp: 90,
        type: 'Fairy',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Power Gem': { bp: 80 },
    'Power-Up Punch': {
        bp: 40,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isPunch: true
    },
    'Precipice Blades': {
        bp: 120,
        type: 'Ground',
        category: 'Physical',
        isSpread: 'true'
    },
    'Rock Tomb': { bp: 60 },
    'Storm Throw': { bp: 60 },
    'Surf': { bp: 90 },
    'Thief': { bp: 60 },
    'Thunder': { bp: 110 },
    'Thunderbolt': { bp: 90 },
    'Wake-Up Slap': { bp: 70 },
    'Water Shuriken': {
        bp: 15,
        type: 'Water',
        category: 'Physical',
        isMultiHit: true
    }
});

MOVES_XY['Ancient Power'] = MOVES_XY['AncientPower'];
MOVES_XY['Dynamic Punch'] = MOVES_XY['DynamicPunch'];
MOVES_XY['Extreme Speed'] = MOVES_XY['ExtremeSpeed'];
MOVES_XY['Feint Attack'] = MOVES_XY['Faint Attack'];
MOVES_XY['High Jump Kick'] = MOVES_XY['Hi Jump Kick'];
MOVES_XY['Self-Destruct'] = MOVES_XY['Selfdestruct'];
MOVES_XY['Solar Beam'] = MOVES_XY['SolarBeam'];
MOVES_XY['Thunder Punch'] = MOVES_XY['ThunderPunch'];
delete MOVES_XY['AncientPower'];
delete MOVES_XY['DynamicPunch'];
delete MOVES_XY['ExtremeSpeed'];
delete MOVES_XY['Faint Attack'];
delete MOVES_XY['Hi Jump Kick'];
delete MOVES_XY['Selfdestruct'];
delete MOVES_XY['SolarBeam'];
delete MOVES_XY['ThunderPunch'];
