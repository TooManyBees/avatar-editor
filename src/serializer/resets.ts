import { Mobile, Objekt, Resets, Room } from "../app/models";
import {
	DoorReset,
	EquipmentReset,
	InObjectReset,
	InventoryReset,
	MobReset,
	ObjectReset,
	RandomExitReset,
} from "../app/models/resets";
import { findVnum } from "../app/models/helpers";

export default function serializeResets(resets: Resets, mobiles: Mobile[], objects: Objekt[], rooms: Room[]): string {
	let buffer = "";

	for (let reset of resets.mobile) {
		buffer += serializeMobReset(reset, mobiles, rooms);

		for (let eqReset of reset.equipment) {
			buffer += serializeEqReset(eqReset, objects);
		}

		for (let invReset of reset.inventory) {
			buffer += serializeInvReset(invReset, objects);
		}
	}

	for (let reset of resets.object) {
		buffer += serializeObjReset(reset, objects, rooms);
	}

	for (let reset of resets.inObject) {
		buffer += serializeInObjReset(reset, objects);
	}

	for (let reset of resets.door) {
		buffer += serializeDoorReset(reset, rooms);
	}

	for (let reset of resets.randomExit) {
		buffer += serializeRandomReset(reset, rooms);
	}

	if (buffer !== "") return `#RESETS\n${buffer}S\n`;
	else return "";
}

function serializeMobReset(reset: MobReset, mobiles: Mobile[], rooms: Room[]): string {
	let mobVnum = findVnum(mobiles, reset.mobId);
	let roomVnum = findVnum(rooms, reset.roomId);

	let comment = reset.comment;
	if (comment && !comment.match(/^\s/)) comment = " " + comment;

	return `M 0 ${mobVnum} ${reset.limit} ${roomVnum}${comment}\n`;
}

function serializeEqReset(reset: EquipmentReset, objects: Objekt[]): string {
	let vnum = findVnum(objects, reset.objectId);

	let limit = reset.limit > 0 ? ~reset.limit : 0;

	let comment = reset.comment;
	if (comment && !comment.match(/^\s/)) comment = " " + comment;

	return `E ${limit} ${vnum} 0 ${reset.wearLocation}${comment}\n`;
}

function serializeInvReset(reset: InventoryReset, objects: Objekt[]): string {
	let vnum = findVnum(objects, reset.objectId);

	let limit = reset.limit > 0 ? ~reset.limit : 0;

	let comment = reset.comment;
	if (comment && !comment.match(/^\s/)) comment = " " + comment;

	return `G ${limit} ${vnum} 0${comment}\n`;
}

function serializeObjReset(reset: ObjectReset, objects: Objekt[], rooms: Room[]): string {
	let objectVnum = findVnum(objects, reset.objectId);
	let roomVnum = findVnum(rooms, reset.roomId);

	let comment = reset.comment;
	if (comment && !comment.match(/^\s/)) comment = " " + comment;

	return `O 0 ${objectVnum} 0 ${roomVnum}${comment}\n`;
}

function serializeInObjReset(reset: InObjectReset, objects: Objekt[]): string {
	let objectVnum = findVnum(objects, reset.objectId);
	let containerVnum = findVnum(objects, reset.containerId);

	let comment = reset.comment;
	if (comment && !comment.match(/^\s/)) comment = " " + comment;

	return `P 0 ${objectVnum} 0 ${containerVnum}${comment}\n`;
}

function serializeDoorReset(reset: DoorReset, rooms: Room[]): string {
	let roomVnum = findVnum(rooms, reset.roomId);

	let comment = reset.comment;
	if (comment && !comment.match(/^\s/)) comment = " " + comment;

	return `D 0 ${roomVnum} ${reset.direction} ${reset.state}${comment}\n`;
}

function serializeRandomReset(reset: RandomExitReset, rooms: Room[]): string {
	let roomVnum = findVnum(rooms, reset.roomId);

	let comment = reset.comment;
	if (comment && !comment.match(/^\s/)) comment = " " + comment;

	return `R 0 ${roomVnum} ${reset.numExits}${comment}\n`;
}