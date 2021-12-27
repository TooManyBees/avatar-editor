import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
	Resets,
	MobReset,
	InventoryReset,
	EquipmentReset,
	newId
} from "../models";
import type { UncorellatedResets } from "../models/resets";

interface ResetsSlice {
	resets: Resets;
	orphaned: UncorellatedResets;
}

const initialState: ResetsSlice = {
	resets: {
		mobile: [],
		object: [],
		inObject: [],
		door: [],
		randomExit: [],
	},
	orphaned: {
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
		init(state, action: PayloadAction<[Resets, UncorellatedResets]>) {
			const [resets, orphaned] = action.payload;
			state.resets = resets;
			state.orphaned = orphaned;
		},
		addedMobReset(state, action: PayloadAction<[string, string]>) {
			const [mobId, roomId] = action.payload;
			const reset: MobReset = {
				id: newId(),
				mobId,
				roomId,
				limit: 1,
				comment: "",
				inventory: [],
				equipment: [],
				_error: {},
			};
			state.resets.mobile.push(reset);
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
		addedInventoryReset(state, action: PayloadAction<string>) {
			const reset = state.resets.mobile.find(r => r.id === action.payload);
			if (reset) {
				const invReset: InventoryReset = {
					id: newId(),
					objectId: "",
					limit: 0,
					comment: "",
					_error: {},
				};
				reset.inventory.push(invReset);
			}
		},
		updatedInventoryReset(state, action: PayloadAction<[string, InventoryReset]>) {
			const [mobId, newReset] = action.payload;
			const reset = state.resets.mobile.find(r => r.id === mobId);
			if (reset) {
				const invReset = reset.inventory.find(r => r.id === newReset.id);
				if (invReset) {
					invReset.objectId = newReset.objectId;
					invReset.limit = newReset.limit;
					invReset.comment = newReset.comment;
				}
			}
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
				reset.equipment.push(eqReset);
			}
		},
		updatedEquipmentReset(state, action: PayloadAction<[string, EquipmentReset]>) {
			const [mobId, newReset] = action.payload;
			const reset = state.resets.mobile.find(r => r.id === mobId);
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
	},
});

export const {
	init,
	addedMobReset,
	updatedMobReset,
	removedMobReset,
	addedInventoryReset,
	updatedInventoryReset,
	addedEquipmentReset,
	updatedEquipmentReset,
} = resetsSlice.actions;
export default resetsSlice.reducer;
