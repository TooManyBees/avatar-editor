import { Mobile, Objekt, Resets, Room } from "../app/models";
import {
	DoorReset,
	EquipmentReset,
	InObjectReset,
	MobReset,
	ObjectReset,
	RandomExitReset,
} from "../app/models/resets";
import { findVnum, sortByVnum } from "../app/models/helpers";

export default function serializeResets(resets: Resets, mobiles: Mobile[], objects: Objekt[], rooms: Room[]): string {
	let buffer = "";

	let mobResets: { vnum: number, reset: MobReset }[] = [];
	for (let reset of resets.mobile) {
		let vnum = findVnum(mobiles, reset.mobId);
		if (vnum == null) continue;
		mobResets.push({ vnum, reset });
	};
	sortByVnum(mobResets);
	for (let { vnum, reset } of mobResets) {
		buffer += serializeMobReset(reset, vnum, rooms);

		for (let eqReset of reset.equipment) {
			buffer += serializeEqReset(eqReset, objects);
		}
	}

	let objResets: { vnum: number, reset: ObjectReset }[] = [];
	for (let reset of resets.object) {
		let vnum = findVnum(objects, reset.objectId);
		if (vnum == null) continue;
		objResets.push({ vnum, reset });
	}
	sortByVnum(objResets);
	for (let { vnum, reset } of objResets) {
		buffer += serializeObjReset(reset, vnum, objects, rooms);
	}

	let inObjResets: { vnum: number, reset: InObjectReset }[] = [];
	for (let reset of resets.inObject) {
		let vnum = findVnum(objects, reset.objectId);
		if (vnum == null) continue;
		inObjResets.push({ vnum, reset });
	}
	sortByVnum(inObjResets);
	for (let { vnum, reset } of inObjResets) {
		buffer += serializeInObjReset(reset, vnum, objects);
	}

	let doorResets: { vnum: number, reset: DoorReset }[] = [];
	for (let reset of resets.door) {
		let vnum = findVnum(rooms, reset.roomId);
		if (vnum == null) continue;
		doorResets.push({ vnum, reset });
	}
	doorResets.sort((a, b) => {
		if (a.vnum - b.vnum === 0) return a.reset.direction - b.reset.direction;
		return a.vnum - b.vnum;
	});
	for (let { vnum, reset } of doorResets) {
		buffer += serializeDoorReset(reset, vnum, rooms);
	}

	let randomResets: { vnum: number, reset: RandomExitReset }[] = [];
	for (let reset of resets.randomExit) {
		let vnum = findVnum(rooms, reset.roomId);
		if (vnum == null) continue;
		randomResets.push({ vnum, reset });
	}
	sortByVnum(randomResets);
	for (let { vnum, reset } of randomResets) {
		buffer += serializeRandomReset(reset, vnum, rooms);
	}

	if (buffer !== "") return `#RESETS\n${buffer}S\n`;
	else return "";
}

function serializeMobReset(reset: MobReset, mobVnum: number, rooms: Room[]): string {
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

	if (reset.wearLocation >= 0)
		return `E ${limit} ${vnum} 0 ${reset.wearLocation}${comment}\n`;
	else
		return `G ${limit} ${vnum} 0${comment}\n`;
}

function serializeObjReset(reset: ObjectReset, objectVnum: number, objects: Objekt[], rooms: Room[]): string {
	let roomVnum = findVnum(rooms, reset.roomId);

	let comment = reset.comment;
	if (comment && !comment.match(/^\s/)) comment = " " + comment;

	return `O 0 ${objectVnum} 0 ${roomVnum}${comment}\n`;
}

function serializeInObjReset(reset: InObjectReset, objectVnum: number, objects: Objekt[]): string {
	let containerVnum = findVnum(objects, reset.containerId);

	let comment = reset.comment;
	if (comment && !comment.match(/^\s/)) comment = " " + comment;

	return `P 0 ${objectVnum} 0 ${containerVnum}${comment}\n`;
}

function serializeDoorReset(reset: DoorReset, roomVnum: number, rooms: Room[]): string {
	let comment = reset.comment;
	if (comment && !comment.match(/^\s/)) comment = " " + comment;

	return `D 0 ${roomVnum} ${reset.direction} ${reset.state}${comment}\n`;
}

function serializeRandomReset(reset: RandomExitReset, roomVnum: number, rooms: Room[]): string {
	let comment = reset.comment;
	if (comment && !comment.match(/^\s/)) comment = " " + comment;

	return `R 0 ${roomVnum} ${reset.numExits}${comment}\n`;
}
