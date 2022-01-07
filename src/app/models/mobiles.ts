import { newId, Apply, ErrorMarkers } from "./helpers";

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
	race: number | null;
	klass: number | null;
	applies: Apply[];
	team: number | null;
	kspawn?: Kspawn;
	specFun: string | null;
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

export const blankMobile = (id?: string): Mobile => ({
	id: id || newId(),
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
	race: null,
	klass: null,
	applies: [],
	team: null,
	specFun: null,
	_error: {},
});
