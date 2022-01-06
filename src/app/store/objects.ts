import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Apply, Edesc, Objekt, newId } from "../models";
import { blankObject } from "../models/objects";
import { blankApply, sortByVnum } from "../models/helpers";

interface ObjectState {
	objects: Objekt[];
	selectedId: string | null;
}

const initialState: ObjectState = {
	objects: [],
	selectedId: null,
};

const objectSlice = createSlice({
	name: 'objects',
	initialState,
	reducers: {
		init(state, action: PayloadAction<Objekt[]>) {
			state.objects = action.payload;
			sortByVnum(state.objects);
		},
		selectedId(state, action: PayloadAction<string>) {
			state.selectedId = action.payload;
		},
		addedObject(state) {
			const newObject = blankObject();
			state.objects.unshift(newObject);
			state.selectedId = newObject.id;
		},
		removedObject(state, action: PayloadAction<string>) {
			state.objects = state.objects.filter(o => o.id !== action.payload);
		},
		updatedVnum(state, action: PayloadAction<[string, number]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.vnum = payload;
			sortByVnum(state.objects);
		},
		updatedKeywords(state, action: PayloadAction<[string, string[]]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.keywords = payload;
		},
		updatedShortDesc(state, action: PayloadAction<[string, string]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.shortDesc = payload;
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
		updatedValue0(state, action: PayloadAction<[string, number | string]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.value0 = payload.toString();
		},
		updatedValue1(state, action: PayloadAction<[string, number | string]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.value1 = payload.toString();
		},
		updatedValue2(state, action: PayloadAction<[string, number | string]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.value2 = payload.toString();
		},
		updatedValue3(state, action: PayloadAction<[string, number | string]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) object.value3 = payload.toString();
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
		addedExtraDesc(state, action: PayloadAction<string>) {
			const object = state.objects.find(m => m.id === action.payload);
			if (object) {
				object.extraDescs.unshift({ id: newId(), keywords: [], body: "", _error: {} });
			}
		},
		removedExtraDesc(state, action: PayloadAction<[string, string]>) {
			const [id, edescId] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) {
				object.extraDescs = object.extraDescs.filter(e => e.id !== edescId);
			}
		},
		updatedExtraDesc(state, action: PayloadAction<[string, Edesc]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) {
				const edesc = object.extraDescs.find(e => e.id === payload.id);
				if (edesc) {
					edesc.keywords = payload.keywords;
					edesc.body = payload.body;
				}
			}
		},
		addedApply(state, action: PayloadAction<string>) {
			const object = state.objects.find(m => m.id === action.payload);
			if (object) {
				object.applies.unshift(blankApply());
			}
		},
		removedApply(state, action: PayloadAction<[string, string]>) {
			const [id, applyId] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) {
				object.applies = object.applies.filter(a => a.id !== applyId);
			}
		},
		updatedApply(state, action: PayloadAction<[string, Apply]>) {
			const [id, payload] = action.payload;
			const object = state.objects.find(m => m.id === id);
			if (object) {
				const idx = object.applies.findIndex(a => a.id === payload.id);
				if (idx > -1) object.applies[idx] = payload;
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
	selectedId,
	addedObject,
	removedObject,
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
