import React from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import { useAppDispatch } from "../../app/hooks";
import { NumberField, SelectField } from "../fields";
import BitsField from "./BitsField";
import { ToolRow } from "./shared";
import styles from "./ApplyFields.module.css";

interface Props {
	id: string;
	applies: [number, number][];
	updatedApply: ActionCreatorWithPayload<[string, number, [number, number]], string>;
	addedApply: ActionCreatorWithPayload<string, string>;
	removedApply: ActionCreatorWithPayload<[string, number], string>;
}

export default function ApplyFields({ applies, id, updatedApply, addedApply, removedApply }: Props) {
	const dispatch = useAppDispatch();

	const onUpdate = (n: number, p: [number, number]) => dispatch(updatedApply([id, n, p]));

	return <>
		<ToolRow>
			<h2>Applies</h2>
			({applies.length})
			<button onClick={() => dispatch(addedApply(id))}>Add apply</button>
		</ToolRow>
		<ol className={styles.applyFields}>
			{applies.map(([type, value], n) => (
				<li key={value * 1000000 + type * 10000 + n}>
					<SelectField name="Type" value={type} map={APPLY_TYPE} onUpdate={(t: number) => onUpdate(n, [t, value])} />
					<ApplyFlagField type={type} value={value} onUpdate={(v: number) => onUpdate(n, [type, v])} />
					<button onClick={() => dispatch(removedApply([id, n]))}>Remove</button>
					<p>{APPLY_TYPE.find(a => a[0] === type)?.[2]}</p>
				</li>
			))}
		</ol>
	</>;
}

// FIXME
function factor(n: number): number[] {
	let factors: number[] = [];
	for (let power = 0; power < 32; power++) {
		if ((n & 1<<power) > 0) {
			factors.push(1<<power);
		}
	}
	return factors;
}

interface ApplyFlagProps {
	type: number;
	value: number;
	onUpdate: (n: number) => void;
}

function ApplyFlagField({ type, value, onUpdate }: ApplyFlagProps) {
	switch (type) {
		case 25:
		case 26:
		case 27:
		case 28:
		case 29:
		case 30:
		case 31:
		case 32:
		case 33:
		case 34:
		case 35:
		case 36:
		case 37:
		case 38:
		case 39:
		case 40:
		case 41:
		case 42:
		case 43:
		case 44:
			return null; // FIXME: toggle switch
		case 50:
			return <BitsField name="Value" value={factor(value)} map={IMMUNITY_FLAGS} onUpdate={(bs: number[]) => onUpdate(bs.reduce((a, b) => a + b, 0))} />;
		case 93:
			return <SelectField name="Value" value={value} map={DAMAGE_TYPE} onUpdate={onUpdate} />;
		case 94:
			return <SelectField name="Value" value={value} map={OPEN_HAND_DAMAGE_TYPE} onUpdate={onUpdate} />;
		default:
			return <NumberField name="Value" value={value} onUpdate={onUpdate} />;
	}
}


const APPLY_TYPE: [number, string, string][] = [
	[1, "Strength", ""],
	[2, "Dexterity", ""],
	[3, "Intelligence", ""],
	[4, "Wisdom", ""],
	[5, "Constitution", ""],
	[6, "Sex", "Has no effect."],
	[7, "Class", "Has no effect."],
	[8, "Level", "Has no effect."],
	[9, "Age", "Has no effect."],
	[10, "Height", "Has no effect."],
	[11, "Weight", "Has no effect."],
	[12, "Mana", ""],
	[13, "Hitpoints", "Max range is [-32,768, +32,767]. Use multiple applies to exceed it."],
	[14, "Move", ""],
	[15, "Gold", "Has no effect."],
	[16, "Experiance", "Has no effect."],
	[17, "AC", ""],
	[18, "Hitroll", ""],
	[19, "Damroll", ""],
	[20, "Save vs Spell", ""],
	[21, "Save vs Spell", ""],
	[22, "Save vs Spell", ""],
	[23, "Save vs Spell", ""],
	[24, "Save vs Spell", ""],
	[25, "Sanctuary", ""],
	[26, "Flying", ""],
	[27, "Blind", ""],
	[28, "Invisible", ""],
	[29, "Detect Evil", ""],
	[30, "Detect Invis", ""],
	[31, "Detect Magic", ""],
	[32, "Detect Hidden", ""],
	[33, "Faerie Fire", ""],
	[34, "Infrared", ""],
	[35, "Curse", ""],
	[36, "Poison", ""],
	[37, "Protect", ""],
	[38, "Sneak", ""],
	[39, "Hide", ""],
	[40, "Pass Door", ""],
	[41, "Plague", ""],
	[42, "Endurance", "Has no effect, and blocks the endurance spell."],
	[43, "Detect Alignment", ""],
	[44, "Protection Good", ""],
	// [45, "Xp Gain", ""],
	// [46, "Hp Regen", ""],
	// [47, "Mana Regen", ""],
	// [48, "Move Regen", ""],
	// [49, "Secret", ""],
	[50, "Immunity", "Items with this apply must not be obtainable by mortals."],
	[51, "Kinetic Damroll", ""],
	[52, "Xp Gain Modifier", ""],
	[53, "Hp Regen Modifier", ""],
	[54, "Mana Regen Modifier", ""],
	[55, "Move Regen Modifier", ""],

	[63, "Resist Cold", "On objects, apply to: legs, feet, hands. Max 5% at Hero, max 10% at Lord."],
	[64, "Resist Stasis", "On objects, apply to: weapon, shield, held. Max 5% at Hero, max 10% at Lord."],
	[65, "Resist Biological", "On objects, apply to: held. Max 5% at Hero, max 10% at Lord."],
	[66, "Resist Sonic", "On objects, apply to: head, held. Max 5% at Hero, max 10% at Lord."],
	[67, "Resist Pressure", "On objects, apply to: held. Max 5% at Hero, max 10% at Lord."],
	[68, "Resist Radiant", "On objects, apply to: held. Max 5% at Hero, max 10% at Lord."],
	[69, "Resist Electric", "On objects, apply to: feet (rubber-like), hands, held. Max 5% at Hero, max 10% at Lord."],
	[70, "Resist Leeching", "On objects, apply to: weapon, shield. Max 5% at Hero, max 10% at Lord."],
	[71, "Resist Poison", "On objects, apply to: weapon, shield, hands. Max 5% at Hero, max 10% at Lord."],
	[72, "Resist Chemical", "On objects, apply to: weapon, shield, held. Max 5% at Hero, max 10% at Lord."],
	[73, "Resist Mental", "On objects, apply to: head, hands, held. Max 5% at Hero, max 10% at Lord."],
	[74, "Resist Arcane", "On objects, apply to: hands, shield, held. Max 5% at Hero, max 10% at Lord."],
	[75, "Resist Divine", "On objects, apply to: hands, shield, held. Max 5% at Hero, max 10% at Lord."],
	[78, "Resist Cursed", "On objects, apply to: hands, shield, held. Max 5% at Hero, max 10% at Lord."],
	[79, "Resist Fire", "On objects, apply to: weapon, shield, held. Max 5% at Hero, max 10% at Lord."],
	[80, "Resist Mind Control", "On objects, apply to: head, held, hands. Max 5% at Hero, max 10% at Lord."],
	[84, "Resist Air", "On objects, apply to: feet, shield, held. Max 5% at Hero, max 10% at Lord."],
	[85, "Resist Earth", "On objects, apply to: weapon, shield, held. Max 5% at Hero, max 10% at Lord."],
	[86, "Resist Water", "On objects, apply to: waist, legs, feet. Max 5% at Hero, max 10% at Lord."],
	[76, "Resist Falling", "Subject to change and should not be used."],
	[77, "Resist Portal", "Subject to change and should not be used."],
	[81, "Resist Polymorph", "Subject to change and should not be used."],
	[82, "Resist Antimagic", "Subject to change and should not be used."],
	[83, "Resist Natural", "Subject to change and should not be used."],
	[87, "Resist Piercing", "Unavailable pending a further code project."],
	[88, "Resist Slicing", "Unavailable pending a further code project."],
	[89, "Resist Chopping", "Unavailable pending a further code project."],
	[90, "Resist Blunt", "Unavailable pending a further code project."],
	[91, "Resist Whipping", "Unavailable pending a further code project."],
	[92, "Resist Blasting", "Unavailable pending a further code project."],
	[93, "Damage type", ""],
	[94, "Open hand damage type", ""],
	[95, "Sneakiness", ""],

	[100, "Spell Cost", "Chance to halve spell cost. Do not apply this to sub-Lord objects."],
	[101, "Spell Level", "Chance to increase spell level. Do not apply this to sub-Lord objects."],
	[102, "Spell Fail", "Chance to negate cast failure. Do not apply this to sub-Lord objects."],
	[103, "Spell Lag", "Chance to halve spell lag. Do not apply this to sub-Lord objects."],
	[110, "Arcane Spell Cost", "Chance to halve arcane spell cost. Do not apply this to sub-Lord objects."],
	[111, "Arcane Spell Level", "Chance to increase arcane spell level. Do not apply this to sub-Lord objects."],
	[112, "Arcane Spell Fail", "Chance to negate arcane cast failure. Do not apply this to sub-Lord objects."],
	[113, "Arcane Spell Lag", "Chance to halve arcane spell lag. Do not apply this to sub-Lord objects."],
	[120, "Divine Spell Cost", "Chance to halve divine spell cost. Do not apply this to sub-Lord objects."],
	[121, "Divine Spell Level", "Chance to increase divine spell level. Do not apply this to sub-Lord objects."],
	[122, "Divine Spell Fail", "Chance to negate divine cast failure. Do not apply this to sub-Lord objects."],
	[123, "Divine Spell Lag", "Chance to halve divine spell lag. Do not apply this to sub-Lord objects."],
	[130, "Psionic Spell Cost", "Chance to halve psionic spell cost. Do not apply this to sub-Lord objects."],
	[131, "Psionic Spell Level", "Chance to increase psionic spell level. Do not apply this to sub-Lord objects."],
	[132, "Psionic Spell Fail", "Chance to negate psionic cast failure. Do not apply this to sub-Lord objects."],
	[133, "Psionic Spell Lag", "Chance to halve psionic spell lag. Do not apply this to sub-Lord objects."],
];

const IMMUNITY_FLAGS: [number, string, string][] = [
	[1, "Area Spells", ""],
	[2, "Poisons", ""],
	[4, "Diseases", ""],
	[8, "Falling", ""],
	[16, "Arrows", ""],
	[32, "Blunt weapons", ""],
	[64, "Sharp weapons", ""],
	[128, "Unarmed attacks", ""],
	[256, "Sneak attacks", ""],
	[512, "Being blinded", ""],
];

const DAMAGE_TYPE: [number, string, string][] = [
	[2, "Cold", ""],
	[3, "Stasis", ""],
	[4, "Biological", ""],
	[5, "Sonic", ""],
	[6, "Pressure", ""],
	[7, "Radiant", ""],
	[8, "Electric", ""],
	[9, "Leeching", ""],
	[10, "Poison", ""],
	[11, "Chemical", ""],
	[12, "Mental", ""],
	[13, "Arcane", ""],
	[14, "Divine", ""],
	[15, "Falling", "Subject to change and should not be used."],
	[16, "Portal", "Subject to change and should not be used."],
	[17, "Cursed", ""],
	[18, "Fire", ""],
	[19, "Mind_control", ""],
	[20, "Polymorph", "Subject to change and should not be used."],
	[21, "Antimagic", "Subject to change and should not be used."],
	[22, "Natural", "Subject to change and should not be used."],
	[23, "Air", ""],
	[24, "Earth", ""],
	[25, "Water", ""],
];

const OPEN_HAND_DAMAGE_TYPE: [number, string, string][] = [
	[0, "Piercing", ""],
	[1, "Slicing", ""],
	[2, "Chopping", ""],
	[3, "Blunt", ""],
	[4, "Whipping", ""],
	[5, "Blasting", ""],
];
