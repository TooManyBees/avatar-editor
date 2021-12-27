import {
	Resets,
	MobReset,
	InventoryReset,
	EquipmentReset,
	ObjectReset,
	InObjectReset,
	DoorReset,
	RandomExitReset,
} from "../app/models";
import { parseNumber } from "./helpers";
import { newId } from "../app/models/helpers";

interface UncorellatedResets {
	mobile: MobResetU[];
	inventory: InventoryResetU[];
	equipment: EquipmentResetU[];
	object: ObjectResetU[];
	inObject: InObjectResetU[];
	door: DoorResetU[];
	randomExit: RandomExitResetU[];
}

export default function parseResets(section: string): Resets {
	let uncorellatedResets: UncorellatedResets = {
		mobile: [],
		inventory: [],
		equipment: [],
		object: [],
		inObject: [],
		door: [],
		randomExit: [],
	}

	let lines = section.split(/\r?\n/);

	for (let line of lines) {
		line = line.trimLeft();
		let type = line.split(/\s+/, 1)[0];
		switch (type.toUpperCase()) {
			case "M":
				uncorellatedResets.mobile.push(parseMobReset(line));
				break;
			case "G":
				uncorellatedResets.inventory.push(parseInventoryReset(line));
				break;
			case "E":
				uncorellatedResets.equipment.push(parseEquipmentReset(line));
				break;
			case "O":
				uncorellatedResets.object.push(parseObjectReset(line));
				break;
			case "P":
				uncorellatedResets.inObject.push(parseInObjectReset(line));
				break;
			case "D":
				uncorellatedResets.door.push(parseDoorReset(line));
				break;
			case "R":
				uncorellatedResets.randomExit.push(parseRandomExitReset(line));
				break;
			default:
				// TODO: error handling
		}
	}

	let resets: Resets = {
		mobile: [],
		inventory: [],
		equipment: [],
		object: [],
		inObject: [],
		door: [],
		randomExit: [],
	};

	return resets;
}

interface MobResetU {
	mobVnum: number;
	roomVnum: number;
	limit: number;
	comment: string;
	_error: {
		mobVnum?: boolean;
		roomVnum?: boolean;
		limit?: boolean;
	};
}

interface InventoryResetU {
	objectVnum: number;
	limit: number;
	comment: string;
	_error: {
		objectVnum?: boolean;
		limit?: boolean;
	};
}

interface EquipmentResetU {
	objectVnum: number;
	limit: number;
	wearLocation: number;
	comment: string;
	_error: {
		objectVnum?: boolean;
		limit?: boolean;
		wearLocation?: boolean;
	};
}

interface ObjectResetU {
	objectVnum: number;
	roomVnum: number;
	comment: string;
	_error: {
		objectVnum?: boolean;
		roomVnum?: boolean;
	};
}

interface InObjectResetU {
	objectVnum: number;
	containerVnum: number;
	comment: string;
	_error: {
		objectVnum?: boolean;
		containerVnum?: boolean;
	};
}

interface DoorResetU {
	roomVnum: number;
	direction: number;
	state: number;
	comment: string;
	_error: {
		roomVnum?: boolean;
		direction?: boolean;
		state?: boolean;
	};
}

interface RandomExitResetU {
	roomVnum: number;
	numExits: number;
	comment: string;
	_error: {
		roomVnum?: boolean;
		numExits?: boolean;
	};
}

export function parseMobReset(line: string): MobResetU {
	let tokens = parseResetTokens(line, 4);
	let reset: MobResetU = {
		mobVnum: 0,
		roomVnum: 0,
		limit: 1,
		comment: "",
		_error: {},
	};

	let [_0, mobVnumString, limitString, roomVnumString, comment] = tokens;

	let mobVnum = parseNumber(mobVnumString);
	if (mobVnum != null) reset.mobVnum = mobVnum;
	else reset._error.mobVnum = true;

	let limit = parseNumber(limitString);
	if (limit != null) reset.limit = limit;
	else reset._error.limit = true;

	let roomVnum = parseNumber(roomVnumString);
	if (roomVnum != null) reset.roomVnum = roomVnum;
	else reset._error.roomVnum = true;

	reset.comment = comment;

	return reset;
}

export function parseInventoryReset(line: string): InventoryResetU {
	let tokens = parseResetTokens(line, 3);
	let reset: InventoryResetU = {
		objectVnum: 0,
		limit: 0,
		comment: "",
		_error: {},
	};

	let [limitString, objectVnumString, _0, comment] = tokens;

	let limit = parseNumber(limitString);
	if (limit != null && limit <= 0) {
		reset.limit = limit === 0 ? 0 : ~limit;
	}
	else reset._error.limit = true;

	let objectVnum = parseNumber(objectVnumString);
	if (objectVnum != null) reset.objectVnum = objectVnum;
	else reset._error.objectVnum = true;

	reset.comment = comment;

	return reset;
}

export function parseEquipmentReset(line: string): EquipmentResetU {
	let tokens = parseResetTokens(line, 4);
	let reset: EquipmentResetU = {
		objectVnum: 0,
		limit: 0,
		wearLocation: 0,
		comment: "",
		_error: {},
	};

	let [limitString, objectVnumString, _0, wearLocationString, comment] = tokens;

	let limit = parseNumber(limitString);
	if (limit != null && limit <= 0) {
		reset.limit = limit === 0 ? 0 : ~limit;
	}
	else reset._error.limit = true;

	let objectVnum = parseNumber(objectVnumString);
	if (objectVnum != null) reset.objectVnum = objectVnum;
	else reset._error.objectVnum = true;

	let wearLocation = parseNumber(wearLocationString);
	if (wearLocation != null) reset.wearLocation = wearLocation;
	else reset._error.wearLocation = true;

	reset.comment = comment;

	return reset;
}

export function parseObjectReset(line: string): ObjectResetU {
	let tokens = parseResetTokens(line, 4);
	let reset: ObjectResetU = {
		objectVnum: 0,
		roomVnum: 0,
		comment: "",
		_error: {},
	};

	let [_0, objectVnumString, anotherZero, roomVnumString, comment] = tokens;

	let objectVnum = parseNumber(objectVnumString);
	if (objectVnum != null) reset.objectVnum = objectVnum;
	else reset._error.objectVnum = true;

	let roomVnum = parseNumber(roomVnumString);
	if (roomVnum != null) reset.roomVnum = roomVnum;
	else reset._error.roomVnum = true;

	reset.comment = comment;

	return reset;
}

export function parseInObjectReset(line: string): InObjectResetU {
	let tokens = parseResetTokens(line, 4);
	let reset: InObjectResetU = {
		objectVnum: 0,
		containerVnum: 0,
		comment: "",
		_error: {},
	};

	let [_0, objectVnumString, __0, containerVnumString, comment] = tokens;

	let objectVnum = parseNumber(objectVnumString);
	if (objectVnum != null) reset.objectVnum = objectVnum;
	else reset._error.objectVnum = true;

	let containerVnum = parseNumber(containerVnumString);
	if (containerVnum != null) reset.containerVnum = containerVnum;
	else reset._error.containerVnum = true;

	reset.comment = comment;

	return reset;
}

export function parseDoorReset(line: string): DoorResetU {
	let tokens = parseResetTokens(line, 4);
	let reset: DoorResetU = {
		roomVnum: 0,
		direction: 0,
		state: 0,
		comment: "",
		_error: {},
	};

	let [_0, roomVnumString, directionString, stateString, comment] = tokens;

	let roomVnum = parseNumber(roomVnumString);
	if (roomVnum != null) reset.roomVnum = roomVnum;
	else reset._error.roomVnum = true;

	let direction = parseNumber(directionString);
	if (direction != null) {
		reset.direction = direction;
		if (direction > 5 || direction < 0) {
			reset._error.direction = true;
		}
	}
	else reset._error.direction = true;

	let state = parseNumber(stateString);
	if (state != null) {
		reset.state = state;
		if (state > 2 || state < 0) {
			reset._error.state = true;
		}
	}
	else reset._error.state = true;

	reset.comment = comment;

	return reset;
}

export function parseRandomExitReset(line: string): RandomExitResetU {
	let tokens = parseResetTokens(line, 3);
	let reset: RandomExitResetU = {
		roomVnum: 0,
		numExits: 0,
		comment : "",
		_error: {},
	};

	let [_0, roomVnumString, numExitsString, comment] = tokens;

	let roomVnum = parseNumber(roomVnumString);
	if (roomVnum != null && roomVnum) reset.roomVnum = roomVnum;
	else reset._error.roomVnum = true;

	let numExits = parseNumber(numExitsString);
	if (numExits != null && numExits >= 0) reset.numExits = numExits;
	else reset._error.numExits = true;

	reset.comment = comment;

	return reset;
}

function parseResetTokens(line: string, n: number): string[] {
	let result: string[] = [];
	let pos = line.search(/\s/);
	if (pos < 0) return result;

	for (let i = 0; i <= line.length && result.length < n; i++) {
		if (line[i] === undefined || line[i].match(/\s/)) {
			if (i - pos > 0) {
				result.push(line.substring(pos, i));
			}
			pos = i;
		}
	}

	let rest = line.substring(pos).trimRight();
	if (rest.match(/\S/)) {
		result.push(rest);
	} else {
		result.push("");
	}

	return result;
}
