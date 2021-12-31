import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AreaSection, Help, newId, BLANK_AREA_SECTION } from "../models";

export interface AreaSectionState {
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
			let help = {
				id: newId(),
				level: 1,
				keywords: [],
				body: "",
				_error: {},
			};
			state.helps.push(help);
		},
		removedHelp(state, action: PayloadAction<string>) {
			state.helps = state.helps.filter(h => h.id !== action.payload);
		},
		updatedHelp(state, action: PayloadAction<Help>) {
			const newHelp = action.payload;
			const help = state.helps.find(h => h.id === newHelp.id);
			if (help) {
				help.level = newHelp.level;
				help.keywords = newHelp.keywords;
				help.body = newHelp.body;
			}
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
