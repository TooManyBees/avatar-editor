import {
	Resets,
	MobReset,
	InventoryReset,
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
	InventoryResetU,
	EquipmentResetU,
	ObjectResetU,
	InObjectResetU,
	DoorResetU,
	RandomExitResetU,
} from "../app/models/resets";
import { parseNumber } from "./helpers";
import { newId } from "../app/models/helpers";

export function parseResets(section: string): UncorellatedResets {
	let resets: UncorellatedResets = {
		mobile: [],
		inventory: [],
		equipment: [],
		object: [],
		inObject: [],
		door: [],
		randomExit: [],
	};
	let currentMobVnum = 0;

	let lines = section.split(/\r?\n/);

	for (let line of lines) {
		line = line.trimLeft();
		if (line.length === 0) continue;
		let type = line.split(/\s+/, 1)[0];
		switch (type.toUpperCase()) {
			case "M": {
				let reset = parseMobReset(line);
				currentMobVnum = reset.mobVnum;
				resets.mobile.push(reset);
				break;
			}
			case "G":
				resets.inventory.push(parseInventoryReset(line, currentMobVnum));
				break;
			case "E":
				resets.equipment.push(parseEquipmentReset(line, currentMobVnum));
				break;
			case "O":
				resets.object.push(parseObjectReset(line));
				break;
			case "P":
				resets.inObject.push(parseInObjectReset(line));
				break;
			case "D":
				resets.door.push(parseDoorReset(line));
				break;
			case "R":
				resets.randomExit.push(parseRandomExitReset(line));
				break;
			default:
				// TODO: error handling
		}
	}

	return resets;
}

export function corellateResets(uncorellatedResets: UncorellatedResets, mobiles: Mobile[], objects: Objekt[], rooms: Room[]): [Resets, UncorellatedResets] {
	let resets: Resets = {
		mobile: [],
		inventory: [],
		equipment: [],
		object: [],
		inObject: [],
		door: [],
		randomExit: [],
	};

	let orphanedResets: UncorellatedResets = {
		mobile: [],
		inventory: [],
		equipment: [],
		object: [],
		inObject: [],
		door: [],
		randomExit: [],
	};

	for (let uReset of uncorellatedResets.mobile) {
		let mob = mobiles.find(m => m.vnum === uReset.mobVnum);
		let room = rooms.find(r => r.vnum === uReset.roomVnum);
		if (mob && room) {
			let reset: MobReset = {
				id: newId(),
				mobId: mob.id,
				roomId: room.id,
				limit: uReset.limit,
				comment: uReset.comment,
				_error: uReset._error,
			};
			resets.mobile.push(reset);
		} else {
			if (!mob) uReset._error.mobVnum = true;
			if (!room) uReset._error.roomVnum = true;
			orphanedResets.mobile.push(uReset);
		}
	}

	for (let uReset of uncorellatedResets.inventory) {
		let mob = mobiles.find(m => m.vnum === uReset.mobVnum);
		let object = objects.find(o => o.vnum === uReset.objectVnum);
		if (mob && object) {
			let reset: InventoryReset = {
				id: newId(),
				mobId: mob.id,
				objectId: object.id,
				limit: uReset.limit,
				comment: uReset.comment,
				_error: uReset._error,
			};
			resets.inventory.push(reset);
		} else {
			if (!mob) uReset._error.mobVnum = true;
			if (!object) uReset._error.objectVnum = true;
			orphanedResets.inventory.push(uReset);
		}
	}

	for (let uReset of uncorellatedResets.equipment) {
		let mob = mobiles.find(m => m.vnum === uReset.mobVnum);
		let object = objects.find(o => o.vnum === uReset.objectVnum);
		if (mob && object) {
			let reset: EquipmentReset = {
				id: newId(),
				mobId: mob.id,
				objectId: object.id,
				limit: uReset.limit,
				wearLocation: uReset.wearLocation,
				comment: uReset.comment,
				_error: uReset._error,
			};
			resets.equipment.push(reset);
		} else {
			if (!mob) uReset._error.mobVnum = true;
			if (!object) uReset._error.objectVnum = true;
			orphanedResets.equipment.push(uReset);
		}
	}

	for (let uReset of uncorellatedResets.object) {
		let object = objects.find(o => o.vnum === uReset.objectVnum);
		let room = rooms.find(r => r.vnum === uReset.roomVnum);
		if (object && room) {
			let reset: ObjectReset = {
				id: newId(),
				objectId: object.id,
				roomId: room.id,
				comment: uReset.comment,
				_error: {},
			};
			resets.object.push(reset);
		} else {
			if (!object) uReset._error.objectVnum = true;
			if (!room) uReset._error.roomVnum = true;
			orphanedResets.object.push(uReset);
		}
	}

	for (let uReset of uncorellatedResets.inObject) {
		let object = objects.find(o => o.vnum === uReset.objectVnum);
		let container = objects.find(o => o.vnum === uReset.containerVnum);
		if (object && container) {
			let reset: InObjectReset = {
				id: newId(),
				objectId: object.id,
				containerId: container.id,
				comment: uReset.comment,
				_error: {},
			};
			resets.inObject.push(reset);
		} else {
			if (!object) uReset._error.objectVnum = true;
			if (!container) uReset._error.containerVnum = true;
			orphanedResets.inObject.push(uReset);
		}
	}

	for (let uReset of uncorellatedResets.door) {
		let room = rooms.find(r => r.vnum === uReset.roomVnum);
		if (room) {
			let reset: DoorReset = {
				id: newId(),
				roomId: room.id,
				direction: uReset.direction,
				state: uReset.state,
				comment: uReset.comment,
				_error: uReset._error,
			};
			let direction = room.doors.find(d => d.direction === uReset.direction);
			if (!direction) reset._error.direction = true;
			resets.door.push(reset);
		} else {
			uReset._error.roomVnum = true;
			orphanedResets.door.push(uReset);
		}
	}

	for (let uReset of uncorellatedResets.randomExit) {
		let room = rooms.find(r => r.vnum === uReset.roomVnum);
		if (room) {
			let reset: RandomExitReset = {
				id: newId(),
				roomId: room.id,
				numExits: uReset.numExits,
				comment: uReset.comment,
				_error: uReset._error,
			};
			resets.randomExit.push(reset);
		} else {
			uReset._error.roomVnum = true;
			orphanedResets.randomExit.push(uReset);
		}
	}

	return [resets, orphanedResets];
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

export function parseInventoryReset(line: string, mobVnum: number): InventoryResetU {
	let tokens = parseResetTokens(line, 3);
	let reset: InventoryResetU = {
		mobVnum,
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

export function parseEquipmentReset(line: string, mobVnum: number): EquipmentResetU {
	let tokens = parseResetTokens(line, 4);
	let reset: EquipmentResetU = {
		mobVnum,
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
