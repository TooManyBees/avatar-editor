import { Room, Door, blankRoom, blankDoor, blankEdesc } from "../app/models/rooms";
import {
	parseBits,
	parseKeywords,
	parseNumber,
	splitOnVnums,
} from "./helpers";

const enum ParseState {
	Vnum,
	Name,
	Description,
	FlagsSector,
	ExtraLines,
	DoorDesc,
	DoorKeywords,
	DoorLocks,
	EdescKeywords,
	EdescMessage,
};

export default function parseRooms(section: string): Room[] {
	let parts = splitOnVnums(section);
	return parts.map(part => parseRoom(part));
}

export function parseRoom(roomString: string): Room {
	let state = ParseState.Vnum;
	let room = blankRoom();

	let multiLineBuffer = "";
	let edesc = blankEdesc();
	let door = blankDoor();

	let lines = roomString.trim().split("\n");

	for (let line of lines) {
		line = line.trimRight();
		switch (state as ParseState) {
			case ParseState.Vnum: {
				state = ParseState.Name;
				let match = line.match(/^\s*#(\d+)/);
				if (!match) {
					room._error.vnum = true;
					continue;
				}
				let vnum = parseNumber(match[1]);
				if (vnum != null) room.vnum = vnum;
				else room._error.vnum = true;
				break;
				break;
			}
			case ParseState.Name: {
				state = ParseState.Description;
				let tilde = line.indexOf("~");
				line = tilde ? line.substring(0, tilde) : line;
				room.name = line;
				break;
			}
			case ParseState.Description: {
				let tilde = line.indexOf("~")
				if (tilde > -1) {
					multiLineBuffer += line.substring(0, tilde);
					room.description = multiLineBuffer.trimRight();
					multiLineBuffer = "";
					state = ParseState.FlagsSector;
				} else {
					multiLineBuffer += line;
					multiLineBuffer += "\n";
				}
				break;
			}
			case ParseState.FlagsSector: {
				state = ParseState.ExtraLines;
				let [zero, flagsString, sectorString, ...rest] = line.split(/\s+/);

				let { error, bits } = parseBits(flagsString);
				if (error) room._error.flags = true;
				room.flags = bits;

				let sector = parseNumber(sectorString);
				if (sector != null) room.sector = sector;
				else room._error.sector = true;

				break;
			}
			case ParseState.ExtraLines: {
				let [type, ...tokens] = line.trimLeft().split(/\s+/);
				switch (type.toUpperCase()) {
					case "E": {
						state = ParseState.EdescKeywords;
						edesc = blankEdesc();
						break;
					}
					case "A": {
						let { error, bits } = parseBits(tokens[0]);
						if (error) room._error.alignFlags = true;
						room.alignFlags = bits;
						break;
					}
					case "C": {
						let { error, bits } = parseBits(tokens[0]);
						if (error) room._error.classFlags = true;
						room.classFlags = bits;
						break;
					}
					case "S": {
						break;
					}
					default: {
						let match = type.match(/^D(\S+)/i);
						if (match) {
							state = ParseState.DoorDesc;
							let direction = parseNumber(match[1]);
							if (direction != null && direction >= 0) door.direction = direction;
							else door._error.direction = true;
						} else {
							room._error.all = true;
						}
					}
				}
				break;
			}
			case ParseState.DoorDesc: {
				let tilde = line.indexOf("~")
				if (tilde > -1) {
					door.description += line.substring(0, tilde);
					door.description = door.description.trimRight();
					state = ParseState.DoorKeywords;
				} else {
					door.description += line;
					door.description += "\n";
				}
				break;
			}
			case ParseState.DoorKeywords: {
				state = ParseState.DoorLocks;
				let tilde = line.indexOf("~");
				line = tilde > -1 ? line.substring(0, tilde) : line;
				let { errors, keywords } = parseKeywords(line);
				if (errors.length > 0) door._error.keywords = true;
				door.keywords = keywords;
				break;
			}
			case ParseState.DoorLocks: {
				state = ParseState.ExtraLines;
				let [locksString, keyString, toVnumString, ...rest] = line.trimLeft().split(/\s+/);

				let locks = parseNumber(locksString);
				if (locks != null) door.locks = locks;
				else door._error.locks = true;

				let key = parseNumber(keyString);
				if (key != null) door.key = key;
				else door._error.key = true;

				let toVnum = parseNumber(toVnumString);
				if (toVnum != null) door.toVnum = toVnum;
				else door._error.toVnum = true;

				room.doors.push(door);
				door = blankDoor();

				break;
			}
			case ParseState.EdescKeywords: {
				state = ParseState.EdescMessage;
				let tilde = line.indexOf("~");
				line = tilde === -1 ? line : line.substring(0, tilde);
				let { errors, keywords } = parseKeywords(line);
				if (errors.length > 0) room._error.extraDescs = true;
				edesc.keywords = keywords;
				break;
			}
			case ParseState.EdescMessage: {
				let tilde = line.indexOf("~");
				if (tilde === -1) {
					edesc.body += line;
					edesc.body += "\n";
				} else {
					state = ParseState.ExtraLines;
					edesc.body += line.substring(0, tilde);
					room.extraDescs.push(edesc);
				}
				break;
			}
		}
	}

	if (state === ParseState.Description) {
		room._error.description = true;
		room._error.flags = true;
		room._error.sector = true;
	} else if (state === ParseState.DoorDesc) {
		door._error.description = true;
		room.doors.push(door);
	} else if (state === ParseState.DoorKeywords || state === ParseState.DoorLocks) {
		door._error.all = true;
		room.doors.push(door)
	} else if (state === ParseState.EdescMessage) {
		room._error.extraDescs = true;
		room.extraDescs.push(edesc);
	}

	return room;
}
