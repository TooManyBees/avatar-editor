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
		updatePlane(state, action: PayloadAction<PlaneData>) {
			state.plane = action.payload;
		},
		updateFlags(state, action: PayloadAction<FlagsData>) {
			state.flags = action.payload;
		},
		updateOutlaw(state, action: PayloadAction<OutlawData>) {
			state.outlaw = action.payload;
		},
		updateKspawn(state, action: PayloadAction<KspawnData>) {
			state.kspawn = action.payload;
		},
		updateModifier(state, action: PayloadAction<ModifierData>) {
			state.modifier = action.payload;
		},
		updateGroupSize(state, action: PayloadAction<GroupSizeData>) {
			state.groupSize = action.payload;
		},
		updateVnumRange(state, action: PayloadAction<VnumRangeData>) {
			state.vnumRange = action.payload;
		},
		updateScaling(state, action: PayloadAction<ScalingData>) {
			state.scaling = action.payload;
		},
	}
});

export const {
	init,
	updatePlane,
	updateFlags,
	updateOutlaw,
	updateKspawn,
	updateModifier,
	updateGroupSize,
	updateVnumRange,
	updateScaling,
} = areadataSlice.actions;
export default areadataSlice.reducer;
