import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TabName = "area" | "areadata" | "mobiles" | "objects" | "rooms" | "shops";

interface UiState {
	loaded: boolean;
	tab: TabName;
}

const initialState: UiState = {
	loaded: false,
	tab: "area",
};

const uiSlice = createSlice({
	name: "ui",
	initialState,
	reducers: {
		loaded(state) {
			state.loaded = true;
		},
		changedTab(state, action: PayloadAction<TabName>) {
			if (state.tab !== action.payload) {
				state.tab = action.payload;
			}
		},
	},
});

export const {
	loaded,
	changedTab,
} = uiSlice.actions;
export default uiSlice.reducer;
