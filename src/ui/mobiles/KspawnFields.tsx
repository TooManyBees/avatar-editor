import React from "react";
import { Kspawn } from "../../app/models";
import { useAppDispatch } from "../../app/hooks";
import {
	addedKspawn,
	updatedKspawn,
	removedKspawn,
} from "../../app/store/mobiles";
import {
	SelectField,
	BitsField,
	NumberField,
	Row,
	TextArea,
	ToggleContainer,
	ToolRow,
} from "../components";

interface Props {
	mobId: string;
	kspawn: Kspawn | null;
}

export default function KspawnFields(props: Props) {
	const dispatch = useAppDispatch();
	const { mobId, kspawn } = props;
	const textAreaName = kspawn && kspawn.spawnType.includes(128) ? "KS trigger command" : "Room message"
	return (
		<ToggleContainer
			opened={!!kspawn}
			label="K-Spawn"
			onEnabled={() => dispatch(addedKspawn(mobId))}
			onDisabled={() => dispatch(removedKspawn(mobId))}
		>
			{kspawn && <>
				<ToolRow>
					<SelectField name="Condition" value={kspawn.condition} options={KSPAWN_CONDITION} defaultValue={KSPAWN_CONDITION[0]} onUpdate={condition => dispatch(updatedKspawn([mobId, {...kspawn, condition}]))} />
					<NumberField name="Spawn VNUM" inline value={kspawn.spawnVnum} min={-1} onUpdate={spawnVnum => dispatch(updatedKspawn([mobId, {...kspawn, spawnVnum}]))} />
					<NumberField name="Room VNUM" inline value={kspawn.roomVnum} min={-1} onUpdate={roomVnum => dispatch(updatedKspawn([mobId, {...kspawn, roomVnum}]))} />
				</ToolRow>
				<Row>
					<BitsField name="Type" value={kspawn.spawnType} map={KSPAWN_TYPE} onUpdate={spawnType => dispatch(updatedKspawn([mobId, {...kspawn, spawnType}]))} />
				</Row>
				<TextArea name={textAreaName} value={kspawn.message} onUpdate={message => dispatch(updatedKspawn([mobId, {...kspawn, message}]))} />
			</>}
		</ToggleContainer>
	);
}

const KSPAWN_CONDITION: { value: number, label: string, desc: string }[] = [
	{ value: 1, label: "Death", desc: "When the mob dies, the spawn is invoked" },
	{ value: 2, label: "Clear", desc: "When the mob dies and the room is empty, the spawn is invoked" },
	{ value: 3, label: "Genocide", desc: "When the mob dies and no other mobs with the same VNUM exist, the spawn is invoked" },
	{ value: 4, label: "Massacre", desc: "When the mob dies and no other mobs with massacre-type spawn exist in the area, the spawn is invoked" },
];

const KSPAWN_TYPE: [number, string, string, ((bits: number[]) => boolean)?][] = [
	[
		1,
		"Load mobile",
		"a mob specified with <spawn-vnum#> is loaded.",
	],
	[
		2,
		"Load object",
		"an object specified with <spawn-vnum#> is loaded on the ground.",
	],
	[
		4,
		"Equip object",
		"If a mob and object specified with <spawn-vnum#> is loaded (with 1 and 2), the mob attempts to wear object. Depending on object and mob's alignment, object might zap and fall to the ground. The object must also have a wear location set.",
		(bits: number[]) => bits.includes(1) && bits.includes(2),
	],
	[
		8,
		"Hunt killer",
		"If a mob with <spawn-vnum#> is successfully loaded (with 1), it is set to hunt killer.",
		(bits: number[]) => bits.includes(1),
	],
	[
		16,
		"Give object",
		"If an object with <spawn-vnum#> is successfully loaded (with 2), the object is given to killer.",
		(bits: number[]) => bits.includes(2),
	],
	[
		32,
		"Bind object",
		"If an object with <spawn-vnum#> is successfully loaded (with 2), the object is bound to killer.",
		(bits: number[]) => bits.includes(2),
	],
	[64, "KS trigger", "send the <death message> to the room and execute a mobprog check for the \"KS\" mobprog option on a mob with <spawn-vnum#>."],
	[128, "KS with argument", "No death message is played to the room. Instead, the death message field is used as a text parameter for the mobprog C command = \"msg\". This allows a mob to react to diferent K-Spawns. Again, a mobprog check for the \"KS\" option on the mob with <spawn-vnum#> is done."]
];
