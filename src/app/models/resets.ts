import { newId, ErrorMarkers } from "./helpers";

export interface Resets {
	mobile: MobReset[];
	inventory: InventoryReset[];
	equipment: EquipmentReset[];
	object: ObjectReset[];
	inObject: InObjectReset[];
	door: DoorReset[];
	randomExit: RandomExitReset[];
}

export const BLANK_RESETS_SECTION: Resets = {
	mobile: [],
	inventory: [],
	equipment: [],
	object: [],
	inObject: [],
	door: [],
	randomExit: [],
};

interface MobResetFields {
	mobId: string;
	roomId: string;
	limit: number;
	comment: string;
}

export interface MobReset extends MobResetFields {
	readonly id: string;
	_error: ErrorMarkers<MobResetFields>;
}

interface InventoryResetFields {
	mobId: string;
	objectId: string;
	limit: number;
	comment: string;
}

export interface InventoryReset extends InventoryResetFields {
	readonly id: string;
	_error: ErrorMarkers<InventoryResetFields>;
}

interface EquipmentResetFields {
	mobId: string;
	objectId: string;
	limit: number;
	wearLocation: number;
	comment: string;
}

export interface EquipmentReset extends EquipmentResetFields {
	readonly id: string;
	_error: ErrorMarkers<EquipmentResetFields>;
}

interface ObjectResetFields {
	objectId: string;
	roomId: string;
	comment: string;
}

export interface ObjectReset extends ObjectResetFields {
	readonly id: string;
	_error: ErrorMarkers<ObjectResetFields>;
}

interface InObjectResetFields {
	objectId: string;
	containerId: string;
	comment: string;
}

export interface InObjectReset extends InObjectResetFields {
	readonly id: string;
	_error: ErrorMarkers<InObjectResetFields>;
}

interface DoorResetFields {
	roomId: string;
	direction: number;
	state: number;
	comment: string;
}

export interface DoorReset extends DoorResetFields {
	readonly id: string;
	_error: ErrorMarkers<DoorResetFields>;
}

interface RandomExitResetFields {
	roomId: string;
	numExits: number;
	comment: string;
}

export interface RandomExitReset extends RandomExitResetFields {
	readonly id: string;
	_error: ErrorMarkers<RandomExitResetFields>;
}
