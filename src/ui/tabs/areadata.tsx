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
} from "../../app/store/areadata";
import TabsLayout from "./tabs-layout";
import { NumberField, SelectField, TextField } from "../fields";
import { BitsFieldN } from "../components/BitsField";
import TextArea from "../components/TextArea";
import ToggleContainer from "../components/ToggleContainer";

export default function AreadataTab() {
	const dispatch = useAppDispatch();
	const areadata = useAppSelector(state => state.areadata);

	return (
		<TabsLayout>
			<VnumRange vnumRange={areadata.vnumRange} />
			<AreaFlags flags={areadata.flags} />
			<Plane plane={areadata.plane} />
			<Outlaw outlaw={areadata.outlaw} />
			<Kspawn kspawn={areadata.kspawn} />
			<Modifier modifier={areadata.modifier} />
			<GroupSize groupSize={areadata.groupSize} />
			<Scaling scaling={areadata.scaling} />
		</TabsLayout>
	);
}

function VnumRange(props: { vnumRange: VnumRangeData | null }) {
	const dispatch = useAppDispatch();
	const opened = !!props.vnumRange;
	const vnumRange: VnumRangeData = props.vnumRange || { min: 0, max: 0, _error: {} };
	const [min, setMin] = useState(vnumRange.min);
	const [max, setMax] = useState(vnumRange.max);

	const onEnabled = () => dispatch(updatedVnumRange({ ...vnumRange, min, max }));
	const onDisabled = () => dispatch(updatedVnumRange(null));

	function onUpdateMin(min: number) {
		setMin(min);
		dispatch(updatedVnumRange({min, max, _error: {}}))
	}
	function onUpdateMax(max: number) {
		setMax(max);
		dispatch(updatedVnumRange({min, max, _error: {}}));
	}

	return (
		<ToggleContainer opened={opened} label="Vnum Range" onEnabled={onEnabled} onDisabled={onDisabled}>
			<NumberField name="Min" value={min} onUpdate={onUpdateMin} />
			<NumberField name="Max" value={max} onUpdate={onUpdateMax} />
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

function AreaFlags(props: { flags: FlagsData | null }) {
	const dispatch = useAppDispatch();
	const opened = !!props.flags;
	const [flags, setFlags] = useState(props.flags?.flags || []);

	function onEnabled() {
		dispatch(updatedFlags({ flags, _error: {} }));
	}
	function onDisabled() {
		dispatch(updatedFlags(null));
	}
	function onUpdate(flags: number[]) {
		setFlags(flags);
		dispatch(updatedFlags({ flags, _error: {} }))
	}

	return (
		<ToggleContainer opened={opened} label="Area Flags" onEnabled={onEnabled} onDisabled={onDisabled}>
			<BitsFieldN map={AREA_FLAGS} value={flags} onUpdate={onUpdate} />
		</ToggleContainer>
	);
}

function Plane(props: { plane: PlaneData | null }) {
	const dispatch = useAppDispatch();
	const opened = !!props.plane;
	const planeData: PlaneData = props.plane || { plane: 1, zone: null, _error: {} };
	const [plane, setPlane] = useState(planeData.plane);
	const [zone, setZone] = useState(planeData.zone);

	const onEnabled = () => dispatch(updatedPlane({...planeData, plane, zone }));
	const onDisabled = () => dispatch(updatedPlane(null));
	function onUpdatePlane(plane: number) {
		setPlane(plane);
		dispatch(updatedPlane({...planeData, plane, zone}))
	}
	function onUpdateZone(zone: number) {
		setZone(zone);
		dispatch(updatedPlane({...planeData, plane, zone}));
	}

	return (
		<ToggleContainer opened={opened} label="Plane" onEnabled={onEnabled} onDisabled={onDisabled}>
			<NumberField name="Plane" value={plane} min={1} onUpdate={onUpdatePlane} />
			<NumberField name="Zone" value={zone} min={1} onUpdate={onUpdateZone} />
		</ToggleContainer>
	);
}

function Outlaw(props: { outlaw: OutlawData | null }) {
	const dispatch = useAppDispatch();
	const opened = !!props.outlaw;
	const outlaw: OutlawData = props.outlaw || { dumpVnum: -1, jailVnum: -1, deathVnum: -1, execVnum: -1, justice: -1, _error: {} };
	const [dumpVnum, setDumpVnum] = useState(outlaw.dumpVnum);
	const [jailVnum, setJailVnum] = useState(outlaw.jailVnum);
	const [deathVnum, setDeathVnum] = useState(outlaw.deathVnum);
	const [execVnum, setExecVnum] = useState(outlaw.execVnum);
	const [justice, setJustice] = useState(outlaw.justice);

	const onEnabled = () => dispatch(updatedOutlaw({...outlaw, dumpVnum, jailVnum, deathVnum, execVnum, justice}));
	const onDisabled = () => dispatch(updatedOutlaw(null));

	function onUpdateDumpVnum(dumpVnum: number) {
		setDumpVnum(dumpVnum);
		dispatch(updatedOutlaw({...outlaw, dumpVnum, jailVnum, deathVnum, execVnum, justice}));
	}
	function onUpdateJailVnum(jailVnum: number) {
		setJailVnum(jailVnum);
		dispatch(updatedOutlaw({...outlaw, dumpVnum, jailVnum, deathVnum, execVnum, justice}));
	}
	function onUpdateDeathVnum(deathVnum: number) {
		setDeathVnum(deathVnum);
		dispatch(updatedOutlaw({...outlaw, dumpVnum, jailVnum, deathVnum, execVnum, justice}));
	}
	function onUpdateExecVnum(execVnum: number) {
		setExecVnum(execVnum);
		dispatch(updatedOutlaw({...outlaw, dumpVnum, jailVnum, deathVnum, execVnum, justice}));
	}
	function onUpdateJustice(justice: number) {
		setJustice(justice);
		dispatch(updatedOutlaw({...outlaw, dumpVnum, jailVnum, deathVnum, execVnum, justice}));
	}

	return (
		<ToggleContainer opened={opened} label="Outlaw" onEnabled={onEnabled} onDisabled={onDisabled}>
			<NumberField name="Dump Room Vnum" value={dumpVnum} min={-1} onUpdate={onUpdateDumpVnum} />
			<NumberField name="Jail Vnum" value={jailVnum} min={-1} onUpdate={onUpdateJailVnum} />
			<NumberField name="Death Row Vnum" value={deathVnum} min={-1} onUpdate={onUpdateDeathVnum} />
			<NumberField name="Executioner Vnum" value={execVnum} min={-1} onUpdate={onUpdateExecVnum} />
			<NumberField name="Justice Factor" value={justice} min={-1} onUpdate={onUpdateJustice} />
		</ToggleContainer>
	);
}

const KSPAWN_CONDITION: [number, string, string][] = [
	[1, "Planeshift", ""],
];

const KSPAWN_COMMAND: [number, string, string][] = [
	[1, "Spawn", "Loads a new mob at the room specified and sets it hunting the player."],
	[2, "Page", "The first non-hunting mob of the matching vnum is set hunting the player."],
	[3, "Page-Spawn", "As Page, but if no free mob is found, one is loaded."],
	[4, "Swarm", "All non-hunting mobs of the matching vnum are set hunting the player."],
	[5, "Swarm-Spawn", "As Swarm, but if no free mob is found, one is loaded."],
	[6, "Alarm", "All mobs of the matching vnum are set hunting the player."],
	[7, "Alarm-Spawn", "As Alarm, but if no mob is found, one is loaded. "],
];

function Kspawn(props: { kspawn: KspawnData | null }) {
	const dispatch = useAppDispatch();
	const opened = !!props.kspawn;
	const kspawn: KspawnData = props.kspawn || { condition: 1, command: 1, mobVnum: -1, roomVnum: -1, text: "", _error: {} };
	const [condition, setCondition] = useState(kspawn.condition);
	const [command, setCommand] = useState(kspawn.command);
	const [mobVnum, setMobVnum] = useState(kspawn.mobVnum);
	const [roomVnum, setRoomVnum] = useState(kspawn.roomVnum);
	const [text, setText] = useState(kspawn.text);

	const onEnabled = () => dispatch(updatedKspawn({...kspawn, condition, command, mobVnum, roomVnum, text}));
	const onDisabled = () => dispatch(updatedKspawn(null));

	function onUpdateCondition(condition: number) {
		setCondition(condition);
		dispatch(updatedKspawn({...kspawn, condition, command, mobVnum, roomVnum, text}));
	}
	function onUpdateCommand(command: number) {
		setCommand(command);
		dispatch(updatedKspawn({...kspawn, condition, command, mobVnum, roomVnum, text}));
	}
	function onUpdateMobVnum(mobVnum: number) {
		setMobVnum(mobVnum);
		dispatch(updatedKspawn({...kspawn, condition, command, mobVnum, roomVnum, text}));
	}
	function onUpdateRoomVnum(roomVnum: number) {
		setRoomVnum(roomVnum);
		dispatch(updatedKspawn({...kspawn, condition, command, mobVnum, roomVnum, text}));
	}
	function onUpdateText(text: string) {
		setText(text);
		dispatch(updatedKspawn({...kspawn, condition, command, mobVnum, roomVnum, text}));
	}

	return (
		<ToggleContainer opened={opened} label="K-Spawn" onEnabled={onEnabled} onDisabled={onDisabled}>
			<SelectField name="Condition" value={condition} map={KSPAWN_CONDITION} onUpdate={onUpdateCondition} />
			<SelectField name="Command" value={command} map={KSPAWN_COMMAND} onUpdate={onUpdateCommand} />
			<NumberField name="Mob Vnum" value={mobVnum} min={1} onUpdate={onUpdateMobVnum} />
			<NumberField name="Room Vnum" value={roomVnum} min={-1} onUpdate={onUpdateRoomVnum} />
			<TextArea name="Text" value={text} onUpdate={onUpdateText} />
		</ToggleContainer>
	);
}

function Modifier(props: { modifier: ModifierData | null }) {
	const dispatch = useAppDispatch();
	const opened = !!props.modifier;
	const modifier: ModifierData = props.modifier || { xpGain: 0, hpRegen: 0, manaRegen: 0, moveRegen: 0, statloss: 0, respawnRoom: 0, tbd1: 0, tbd2: 0, _error: {} };
	const [xpGain, setXpGain] = useState(modifier.xpGain);
	const [hpRegen, setHpRegen] = useState(modifier.hpRegen);
	const [manaRegen, setManaRegen] = useState(modifier.manaRegen);
	const [moveRegen, setMoveRegen] = useState(modifier.moveRegen);
	const [statloss, setStatloss] = useState(modifier.statloss);
	const [respawnRoom, setRespawnRoom] = useState(modifier.respawnRoom);

	const onEnabled = () => dispatch(updatedModifier({...modifier, xpGain, hpRegen, manaRegen, moveRegen, statloss, respawnRoom}));
	const onDisabled = () => dispatch(updatedModifier(null));

	return (
		<ToggleContainer opened={opened} label="Modifiers" onEnabled={onEnabled} onDisabled={onDisabled}>
			<NumberField name="XP Gain" value={xpGain} onUpdate={xpGain => dispatch(updatedModifier({...modifier, xpGain, hpRegen, manaRegen, moveRegen, statloss, respawnRoom}))} />
			<NumberField name="HP Regen" value={hpRegen} onUpdate={hpRegen => dispatch(updatedModifier({...modifier, xpGain, hpRegen, manaRegen, moveRegen, statloss, respawnRoom}))} />
			<NumberField name="Mana Regen" value={manaRegen} onUpdate={manaRegen => dispatch(updatedModifier({...modifier, xpGain, hpRegen, manaRegen, moveRegen, statloss, respawnRoom}))} />
			<NumberField name="Move Regen" value={moveRegen} onUpdate={moveRegen => dispatch(updatedModifier({...modifier, xpGain, hpRegen, manaRegen, moveRegen, statloss, respawnRoom}))} />
			<NumberField name="Statloss" value={statloss} onUpdate={statloss => dispatch(updatedModifier({...modifier, xpGain, hpRegen, manaRegen, moveRegen, statloss, respawnRoom}))} />
			<NumberField name="Respawn Room" value={respawnRoom} min={0} onUpdate={respawnRoom => dispatch(updatedModifier({...modifier, xpGain, hpRegen, manaRegen, moveRegen, statloss, respawnRoom}))} />
		</ToggleContainer>
	);
}

function GroupSize(props: { groupSize: GroupSizeData | null }) {
	const dispatch = useAppDispatch();
	const opened = !!props.groupSize;
	const groupSize: GroupSizeData = props.groupSize || { pct0: 0, num1: 0, pct1: 0, num2: 0, pct2: 0, pct3: 0, div: 0, tbd: 0, _error: {} };
	const [pct0, setPct0] = useState(groupSize.pct0);
	const [num1, setNum1] = useState(groupSize.num1);
	const [pct1, setPct1] = useState(groupSize.pct1);
	const [num2, setNum2] = useState(groupSize.num2);
	const [pct2, setPct2] = useState(groupSize.pct2);
	const [pct3, setPct3] = useState(groupSize.pct3);
	const [div, setDiv] = useState(groupSize.div);

	const onEnabled = () => dispatch(updatedGroupSize({...groupSize, pct0, num1, pct1, num2, pct2, pct3, div}));
	const onDisabled = () => dispatch(updatedGroupSize(null));

	function onUpdatePct0(pct0: number) {
		setPct0(pct0);
		dispatch(updatedGroupSize({...groupSize, pct0, num1, pct1, num2, pct2, pct3, div}));
	}
	function onUpdateNum1(num1: number) {
		setNum1(num1);
		dispatch(updatedGroupSize({...groupSize, pct0, num1, pct1, num2, pct2, pct3, div}));
	}
	function onUpdatePct1(pct1: number) {
		setPct1(pct1);
		dispatch(updatedGroupSize({...groupSize, pct0, num1, pct1, num2, pct2, pct3, div}));
	}
	function onUpdateNum2(num2: number) {
		setNum2(num2);
		dispatch(updatedGroupSize({...groupSize, pct0, num1, pct1, num2, pct2, pct3, div}));
	}
	function onUpdatePct2(pct2: number) {
		setPct2(pct2);
		dispatch(updatedGroupSize({...groupSize, pct0, num1, pct1, num2, pct2, pct3, div}));
	}
	function onUpdatePct3(pct3: number) {
		setPct3(pct3);
		dispatch(updatedGroupSize({...groupSize, pct0, num1, pct1, num2, pct2, pct3, div}));
	}
	function onUpdateDiv(div: number) {
		setDiv(div);
		dispatch(updatedGroupSize({...groupSize, pct0, num1, pct1, num2, pct2, pct3, div}));
	}

	return (
		<ToggleContainer opened={opened} label="XP Curve" onEnabled={onEnabled} onDisabled={onDisabled}>
			<NumberField name="Pct0" value={pct0} onUpdate={onUpdatePct0} />
			<NumberField name="Num1" value={num1} onUpdate={onUpdateNum1} />
			<NumberField name="Pct1" value={pct1} onUpdate={onUpdatePct1} />
			<NumberField name="Num2" value={num2} onUpdate={onUpdateNum2} />
			<NumberField name="Pct2" value={pct2} onUpdate={onUpdatePct2} />
			<NumberField name="Pct3" value={pct3} onUpdate={onUpdatePct3} />
			<NumberField name="Div" value={div} onUpdate={onUpdateDiv} />
		</ToggleContainer>
	);
}

function Scaling(props: { scaling: ScalingData | null }) {
	const dispatch = useAppDispatch();
	const opened = !!props.scaling;
	const scaling: ScalingData = props.scaling || { maxGroupPower: 490, maxGroupToughness: 180000, _error: {} };
	const [maxGroupPower, setMaxGroupPower] = useState(scaling.maxGroupPower);
	const [maxGroupToughness, setMaxGroupToughness] = useState(scaling.maxGroupToughness);

	const onEnabled = () => dispatch(updatedScaling({...scaling, maxGroupPower, maxGroupToughness}));
	const onDisabled = () => dispatch(updatedScaling(null));

	function onUpdateMaxGroupPower(maxGroupPower: number) {
		setMaxGroupPower(maxGroupPower);
		dispatch(updatedScaling({...scaling, maxGroupPower, maxGroupToughness}));
	}
	function onUpdateMaxGroupToughness(maxGroupToughness: number) {
		setMaxGroupToughness(maxGroupToughness);
		dispatch(updatedScaling({...scaling, maxGroupPower, maxGroupToughness}));
	}

	return (
		<ToggleContainer opened={opened} label="Dynamic Scaling" onEnabled={onEnabled} onDisabled={onDisabled}>
			<NumberField name="Max Group Power" value={maxGroupPower} onUpdate={onUpdateMaxGroupPower} />
			<NumberField name="Max Group Toughness" value={maxGroupToughness} onUpdate={onUpdateMaxGroupToughness} />
		</ToggleContainer>
	);
}
