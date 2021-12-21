export interface PlaneData {
	plane: number;
	zone?: number;
}

export interface OutlawData {
	dumpVnum: number;
	jailVnum: number;
	deathVnum: number;
	execVnum: number;
	justice: number;
}

export interface KspawnData {
	condition: number;
	command: number;
	mobVnum: number;
	roomVnum: number;
	text: string;
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
}

export interface VnumRangeData {
	min: number;
	max: number;
}

export interface ScalingData {
	maxGroupPower: number;
	maxGroupToughness: number;
}

export interface AreadataSection {
	plane?: PlaneData;
	flags?: number[];
	outlaw?: OutlawData;
	kspawn?: KspawnData;
	modifier?: ModifierData;
	groupSize?: GroupSizeData;
	vnumRange?: VnumRangeData;
	scaling?: ScalingData;
	// TODO: titan N and X lines
}

export interface ParseAreadataReturn {
	section: AreadataSection,
	errors: string[],
}

export default function parseAreadata(section: string): ParseAreadataReturn {
	let errors: string[] = [];
	let lines = section.split(/\r?\n/);
	let areaData: AreadataSection = {};

	for (let line of lines) {
		line = line.trim();
		if (line.length === 0) continue;
		let words = line.split(/\s+/);
		switch (words[0].toUpperCase()) {
			case "P": {
				let { err, plane } = parsePlane(words.slice(1));
				if (plane) areaData.plane = plane;
				break;
			}
			case "F": {
				let { err, flags } = parseFlags(words.slice(1));
				if (flags) areaData.flags = flags;
				break;
			}
			case "O": {
				let { err, outlaw } = parseOutlaw(words.slice(1));
				if (outlaw) areaData.outlaw = outlaw;
				break;
			}
			case "K": {
				let { err, kspawn } = parseKspawn(line);
				if (kspawn) areaData.kspawn = kspawn;
				break;
			}
			case "M": {
				let { err, modifier } = parseModifier(words.slice(1));
				if (modifier) areaData.modifier = modifier;
				break;
			}
			case "G": {
				let { err, groupSize } = parseGroupSize(words.slice(1));
				if (groupSize) areaData.groupSize = groupSize;
				break;
			}
			case "V": {
				let { err, vnumRange } = parseVnumRange(words.slice(1));
				if (vnumRange) areaData.vnumRange = vnumRange;
				break;
			}
			case "B": {
				let { err, scaling } = parseScaling(words.slice(1));
				if (scaling) areaData.scaling = scaling;
				break;
			}
			// TODO: titan N and X lines
			default: {
				errors.push(`Unknown AREADATA line:\n${line}`);
			}
		}
	}

	return { errors, section: areaData };
}

function parsePlane(words: string[]): { err: string[], plane: PlaneData | null } {
	let err: string[] = [];
	let [planeString, zoneString, ...rest] = words;
	if (!planeString) return { err, plane: null };

	let plane: PlaneData = { plane: 1 };

	let planeNum = parseInt(planeString);
	if (Number.isNaN(planeNum)) {
		err.push(`AREADATA plane ${planeString} is not a number`);
	} else {
		plane.plane = planeNum;
	}

	if (zoneString) {
		let zoneNum = parseInt(zoneString);
		if (Number.isNaN(zoneNum)) {
			err.push(`AREADATA zone ${zoneString} is not a number`);
		} else {
			plane.zone = zoneNum;
		}
	}

	if (rest.length > 0) {
		err.push(`Dropped invalid text at the end of AREADATA P line:\n${rest.join(" ")}`);
	}

	return { err, plane };
}

function factor(n: number): number[] {
	let factors: number[] = [];
	for (let power = 0; power < 32; power++) {
		if ((n & 1<<power) > 0) {
			factors.push(1<<power);
		}
	}
	return factors;
}

function parseFlags(words: string[]): { err: string[], flags: number[] | null } {
	let err: string[] = [];
	let [flagsWord, ...rest] = words;
	let flagStrings = flagsWord.split("|");

	let flagSet: Set<number> = new Set();
	for (let s of flagStrings) {
		if (s.length === 0) continue;
		let number = parseInt(s);
		if (Number.isNaN(number)) {
			err.push(`AREADATA flag ${s} is not a number`);
			continue;
		}
		let bits = factor(number);
		for (let bit of bits) {
			flagSet.add(bit);
		}
	}

	if (rest.length > 0) {
		err.push(`Dropped invalid text at the end of AREADATA F line:\n${rest.join(" ")}`);
	}

	let flags = Array.from(flagSet).sort((a, b) => a - b);

	return { err, flags };
}

function parseOutlaw(words: string[]): { err: string[], outlaw: OutlawData | null } {
	let err: string[] = [];
	let [dumpVnumString, jailVnumString, deathVnumString, execVnumString, justiceString, ...rest] = words;
	let outlaw = {
		dumpVnum: -1,
		jailVnum: -1,
		deathVnum: -1,
		execVnum: -1,
		justice: -1,
	};

	let dumpVnum = parseInt(dumpVnumString);
	if (Number.isNaN(dumpVnum)) {
		err.push(`AREADATA outlaw dump vnum ${dumpVnumString} is not a number`);
	} else {
		outlaw.dumpVnum = dumpVnum;
	}
	let jailVnum = parseInt(jailVnumString);
	if (Number.isNaN(jailVnum)) {
		err.push(`AREADATA outlaw jail vnum ${jailVnumString} is not a number`);
	} else {
		outlaw.jailVnum = jailVnum;
	}
	let deathVnum = parseInt(deathVnumString);
	if (Number.isNaN(deathVnum)) {
		err.push(`AREADATA outlaw death vnum ${deathVnumString} is not a number`);
	} else {
		outlaw.deathVnum = deathVnum;
	}
	let execVnum = parseInt(execVnumString);
	if (Number.isNaN(execVnum)) {
		err.push(`AREADATA outlaw exec vnum ${execVnumString} is not a number`);
	} else {
		outlaw.execVnum = execVnum;
	}
	let justice = parseInt(justiceString);
	if (Number.isNaN(justice)) {
		err.push(`AREADATA outlaw justice ${justiceString} is not a number`);
	} else {
		outlaw.justice = justice;
	}

	if (rest.length > 0) {
		err.push(`Dropped invalid text at the end of AREADATA O line:\n${rest.join(" ")}`);
	}

	return { err, outlaw };
}

function parseKspawn(rawLine: string): { err: string[], kspawn: KspawnData | null } {
	let err: string[] = [];
	let tilde = rawLine.indexOf("~");
	let line = rawLine;
	let rest = "";
	if (tilde > -1) {
		line = rawLine.substring(0, tilde);
		rest = rawLine.substring(tilde + 1);
	}

	let match = line.match(/^K\s+([\w-]?)\s+([\w-]?)\s+([\w-]?)\s+([\w-]?)\s+(.*)/);
	if (!match) {
		err.push(`AREADATA kspawn line is malformed:\n${rawLine}`);
		return { err, kspawn: null };
	}
	let kspawn: KspawnData = {
		condition: 1,
		command: 1,
		mobVnum: -1,
		roomVnum: -1,
		text: "",
	};
	let [, conditionString, commandString, mobVnumString, roomVnumString, text] = match;
	let condition = parseInt(conditionString);
	if (Number.isNaN(condition)) {
		err.push(`AREADATA kspawn condition ${conditionString} is not a number`);
	} else {
		kspawn.condition = condition;
	}
	let command = parseInt(commandString);
	if (Number.isNaN(command)) {
		err.push(`AREADATA kspawn command ${commandString} is not a number`);
	} else {
		kspawn.command = command;
	}
	let mobVnum = parseInt(mobVnumString);
	if (Number.isNaN(mobVnum)) {
		err.push(`AREADATA kspawn mob vnum ${mobVnumString} is not a number`);
	} else {
		kspawn.mobVnum = mobVnum;
	}
	let roomVnum = parseInt(roomVnumString);
	if (Number.isNaN(roomVnum)) {
		err.push(`AREADATA kspawn room vnum ${roomVnumString} is not a number`);
	} else {
		kspawn.roomVnum = roomVnum;
	}
	kspawn.text = text;

	if (rest.length > 0) {
		err.push(`Dropped invalid text at the end of AREADATA K line:\n${rest}`);
	}

	return { err, kspawn };
}

function parseModifier(words: string[]): { err: string[], modifier: ModifierData | null } {
	let err: string[] = [];
	let [
		xpGainString, hpRegenString, manaRegenString,
		moveRegenString, statlossString, respawnRoomString,
		tbd1String, tbd2String, ...rest
	] = words;
	let modifier: ModifierData = {
		xpGain: 0,
		hpRegen: 0,
		manaRegen: 0,
		moveRegen: 0,
		statloss: 0,
		respawnRoom: 0,
		tbd1: 0,
		tbd2: 0,
	};

	if (!xpGainString) return { err, modifier };
	let xpGain = parseInt(xpGainString);
	if (Number.isNaN(xpGain)) {
		err.push(`AREADATA xpGain modifier ${xpGainString} is not a number`);
	} else {
		modifier.xpGain = xpGain;
	}
	if (!hpRegenString) return { err, modifier };
	let hpRegen = parseInt(hpRegenString);
	if (Number.isNaN(hpRegen)) {
		err.push(`AREADATA hpRegen modifier ${hpRegenString} is not a number`);
	} else {
		modifier.hpRegen = hpRegen;
	}
	if (!manaRegenString) return { err, modifier };
	let manaRegen = parseInt(manaRegenString);
	if (Number.isNaN(manaRegen)) {
		err.push(`AREADATA manaRegen modifier ${manaRegenString} is not a number`);
	} else {
		modifier.manaRegen = manaRegen;
	}
	if (!moveRegenString) return { err, modifier };
	let moveRegen = parseInt(moveRegenString);
	if (Number.isNaN(moveRegen)) {
		err.push(`AREADATA moveRegen modifier ${moveRegenString} is not a number`);
	} else {
		modifier.moveRegen = moveRegen;
	}
	if (!statlossString) return { err, modifier };
	let statloss = parseInt(statlossString);
	if (Number.isNaN(statloss)) {
		err.push(`AREADATA statloss modifier ${statlossString} is not a number`);
	} else {
		modifier.statloss = statloss;
	}
	if (!respawnRoomString) return { err, modifier };
	let respawnRoom = parseInt(respawnRoomString);
	if (Number.isNaN(respawnRoom)) {
		err.push(`AREADATA respawnRoom modifier ${respawnRoomString} is not a number`);
	} else {
		modifier.respawnRoom = respawnRoom;
	}

	if (!tbd1String) return { err, modifier };
	let tbd1 = parseInt(tbd1String);
	if (!Number.isNaN(tbd1)) {
		modifier.tbd1 = tbd1;
	}
	if (!tbd2String) return { err, modifier };
	let tbd2 = parseInt(tbd2String);
	if (!Number.isNaN(tbd2)) {
		modifier.tbd2 = tbd2;
	}

	if (rest.length > 0) {
		err.push(`Dropped invalid text at the end of AREADATA M line:\n${rest.join(" ")}`);
	}

	return { err, modifier };
}

function parseGroupSize(words: string[]): { err: string[], groupSize: GroupSizeData | null } {
	let err: string[] = [];
	let [
		pct0String, num1String, pct1String, num2String,
		pct2String, pct3String, divString, tbdString,
		...rest
	] = words;
	let groupSize: GroupSizeData = {
		pct0: 0,
		num1: 0,
		pct1: 0,
		num2: 0,
		pct2: 0,
		pct3: 0,
		div: 0,
		tbd: 0,
	};

	if (!pct0String) return { err, groupSize };
	let pct0 = parseInt(pct0String);
	if (Number.isNaN(pct0)) {
		err.push(`AREADATA pct0 groupSize ${pct0String} is not a number`);
	} else {
		groupSize.pct0 = pct0;
	}
	if (!num1String) return { err, groupSize };
	let num1 = parseInt(num1String);
	if (Number.isNaN(num1)) {
		err.push(`AREADATA num1 groupSize ${num1String} is not a number`);
	} else {
		groupSize.num1 = num1;
	}
	if (!pct1String) return { err, groupSize };
	let pct1 = parseInt(pct1String);
	if (Number.isNaN(pct1)) {
		err.push(`AREADATA pct1 groupSize ${pct1String} is not a number`);
	} else {
		groupSize.pct1 = pct1;
	}
	if (!num2String) return { err, groupSize };
	let num2 = parseInt(num2String);
	if (Number.isNaN(num2)) {
		err.push(`AREADATA num2 groupSize ${num2String} is not a number`);
	} else {
		groupSize.num2 = num2;
	}
	if (!pct2String) return { err, groupSize };
	let pct2 = parseInt(pct2String);
	if (Number.isNaN(pct2)) {
		err.push(`AREADATA pct2 groupSize ${pct2String} is not a number`);
	} else {
		groupSize.pct2 = pct2;
	}
	if (!pct3String) return { err, groupSize };
	let pct3 = parseInt(pct3String);
	if (Number.isNaN(pct3)) {
		err.push(`AREADATA pct3 groupSize ${pct3String} is not a number`);
	} else {
		groupSize.pct3 = pct3;
	}
	if (!divString) return { err, groupSize };
	let div = parseInt(divString);
	if (Number.isNaN(div)) {
		err.push(`AREADATA div groupSize ${divString} is not a number`);
	} else {
		groupSize.div = div;
	}

	if (!tbdString) return { err, groupSize };
	let tbd = parseInt(tbdString);
	if (!Number.isNaN(tbd)) {
		groupSize.tbd = tbd;
	}

	if (rest.length > 0) {
		err.push(`Dropped invalid text at the end of AREADATA G line:\n${rest.join(" ")}`);
	}

	return { err, groupSize };
}

function parseVnumRange(words: string[]): { err: string[], vnumRange: VnumRangeData | null } {
	let err: string[] = [];
	let [minString, maxString, ...rest] = words;
	let vnumRange: VnumRangeData = {
		min: 0,
		max: 0,
	};

	if (!minString) return { err, vnumRange: null };
	let min = parseInt(minString);
	if (Number.isNaN(min)) {
		err.push(`AREADATA vnum range min ${minString} is not a number`);
	} else {
		vnumRange.min = min;
	}
	if (!maxString) {
		vnumRange.max = vnumRange.min;
		return { err, vnumRange };
	}
	let max = parseInt(maxString);
	if (Number.isNaN(max)) {
		err.push(`AREADATA vnum range max ${maxString} is not a number`);
		vnumRange.max = vnumRange.min;
	} else {
		vnumRange.max = max;
	}

	if (rest.length > 0) {
		err.push(`Dropped invalid text at the end of AREADATA V line:\n${rest.join(" ")}`);
	}

	return { err, vnumRange };
}

function parseScaling(words: string[]): { err: string[], scaling: ScalingData | null } {
	let err: string[] = [];
	let [maxGroupPowerString, maxGroupToughnessString, ...rest] = words;
	let scaling: ScalingData = {
		maxGroupPower: 490,
		maxGroupToughness: 180000,
	};

	if (!maxGroupPowerString) return { err, scaling };
	let maxGroupPower = parseInt(maxGroupPowerString);
	if (Number.isNaN(maxGroupPower)) {
		err.push(`AREADATA scaling max group power ${maxGroupPowerString} is not a number`);
	} else {
		scaling.maxGroupPower = maxGroupPower;
	}
	if (!maxGroupToughnessString) return { err, scaling };
	let maxGroupToughness = parseInt(maxGroupToughnessString);
	if (Number.isNaN(maxGroupToughness)) {
		err.push(`AREADATA scaling max group toughness ${maxGroupToughnessString} is not a number`);
	} else {
		scaling.maxGroupToughness = maxGroupToughness;
	}

	if (rest.length > 0) {
		err.push(`Dropped invalid text at the end of AREADATA B line:\n${rest.join(" ")}`);
	}

	return { err, scaling };
}
