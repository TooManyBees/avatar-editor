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
	locks: number;
	key: number;
	toVnum: number;
}

export interface Door extends DoorFields {
	id: string;
	_error: ErrorMarkers<DoorFields>;
}

export const blankDoor = (): Door => ({
	id: newId(),
	direction: 0,
	description: "",
	keywords: [],
	locks: 0,
	key: 0,
	toVnum: 1,
	_error: {},
});
