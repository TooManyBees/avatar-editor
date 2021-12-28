import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Special, SpecialU } from "../models/specials";

interface SpecialsState {
	specials: { [s: string]: string };
	orphaned: SpecialU[];
}

const initialState: SpecialsState = {
	specials: {},
	orphaned: [],
};

const specialsSlice = createSlice({
	name: "specials",
	initialState,
	reducers: {
		init(state, action: PayloadAction<[Special[], SpecialU[]]>) {
			const [specials, orphaned] = action.payload;
			for (let special of specials) {
				state.specials[special.mobId] = special.special;
			}
			state.orphaned = orphaned;
		},
		updatedSpecial(state, action: PayloadAction<[string, string]>) {
			const [mobId, special] = action.payload;
			state.specials[mobId] = special;
		},
		removedSpecial(state, action: PayloadAction<string>) {
			delete state.specials[action.payload];
		},
	},
});

export const { init, updatedSpecial, removedSpecial } = specialsSlice.actions;
export default specialsSlice.reducer;
