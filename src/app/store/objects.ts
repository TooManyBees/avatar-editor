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
		updatedVnum(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.vnum = payload;
		},
		updatedKeywords(state, action: PayloadAction<[string, string[]]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.keywords = payload;
		},
		updatedShortDesc(state, action: PayloadAction<[string, string]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.name = payload;
		},
		updatedLongDesc(state, action: PayloadAction<[string, string]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.longDesc = payload;
		},
		updatedActionDesc(state, action: PayloadAction<[string, string]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.actionDesc = payload;
		},
		updatedItemType(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.itemType = payload;
		},
		updatedExtraFlags(state, action: PayloadAction<[string, number[]]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.extraFlags = payload;
		},
		updatedWearFlags(state, action: PayloadAction<[string, number[]]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.wearFlags = payload;
		},
		updatedValue0(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.value0 = payload.toString(); // FIXME
		},
		updatedValue1(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.value1 = payload.toString(); // FIXME
		},
		updatedValue2(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.value2 = payload.toString(); // FIXME
		},
		updatedValue3(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.value3 = payload.toString(); // FIXME
		},
		updatedWeight(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.weight = payload;
		},
		updatedWorth(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.worth = payload;
		},
		updatedRacialFlags(state, action: PayloadAction<[string, number[]]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.racialFlags = payload;
		},
		addedExtraDesc(state, action: PayloadAction<[string, [string[], string]]>) {

		},
		removedExtraDesc(state, action: PayloadAction<[string, number]>) {

		},
		updatedExtraDesc(state, action: PayloadAction<[string, number, [string[], string]]>) {

		},
		addedApply(state, action: PayloadAction<string>) {
			const object = state.objects.find(m => m.id === action.payload);
			if (object) {
				object.applies.push([1, 0]);
			}
		},
		removedApply(state, action: PayloadAction<[string, number]>) {
			const [id, idx] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object && idx < object.applies.length) {
				object.applies = object.applies.slice(0, idx).concat(object.applies.slice(idx + 1));
			}
		},
		updatedApply(state, action: PayloadAction<[string, number, [number, number]]>) {
			const [id, idx, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object && idx < object.applies.length) {
				object.applies[idx] = payload;
			}
		},
		updatedQuality(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.quality = payload;
		},
	},
});

export const {
	init,
	updatedVnum,
	updatedKeywords,
	updatedShortDesc,
	updatedLongDesc,
	updatedActionDesc,
	updatedItemType,
	updatedExtraFlags,
	updatedWearFlags,
	updatedValue0,
	updatedValue1,
	updatedValue2,
	updatedValue3,
	updatedWeight,
	updatedWorth,
	updatedRacialFlags,
	addedExtraDesc,
	removedExtraDesc,
	updatedExtraDesc,
	addedApply,
	removedApply,
	updatedApply,
	updatedQuality,
} = objectSlice.actions;
export default objectSlice.reducer;
