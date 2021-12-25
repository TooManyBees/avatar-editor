import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AreaSection, Help, BLANK_AREA_SECTION } from "../models";

interface AreaSectionState {
	author: string;
	name: string;
	helps: Help[];
}

const initialState: AreaSectionState = {
	author: "",
	name: "",
	helps: [],
};

const areaSectionSlice = createSlice({
	name: 'area-section',
	initialState,
	reducers: {
		init(state, action: PayloadAction<[AreaSection, Help[]]>) {
			const [area, helps] = action.payload;
			state.author = area.author;
			state.name = area.name;
			state.helps = helps;
		},
		updatedAuthor(state, action: PayloadAction<string>) {
			state.author = action.payload;
		},
		updatedName(state, action: PayloadAction<string>) {
			state.name = action.payload;
		},
	},
});

export const {
	init,
	updatedAuthor,
	updatedName,
} = areaSectionSlice.actions;
export default areaSectionSlice.reducer;
