import {
	Resets,
	MobReset,
	EquipmentReset,
	ObjectReset,
	InObjectReset,
	DoorReset,
	RandomExitReset,
	Mobile,
	Objekt,
	Room,
} from "../app/models";
import {
	UncorellatedResets,
	MobResetU,
	EquipmentResetU,
	ObjectResetU,
	InObjectResetU,
	DoorResetU,
	RandomExitResetU,
} from "../app/models/resets";
import { parseNumber } from "./helpers";
import { newId } from "../app/models/helpers";

function newMobReset(): MobResetU {
	return {
		mobVnum: -1,
		roomVnum: -1,
		limit: -1,
		comment: "",
		equipment: [],
		_error: {},
	};
}

export function parseResets(section: string): UncorellatedResets {
	let resets: UncorellatedResets = {
		mobile: [],
		object: [],
		inObject: [],
		door: [],
		randomExit: [],
	};
	let currentMobReset = newMobReset();
	function closeCurrentMob() {
		if (currentMobReset.mobVnum >= 0) {
			resets.mobile.push(currentMobReset);
			currentMobReset = newMobReset();
		}
	}

	let lines = section.split(/\r?\n/);

	for (let line of lines) {
		line = line.trimLeft();
		if (line.length === 0) continue;
		let type = line.split(/\s+/, 1)[0];
		switch (type.toUpperCase()) {
			case "M":
				closeCurrentMob();
				currentMobReset = parseMobReset(line);
				break;
			case "G":
				currentMobReset.equipment.push(parseInventoryReset(line));
				break;
			case "E":
				currentMobReset.equipment.push(parseEquipmentReset(line));
				break;
			case "O":
				closeCurrentMob();
				resets.object.push(parseObjectReset(line));
				break;
			case "P":
				closeCurrentMob();
				resets.inObject.push(parseInObjectReset(line));
				break;
			case "D":
				closeCurrentMob();
				resets.door.push(parseDoorReset(line));
				break;
			case "R":
				closeCurrentMob();
				resets.randomExit.push(parseRandomExitReset(line));
				break;
			default:
				closeCurrentMob();
				// TODO: error handling
		}
	}

	closeCurrentMob();

	return resets;
}

export function corellateResets(uncorellatedResets: UncorellatedResets, mobiles: Mobile[], objects: Objekt[], rooms: Room[]): Resets {
	let resets: Resets = {
		mobile: [],
		object: [],
		inObject: [],
		door: [],
		randomExit: [],
	};

	for (let uReset of uncorellatedResets.mobile) {
		let mob = mobiles.find(m => m.vnum === uReset.mobVnum);
		let room = rooms.find(r => r.vnum === uReset.roomVnum);

		let reset: MobReset = {
			id: newId(),
			mobId: mob?.id || uReset.mobVnum.toString(),
			roomId: room?.id || uReset.roomVnum.toString(),
			limit: uReset.limit,
			comment: uReset.comment,
			orphan: !mob,
			equipment: [],
			_error: uReset._error,
		};
		if (!room) reset._error.roomId = true;

		for (let uEqReset of uReset.equipment) {
			let object = objects.find(o => o.vnum === uEqReset.objectVnum);
			let eqReset: EquipmentReset = {
				id: newId(),
				objectId: object?.id || uEqReset.objectVnum.toString(),
				limit: uEqReset.limit,
				wearLocation: uEqReset.wearLocation,
				comment: uEqReset.comment,
				_error: uEqReset._error,
			};
			if (!object) eqReset._error.objectId = true;
			reset.equipment.push(eqReset);
		}

		resets.mobile.push(reset);
	}

	for (let uReset of uncorellatedResets.object) {
		let object = objects.find(o => o.vnum === uReset.objectVnum);
		let room = rooms.find(r => r.vnum === uReset.roomVnum);
		let reset: ObjectReset = {
			id: newId(),
			objectId: object?.id || uReset.objectVnum.toString(),
			roomId: room?.id || uReset.roomVnum.toString(),
			comment: uReset.comment,
			orphan: !object,
			_error: {},
		};
		if (!room) reset._error.roomId = true;
		resets.object.push(reset);
	}

	for (let uReset of uncorellatedResets.inObject) {
		let object = objects.find(o => o.vnum === uReset.objectVnum);
		let container = objects.find(o => o.vnum === uReset.containerVnum);
		let reset: InObjectReset = {
			id: newId(),
			objectId: object?.id || uReset.objectVnum.toString(),
			containerId: container?.id || uReset.containerVnum.toString(),
			comment: uReset.comment,
			orphan: !container,
			_error: {},
		};
		if (!object) reset._error.objectId = true;
		resets.inObject.push(reset);
	}

	for (let uReset of uncorellatedResets.door) {
		let room = rooms.find(r => r.vnum === uReset.roomVnum);
		let reset: DoorReset = {
			id: newId(),
			roomId: room?.id || uReset.roomVnum.toString(),
			direction: uReset.direction,
			state: uReset.state,
			comment: uReset.comment,
			orphan: !room,
			_error: uReset._error,
		};
		if (room) {
			let direction = room.doors.find(d => d.direction === uReset.direction);
			if (!direction) reset._error.direction = true;
		}
		resets.door.push(reset);
	}

	for (let uReset of uncorellatedResets.randomExit) {
		let room = rooms.find(r => r.vnum === uReset.roomVnum);
		let reset: RandomExitReset = {
			id: newId(),
			roomId: room?.id || uReset.roomVnum.toString(),
			numExits: uReset.numExits,
			comment: uReset.comment,
			orphan: !room,
			_error: uReset._error,
		};
		resets.randomExit.push(reset);
	}

	return resets;
}

export function parseMobReset(line: string): MobResetU {
	let tokens = parseResetTokens(line, 4);
	let reset: MobResetU = {
		mobVnum: 0,
		roomVnum: 0,
		limit: 1,
		comment: "",
		equipment: [],
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

export function parseInventoryReset(line: string): EquipmentResetU {
	let tokens = parseResetTokens(line, 3);
	let reset: EquipmentResetU = {
		objectVnum: 0,
		limit: 0,
		wearLocation: -1,
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
