import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AreaSection, BLANK_AREA_SECTION } from "../models";

interface AreaSectionState {
	area: AreaSection;
}

const initialState: AreaSectionState = {
	area: BLANK_AREA_SECTION,
};

const areaSectionSlice = createSlice({
	name: 'area-section',
	initialState,
	reducers: {
		updatedAuthor(state, action: PayloadAction<string>) {
			state.area.author = action.payload;
		},
		updatedName(state, action: PayloadAction<string>) {
			state.area.name = action.payload;
		},
	},
});

export const { updatedAuthor, updatedName } = areaSectionSlice.actions;
export default areaSectionSlice.reducer;
