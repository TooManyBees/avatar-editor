import { newId, ErrorMarkers } from "./helpers";

export interface ObjectFields {
	vnum: number | null;
	keywords: string[];
	name: string;
	longDesc: string;
	actionDesc: string;
	itemType: number;
	extraFlags: number[];
	wearFlags: number[];
	value0: string;
	value1: string;
	value2: string;
	value3: string;
	weight: number;
	worth: number;
	racialFlags: number[];
	extraDescs: [string[], string][];
	applies: [number, number][];
	quality: number | null;
}

export interface Objekt extends ObjectFields {
	readonly id: string;
	_error: ErrorMarkers<ObjectFields>;
}

export const blankObject = (): Objekt => ({
	id: newId(),
	vnum: null,
	keywords: [],
	name: "",
	longDesc: "",
	actionDesc: "",
	itemType: 1,
	extraFlags: [],
	wearFlags: [],
	value0: "0",
	value1: "0",
	value2: "0",
	value3: "0",
	weight: 0,
	worth: 0,
	racialFlags: [],
	extraDescs: [],
	applies: [],
	quality: null,
	_error: {},
});
