import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AreaSection, AreadataSection, BLANK_AREA_SECTION } from "../models";
import {
	PlaneData,
	FlagsData,
	OutlawData,
	KspawnData,
	ModifierData,
	GroupSizeData,
	VnumRangeData,
	ScalingData,
} from "../models/areadata";

type AreadataLines = {
	[F in keyof AreadataSection]-?: boolean;
}

interface AreaSectionState {
	area: AreaSection;
	areadata: AreadataSection;
	areadataBits: AreadataLines;
}

const initialState: AreaSectionState = {
	area: BLANK_AREA_SECTION,
	areadata: {},
	areadataBits: {
		plane: false,
		flags: false,
		outlaw: false,
		kspawn: false,
		modifier: false,
		groupSize: false,
		vnumRange: false,
		scaling: false,
	},
};

const areaSectionSlice = createSlice({
	name: 'area-section',
	initialState,
	reducers: {
		init(state, action: PayloadAction<[AreaSection, AreadataSection]>) {
			const [area, areadata] = action.payload;
			state.area = area;
			state.areadata = areadata;
			for (let k of Object.keys(areadata)) {
				state.areadataBits[k as keyof AreadataSection] = true;
			}
		},
		updatedAuthor(state, action: PayloadAction<string>) {
			state.area.author = action.payload;
		},
		updatedName(state, action: PayloadAction<string>) {
			state.area.name = action.payload;
		},
		updatePlane(state, action: PayloadAction<PlaneData>) {
			state.areadata.plane = action.payload;
		},
		updateFlags(state, action: PayloadAction<FlagsData>) {
			state.areadata.flags = action.payload;
		},
		updateOutlaw(state, action: PayloadAction<OutlawData>) {
			state.areadata.outlaw = action.payload;
		},
		updateKspawn(state, action: PayloadAction<KspawnData>) {
			state.areadata.kspawn = action.payload;
		},
		updateModifier(state, action: PayloadAction<ModifierData>) {
			state.areadata.modifier = action.payload;
		},
		updateGroupSize(state, action: PayloadAction<GroupSizeData>) {
			state.areadata.groupSize = action.payload;
		},
		updateVnumRange(state, action: PayloadAction<VnumRangeData>) {
			state.areadata.vnumRange = action.payload;
		},
		updateScaling(state, action: PayloadAction<ScalingData>) {
			state.areadata.scaling = action.payload;
		},
	},
});

export const {
	init,
	updatedAuthor,
	updatedName,
	updatePlane,
	updateFlags,
	updateOutlaw,
	updateKspawn,
	updateModifier,
	updateGroupSize,
	updateVnumRange,
	updateScaling,
} = areaSectionSlice.actions;
export default areaSectionSlice.reducer;
