import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Mobile } from "../models";

interface MobileState {
	mobiles: Mobile[];
}

const initialState: MobileState = {
	mobiles: [],
};

const mobileSlice = createSlice({
	name: 'mobiles',
	initialState,
	reducers: {
		init(state, action: PayloadAction<Mobile[]>) {
			state.mobiles = action.payload;
		},
		updatedVnum(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.vnum = payload;
		},
		updatedKeywords(state, action: PayloadAction<[string, string[]]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.keywords = payload;
		},
		updatedShortDesc(state, action: PayloadAction<[string, string]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.name = payload;
		},
		updatedLongDesc(state, action: PayloadAction<[string, string]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.longDesc = payload;
		},
		updatedDescription(state, action: PayloadAction<[string, string]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.description = payload;
		},
		updatedAct(state, action: PayloadAction<[string, number[]]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.act = payload;
		},
		updatedAffected(state, action: PayloadAction<[string, number[]]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.affected = payload;
		},
		updatedAlign(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.align = payload;
		},
		updatedLevel(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.level = payload;
		},
		updatedSex(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.sex = payload;
		},
		updatedRace(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.race = payload;
		},
		updatedClass(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.klass = payload;
		},
		addedApply(state, action: PayloadAction<[string, [number, number]]>) {

		},
		removedApply(state, action: PayloadAction<[string, number]>) {

		},
		updatedApply(state, action: PayloadAction<[string, number, [number, number]]>) {

		},
		updatedTeam(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.team = payload;
		},
		updatedKspawn(state, action: PayloadAction<[string, ]>) {

		},
	},
});

export const {
	init,
	updatedVnum,
	updatedKeywords,
	updatedShortDesc,
	updatedLongDesc,
	updatedDescription,
	updatedAct,
	updatedAffected,
	updatedAlign,
	updatedLevel,
	updatedSex,
	updatedRace,
	updatedClass,
	addedApply,
	removedApply,
	updatedApply,
	updatedTeam,
	updatedKspawn,
} = mobileSlice.actions;
export default mobileSlice.reducer;
