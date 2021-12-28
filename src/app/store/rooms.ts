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
		updatedVnum(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const room = state.rooms.find(m => m.id === id);
			if (room) room.vnum = payload;
		},
		updatedName(state, action: PayloadAction<[string, string]>) {
			const [id, payload] = action.payload;
			const room = state.rooms.find(m => m.id === id);
			if (room) room.name = payload;
		},
		updatedDescription(state, action: PayloadAction<[string, string]>) {
			const [id, payload] = action.payload;
			const room = state.rooms.find(m => m.id === id);
			if (room) room.description = payload;
		},
		updatedFlags(state, action: PayloadAction<[string, number[]]>) {
			const [id, payload] = action.payload;
			const room = state.rooms.find(m => m.id === id);
			if (room) room.flags = payload;
		},
		updatedSector(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const room = state.rooms.find(m => m.id === id);
			if (room) room.sector = payload;
		},
		updatedAlignFlags(state, action: PayloadAction<[string, number[]]>) {
			const [id, payload] = action.payload;
			const room = state.rooms.find(m => m.id === id);
			if (room) room.alignFlags = payload;
		},
		updatedClassFlags(state, action: PayloadAction<[string, number[]]>) {
			const [id, payload] = action.payload;
			const room = state.rooms.find(m => m.id === id);
			if (room) room.classFlags = payload;
		},
		addedExtraDesc(state, action: PayloadAction<string>) {
			const room = state.rooms.find(m => m.id === action.payload);
			if (room) {
				room.extraDescs.push([[], ""]);
			}
		},
		removedExtraDesc(state, action: PayloadAction<[string, number]>) {
			const [id, idx] = action.payload;
			const room = state.rooms.find(m => m.id === id);
			if (room && idx < room.extraDescs.length) {
				room.extraDescs.splice(idx, 1);
			}
		},
		updatedExtraDesc(state, action: PayloadAction<[string, number, [string[], string]]>) {
			const [id, idx, payload] = action.payload;
			const room = state.rooms.find(m => m.id === id);
			if (room && idx < room.extraDescs.length) {
				room.extraDescs[idx] = payload;
			}
		},
	},
});

export const {
	init,
	updatedVnum,
	updatedName,
	updatedDescription,
	updatedFlags,
	updatedSector,
	updatedAlignFlags,
	updatedClassFlags,
	addedExtraDesc,
	removedExtraDesc,
	updatedExtraDesc,
} = roomSlice.actions;
export default roomSlice.reducer;
