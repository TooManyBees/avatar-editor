import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import TabsNav from "./tabs-nav";
import { BitsField, NumberField, SelectField, TextArea, TextField } from "../fields";

export default function AreaTab() {
	const dispatch = useAppDispatch();
	const area = useAppSelector(state => state.area.area);
	const areadata = useAppSelector(state => state.area.areadata);

	return (
		<div>
			<TabsNav />

			<div>
				<TextField name="Author" value={area.author} />
				<TextField name="Name" value={area.name} />
				<TextField name="Level Range" value={""} />

				<h2>Vnum Range</h2>
				<NumberField name="Min" value={areadata.vnumRange?.min || null} />
				<NumberField name="Max" value={areadata.vnumRange?.max || null} />

				<h2>Plane</h2>
				<NumberField name="Plane" value={areadata.plane?.plane || null} min={1} />
				<NumberField name="Zone" value={areadata.plane?.zone || null} min={1} />

				<h2>Outlaw</h2>
				<NumberField name="Dump Room Vnum" value={areadata.outlaw?.dumpVnum || -1} min={-1} />
				<NumberField name="Jail Vnum" value={areadata.outlaw?.jailVnum || -1} min={-1} />
				<NumberField name="Death Row Vnum" value={areadata.outlaw?.deathVnum || -1} min={-1} />
				<NumberField name="Executioner Vnum" value={areadata.outlaw?.execVnum || -1} min={-1} />
				<NumberField name="Justice Factor" value={areadata.outlaw?.justice || -1} min={-1} />

				<h2>K-Spawn</h2>
				<SelectField name="Condition" value={areadata.kspawn?.condition} map={KSPAWN_CONDITION} />
				<SelectField name="Command" value={areadata.kspawn?.command} map={KSPAWN_COMMAND} />
				<NumberField name="Mob Vnum" value={areadata.kspawn?.mobVnum || null } min={1} />
				<NumberField name="Room Vnum" value={areadata.kspawn?.mobVnum || -1 } min={-1} />
				<TextArea name="Text" value={areadata.kspawn?.text || ""} />

				<h2>Modifiers</h2>
				<NumberField name="XP Gain" value={areadata.modifier?.xpGain || null} />
				<NumberField name="HP Regen" value={areadata.modifier?.hpRegen || null} />
				<NumberField name="Mana Regen" value={areadata.modifier?.manaRegen || null} />
				<NumberField name="Move Regen" value={areadata.modifier?.moveRegen || null} />
				<NumberField name="Statloss" value={areadata.modifier?.statloss || 0} />
				<NumberField name="Respawn Room" value={areadata.modifier?.respawnRoom || 0} min={0} />

				<h2>Group Size</h2>
				<NumberField name="Pct0" value={areadata.groupSize?.pct0 || 0} />
				<NumberField name="Num1" value={areadata.groupSize?.num1 || 0} />
				<NumberField name="Pct1" value={areadata.groupSize?.pct1 || 0} />
				<NumberField name="Num2" value={areadata.groupSize?.num2 || 0} />
				<NumberField name="Pct2" value={areadata.groupSize?.pct2 || 0} />
				<NumberField name="Pct3" value={areadata.groupSize?.pct3 || 0} />
				<NumberField name="Div" value={areadata.groupSize?.div || 0} />

				<h2>Dynamic Scaling</h2>
				<NumberField name="Max Group Power" value={areadata.scaling?.maxGroupPower || 490} />
				<NumberField name="Max Group Toughness" value={areadata.scaling?.maxGroupToughness || 180000} />

			</div>
		</div>
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
