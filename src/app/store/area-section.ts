import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AreaSection, Help, BLANK_AREA_SECTION } from "../models";

interface AreaSectionState {
	line: string;
	helps: Help[];
}

const initialState: AreaSectionState = {
	line: "",
	helps: [],
};

const areaSectionSlice = createSlice({
	name: 'area-section',
	initialState,
	reducers: {
		init(state, action: PayloadAction<[AreaSection, Help[]]>) {
			const [area, helps] = action.payload;
			state.line = area.line;
			state.helps = helps;
		},
		updatedLine(state, action: PayloadAction<string>) {
			state.line = action.payload;
		},
		addedHelp(state) {

		},
		removedHelp(state, action: PayloadAction<number>) {

		},
		updatedHelp(statet, action: PayloadAction<[number, Help]>) {

		},
	},
});

export const {
	init,
	updatedLine,
	addedHelp,
	removedHelp,
	updatedHelp,
} = areaSectionSlice.actions;
export default areaSectionSlice.reducer;
