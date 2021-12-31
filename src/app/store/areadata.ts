import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AreadataSection } from "../models";
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

export interface AreadataState {
	plane: PlaneData | null,
	flags: FlagsData | null,
	outlaw: OutlawData | null,
	kspawn: KspawnData | null,
	modifier: ModifierData | null,
	groupSize: GroupSizeData | null,
	vnumRange: VnumRangeData | null,
	scaling: ScalingData | null,
	areadataBits: AreadataLines;
}

const initialState: AreadataState = {
	plane: null,
	flags: null,
	outlaw: null,
	kspawn: null,
	modifier: null,
	groupSize: null,
	vnumRange: null,
	scaling: null,
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

const areadataSlice = createSlice({
	name: "areadata",
	initialState,
	reducers: {
		init(state, action: PayloadAction<AreadataSection>) {
			for (let [k, v] of Object.entries(action.payload)) {
				state[k as keyof AreadataSection] = v;
				state.areadataBits[k as keyof AreadataSection] = true;
			}
		},
		togglePlane(state, action: PayloadAction<boolean>) {
			state.areadataBits.plane = action.payload;
		},
		updatedPlane(state, action: PayloadAction<PlaneData>) {
			state.plane = action.payload;
		},
		toggleFlags(state, action: PayloadAction<boolean>) {
			state.areadataBits.flags = action.payload;
		},
		updatedFlags(state, action: PayloadAction<FlagsData>) {
			state.flags = action.payload;
		},
		toggleOutlaw(state, action: PayloadAction<boolean>) {
			state.areadataBits.outlaw = action.payload;
		},
		updatedOutlaw(state, action: PayloadAction<OutlawData>) {
			state.outlaw = action.payload;
		},
		toggleKspawn(state, action: PayloadAction<boolean>) {
			state.areadataBits.kspawn = action.payload;
		},
		updatedKspawn(state, action: PayloadAction<KspawnData>) {
			state.kspawn = action.payload;
		},
		toggleModifier(state, action: PayloadAction<boolean>) {
			state.areadataBits.modifier = action.payload;
		},
		updatedModifier(state, action: PayloadAction<ModifierData>) {
			state.modifier = action.payload;
		},
		toggleGroupSize(state, action: PayloadAction<boolean>) {
			state.areadataBits.groupSize = action.payload;
		},
		updatedGroupSize(state, action: PayloadAction<GroupSizeData>) {
			state.groupSize = action.payload;
		},
		toggleVnumRange(state, action: PayloadAction<boolean>) {
			state.areadataBits.vnumRange = action.payload;
		},
		updatedVnumRange(state, action: PayloadAction<VnumRangeData>) {
			state.vnumRange = action.payload;
		},
		toggleScaling(state, action: PayloadAction<boolean>) {
			state.areadataBits.scaling = action.payload;
		},
		updatedScaling(state, action: PayloadAction<ScalingData>) {
			state.scaling = action.payload;
		},
	}
});

export const {
	init,
	updatedPlane,
	updatedFlags,
	updatedOutlaw,
	updatedKspawn,
	updatedModifier,
	updatedGroupSize,
	updatedVnumRange,
	updatedScaling,
	togglePlane,
	toggleFlags,
	toggleOutlaw,
	toggleKspawn,
	toggleModifier,
	toggleGroupSize,
	toggleVnumRange,
	toggleScaling,
} = areadataSlice.actions;
export default areadataSlice.reducer;
