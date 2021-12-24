import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room } from "../models";

interface RoomState {
	rooms: Room[];
}

const initialState: RoomState = {
	rooms: [],
};

const roomSlice = createSlice({
	name: 'rooms',
	initialState,
	reducers: {
		init(state, action: PayloadAction<Room[]>) {
			state.rooms = action.payload;
		},
	},
});

export const { init } = roomSlice.actions;
export default roomSlice.reducer;
