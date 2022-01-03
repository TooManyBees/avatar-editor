import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Mobile, Kspawn, blankKspawn, blankMobile } from "../models/mobiles";
import { SpecialU } from "../models/specials";

interface MobileState {
	mobiles: Mobile[];
	orphanedSpecials: SpecialU[];
	selectedId: string | null;
}

const initialState: MobileState = {
	mobiles: [],
	orphanedSpecials: [],
	selectedId: null,
};

const mobileSlice = createSlice({
	name: 'mobiles',
	initialState,
	reducers: {
		init(state, action: PayloadAction<[Mobile[], SpecialU[]]>) {
			const [mobiles, orphanedSpecials] = action.payload;
			state.mobiles = mobiles;
			state.orphanedSpecials = orphanedSpecials;
		},
		selectedId(state, action: PayloadAction<string>) {
			state.selectedId = action.payload;
		},
		addedMobile(state) {
			const newMob = blankMobile();
			state.mobiles.unshift(newMob);
			state.selectedId = newMob.id;
		},
		removedMobile(state, action: PayloadAction<string>) {
			state.mobiles = state.mobiles.filter(m => m.id !== action.payload);
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
			if (mobile) mobile.shortDesc = payload;
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
		updatedRace(state, action: PayloadAction<[string, number | null]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.race = payload;
		},
		updatedClass(state, action: PayloadAction<[string, number | null]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.klass = payload;
		},
		addedApply(state, action: PayloadAction<string>) {
			const mobile = state.mobiles.find(m => m.id === action.payload);
			if (mobile) {
				mobile.applies.push([1, 0]);
			}
		},
		removedApply(state, action: PayloadAction<[string, number]>) {
			const [id, idx] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile && idx < mobile.applies.length) {
				mobile.applies = mobile.applies.slice(0, idx).concat(mobile.applies.slice(idx + 1));
			}
		},
		updatedApply(state, action: PayloadAction<[string, number, [number, number]]>) {
			const [id, idx, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile && idx < mobile.applies.length) {
				mobile.applies[idx] = payload;
			}
		},
		updatedTeam(state, action: PayloadAction<[string, number | null]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.team = payload;
		},
		addedKspawn(state, action: PayloadAction<string>) {
			const mobile = state.mobiles.find(m => m.id === action.payload);
			if (mobile && mobile.kspawn == null) {
				mobile.kspawn = blankKspawn();
			}
		},
		removedKspawn(state, action: PayloadAction<string>) {
			const mobile = state.mobiles.find(m => m.id === action.payload);
			if (mobile && mobile.kspawn != null) {
				mobile.kspawn = undefined;
			}
		},
		updatedKspawn(state, action: PayloadAction<[string, Kspawn]>) {
			const [id, kspawn] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile && mobile.kspawn != null) {
				mobile.kspawn = kspawn;
			}
		},
		updatedSpecial(state, action: PayloadAction<[string, string | null]>) {
			const [id, specFun] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.specFun = specFun;
		},
	},
});

export const {
	init,
	selectedId,
	addedMobile,
	removedMobile,
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
	addedKspawn,
	removedKspawn,
	updatedKspawn,
	updatedSpecial,
} = mobileSlice.actions;
export default mobileSlice.reducer;
