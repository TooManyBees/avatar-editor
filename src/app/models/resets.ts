import { newId, ErrorMarkers } from "./helpers";

export interface Resets {
	mobile: MobReset[];
	object: ObjectReset[];
	inObject: InObjectReset[];
	door: DoorReset[];
	randomExit: RandomExitReset[];
}

export interface UncorellatedResets {
	mobile: MobResetU[];
	object: ObjectResetU[];
	inObject: InObjectResetU[];
	door: DoorResetU[];
	randomExit: RandomExitResetU[];
}

export const BLANK_RESETS_SECTION: Resets = {
	mobile: [],
	object: [],
	inObject: [],
	door: [],
	randomExit: [],
};

export interface MobResetU {
	mobVnum: number;
	roomVnum: number;
	limit: number;
	comment: string;
	equipment: EquipmentResetU[];
	_error: {
		mobVnum?: boolean;
		roomVnum?: boolean;
		limit?: boolean;
	};
}

interface MobResetFields {
	mobId: string;
	roomId: string;
	limit: number;
	comment: string;
}

export interface MobReset extends MobResetFields {
	readonly id: string;
	orphan: boolean;
	equipment: EquipmentReset[];
	_error: ErrorMarkers<MobResetFields>;
}

export interface EquipmentResetU {
	objectVnum: number;
	limit: number;
	wearLocation: number;
	comment: string;
	_error: {
		mobVnum?: boolean;
		objectVnum?: boolean;
		limit?: boolean;
		wearLocation?: boolean;
	};
}

interface EquipmentResetFields {
	objectId: string;
	limit: number;
	wearLocation: number;
	comment: string;
}

export interface EquipmentReset extends EquipmentResetFields {
	readonly id: string;
	_error: ErrorMarkers<EquipmentResetFields>;
}

export interface ObjectResetU {
	objectVnum: number;
	roomVnum: number;
	comment: string;
	_error: {
		objectVnum?: boolean;
		roomVnum?: boolean;
	};
}

interface ObjectResetFields {
	objectId: string;
	roomId: string;
	comment: string;
}

export interface ObjectReset extends ObjectResetFields {
	readonly id: string;
	orphan: boolean;
	_error: ErrorMarkers<ObjectResetFields>;
}

export interface InObjectResetU {
	objectVnum: number;
	containerVnum: number;
	comment: string;
	_error: {
		objectVnum?: boolean;
		containerVnum?: boolean;
	};
}

interface InObjectResetFields {
	objectId: string;
	containerId: string;
	comment: string;
}

export interface InObjectReset extends InObjectResetFields {
	readonly id: string;
	orphan: boolean;
	_error: ErrorMarkers<InObjectResetFields>;
}

export interface DoorResetU {
	roomVnum: number;
	direction: number;
	state: number;
	comment: string;
	_error: {
		roomVnum?: boolean;
		direction?: boolean;
		state?: boolean;
	};
}

interface DoorResetFields {
	roomId: string;
	direction: number;
	state: number;
	comment: string;
}

export interface DoorReset extends DoorResetFields {
	readonly id: string;
	orphan: boolean;
	_error: ErrorMarkers<DoorResetFields>;
}

export interface RandomExitResetU {
	roomVnum: number;
	numExits: number;
	comment: string;
	_error: {
		roomVnum?: boolean;
		numExits?: boolean;
	};
}

interface RandomExitResetFields {
	roomId: string;
	numExits: number;
	comment: string;
}

export interface RandomExitReset extends RandomExitResetFields {
	readonly id: string;
	orphan: boolean;
	_error: ErrorMarkers<RandomExitResetFields>;
}
