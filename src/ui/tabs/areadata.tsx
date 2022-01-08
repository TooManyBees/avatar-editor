import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
	FlagsData,
	KspawnData,
	GroupSizeData,
	ModifierData,
	OutlawData,
	PlaneData,
	ScalingData,
	VnumRangeData
} from "../../app/models/areadata";
import {
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
} from "../../app/store/areadata";
import { TabsContents } from "./tabs-layout";
import { BitsFieldN } from "../components/BitsField";
import {
	NumberField,
	SelectField,
	TextArea,
	ToolRow,
} from "../components";
import ToggleContainer from "../components/ToggleContainer";

export default function AreadataTab() {
	const dispatch = useAppDispatch();
	const areadata = useAppSelector(state => state.areadata);
	const enabled = useAppSelector(state => state.areadata.areadataBits);

	return (
		<TabsContents>
			<VnumRange vnumRange={areadata.vnumRange} opened={enabled.vnumRange} />
			<AreaFlags flags={areadata.flags} opened={enabled.flags} />
			<Plane plane={areadata.plane} opened={enabled.plane} />
			<Outlaw outlaw={areadata.outlaw} opened={enabled.outlaw} />
			<Kspawn kspawn={areadata.kspawn} opened={enabled.kspawn} />
			<Modifier modifier={areadata.modifier} opened={enabled.modifier} />
			<GroupSize groupSize={areadata.groupSize} opened={enabled.groupSize} />
			<Scaling scaling={areadata.scaling} opened={enabled.scaling} />
		</TabsContents>
	);
}

function VnumRange(props: { opened: boolean, vnumRange: VnumRangeData | null }) {
	const dispatch = useAppDispatch();
	const { min, max } = props.vnumRange || { min: 0, max: 0 };

	const onEnabled = () => dispatch(toggleVnumRange(true));
	const onDisabled = () => dispatch(toggleVnumRange(false));

	function onUpdateMin(min: number) {
		dispatch(updatedVnumRange({min, max, _error: {}}))
	}
	function onUpdateMax(max: number) {
		dispatch(updatedVnumRange({min, max, _error: {}}));
	}

	return (
		<ToggleContainer section opened={props.opened} label="Vnum Range" onEnabled={onEnabled} onDisabled={onDisabled}>
			<ToolRow>
				<NumberField name="Min" value={min} onUpdate={onUpdateMin} />
				<NumberField name="Max" value={max} onUpdate={onUpdateMax} />
			</ToolRow>
		</ToggleContainer>
	);
}

const AREA_FLAGS: [number, string, string][] = [
	[1, "No plague", "plague cannot spread in the area"],
	[2, "No summon", "nothing can be summoned into the area"],
	[4, "Arena", "*** not yet implemented, subject to change ***"],
	[8, "No exit", "blocks a variety of exit spells (portal, nexus, teleport, mercy out, summon, astral, planeshift). does not block recall, sanctum, or homeshift; use the room flag NO_RECALL (8192) if needed"],
	[16, "EHA", "designates area as an Elite Hero area"],
	[32, "No HOG", "players are not able to enter the area while hogged, or hog within the area"],
	[64, "No Recall", "It will not be possible to use the recall or sanc commands to leave the area. In combination with noexit this means that teleporting etc within the area is possible, but not so for leaving."],
	[128, "No global mod", "Global Modifications such as experience boosts or regeneration changes will not affect this area."],
	[256, "No restore all", "Restore all will not affect this area"],
	[512, "Local zombie", "Bountied players in this area will behave like zombies. See HELP QEVENTS-ZOMBIEFEST for more information."],
	[1024, "No entrance", "blocks a variety of entrance spells (portal, nexus, teleport, mercy, summon, astral, raise dead). Does not block gurney, send, planeshift, salvation."],
];

function AreaFlags(props: { opened: boolean, flags: FlagsData | null }) {
	const dispatch = useAppDispatch();
	const flags: number[] = props.flags?.flags || [];

	function onEnabled() {
		dispatch(toggleFlags(true));
	}
	function onDisabled() {
		dispatch(toggleFlags(false));
	}
	function onUpdate(flags: number[]) {
		dispatch(updatedFlags({ flags, _error: {} }))
	}

	return (
		<ToggleContainer section opened={props.opened} label="Area Flags" onEnabled={onEnabled} onDisabled={onDisabled}>
			<BitsFieldN map={AREA_FLAGS} value={flags} onUpdate={onUpdate} />
		</ToggleContainer>
	);
}

function Plane(props: { opened: boolean, plane: PlaneData | null }) {
	const dispatch = useAppDispatch();
	const { plane, zone } = props.plane || { plane: 1, zone: null };

	const onEnabled = () => dispatch(togglePlane(true));
	const onDisabled = () => dispatch(togglePlane(false));
	function onUpdatePlane(plane: number) {
		dispatch(updatedPlane({plane, zone, _error: {}}))
	}
	function onUpdateZone(zone: number) {
		dispatch(updatedPlane({plane, zone, _error: {}}));
	}

	return (
		<ToggleContainer section opened={props.opened} label="Plane" onEnabled={onEnabled} onDisabled={onDisabled}>
			<ToolRow>
				<NumberField name="Plane" value={plane} min={1} onUpdate={onUpdatePlane} />
				<NumberField name="Zone" value={zone} min={1} onUpdate={onUpdateZone} />
			</ToolRow>
		</ToggleContainer>
	);
}

function Outlaw(props: { opened: boolean, outlaw: OutlawData | null }) {
	const dispatch = useAppDispatch();
	const outlaw: OutlawData = props.outlaw || { dumpVnum: -1, jailVnum: -1, deathVnum: -1, execVnum: -1, justice: -1, _error: {} };

	const onEnabled = () => dispatch(toggleOutlaw(true));
	const onDisabled = () => dispatch(toggleOutlaw(false));

	function onUpdateDumpVnum(dumpVnum: number) {
		dispatch(updatedOutlaw({...outlaw, dumpVnum}));
	}
	function onUpdateJailVnum(jailVnum: number) {
		dispatch(updatedOutlaw({...outlaw, jailVnum}));
	}
	function onUpdateDeathVnum(deathVnum: number) {
		dispatch(updatedOutlaw({...outlaw, deathVnum}));
	}
	function onUpdateExecVnum(execVnum: number) {
		dispatch(updatedOutlaw({...outlaw, execVnum}));
	}
	function onUpdateJustice(justice: number) {
		dispatch(updatedOutlaw({...outlaw, justice}));
	}

	return (
		<ToggleContainer section opened={props.opened} label="Outlaw" onEnabled={onEnabled} onDisabled={onDisabled}>
			<ToolRow>
				<NumberField name="Dump Room Vnum" value={outlaw.dumpVnum} min={-1} onUpdate={onUpdateDumpVnum} />
				<NumberField name="Jail Vnum" value={outlaw.jailVnum} min={-1} onUpdate={onUpdateJailVnum} />
				<NumberField name="Death Row Vnum" value={outlaw.deathVnum} min={-1} onUpdate={onUpdateDeathVnum} />
				<NumberField name="Executioner Vnum" value={outlaw.execVnum} min={-1} onUpdate={onUpdateExecVnum} />
				<NumberField name="Justice Factor" value={outlaw.justice} min={-1} onUpdate={onUpdateJustice} />
			</ToolRow>
		</ToggleContainer>
	);
}

const KSPAWN_CONDITION: { value: number, label: string }[] = [
	{ value: 1, label: "Planeshift" },
];

const KSPAWN_COMMAND: { value: number, label: string, desc: string }[] = [
	{ value: 1, label: "Spawn", desc: "Loads a new mob at the room specified and sets it hunting the player." },
	{ value: 2, label: "Page", desc: "The first non-hunting mob of the matching vnum is set hunting the player." },
	{ value: 3, label: "Page-Spawn", desc: "As Page, but if no free mob is found, one is loaded." },
	{ value: 4, label: "Swarm", desc: "All non-hunting mobs of the matching vnum are set hunting the player." },
	{ value: 5, label: "Swarm-Spawn", desc: "As Swarm, but if no free mob is found, one is loaded." },
	{ value: 6, label: "Alarm", desc: "All mobs of the matching vnum are set hunting the player." },
	{ value: 7, label: "Alarm-Spawn", desc: "As Alarm, but if no mob is found, one is loaded. " },
];

function Kspawn(props: { opened: boolean, kspawn: KspawnData | null }) {
	const dispatch = useAppDispatch();
	const kspawn: KspawnData = props.kspawn || { condition: 1, command: 1, mobVnum: -1, roomVnum: -1, text: "", _error: {} };

	const onEnabled = () => dispatch(toggleKspawn(true));
	const onDisabled = () => dispatch(toggleKspawn(false));

	function onUpdateCondition(condition: number) {
		dispatch(updatedKspawn({...kspawn, condition}));
	}
	function onUpdateCommand(command: number) {
		dispatch(updatedKspawn({...kspawn, command}));
	}
	function onUpdateMobVnum(mobVnum: number) {
		dispatch(updatedKspawn({...kspawn, mobVnum}));
	}
	function onUpdateRoomVnum(roomVnum: number) {
		dispatch(updatedKspawn({...kspawn, roomVnum}));
	}
	function onUpdateText(text: string) {
		dispatch(updatedKspawn({...kspawn, text}));
	}

	return (
		<ToggleContainer section opened={props.opened} label="K-Spawn" onEnabled={onEnabled} onDisabled={onDisabled}>
			<ToolRow>
				<SelectField name="Condition" value={kspawn.condition} options={KSPAWN_CONDITION} defaultValue={KSPAWN_CONDITION[0]} onUpdate={onUpdateCondition} />
				<SelectField name="Command" value={kspawn.command} options={KSPAWN_COMMAND} defaultValue={KSPAWN_COMMAND[1]} onUpdate={onUpdateCommand} />
				<NumberField name="Mob Vnum" value={kspawn.mobVnum} min={1} onUpdate={onUpdateMobVnum} />
				<NumberField name="Room Vnum" value={kspawn.roomVnum} min={-1} onUpdate={onUpdateRoomVnum} />
			</ToolRow>
			<TextArea name="Text" value={kspawn.text} onUpdate={onUpdateText} />
		</ToggleContainer>
	);
}

function Modifier(props: { opened: boolean, modifier: ModifierData | null }) {
	const dispatch = useAppDispatch();
	const modifier: ModifierData = props.modifier || { xpGain: 0, hpRegen: 0, manaRegen: 0, moveRegen: 0, statloss: 0, respawnRoom: 0, tbd1: 0, tbd2: 0, _error: {} };

	const onEnabled = () => dispatch(toggleModifier(true));
	const onDisabled = () => dispatch(toggleModifier(false));

	return (
		<ToggleContainer section opened={props.opened} label="Modifiers" onEnabled={onEnabled} onDisabled={onDisabled}>
			<ToolRow>
				<NumberField name="XP Gain" value={modifier.xpGain} onUpdate={xpGain => dispatch(updatedModifier({...modifier, xpGain}))} />
				<NumberField name="HP Regen" value={modifier.hpRegen} onUpdate={hpRegen => dispatch(updatedModifier({...modifier, hpRegen}))} />
				<NumberField name="Mana Regen" value={modifier.manaRegen} onUpdate={manaRegen => dispatch(updatedModifier({...modifier, manaRegen}))} />
				<NumberField name="Move Regen" value={modifier.moveRegen} onUpdate={moveRegen => dispatch(updatedModifier({...modifier, moveRegen}))} />
				<NumberField name="Statloss" value={modifier.statloss} onUpdate={statloss => dispatch(updatedModifier({...modifier, statloss}))} />
				<NumberField name="Respawn Room" value={modifier.respawnRoom} min={0} onUpdate={respawnRoom => dispatch(updatedModifier({...modifier, respawnRoom}))} />
			</ToolRow>
		</ToggleContainer>
	);
}

function GroupSize(props: { opened: boolean, groupSize: GroupSizeData | null }) {
	const dispatch = useAppDispatch();
	const groupSize: GroupSizeData = props.groupSize || { pct0: 0, num1: 0, pct1: 0, num2: 0, pct2: 0, pct3: 0, div: 0, tbd: 0, _error: {} };


	const onEnabled = () => dispatch(toggleGroupSize(true));
	const onDisabled = () => dispatch(toggleGroupSize(false));

	function onUpdatePct0(pct0: number) {
		dispatch(updatedGroupSize({...groupSize, pct0}));
	}
	function onUpdateNum1(num1: number) {
		dispatch(updatedGroupSize({...groupSize, num1}));
	}
	function onUpdatePct1(pct1: number) {
		dispatch(updatedGroupSize({...groupSize, pct1}));
	}
	function onUpdateNum2(num2: number) {
		dispatch(updatedGroupSize({...groupSize, num2}));
	}
	function onUpdatePct2(pct2: number) {
		dispatch(updatedGroupSize({...groupSize, pct2}));
	}
	function onUpdatePct3(pct3: number) {
		dispatch(updatedGroupSize({...groupSize, pct3}));
	}
	function onUpdateDiv(div: number) {
		dispatch(updatedGroupSize({...groupSize, div}));
	}

	return (
		<ToggleContainer section opened={props.opened} label="XP Curve" onEnabled={onEnabled} onDisabled={onDisabled}>
			<ToolRow>
				<NumberField name="Pct0" value={groupSize.pct0} onUpdate={onUpdatePct0} />
				<NumberField name="Num1" value={groupSize.num1} onUpdate={onUpdateNum1} />
				<NumberField name="Pct1" value={groupSize.pct1} onUpdate={onUpdatePct1} />
				<NumberField name="Num2" value={groupSize.num2} onUpdate={onUpdateNum2} />
				<NumberField name="Pct2" value={groupSize.pct2} onUpdate={onUpdatePct2} />
				<NumberField name="Pct3" value={groupSize.pct3} onUpdate={onUpdatePct3} />
				<NumberField name="Div" value={groupSize.div} onUpdate={onUpdateDiv} />
			</ToolRow>
		</ToggleContainer>
	);
}

function Scaling(props: { opened: boolean, scaling: ScalingData | null }) {
	const dispatch = useAppDispatch();
	const scaling: ScalingData = props.scaling || { maxGroupPower: 490, maxGroupToughness: 180000, _error: {} };

	const onEnabled = () => dispatch(toggleScaling(true));
	const onDisabled = () => dispatch(toggleScaling(false));

	function onUpdateMaxGroupPower(maxGroupPower: number) {
		dispatch(updatedScaling({...scaling, maxGroupPower}));
	}
	function onUpdateMaxGroupToughness(maxGroupToughness: number) {
		dispatch(updatedScaling({...scaling, maxGroupToughness}));
	}

	return (
		<ToggleContainer section opened={props.opened} label="Dynamic Scaling" onEnabled={onEnabled} onDisabled={onDisabled}>
			<ToolRow>
				<NumberField name="Max Group Power" value={scaling.maxGroupPower} onUpdate={onUpdateMaxGroupPower} />
				<NumberField name="Max Group Toughness" value={scaling.maxGroupToughness} onUpdate={onUpdateMaxGroupToughness} />
			</ToolRow>
		</ToggleContainer>
	);
}
