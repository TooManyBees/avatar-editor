import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Room, Door, Edesc, newId } from "../models";
import { blankDoor, blankRoom } from "../models/rooms";
import { sortByVnum } from "../models/helpers";

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
			sortByVnum(state.rooms);
		},
		addedRoom(state, action: PayloadAction<string>) {
			const newRoom = blankRoom(action.payload);
			state.rooms.unshift(newRoom);
		},
		removedRoom(state, action: PayloadAction<string>) {
			state.rooms = state.rooms.filter(r => r.id !== action.payload);
		},
		updatedVnum(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const room = state.rooms.find(m => m.id === id);
			if (room) room.vnum = payload;
			sortByVnum(state.rooms);
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
				room.extraDescs.unshift({ id: newId(), keywords: [], body: "", _error: {} });
			}
		},
		removedExtraDesc(state, action: PayloadAction<[string, string]>) {
			const [id, edescId] = action.payload;
			const room = state.rooms.find(m => m.id === id);
			if (room) {
				room.extraDescs = room.extraDescs.filter(e => e.id !== edescId);
			}
		},
		updatedExtraDesc(state, action: PayloadAction<[string, Edesc]>) {
			const [id, payload] = action.payload;
			const room = state.rooms.find(m => m.id === id);
			if (room) {
				const edesc = room.extraDescs.find(e => e.id === payload.id);
				if (edesc) {
					edesc.keywords = payload.keywords;
					edesc.body = payload.body;
				}
			}
		},
		addedDoor(state, action: PayloadAction<string>) {
			const room = state.rooms.find(m => m.id === action.payload);
			if (room) room.doors.unshift(blankDoor());
		},
		updatedDoor(state, action: PayloadAction<[string, Door]>) {
			const [roomId, newDoor] = action.payload;
			const room = state.rooms.find(m => m.id === roomId);
			if (room) {
				const door = room.doors.find(d => d.id === newDoor.id);
				if (door) {
					door.direction = newDoor.direction;
					door.description = newDoor.description;
					door.keywords = newDoor.keywords;
					door.locks = newDoor.locks;
					door.keyId = newDoor.keyId;
					door.toRoomId = newDoor.toRoomId;
				}
			}
		},
		removedDoor(state, action: PayloadAction<[string, string]>) {
			const [roomId, doorId] = action.payload;
			const room = state.rooms.find(m => m.id === roomId);
			if (room) room.doors = room.doors.filter(d => d.id !== doorId)
		},
		shiftVnums(state, action: PayloadAction<{ min: number, max: number, newMin: number }>) {
			const { min, max, newMin } = action.payload;
			const delta = newMin - min;
			state.rooms.forEach(e => {
				if (e.vnum != null && e.vnum >= min && e.vnum <= max) {
					e.vnum += delta;
				}
			});
		},
	},
});

export const {
	init,
	addedRoom,
	removedRoom,
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
	addedDoor,
	updatedDoor,
	removedDoor,
	shiftVnums,
} = roomSlice.actions;
export default roomSlice.reducer;
