import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Area } from "../models";

type TabName = keyof Area;

interface UiState {
	loaded: boolean;
	tab: TabName;
	currentId: string | null;
}

const initialState: UiState = {
	loaded: false,
	tab: "mobiles", // FIXME: set to area later
	currentId: null,
};

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		loaded(state) {
			state.loaded = true;
		},
		changedTab(state, action: PayloadAction<TabName>) {
			state.tab = action.payload;
			state.currentId = null;
		},
		selectedId(state, action: PayloadAction<string>) {
			state.currentId = action.payload;
		}
	},
});

export const { loaded, changedTab, selectedId } = uiSlice.actions;
export default uiSlice.reducer;
