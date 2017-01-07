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
    'Agility': {
        bp: 0,
        type: 'Psychic'
    },
    'Amnesia': {
        bp: 0,
        type: 'Psychic'
    },
    'Barrier': {
        bp: 0,
        type: 'Psychic'
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
    'Bubble Beam': {
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
    'Confuse Ray': {
        bp: 0,
        type: 'Ghost'
    },
    'Defense Curl': {
        bp: 0,
        type: 'Normal'
    },
    'Dig': {
        bp: 100,
        type: 'Ground'
    },
    'Disable': {
        bp: 0,
        type: 'Normal'
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
    'Double Team': {
        bp: 0,
        type: 'Normal'
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
    'Fly': {
        bp: 70,
        type: 'Flying',
        category: 'Physical'
    },
    'Fury Swipes': {
        bp: 18,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        isMultiHit: true
    },
    'Glare': {
        bp: 0,
        type: 'Normal'
    }, 
    'Haze': {
        bp: 0,
        type: 'Ice'
    },
    'High Jump Kick': {
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
    'Jump Kick': {
        bp: 70,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        hasRecoil: true
    },
    'Leech Seed': {
        bp: 0,
        type: 'Grass'
    },
    'Light Screen': {
        bp: 0,
        type: 'Psychic'
    },
    'Lovely Kiss': {
        bp: 0,
        type: 'Normal'
    },
    'Mega Drain': {
        bp: 40,
        type: 'Grass',
        givesHealth: true
    },
    'Mirror Move': {
        bp: 0,
        type: 'Flying'
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
        makesContact: true,
        hasPriority: true
    },
    'Razor Leaf': {
        bp: 55,
        type: 'Grass',
        category: 'Special',
        alwaysCrit: true
    },
    'Recover': {
        bp: 0,
        type: 'Normal'
    },
    'Reflect': {
        bp: 0,
        type: 'Psychic'
    },
    'Rest': {
        bp: 0,
        type: 'Psychic'
    },
    'Roar': {
        bp: 0,
        type: 'Normal'
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
    'Self-Destruct': {
        bp: 130,
        type: 'Normal',
        category: 'Physical',
        isSpread: true
    },
    'Sing': {
        bp: 0,
        type: 'Normal'
    },
    'Sky Attack': {
        bp: 140,
        type: 'Flying',
        category: 'Physical',
        hasSecondaryEffect: true
    },
    'Skull Bash': {
        bp: 100,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
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
    'Soft-Boiled': {
        bp: 0,
        type: 'Normal'
    },
    'Spore': {
        bp: 0,
        type: 'Grass'
    },
    'Submission': {
        bp: 80,
        type: 'Fighting'
    },
    'Substitute': {
        bp: 0,
        type: 'Normal'
    },
    'Super Fang': {
        bp: 0,
        type: 'Normal'
    },
    'Surf': {
        bp: 95,
        type: 'Water',
        category: 'Special',
        isSpread: true
    },
    'Swift': {
        bp: 60,
        type: 'Normal',
        category: 'Special',
        isSpread: true
    },
    'Swords Dance': {
        bp: 0,
        type: 'Normal'
    },
    'Tackle': {
        bp: 35,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Thrash': {
        bp: 90,
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
    'Thunderbolt': {
        bp: 95,
        type: 'Electric',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Thunder Punch': {
        bp: 75,
        type: 'Electric',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isPunch: true
    },
    'Thunder Wave': {
        bp: 0,
        type: 'Electric'
    },
    'Toxic': {
        bp: 0,
        type: 'Poison'
    },
    'Tri Attack': {
        bp: 80,
        type: 'Normal',
        category: 'Special'
    },
    'Twineedle': {
        bp: 25,
        type: 'Bug',
        isTwoHit: true
    },
    'Waterfall': {
        bp: 80,
        type: 'Water',
        category: 'Physical',
        makesContact: true
    },
    'Wrap': {
        bp: 15,
        type: 'Normal'
    },
    'Whirlwind': {
        bp: 0,
        type: 'Normal'
    }
};

var MOVES_GSC = $.extend(true, {}, MOVES_RBY, {
    'Aeroblast': {
        bp: 100,
        type: 'Flying',
        category: 'Special'
    },
    'Ancient Power': {
        bp: 60,
        type: 'Rock',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Baton Pass': {
        bp: 0,
        type: 'Normal'
    },
    'Belly Drum': {
        bp: 0,
        type: 'Normal'
    },
    'Bite': {
        bp: 60,
        type: 'Dark',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isBite: true
    },
    'Bone Rush': {
        bp: 25,
        type: 'Ground',
        category: 'Physical',
        isMultiHit: true
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
    'Curse': {
        bp: 0,
        type: 'Ghost'
    },
    'Destiny Bond': {
        bp: 0,
        type: 'Ghost'
    },
    'Dig': { bp: 60 },
    'Double-Edge': { bp: 120 },
    'Dynamic Punch': {
        bp: 100,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isPunch: true
    },
    'Encore': {
        bp: 0,
        type: 'Normal'
    },
    'Endure': {
        bp: 0,
        type: 'Normal'
    },
    'Explosion': { bp: 250 },
    'Extreme Speed': {
        bp: 80,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        hasPriority: true
    },
    'Feint Attack': {
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
    'Future Sight': {
        bp: 80,
        type: 'Psychic',
        category: 'Special'
    },
    'Giga Drain': {
        bp: 60,
        type: 'Grass',
        category: 'Special',
        givesHealth: true
    },
    'Headbutt': {
        bp: 70,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Heal Bell': {
        bp: 0,
        type: 'Normal'
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
        isPunch: true,
        hasPriority: true
    },
    'Megahorn': {
        bp: 120,
        type: 'Bug',
        category: 'Physical',
        makesContact: true
    },
    'Milk Drink': {
        bp: 0,
        type: 'Normal'
    },
    'Moonlight': {
        bp: 0,
        type: 'Normal'
    },
    'Protect': {
        bp: 0,
        type: 'Normal'
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
    'Rock Smash': {
        bp: 20,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Sacred Fire': {
        bp: 100,
        type: 'Fire',
        category: 'Physical',
        hasSecondaryEffect: true
    },
    'Self-Destruct': { bp: 200 },
    'Shadow Ball': {
        bp: 80,
        type: 'Ghost',
        category: 'Special',
        hasSecondaryEffect: true,
        isBullet: true
    },
    'Slash': { alwaysCrit: false },
    'Sleep Talk': {
        bp: 0,
        type: 'Normal'
    },
    'Sludge Bomb': {
        bp: 90,
        type: 'Poison',
        category: 'Special',
        hasSecondaryEffect: true,
        isBullet: true
    },
    'Solar Beam': {
        bp: 120,
        type: 'Grass',
        category: 'Special'
    },
    'Spark': {
        bp: 65,
        type: 'Electric',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Spikes': {
        bp: 0,
        type: 'Ground'
    },
    'Steel Wing': {
        bp: 70,
        type: 'Steel',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Sunny Day': {
        bp: 0,
        type: 'Fire'
    },
    'Swagger': {
        bp: 0,
        type: 'Normal'
    },
    'Synthesis': {
        bp: 0,
        type: 'Grass'
    },
    'Thief': {
        bp: 40,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Tri Attack': { hasSecondaryEffect: true },
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
delete MOVES_GSC['Fire Spin'];
delete MOVES_GSC['Mega Drain'];
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
    'Astonish': {
        bp: 30,
        type: 'Ghost',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Aromatherapy': {
        bp: 0,
        type: 'Grass'
    },
    'Blast Burn': {
        bp: 150,
        type: 'Fire',
        category: 'Special'
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
    'Bulk Up': {
        bp: 0,
        type: 'Fighting'
    },
    'Bullet Seed': {
        bp: 10,
        type: 'Grass',
        category: 'Physical',
        isMultiHit: true,
        isBullet: true
    },
    'Calm Mind': {
        bp: 0,
        type: 'Psychic'
    },
    'Covet': {
        bp: 40,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Crush Claw': {
        bp: 75,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Dive': {
        bp: 60,
        type: 'Water',
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
        hasSecondaryEffect: true,
        hasPriority: true
    },
    'Focus Punch': {
        bp: 150,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true,
        isPunch: true
    },
    'Frenzy Plant': {
        bp: 150,
        type: 'Grass',
        category: 'Special'
    },
    'Heat Wave': {
        bp: 100,
        type: 'Fire',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Helping Hand': {
        bp: 0,
        type: 'Normal'
    },
    'Hydro Cannon': {
        bp: 150,
        type: 'Water',
        category: 'Special'
    },
    'Hyper Voice': {
        bp: 90,
        type: 'Normal',
        category: 'Special',
        isSound: true,
        isSpread: true
    },
    'Icicle Spear': {
        bp: 10,
        type: 'Ice',
        category: 'Physical',
        isMultiHit: true
    },
    'Ingrain': {
        bp: 0,
        type: 'Grass'
    },
    'Iron Defense': {
        bp: 0,
        type: 'Steel'
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
    'Luster Purge': {
        bp: 70,
        type: 'Psychic',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Low Kick': {
        bp: 1,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Magical Leaf': {
        bp: 60,
        type: 'Grass',
        category: 'Special'
    },
    'Magic Coat': {
        bp: 0,
        type: 'Psychic'
    },
    'Meteor Mash': {
        bp: 100,
        type: 'Steel',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isPunch: true
    },
    'Mist Ball': {
        bp: 70,
        type: 'Psychic',
        category: 'Special',
        hasSecondaryEffect: true,
        isBullet: true
    },
    'Mud Shot': {
        bp: 55,
        type: 'Ground',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Muddy Water': {
        bp: 95,
        type: 'Water',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Needle Arm': {
        bp: 60,
        type: 'Grass',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
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
    'Poison Tail': {
        bp: 50,
        type: 'Poison',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Psycho Boost': {
        bp: 140,
        type: 'Psychic',
        category: 'Special'
    },
    'Recycle': {
        bp: 0,
        type: 'Normal'
    },
    'Refresh': {
        bp: 0,
        type: 'Normal'
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
    'Secret Power': {
        bp: 70,
        type: 'Normal',
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
    'Slack Off': {
        bp: 0,
        type: 'Normal'
    },
    'Stockpile': {
        bp: 0,
        type: 'Normal'
    },
    'Superpower': {
        bp: 120,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Tail Glow': {
        bp: 0,
        type: 'Bug'
    },
    'Taunt': {
        bp: 0,
        type: 'Dark'
    },
    'Trick': {
        bp: 0,
        type: 'Psychic'
    },
    'Uproar': {
        bp: 50,
        type: 'Normal',
        category: 'Special'
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
    },
    'Will-O-Wisp': {
        bp: 0,
        type: 'Fire'
    },
    'Wish': {
        bp: 0,
        type: 'Normal'
    },
    'Yawn': {
        bp: 0,
        type: 'Normal'
    }
});

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
        makesContact: true,
        hasPriority: true
    },
    'Aqua Tail': {
        bp: 90,
        type: 'Water',
        category: 'Physical',
        makesContact: true
    },
    'Aqua Ring': {
        bp: 0,
        type: 'Water'
    },
    'Assurance': {
        bp: 50,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Attack Order': {
        bp: 90,
        type: 'Bug',
        category: 'Physical'
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
    'Brine': {
        bp: 65,
        type: 'Water',
        category: 'Special'
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
        isPunch: true,
        hasPriority: true
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
    'Covet': { bp: 60 },
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
    'Dark Void': {
        bp: 0,
        type: 'Dark'
    },
    'Defend Order': {
        bp: 0,
        type: 'Bug'
    },
    'Defog': {
        bp: 0,
        type: 'Flying'
    },
    'Dig': { bp: 80 },
    'Discharge': {
        bp: 80,
        type: 'Electric',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
    },
    'Dive': { bp: 80 },
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
        isPunch: true,
        givesHealth: true
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
    'Fly': { bp: 90 },
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
    'Heal Order': {
        bp: 0,
        type: 'Bug'
    },
    'Healing Wish': {
        bp: 0,
        type: 'Psychic'
    },
    'High Jump Kick': { bp: 100 },
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
        category: 'Physical',
        hasPriority: true
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
    'Jump Kick': { bp: 85 },
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
    'Lunar Dance': {
        bp: 0,
        type: 'Psychic'
    },
    'Magma Storm': {
        bp: 120,
        type: 'Fire',
        category: 'Special'
    },
    'Magnet Bomb': {
        bp: 60,
        type: 'Steel',
        category: 'Physical',
        isBullet: true
    },
    'Magnet Rise': {
        bp: 0,
        type: 'Electric'
    },
    'Me First': {
        bp: 0,
        type: 'Normal'
    },
    'Mirror Shot': {
        bp: 65,
        type: 'Steel',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Mud Bomb': {
        bp: 65,
        type: 'Ground',
        category: 'Special',
        isBullet: true,
        hasSecondaryEffect: true
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
    'Nasty Plot': {
        bp: 0,
        type: 'Dark'
    },
    'Night Slash': {
        bp: 70,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Ominous Wind': {
        bp: 60,
        type: 'Ghost',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Outrage': {
        bp: 120,
        type: 'Dragon',
        category: 'Physical',
        makesContact: true
    },
    'Paleo Wave': {
        bp: 85,
        type: 'Rock',
        category: 'Special',
        hasSecondaryEffect: true
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
    'Psycho Shift': {
        bp: 0,
        type: 'Psychic'
    },
    'Punishment': {
        bp: 60,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Roar of Time': {
        bp: 150,
        type: 'Dragon',
        category: 'Special'
    },
    'Rock Climb': {
        bp: 90,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    },
    'Rock Smash': { bp: 40 },
    'Rock Polish': {
        bp: 0,
        type: 'Rock'
    },
    'Rock Wrecker': {
        bp: 150,
        type: 'Rock',
        category: 'Physical',
        isBullet: true
    },
    'Roost': {
        bp: 0,
        type: 'Flying'
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
        makesContact: true,
        hasPriority: true
    },
    'Shadow Strike': {
        bp: 80,
        type: 'Ghost',
        category: 'Physical',
        hasSecondaryEffect: true,
        makesContact: true
    },
    'Spacial Rend': {
        bp: 100,
        type: 'Dragon',
        category: 'Special'
    },
    'Stealth Rock': {
        bp: 0,
        type: 'Rock'
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
        makesContact: true,
        hasPriority: true
    },
    'Switcheroo': {
        bp: 0,
        type: 'Dark'
    },
    'Tailwind': {
        bp: 0,
        type: 'Flying'
    },
    'Thunder Fang': {
        bp: 65,
        type: 'Electric',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true,
        isBite: true
    },
    'Toxic Spikes': {
        bp: 0,
        type: 'Poison'
    },
    'Trick Room': {
        bp: 0,
        type: 'Psychic'
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
        category: 'Special',
        hasPriority: true
    },
    'Wake-Up Slap': {
        bp: 60,
        type: 'Fighting',
        category: 'Physical',
        makesContact: true
    },
    'Waterfall': { hasSecondaryEffect: true },
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
    'Zap Cannon': { bp: 120 },
    'Zen Headbutt': {
        bp: 80,
        type: 'Psychic',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
    }
});

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
    'Autotomize': {
        bp: 0,
        type: 'Steel'
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
    'Bullet Seed': { bp: 25 },
    'Chip Away': {
        bp: 70,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        ignoresDefenseBoosts: true
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
    'Coil': {
        bp: 0,
        type: 'Poison'
    },
    'Cotton Guard': {
        bp: 0,
        type: 'Grass'
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
    'Electroweb': {
        bp: 55,
        type: 'Electric',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: true
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
    'Flame Burst': {
        bp: 70,
        type: 'Fire',
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
    'Future Sight': { bp: 100 },
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
    'Heal Pulse': {
        bp: 0,
        type: 'Psychic'
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
    'High Jump Kick': { bp: 130 },
    'Hone Claws': {
        bp: 0,
        type: 'Dark'
    },
    'Horn Leech': {
        bp: 75,
        type: 'Grass',
        category: 'Physical',
        makesContact: true,
        givesHealth: true
    },
    'Hurricane': {
        bp: 120,
        type: 'Flying',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Ice Burn': {
        bp: 140,
        type: 'Ice',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Icicle Crash': {
        bp: 85,
        type: 'Ice',
        category: 'Physical',
        hasSecondaryEffect: true
    },
    'Icicle Spear': { bp: 25 },
    'Incinerate': {
        bp: 30,
        type: 'Fire',
        category: 'Special',
        isSpread: true
    },
    'Inferno': {
        bp: 100,
        type: 'Fire',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Jump Kick': { bp: 100 },
    'Last Resort': { bp: 140 },
    'Leaf Tornado': {
        bp: 65,
        type: 'Grass',
        category: 'Special',
        hasSecondaryEffect: true
    },
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
    'Quick Guard': {
        bp: 0,
        type: 'Fighting'
    },
    'Quiver Dance': {
        bp: 0,
        type: 'Bug'
    },
    'Rage Powder': {
        bp: 0,
        type: 'Bug'
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
    'Round': {
        bp: 60,
        type: 'Normal',
        category: 'Special'
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
    'Shell Smash': {
        bp: 0,
        type: 'Normal'
    },
    'Shift Gear': {
        bp: 0,
        type: 'Steel'
    },
    'Sky Drop': {
        bp: 60,
        type: 'Flying',
        category: 'Physical',
        makesContact: true
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
    'Steamroller': {
        bp: 65,
        type: 'Bug',
        category: 'Physical',
        makesContact: true,
        hasSecondaryEffect: true
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
    'Struggle Bug': {
        bp: 30,
        type: 'Bug',
        category: 'Special',
        isSpread: true
    },
    'Synchronoise': {
        bp: 70,
        type: 'Psychic',
        category: 'Special'
    },
    'Tackle': { bp: 50 },
    'Tail Slap': {
        bp: 25,
        type: 'Normal',
        category: 'Physical',
        makesContact: true,
        isMultiHit: true
    },
    'Techno Blast': {
        bp: 85,
        type: 'Normal',
        category: 'Special'
    },
    'Thrash': { bp: 120 },
    'Uproar': { bp: 90 },
    'V-create': {
        bp: 180,
        type: 'Fire',
        category: 'Physical',
        makesContact: true
    },
    'Venoshock': {
        bp: 65,
        type: 'Poison',
        category: 'Special'
    },
    'Volt Switch': {
        bp: 70,
        type: 'Electric',
        category: 'Special'
    },
    'Wide Guard': {
        bp: 0,
        type: 'Rock'
    },
    'Wild Charge': {
        bp: 90,
        type: 'Electric',
        category: 'Physical',
        makesContact: true,
        hasRecoil: true
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
    'Future Sight': { bp: 120 },
    'Geomancy': {
        bp: 0,
        type: 'Fairy'
    },
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
    'King\'s Shield': {
        bp: 0,
        type: 'Steel'
    },
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
    'Moonlight': { type: 'Fairy' },
    'Muddy Water': { bp: 90 },
    'Nature Power': {
        bp: 80,
        type: 'Normal',
        category: 'Special',
        hasSecondaryEffect: true,
        isSpread: false
    },
    'Nuzzle': {
        bp: 20,
        type: 'Electric',
        category: 'Physical',
        hasSecondaryEffect: true,
        makesContact: true
    },
    'Oblivion Wing': {
        bp: 80,
        type: 'Flying',
        category: 'Special',
        givesHealth: true
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
    'Skull Bash': { bp: 130 },
    'Spiky Shield': {
        bp: 0,
        type: 'Grass'
    },
    'Steam Eruption': {
        bp: 110,
        type: 'Water',
        category: 'Special',
        hasSecondaryEffect: true,
    },
    'Sticky Web': {
        bp: 0,
        type: 'Bug'
    },
    'Storm Throw': { bp: 60 },
    'Struggle Bug': { bp: 50 },
    'Surf': { bp: 90 },
    'Synchronoise': { bp: 120 },
    'Techno Blast': { bp: 120 },
    'Thief': { bp: 60 },
    'Thousand Arrows': {
        bp: 90,
        type: 'Ground',
        category: 'Physical',
        isSpread: 'true'
    },
    'Thousand Waves': {
        bp: 90,
        type: 'Ground',
        category: 'Physical',
        isSpread: 'true'
    },
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

var MOVES_SM = $.extend(true, {}, MOVES_XY, {
    '10,000,000 Volt Thunderbolt': {
        bp: 195,
        type: 'Electric',
        category: 'Special'
    },
    'Acid Downpour': {
        bp: 1,
        type: 'Rock',
        category: 'Physical'
    },
    'Accelerock': {
        bp: 40,
        type: 'Rock',
        category: 'Physical',
        makesContact: true,
        hasPriority: true
    },
    'All-Out Pummeling': {
        bp: 1,
        type: 'Fighting',
        category: 'Physical'
    },
    'Anchor Shot': {
        bp: 80,
        type: 'Steel',
        category: 'Physical',
        makesContact: true
    },
    'Black Hole Eclipse': {
        bp: 1,
        type: 'Dark',
        category: 'Physical'
    },
    'Bloom Doom': {
        bp: 1,
        type: 'Grass',
        category: 'Physical'
    },
    'Beak Blast': {
        bp: 100,
        type: 'Flying',
        category: 'Physical'
    },
    'Breakneck Blitz': {
        bp: 1,
        type: 'Normal',
        category: 'Physical'
    },
    'Brutal Swing': {
        bp: 60,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Burn Up': {
        bp: 130,
        type: 'Fire',
        category: 'Special'
    },
    'Catastropika': {
        bp: 210,
        type: 'Electric',
        category: 'Physical'
    },
    'Clanging Scales': {
        bp: 110,
        type: 'Dragon',
        category: 'Special',
        isSound: true
    },
    'Continental Crush': {
        bp: 1,
        type: 'Rock',
        category: 'Physical'
    },
    'Core Enforcer': {
        bp: 100,
        type: 'Dragon',
        category: 'Special'
    },
    'Corkscrew Crash': {
        bp: 1,
        type: 'Steel',
        category: 'Physical'
    },
    'Darkest Lariat': {
        bp: 85,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Dragon Hammer': {
        bp: 90,
        type: 'Dragon',
        category: 'Physical',
        makesContact: true
    },
    'Devastating Drake': {
        bp: 1,
        type: 'Ghost',
        category: 'Physical'
    },
    'Fire Lash': {
        bp: 80,
        type: 'Fire',
        category: 'Physical',
        hasSecondaryEffect: true,
        makesContact: true
    },
    'Fleur Cannon': {
        bp: 130,
        type: 'Fairy',
        category: 'Special',
        hasSecondaryEffect: true
    },
    'Flying Press': { bp: 100 },
    'Genesis Supernova': {
        bp: 185,
        type: 'Psychic',
        category: 'Special'
    },
    'Gigavolt Havoc': {
        bp: 1,
        type: 'Electric',
        category: 'Physical'
    },
    'Highhorse Power': {
        bp: 95,
        type: 'Ground',
        category: 'Physical',
        makesContact: true
    },
    'Hydro Vortex': {
        bp: 1,
        type: 'Water',
        category: 'Physical'
    },
    'Ice Hammer': {
        bp: 100,
        type: 'Ice',
        category: 'Physical',
        makesContact: true,
        isPunch: true
    },
    'Inferno Overdrive': {
        bp: 1,
        type: 'Fire',
        category: 'Physical'
    },
    'Leafage': {
        bp: 40,
        type: 'Grass',
        category: 'Physical'
    },
    'Liquidation': {
        bp: 85,
        type: 'Water',
        category: 'Physical',
        hasSecondaryEffect: true,
        makesContact: true
    },
    'Lunge': {
        bp: 80,
        type: 'Bug',
        category: 'Physical',
        hasSecondaryEffect: true,
        makesContact: true
    },
    'Malicious Moonsault': {
        bp: 180,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Moongeist Beam': {
        bp: 100,
        type: 'Ghost',
        category: 'Special'
    },
    'Multi-Attack': {
        bp: 90,
        type: 'Normal',
        category: 'Physical',
        makesContact: true
    },
    'Never-Ending Nightmare': {
        bp: 1,
        type: 'Ghost',
        category: 'Physical'
    },
    'Oceanic Operetta': {
        bp: 195,
        type: 'Water',
        category: 'Special'
    },
    'Pollen Puff': {
        bp: 90,
        type: 'Bug',
        category: 'Special'
    },
    'Power Trip': {
        bp: 20,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Prismatic Laser': {
        bp: 160,
        type: 'Psychic',
        category: 'Special'
    },
    'Psychic Fangs': {
        bp: 85,
        type: 'Psychic',
        category: 'Physical',
        makesContact: true
    },
    'Pulverizing Pancake': {
        bp: 210,
        type: 'Normal',
        category: 'Physical'
    },
    'Revelation Dancer': {
        bp: 90,
        type: 'Normal',
        category: 'Special'
    },
    'Savage Spin-Out': {
        bp: 1,
        type: 'Bug',
        category: 'Physical'
    },
    'Shattered Psyche': {
        bp: 1,
        type: 'Psychic',
        category: 'Physical'
    },
    'Shadow Bone': {
        bp: 85,
        type: 'Ghost',
        category: 'Physical',
        hasSecondaryEffect: true
    },
    'Shell Trap': {
        bp: 150,
        type: 'Fire',
        category: 'Special',
        isSpread: true
    },
    'Sinister Arrow Raid': {
        bp: 180,
        type: 'Ghost',
        category: 'Physical'
    },
    'Smart Strike': {
        bp: 70,
        type: 'Steel',
        category: 'Physical',
        makesContact: true
    },
    'Solar Blade': {
        bp: 125,
        type: 'Grass',
        category: 'Physical',
        makesContact: true
    },
    'Soul-Stealing 7-Star Strike': {
        bp: 195,
        type: 'Ghost',
        category: 'Physical'
    },
    'Sparkling Aria': {
        bp: 90,
        type: 'Water',
        category: 'Special',
        isSound: true
    },
    'Spectral Thief': {
        bp: 90,
        type: 'Ghost',
        category: 'Physical',
        makesContact: true
    },
    'Spirit Shackle': {
        bp: 80,
        type: 'Ghost',
        category: 'Physical'
    },
    'Stoked Sparksurfer': {
        bp: 175,
        type: 'Electric',
        category: 'Special'
    },
    'Stomping Tantrum': {
        bp: 75,
        type: 'Ground',
        category: 'Physical',
        makesContact: true
    },
    'Subzero Slammer': {
        bp: 1,
        type: 'Ice',
        category: 'Physical'
    },
    'Sucker Punch': { bp: 70 },
    'Sunsteel Strike': {
        bp: 100,
        type: 'Steel',
        category: 'Physical',
        makesContact: true
    },
    'Supersonic Skystrike': {
        bp: 1,
        type: 'Flying',
        category: 'Physical'
    },
    'Tackle': { bp: 40 },
    'Tectonic Rage': {
        bp: 1,
        type: 'Ground',
        category: 'Physical'
    },
    'Throat Chop': {
        bp: 80,
        type: 'Dark',
        category: 'Physical',
        makesContact: true
    },
    'Trop Kick': {
        bp: 70,
        type: 'Grass',
        category: 'Physical',
        hasSecondaryEffect: true,
        makesContact: true
    },
    'Twinkle Tackle': {
        bp: 1,
        type: 'Fairy',
        category: 'Physical'
    },
    'Water Shuriken': { category: 'Special' },
    'Zing Zap': {
        bp: 80,
        type: 'Electric',
        category: 'Physical',
        hasSecondaryEffect: true,
        makesContact: true
    }
});
