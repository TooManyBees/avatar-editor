import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Mobile, Kspawn, blankKspawn, blankMobile } from "../models/mobiles";
import { Shop, ShopU, newShop } from "../models/shops";
import { Special, SpecialU } from "../models/specials";
import { Apply, blankApply, sortByVnum } from "../models/helpers";

interface MobileState {
	mobiles: Mobile[];
	orphanedSpecials: SpecialU[];
	orphanedShops: ShopU[];
}

const initialState: MobileState = {
	mobiles: [],
	orphanedSpecials: [],
	orphanedShops: [],
};

const mobileSlice = createSlice({
	name: 'mobiles',
	initialState,
	reducers: {
		init(state, action: PayloadAction<[Mobile[], SpecialU[], ShopU[]]>) {
			const [mobiles, orphanedSpecials, orphanedShops] = action.payload;
			state.mobiles = mobiles;
			state.orphanedSpecials = orphanedSpecials;
			state.orphanedShops = orphanedShops;
			sortByVnum(state.mobiles);
		},
		addedMobile(state, action: PayloadAction<string>) {
			const newMob = blankMobile(action.payload);
			state.mobiles.unshift(newMob);
		},
		removedMobile(state, action: PayloadAction<string>) {
			state.mobiles = state.mobiles.filter(m => m.id !== action.payload);
		},
		updatedVnum(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.vnum = payload;
			sortByVnum(state.mobiles);
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
				mobile.applies.unshift(blankApply());
			}
		},
		removedApply(state, action: PayloadAction<[string, string]>) {
			const [id, applyId] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) {
				mobile.applies = mobile.applies.filter(a => a.id !== applyId);
			}
		},
		updatedApply(state, action: PayloadAction<[string, Apply]>) {
			const [id, payload] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) {
				const idx = mobile.applies.findIndex(a => a.id === payload.id);
				if (idx > -1) mobile.applies[idx] = payload;
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
		updatedSpecial(state, action: PayloadAction<[string, Special]>) {
			const [id, specFun] = action.payload;
			const mobile = state.mobiles.find(m => m.id === id);
			if (mobile) mobile.specFun = specFun;
		},
		restoredSpecial(state, action: PayloadAction<[string, SpecialU]>) {
			const [mobId, special] = action.payload;
			const mobile = state.mobiles.find(m => m.id === mobId);
			if (mobile) {
				mobile.specFun = { special: special.special, comment: special.comment };
				state.orphanedSpecials = state.orphanedSpecials.filter(s => s.id !== special.id);
			} else {
				const idx = state.orphanedSpecials.findIndex(s => s.id === special.id);
				state.orphanedSpecials[idx] = special;
			}
		},
		addedShop(state, action: PayloadAction<string>) {
			const mobile = state.mobiles.find(m => m.id === action.payload);
			if (mobile) mobile.shop = newShop();
		},
		updatedShop(state, action: PayloadAction<[string, Shop | null]>) {
			const [mobId, shop] = action.payload;
			const mobile = state.mobiles.find(m => m.id === mobId);
			if (mobile) mobile.shop = shop;
		},
		restoredShop(state, action: PayloadAction<[string, ShopU]>) {
			const [mobId, shop] = action.payload;
			const mobile = state.mobiles.find(m => m.id === mobId);
			const { id, mobVnum, ...rest } = shop;
			if (mobile) {
				mobile.shop = { ...rest };
				state.orphanedShops = state.orphanedShops.filter(s => s.id !== shop.id);
			} else {
				const idx = state.orphanedShops.findIndex(s => s.id === shop.id);
				state.orphanedShops[idx] = shop;
			}
		},
		shiftVnums(state, action: PayloadAction<{ min: number, max: number, newMin: number }>) {
			const { min, max, newMin } = action.payload;
			const delta = newMin - min;
			state.mobiles.forEach(e => {
				if (e.vnum != null && e.vnum >= min && e.vnum <= max) {
					e.vnum += delta;
				}
			});
		},
	},
});

export const {
	init,
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
	restoredSpecial,
	addedShop,
	updatedShop,
	restoredShop,
	shiftVnums,
} = mobileSlice.actions;
export default mobileSlice.reducer;
