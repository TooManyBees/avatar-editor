import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Resets } from "../models";
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
	},
});

export const { init } = resetsSlice.actions;
export default resetsSlice.reducer;
