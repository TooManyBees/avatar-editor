import {
	PlaneData,
	FlagsData,
	OutlawData,
	KspawnData,
	ModifierData,
	GroupSizeData,
	VnumRangeData,
	ScalingData,
	AreadataSection,
} from "../app/models/areadata";
import { parseBits, parseNumber } from "./helpers";

export const BLANK_AREADATA_SECTION = {};

export default function parseAreadata(section: string): AreadataSection {
	let lines = section.split(/\r?\n/);
	let areaData: AreadataSection = {};

	for (let line of lines) {
		line = line.trim();
		if (line.length === 0) continue;
		let words = line.split(/\s+/);
		switch (words[0].toUpperCase()) {
			case "P": {
				areaData.plane = parsePlane(words.slice(1));
				break;
			}
			case "F": {
				areaData.flags = parseFlags(words.slice(1));
				break;
			}
			case "O": {
				areaData.outlaw = parseOutlaw(words.slice(1));
				break;
			}
			case "K": {
				areaData.kspawn = parseKspawn(line);
				break;
			}
			case "M": {
				areaData.modifier = parseModifier(words.slice(1));
				break;
			}
			case "G": {
				areaData.groupSize = parseGroupSize(words.slice(1));
				break;
			}
			case "V": {
				areaData.vnumRange = parseVnumRange(words.slice(1));
				break;
			}
			case "B": {
				areaData.scaling = parseScaling(words.slice(1));
				break;
			}
			case "S": {
				break;
			}
			// TODO: titan N and X lines
			default: {
				// TODO: error here
			}
		}
	}

	return areaData;
}

export function parsePlane(words: string[]): PlaneData {
	let plane: PlaneData = { plane: 1, zone: null, _error: {} };

	let [planeString, zoneString, ...rest] = words;

	if (!planeString) {
		plane._error.all = true;
		return plane;
	};

	let planeNum = parseNumber(planeString);
	if (planeNum != null && planeNum !== 0) plane.plane = planeNum;
	else plane._error.plane = true;

	if (zoneString) {
		let zoneNum = parseNumber(zoneString);
		if (zoneNum != null) plane.zone = zoneNum;
		else plane._error.zone = true;
	}

	return plane;
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

export function parseFlags(words: string[]): FlagsData {
	let flags: FlagsData = {
		flags: [],
		_error: {},
	};

	let [flagsWord, ...rest] = words;
	if (!flagsWord) {
		flags._error.all = true;
		return flags;
	}

	let { error, bits } = parseBits(flagsWord);
	if (error) flags._error.flags = true;
	flags.flags = bits;

	return flags;
}

export function parseOutlaw(words: string[]): OutlawData {
	let [dumpVnumString, jailVnumString, deathVnumString, execVnumString, justiceString, ...rest] = words;
	let outlaw: OutlawData = {
		dumpVnum: -1,
		jailVnum: -1,
		deathVnum: -1,
		execVnum: -1,
		justice: -1,
		_error: {},
	};

	let dumpVnum = parseNumber(dumpVnumString);
	if (dumpVnum != null) outlaw.dumpVnum = dumpVnum;
	else outlaw._error.dumpVnum = true;

	let jailVnum = parseNumber(jailVnumString);
	if (jailVnum != null) outlaw.jailVnum = jailVnum;
	else outlaw._error.jailVnum = true;

	let deathVnum = parseNumber(deathVnumString);
	if (deathVnum != null) outlaw.deathVnum = deathVnum;
	else outlaw._error.deathVnum = true;

	let execVnum = parseNumber(execVnumString);
	if (execVnum != null) outlaw.execVnum = execVnum;
	else outlaw._error.execVnum = true;

	let justice = parseNumber(justiceString);
	if (justice != null) outlaw.justice = justice;
	else outlaw._error.justice = true;

	return outlaw;
}

export function parseKspawn(rawLine: string): KspawnData {
	let tilde = rawLine.indexOf("~");
	let line = rawLine;
	let rest = "";
	if (tilde > -1) {
		line = rawLine.substring(0, tilde);
		rest = rawLine.substring(tilde + 1);
	}

	let kspawn: KspawnData = {
		condition: 1,
		command: 1,
		mobVnum: -1,
		roomVnum: -1,
		text: "",
		_error: {},
	};

	let match = line.match(/^K\s+([\w-]+)\s+([\w-]+)\s+([\w-]+)\s+([\w-]+)\s*(.*)/);
	if (!match) {
		kspawn._error.all = true;
		return kspawn;
	}

	let [, conditionString, commandString, mobVnumString, roomVnumString, text] = match;
	let condition = parseNumber(conditionString);
	if (condition != null) kspawn.condition = condition;
	else kspawn._error.condition = true;
	let command = parseNumber(commandString);
	if (command != null) kspawn.command = command;
	else kspawn._error.command = true;
	let mobVnum = parseNumber(mobVnumString);
	if (mobVnum != null) kspawn.mobVnum = mobVnum;
	else kspawn._error.mobVnum = true;
	let roomVnum = parseNumber(roomVnumString);
	if (roomVnum != null) kspawn.roomVnum = roomVnum;
	else kspawn._error.roomVnum = true;
	kspawn.text = text;

	return kspawn;
}

export function parseModifier(words: string[]): ModifierData {
	let modifier: ModifierData = {
		xpGain: 0,
		hpRegen: 0,
		manaRegen: 0,
		moveRegen: 0,
		statloss: 0,
		respawnRoom: 0,
		tbd1: 0,
		tbd2: 0,
		_error: {},
	};

	let [
		xpGainString, hpRegenString, manaRegenString,
		moveRegenString, statlossString, respawnRoomString,
		tbd1String, tbd2String, ...rest
	] = words;

	let xpGain = parseNumber(xpGainString);
	if (xpGain != null) modifier.xpGain = xpGain;
	else modifier._error.xpGain = true;

	let hpRegen = parseNumber(hpRegenString);
	if (hpRegen != null) modifier.hpRegen = hpRegen;
	else modifier._error.hpRegen = true;

	let manaRegen = parseNumber(manaRegenString);
	if (manaRegen != null) modifier.manaRegen = manaRegen;
	else modifier._error.manaRegen = true;

	let moveRegen = parseNumber(moveRegenString);
	if (moveRegen != null) modifier.moveRegen = moveRegen;
	else modifier._error.moveRegen = true;

	let statloss = parseNumber(statlossString);
	if (statloss != null) modifier.statloss = statloss;
	else modifier._error.statloss = true;

	let respawnRoom = parseNumber(respawnRoomString);
	if (respawnRoom != null) modifier.respawnRoom = respawnRoom;
	else modifier._error.respawnRoom = true;

	let tbd1 = parseNumber(tbd1String);
	if (tbd1 != null) modifier.tbd1 = tbd1;

	let tbd2 = parseNumber(tbd2String);
	if (tbd2 != null) modifier.tbd2 = tbd2;

	return modifier;
}

export function parseGroupSize(words: string[]): GroupSizeData {
	let groupSize: GroupSizeData = {
		pct0: 0,
		num1: 0,
		pct1: 0,
		num2: 0,
		pct2: 0,
		pct3: 0,
		div: 0,
		tbd: 0,
		_error: {},
	};
	let [
		pct0String, num1String, pct1String, num2String,
		pct2String, pct3String, divString, tbdString,
		...rest
	] = words;

	let pct0 = parseNumber(pct0String);
	if (pct0 != null) groupSize.pct0 = pct0;
	else groupSize._error.pct0 = true;

	let num1 = parseNumber(num1String);
	if (num1 != null) groupSize.num1 = num1;
	else groupSize._error.num1 = true;

	let pct1 = parseNumber(pct1String);
	if (pct1 != null) groupSize.pct1 = pct1;
	else groupSize._error.pct1 = true;

	let num2 = parseNumber(num2String);
	if (num2 != null) groupSize.num2 = num2;
	else groupSize._error.num2 = true;

	let pct2 = parseNumber(pct2String);
	if (pct2 != null) groupSize.pct2 = pct2;
	else groupSize._error.pct2 = true;

	let pct3 = parseNumber(pct3String);
	if (pct3 != null) groupSize.pct3 = pct3;
	else groupSize._error.pct3 = true;

	let div = parseNumber(divString);
	if (div != null) groupSize.div = div;
	else groupSize._error.div = true;


	let tbd = parseNumber(tbdString);
	if (tbd != null) groupSize.tbd = tbd;

	return groupSize;
}

export function parseVnumRange(words: string[]): VnumRangeData {
	let vnumRange: VnumRangeData = {
		min: 0,
		max: 0,
		_error: {},
	};

	let [minString, maxString, ...rest] = words;

	let min = parseNumber(minString);
	if (min != null) vnumRange.min = min;
	else vnumRange._error.min = true;

	if (!maxString) {
		vnumRange.max = vnumRange.min;
		if (vnumRange._error.min) vnumRange._error.max = true;
		return vnumRange;
	}
	let max = parseNumber(maxString);
	if (max != null) vnumRange.max = max;
	else {
		vnumRange.max = vnumRange.min;
		vnumRange._error.max = true
	};

	return vnumRange;
}

export function parseScaling(words: string[]): ScalingData {
	let scaling: ScalingData = {
		maxGroupPower: 490,
		maxGroupToughness: 180000,
		_error: {},
	};

	let [maxGroupPowerString, maxGroupToughnessString, ...rest] = words;

	let maxGroupPower = parseNumber(maxGroupPowerString);
	if (maxGroupPower != null) scaling.maxGroupPower = maxGroupPower;
	else scaling._error.maxGroupPower = true;

	let maxGroupToughness = parseNumber(maxGroupToughnessString);
	if (maxGroupToughness != null) scaling.maxGroupToughness = maxGroupToughness;
	else scaling._error.maxGroupToughness = true;

	return scaling;
}
