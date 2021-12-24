import { newId } from "./helpers";

export class Room {
	readonly id: string;
	vnum: number | null;
	name: string;
	description: string;
	flags: number[];
	sector: number;
	doors: Door[];
	extraDescs: [string[], string][];
	alignFlags: number[];
	classFlags: number[];
	_error: {
		all?: true;
		vnum?: boolean;
		name?: boolean;
		description?: boolean;
		flags?: boolean;
		sector?: boolean;
		doors?: boolean;
		extraDescs?: boolean;
		alignFlags?: boolean;
		classFlags?: boolean;
	};

	constructor() {
		this.id = newId();
		this.vnum = null;
		this.name = "";
		this.description = "";
		this.flags = [];
		this.sector = 0;
		this.doors = [];
		this.extraDescs = [];
		this.alignFlags = [];
		this.classFlags = [];
		this._error = {};
	}
}

export class Door {
	direction: number;
	description: string;
	keywords: string[];
	locks: number[];
	key: number;
	toVnum: number;
	_error: {
		all?: true;
		direction?: boolean;
		description?: boolean;
		keywords?: boolean;
		locks?: boolean;
		key?: boolean;
		toVnum?: boolean;
	};

	constructor() {
		this.direction = 0;
		this.description = "";
		this.keywords = [];
		this.locks = [];
		this.key = 0;
		this.toVnum = 1;
		this._error = {};
	}
}
