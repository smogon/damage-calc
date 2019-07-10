function Move(data, isCrit, hits, usedTimes, metronomeCount) {
	this.name = data.name;
	this.bp = data.bp;
	this.type = data.type;
	this.category = data.category || 'Status';
	this.hasSecondaryEffect = !!data.hasSecondaryEffect;
	this.isSpread = !!data.isSpread;
	this.makesContact = !!data.makesContact;
	this.hasRecoil = data.hasRecoil;
	this.givesHealth = !!data.givesHealth;
	this.percentHealed = data.percentHealed;
	this.ignoresBurn = !!data.ignoresBurn;
	this.isPunch = !!data.isPunch;
	this.isBite = !!data.isBite;
	this.isBullet = !!data.isBullet;
	this.isSound = !!data.isSound;
	this.isPulse = !!data.isPulse;
	this.hasPriority = !!data.hasPriority;
	this.dropsStats = data.dropsStats;
	this.ignoresDefenseBoosts = !!data.ignoresDefenseBoosts;
	this.dealsPhysicalDamage = !!data.dealsPhysicalDamage;
	this.bypassesProtect = !!data.bypassesProtect;
	this.isZ = !!data.isZ;
	this.usesHighestAttackStat = !!data.usesHighestAttackStat;

	this.isCrit = !!isCrit || !!data.alwaysCrit;
	this.hits = hits;
	this.usedTimes = usedTimes;
	this.metronomeCount = metronomeCount;
}