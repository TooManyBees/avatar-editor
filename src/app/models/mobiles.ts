import { newId } from "./helpers";

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
	applies?: [number, number][];
	team?: number;
	kspawn?: Kspawn;
}

export class Kspawn {
	condition: number;
	spawnType: number[];
	spawnVnum: number;
	roomVnum: number;
	message: string;

	constructor() {
		this.condition = 0;
		this.spawnType = [];
		this.spawnVnum = -1;
		this.roomVnum = -1;
		this.message = "";
	}
}

type ErrorMarkers2<T> = {
	[Field in keyof MobileFields]?: boolean;
}

type ErrorMarkers<T> = ErrorMarkers2<T> & { all?: boolean };

export class Mobile implements MobileFields {
	readonly id: string;
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
	applies?: [number, number][];
	team?: number;
	kspawn?: Kspawn;
	_error: ErrorMarkers<MobileFields>;

	constructor() {
		this.id = newId();
		this.vnum = null;
		this.keywords = [];
		this.shortDesc = "";
		this.longDesc = "";
		this.description = "";
		this.act = [];
		this.affected = [];
		this.align = 0;
		this.level = 1;
		this.sex = 0;
		this._error = {};
	}

	get name(): string {
		return this.shortDesc;
	}
}
