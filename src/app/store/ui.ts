import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TabName = "area" | "areadata" | "mobiles" | "objects" | "rooms" | "orphans";

interface UiState {
	loaded: boolean;
	tab: TabName;
	selectedMobileId: string | null;
	selectedObjectId: string | null;
	selectedRoomId: string | null;
}

const initialState: UiState = {
	loaded: false,
	tab: "area",
	selectedMobileId: null,
	selectedObjectId: null,
	selectedRoomId: null,
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
		selectedMobileId(state, action: PayloadAction<string>) {
			state.selectedMobileId = action.payload;
			if (state.tab !== "mobiles") state.tab = "mobiles";
		},
		selectedObjectId(state, action: PayloadAction<string>) {
			state.selectedObjectId = action.payload;
			if (state.tab !== "objects") state.tab = "objects";
		},
		selectedRoomId(state, action: PayloadAction<string>) {
			state.selectedRoomId = action.payload;
			if (state.tab !== "rooms") state.tab = "rooms";
		},
	},
});

export const {
	loaded,
	changedTab,
	selectedMobileId,
	selectedObjectId,
	selectedRoomId,
} = uiSlice.actions;
export default uiSlice.reducer;
