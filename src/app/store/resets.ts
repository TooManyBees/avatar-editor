import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	Resets,
	DoorReset,
	MobReset,
	EquipmentReset,
	ObjectReset,
	InObjectReset,
	RandomExitReset,
	newId
} from "../models";
import type { UncorellatedResets } from "../models/resets";

interface ResetsSlice {
	resets: Resets;
}

const initialState: ResetsSlice = {
	resets: {
		mobile: [],
		object: [],
		inObject: [],
		door: [],
		randomExit: [],
	},
};

const resetsSlice = createSlice({
	name: "resets",
	initialState,
	reducers: {
		init(state, action: PayloadAction<Resets>) {
			state.resets = action.payload;
		},
		addedMobReset(state, action: PayloadAction<string>) {
			const reset: MobReset = {
				id: newId(),
				mobId: action.payload,
				roomId: "",
				limit: 1,
				comment: "",
				orphan: false,
				equipment: [],
				_error: {},
			};
			state.resets.mobile.unshift(reset);
		},
		updatedMobReset(state, action: PayloadAction<MobReset>) {
			const newReset = action.payload;
			const reset = state.resets.mobile.find(r => r.id === newReset.id);
			if (reset) {
				reset.mobId = newReset.mobId;
				reset.roomId = newReset.roomId;
				reset.limit = newReset.limit;
				reset.comment = newReset.comment;
			}
		},
		removedMobReset(state, action: PayloadAction<string>) {
			state.resets.mobile = state.resets.mobile.filter(r => r.id !== action.payload);
		},
		restoredMobReset(state, action: PayloadAction<[string, MobReset]>) {
			const [mobId, _reset] = action.payload;
			const reset = state.resets.mobile.find(r => r.id === _reset.id);
			if (reset) {
				reset.mobId = mobId;
				reset.orphan = false;
			}
		},
		removedAllMobResets(state, action: PayloadAction<string>) {
			state.resets.mobile = state.resets.mobile.filter(r => r.mobId !== action.payload);
		},
		addedEquipmentReset(state, action: PayloadAction<string>) {
			const reset = state.resets.mobile.find(r => r.id === action.payload);
			if (reset) {
				const eqReset: EquipmentReset = {
					id: newId(),
					objectId: "",
					limit: 0,
					wearLocation: 0,
					comment: "",
					_error: {},
				};
				reset.equipment.unshift(eqReset);
			}
		},
		updatedEquipmentReset(state, action: PayloadAction<[string, EquipmentReset]>) {
			const [resetId, newReset] = action.payload;
			const reset = state.resets.mobile.find(r => r.id === resetId);
			if (reset) {
				const eqReset = reset.equipment.find(r => r.id === newReset.id);
				if (eqReset) {
					eqReset.objectId = newReset.objectId;
					eqReset.limit = newReset.limit;
					eqReset.wearLocation = newReset.wearLocation;
					eqReset.comment = newReset.comment;
				}
			}
		},
		removedEquipmentReset(state, action: PayloadAction<[string, string]>) {
			const [resetId, invId] = action.payload;
			const mobReset = state.resets.mobile.find(r => r.id === resetId);
			if (mobReset) {
				mobReset.equipment = mobReset.equipment.filter(r => r.id !== invId);
			}
		},
		addedObjectReset(state, action: PayloadAction<string>) {
			const newReset: ObjectReset = {
				id: newId(),
				roomId: "",
				objectId: action.payload,
				comment: "",
				orphan: false,
				_error: {},
			};
			state.resets.object.unshift(newReset);
		},
		updatedObjectReset(state, action: PayloadAction<ObjectReset>) {
			const idx = state.resets.object.findIndex(r => r.id === action.payload.id);
			if (idx > -1) state.resets.object[idx] = action.payload;
		},
		removedObjectReset(state, action: PayloadAction<string>) {
			state.resets.object = state.resets.object.filter(r => r.id !== action.payload);
		},
		restoredObjectReset(state, action: PayloadAction<[string, ObjectReset]>) {
			const [objectId, _reset] = action.payload;
			const reset = state.resets.object.find(r => r.id === _reset.id);
			if (reset) {
				reset.objectId = objectId;
				reset.orphan = false;
			}
		},
		addedInObjectReset(state, action: PayloadAction<string>) {
			const newReset: InObjectReset = {
				id: newId(),
				containerId: "",
				objectId: action.payload,
				comment: "",
				orphan: false,
				_error: {},
			};
			state.resets.inObject.unshift(newReset);
		},
		updatedInObjectReset(state, action: PayloadAction<InObjectReset>) {
			const idx = state.resets.inObject.findIndex(r => r.id === action.payload.id);
			if (idx > -1) state.resets.inObject[idx] = action.payload;
		},
		removedInObjectReset(state, action: PayloadAction<string>) {
			state.resets.inObject = state.resets.inObject.filter(r => r.id !== action.payload);
		},
		restoredInObjectReset(state, action: PayloadAction<[string, InObjectReset]>) {
			const [containerId, _reset] = action.payload;
			const reset = state.resets.inObject.find(r => r.id === _reset.id);
			if (reset) {
				reset.containerId = containerId;
				reset.orphan = false;
			}
		},
		addedDoorReset(state, action: PayloadAction<{ roomId: string, direction: number, state: number }>) {
			const { roomId, direction, state: doorState } = action.payload;
			const newReset: DoorReset = {
				id: newId(),
				roomId,
				direction,
				state: doorState,
				comment: "",
				orphan: false,
				_error: {},
			};
			state.resets.door.push(newReset);
		},
		updatedDoorReset(state, action: PayloadAction<DoorReset>) {
			let idx = state.resets.door.findIndex(r => r.id === action.payload.id);
			if (idx > -1) state.resets.door[idx] = action.payload;
		},
		removedDoorReset(state, action: PayloadAction<string>) {
			state.resets.door = state.resets.door.filter(r => r.id !== action.payload);
		},
		restoredDoorReset(state, action: PayloadAction<[string, DoorReset]>) {
			const [roomId, _reset] = action.payload;
			const reset = state.resets.door.find(r => r.id === _reset.id);
			if (reset) {
				reset.roomId = roomId;
				reset.orphan = false;
			}
		},
		addedRandomExitReset(state, action: PayloadAction<string>) {
			const newReset: RandomExitReset = {
				id: newId(),
				roomId: action.payload,
				numExits: 0,
				comment: "",
				orphan: false,
				_error: {},
			};
			state.resets.randomExit.unshift(newReset);
		},
		updatedRandomExitReset(state, action: PayloadAction<RandomExitReset>) {
			const idx = state.resets.randomExit.findIndex(r => r.id === action.payload.id);
			if (idx > -1) state.resets.randomExit[idx] = action.payload;
		},
		removedRandomExitReset(state, action: PayloadAction<string>) {
			state.resets.randomExit = state.resets.randomExit.filter(r => r.id !== action.payload);
		},
		restoredRandomExitReset(state, action: PayloadAction<[string, RandomExitReset]>) {
			const [roomId, _reset] = action.payload;
			const reset = state.resets.randomExit.find(r => r.id === _reset.id);
			if (reset) {
				reset.roomId = roomId;
				reset.orphan = false;
			}
		},
	},
});

export const {
	init,
	addedMobReset,
	updatedMobReset,
	removedMobReset,
	restoredMobReset,
	removedAllMobResets,
	addedEquipmentReset,
	updatedEquipmentReset,
	removedEquipmentReset,
	addedObjectReset,
	updatedObjectReset,
	removedObjectReset,
	restoredObjectReset,
	addedInObjectReset,
	updatedInObjectReset,
	removedInObjectReset,
	restoredInObjectReset,
	addedDoorReset,
	updatedDoorReset,
	removedDoorReset,
	restoredDoorReset,
	addedRandomExitReset,
	updatedRandomExitReset,
	removedRandomExitReset,
	restoredRandomExitReset,
} = resetsSlice.actions;
export default resetsSlice.reducer;
