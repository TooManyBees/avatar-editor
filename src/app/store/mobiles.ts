import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Mobile } from "../models";

interface MobileState {
	mobiles: Mobile[];
}

const initialState: MobileState = {
	mobiles: [],
};

const mobileSlice = createSlice({
	name: 'mobiles',
	initialState,
	reducers: {
		init(state, action: PayloadAction<Mobile[]>) {
			state.mobiles = action.payload;
		},
	},
});

export const { init } = mobileSlice.actions;
export default mobileSlice.reducer;
