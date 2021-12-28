import { newId, Edesc, ErrorMarkers } from "./helpers";
export { blankEdesc } from "./helpers";

export interface RoomFields {
	vnum: number | null;
	name: string;
	description: string;
	flags: number[];
	sector: number;
	doors: Door[];
	extraDescs: Edesc[];
	alignFlags: number[];
	classFlags: number[];
}

export interface RoomU {
	readonly id: string;
	vnum: number | null;
	name: string;
	description: string;
	flags: number[];
	sector: number;
	doors: DoorU[];
	extraDescs: Edesc[];
	alignFlags: number[];
	classFlags: number[];
	_error: ErrorMarkers<RoomFields>;
}

export interface Room extends RoomFields {
	readonly id: string;
	_error: ErrorMarkers<RoomFields>
}

export const blankRoomU = (): RoomU => ({
	id: newId(),
	vnum: null,
	name: "",
	description: "",
	flags: [],
	sector: 0,
	doors: [],
	extraDescs: [],
	alignFlags: [],
	classFlags: [],
	_error: {},
});

export const blankRoom = (): Room => ({
	id: newId(),
	vnum: null,
	name: "",
	description: "",
	flags: [],
	sector: 0,
	doors: [],
	extraDescs: [],
	alignFlags: [],
	classFlags: [],
	_error: {},
});

export interface DoorU {
	id: string,
	direction: number;	
	description: string;
	keywords: string[];
	locks: number;
	key: number;
	fromRoomId: string;
	toVnum: number;
	_error: {
		all?: boolean;
		direction?: boolean;
		description?: boolean;
		keywords?: boolean;
		locks?: boolean;
		key?: boolean;
		toVnum?: boolean;
	};
}

export interface DoorFields {
	direction: number;
	description: string;
	keywords: string[];
	locks: number;
	keyId: string | null;
	toRoomId: string;
}

export interface Door extends DoorFields {
	id: string;
	_error: ErrorMarkers<DoorFields>;
}

export const blankDoorU = (roomId: string): DoorU => ({
	id: newId(),
	direction: 0,
	description: "",
	keywords: [],
	locks: 0,
	key: 0,
	fromRoomId: roomId,
	toVnum: 1,
	_error: {},
});

export const blankDoor = (): Door => ({
	id: newId(),
	direction: 0,
	description: "",
	keywords: [],
	locks: 0,
	keyId: null,
	toRoomId: "",
	_error: {},
});
