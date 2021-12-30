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

interface AreaSectionState {
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

const initialState: AreaSectionState = {
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
		updatedPlane(state, action: PayloadAction<PlaneData | null>) {
			state.plane = action.payload;
		},
		updatedFlags(state, action: PayloadAction<FlagsData | null>) {
			state.flags = action.payload;
		},
		updatedOutlaw(state, action: PayloadAction<OutlawData | null>) {
			state.outlaw = action.payload;
		},
		updatedKspawn(state, action: PayloadAction<KspawnData | null>) {
			state.kspawn = action.payload;
		},
		updatedModifier(state, action: PayloadAction<ModifierData | null>) {
			state.modifier = action.payload;
		},
		updatedGroupSize(state, action: PayloadAction<GroupSizeData | null>) {
			state.groupSize = action.payload;
		},
		updatedVnumRange(state, action: PayloadAction<VnumRangeData | null>) {
			state.vnumRange = action.payload;
		},
		updatedScaling(state, action: PayloadAction<ScalingData | null>) {
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
} = areadataSlice.actions;
export default areadataSlice.reducer;
