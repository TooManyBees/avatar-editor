import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AreaSection, Help, newId, BLANK_AREA_SECTION } from "../models";

export interface AreaSectionState {
	levelRange: string;
	author: string;
	name: string;
	helps: Help[];
}

const initialState: AreaSectionState = {
	levelRange: "",
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
			state.levelRange = area.levelRange;
			state.author = area.author;
			state.name = area.name;
			state.helps = helps;
		},
		updatedLevelRange(state, action: PayloadAction<string>) {
			state.levelRange = action.payload;
		},
		updatedAuthor(state, action: PayloadAction<string>) {
			state.author = action.payload;
		},
		updatedName(state, action: PayloadAction<string>) {
			state.name = action.payload;
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
	updatedLevelRange,
	updatedAuthor,
	updatedName,
	addedHelp,
	removedHelp,
	updatedHelp,
} = areaSectionSlice.actions;
export default areaSectionSlice.reducer;
