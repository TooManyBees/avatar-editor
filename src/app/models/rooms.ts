import { newId, ErrorMarkers } from "./helpers";

export interface RoomFields {
	vnum: number | null;
	name: string;
	description: string;
	flags: number[];
	sector: number;
	doors: Door[];
	extraDescs: [string[], string][];
	alignFlags: number[];
	classFlags: number[];
}

export interface Room extends RoomFields {
	readonly id: string;
	_error: ErrorMarkers<RoomFields>
}

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

export interface DoorFields {
	direction: number;
	description: string;
	keywords: string[];
	locks: number[];
	key: number;
	toVnum: number;
}

export interface Door extends DoorFields {
	_error: ErrorMarkers<DoorFields>;
}

export const blankDoor = (): Door => ({
	direction: 0,
	description: "",
	keywords: [],
	locks: [],
	key: 0,
	toVnum: 1,
	_error: {},
});
