import { Objekt, Room } from "../app/models";
import { joinBits, quote, serializeEdescs } from "./helpers";

export default function serializeRooms(rooms: Room[], objects: Objekt[]): string {
	let buffer = "";

	for (let room of rooms) {
		buffer += serializeRoom(room, objects, rooms) + "\n";
	}

	if (buffer !== "") return `#ROOMS\n\n${buffer}#0\n`;
	else return ""
}

export function serializeRoom(room: Room, objects: Objekt[], rooms: Room[]): string {
	let base = `#${room.vnum}
${room.name}~
${room.description}
~
0 ${joinBits(room.flags)} ${room.sector}
`;

	for (let door of room.doors) {
		let toRoomVnum = rooms.find(r => r.id === door.toRoomId)?.vnum || door.toRoomId;
		let keyVnum = objects.find(o => o.id === door.keyId)?.vnum || door.keyId || "0";
		base += `D${door.direction}\n`;
		if (door.description) {
			base += door.description;
			if (!door.description.endsWith("\n")) base += "\n";
		}
		base += "~\n";
		base += door.keywords.map(kw => quote(kw)).join(" ") + "~\n";
		base += `${door.locks} ${keyVnum} ${toRoomVnum}\n`;
	}

	base += serializeEdescs(room.extraDescs);

	if (room.alignFlags.length > 0)
		base += joinBits(room.alignFlags) + "\n";
	if (room.classFlags.length > 0)
		base += joinBits(room.classFlags) + "\n";

	base += "S\n";

	return base;
}
