import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Objekt } from "../models";

interface ObjectState {
	objects: Objekt[];
}

const initialState: ObjectState = {
	objects: [],
};

const objectSlice = createSlice({
	name: 'objects',
	initialState,
	reducers: {
		init(state, action: PayloadAction<Objekt[]>) {
			state.objects = action.payload;
		},
	},
});

export const { init } = objectSlice.actions;
export default objectSlice.reducer;
