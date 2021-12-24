import { newId } from "./helpers";

export class Objekt {
	readonly id: string;
	vnum: number | null;
	keywords: string[];
	shortDesc: string;
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
	_error: {
		all?: boolean;
		vnum?: boolean;
		keywords?: boolean;
		shortDesc?: boolean;
		longDesc?: boolean;
		actionDesc?: boolean;
		itemType?: boolean;
		extraFlags?: boolean;
		wearFlags?: boolean;
		value0?: boolean;
		value1?: boolean;
		value2?: boolean;
		value3?: boolean;
		weight?: boolean;
		worth?: boolean;
		racialFlags?: boolean;
		extraDescs?: boolean;
		applies?: boolean;
		quality?: boolean;
	};

	constructor() {
		this.id = newId();
		this.vnum = null;
		this.keywords = [];
		this.shortDesc = "";
		this.longDesc = "";
		this.actionDesc = "";
		this.itemType = 1;
		this.extraFlags = [];
		this.wearFlags = [];
		this.value0 = "0";
		this.value1 = "0";
		this.value2 = "0";
		this.value3 = "0";
		this.weight = 0;
		this.worth = 0;
		this.racialFlags = [];
		this.extraDescs = [];
		this.applies = [];
		this.quality = null;
		this._error = {};
	}

	get name(): string {
		return this.shortDesc;
	}
}
