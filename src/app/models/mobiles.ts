import { newId, ErrorMarkers } from "./helpers";

export interface MobileFields {
	vnum: number | null;
	keywords: string[];
	shortDesc: string;
	longDesc: string;
	description: string;
	act: number[];
	affected: number[];
	align: number;
	level: number;
	sex: number;
	race?: number;
	klass?: number;
	applies: [number, number][];
	team?: number;
	kspawn?: Kspawn;
}

export interface Kspawn {
	condition: number;
	spawnType: number[];
	spawnVnum: number;
	roomVnum: number;
	message: string;
}

export const blankKspawn = (): Kspawn => ({
	condition: 0,
	spawnType: [],
	spawnVnum: -1,
	roomVnum: -1,
	message: "",
});

export interface Mobile extends MobileFields {
	readonly id: string;
	_error: ErrorMarkers<MobileFields>;
}

export const blankMobile = (): Mobile => ({
	id: newId(),
	vnum: null,
	keywords: [],
	shortDesc: "",
	longDesc: "",
	description: "",
	act: [],
	affected: [],
	align: 0,
	level: 1,
	sex: 0,
	applies: [],
	_error: {},
});
