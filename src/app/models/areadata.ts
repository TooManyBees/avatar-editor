export interface PlaneData {
	plane: number;
	zone: number | null;
	_error: {
		all?: boolean;
		plane?: boolean,
		zone?: boolean,
	};
}

export interface FlagsData {
	flags: number[],
	_error: {
		all?: boolean;
		flags?: boolean;
	};
}

export interface OutlawData {
	dumpVnum: number;
	jailVnum: number;
	deathVnum: number;
	execVnum: number;
	justice: number;
	_error: {
		all?: boolean;
		dumpVnum?: boolean;
		jailVnum?: boolean;
		deathVnum?: boolean;
		execVnum?: boolean;
		justice?: boolean;
	};
}

export interface KspawnData {
	condition: number;
	command: number;
	mobVnum: number;
	roomVnum: number;
	text: string;
	_error: {
		all?: boolean;
		condition?: boolean;
		command?: boolean;
		mobVnum?: boolean;
		roomVnum?: boolean;
		text?: boolean;
	};
}

export interface ModifierData {
	xpGain: number;
	hpRegen: number;
	manaRegen: number;
	moveRegen: number;
	statloss: number;
	respawnRoom: number;
	tbd1: number;
	tbd2: number;
	_error: {
		xpGain?: boolean;
		hpRegen?: boolean;
		manaRegen?: boolean;
		moveRegen?: boolean;
		statloss?: boolean;
		respawnRoom?: boolean;
		tbd1?: boolean;
		tbd2?: boolean;
	};
}

export interface GroupSizeData {
	pct0: number;
	num1: number;
	pct1: number;
	num2: number;
	pct2: number;
	pct3: number;
	div: number;
	tbd: number;
	_error: {
		pct0?: boolean;
		num1?: boolean;
		pct1?: boolean;
		num2?: boolean;
		pct2?: boolean;
		pct3?: boolean;
		div?: boolean;
		tbd?: boolean;
	};
}

export interface VnumRangeData {
	min: number;
	max: number;
	_error: {
		min?: boolean;
		max?: boolean;
	};
}

export interface ScalingData {
	maxGroupPower: number;
	maxGroupToughness: number;
	_error: {
		maxGroupPower?: boolean;
		maxGroupToughness?: boolean;
	};
}

export interface AreadataSection {
	plane?: PlaneData;
	flags?: FlagsData;
	outlaw?: OutlawData;
	kspawn?: KspawnData;
	modifier?: ModifierData;
	groupSize?: GroupSizeData;
	vnumRange?: VnumRangeData;
	scaling?: ScalingData;
	// TODO: titan N and X lines
}
