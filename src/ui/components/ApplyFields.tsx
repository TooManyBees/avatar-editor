import React, { useState } from "react";
import { ActionCreatorWithPayload } from "@reduxjs/toolkit";
import classnames from "classnames";
import { useAppDispatch } from "../../app/hooks";
import { Apply } from "../../app/models";
import { AddButton, DeleteButton, NumberField, SelectField } from "../components";
import BitsField from "./BitsField";
import { ToolRow } from "./shared";
import styles from "./ApplyFields.module.css";
import sharedStyles from "./shared.module.css";

interface Props {
	id: string;
	applies: Apply[];
	updatedApply: ActionCreatorWithPayload<[string, Apply], string>;
	addedApply: ActionCreatorWithPayload<string, string>;
	removedApply: ActionCreatorWithPayload<[string, string], string>;
}

export default function ApplyFields({ applies, id, updatedApply, addedApply, removedApply }: Props) {
	const dispatch = useAppDispatch();

	const onUpdate = (p: Apply) => dispatch(updatedApply([id, p]));

	return <>
		<ToolRow>
			<h2>Applies</h2>
			({applies.length})
			<AddButton onClick={() => dispatch(addedApply(id))}>Add apply</AddButton>
		</ToolRow>
		<ol className={styles.applyFields}>
			{applies.map(apply => (
				<ApplyItem
					key={apply.id}
					apply={apply}
					id={id}
					updatedApply={updatedApply}
					removedApply={removedApply}
				/>
			))}
		</ol>
	</>;
}

interface ApplyItemProps {
	id: string;
	apply: Apply;
	updatedApply: ActionCreatorWithPayload<[string, Apply], string>;
	removedApply: ActionCreatorWithPayload<[string, string], string>;
}

function ApplyItem({ id, apply, updatedApply, removedApply }: ApplyItemProps) {
	const dispatch = useAppDispatch();
	const [danger, setDanger] = useState(false);
	const onUpdate = (p: Apply) => dispatch(updatedApply([id, p]));
	return (
		<li className={classnames(sharedStyles.container, danger && sharedStyles.dangerTarget)}>
			<ToolRow>
			<SelectField name="Type" value={apply.type} options={APPLY_TYPE} defaultValue={APPLY_TYPE[0]} onUpdate={type => onUpdate({...apply, type})} />
			<ApplyFlagField type={apply.type} value={apply.value} onUpdate={(value: number) => onUpdate({...apply, value})} />
			<em>{APPLY_TYPE.find(a => a.value === apply.type)?.desc}</em>
			<DeleteButton onHoverState={setDanger} onClick={() => dispatch(removedApply([id, apply.id]))}>Remove</DeleteButton>
			</ToolRow>
		</li>
	);
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
			return <SelectField name="Value" value={value} options={DAMAGE_TYPE} defaultValue={DAMAGE_TYPE[0]} onUpdate={onUpdate} />;
		case 94:
			return <SelectField name="Value" value={value} options={OPEN_HAND_DAMAGE_TYPE} defaultValue={OPEN_HAND_DAMAGE_TYPE[0]} onUpdate={onUpdate} />;
		default:
			return <NumberField name="Value" value={value} onUpdate={onUpdate} />;
	}
}


const APPLY_TYPE: { value: number, label: string, desc?: string }[] = [
	{ value: 1, label: "Strength" },
	{ value: 2, label: "Dexterity" },
	{ value: 3, label: "Intelligence" },
	{ value: 4, label: "Wisdom" },
	{ value: 5, label: "Constitution" },
	{ value: 6, label: "Sex", desc: "Has no effect." },
	{ value: 7, label: "Class", desc: "Has no effect." },
	{ value: 8, label: "Level", desc: "Has no effect." },
	{ value: 9, label: "Age", desc: "Has no effect." },
	{ value: 10, label: "Height", desc: "Has no effect." },
	{ value: 11, label: "Weight", desc: "Has no effect." },
	{ value: 12, label: "Mana" },
	{ value: 13, label: "Hitpoints", desc: "Max range is [-32,768, +32,767]. Use multiple applies to exceed it." },
	{ value: 14, label: "Move" },
	{ value: 15, label: "Gold", desc: "Has no effect." },
	{ value: 16, label: "Experiance", desc: "Has no effect." },
	{ value: 17, label: "AC" },
	{ value: 18, label: "Hitroll" },
	{ value: 19, label: "Damroll" },
	{ value: 20, label: "Save vs Spell" },
	{ value: 21, label: "Save vs Spell" },
	{ value: 22, label: "Save vs Spell" },
	{ value: 23, label: "Save vs Spell" },
	{ value: 24, label: "Save vs Spell" },
	{ value: 25, label: "Sanctuary" },
	{ value: 26, label: "Flying" },
	{ value: 27, label: "Blind" },
	{ value: 28, label: "Invisible" },
	{ value: 29, label: "Detect Evil" },
	{ value: 30, label: "Detect Invis" },
	{ value: 31, label: "Detect Magic" },
	{ value: 32, label: "Detect Hidden" },
	{ value: 33, label: "Faerie Fire" },
	{ value: 34, label: "Infrared" },
	{ value: 35, label: "Curse" },
	{ value: 36, label: "Poison" },
	{ value: 37, label: "Protect" },
	{ value: 38, label: "Sneak" },
	{ value: 39, label: "Hide" },
	{ value: 40, label: "Pass Door" },
	{ value: 41, label: "Plague" },
	{ value: 42, label: "Endurance", desc: "Has no effect, and blocks the endurance spell." },
	{ value: 43, label: "Detect Alignment" },
	{ value: 44, label: "Protection Good" },
	// { value: 45, label: "Xp Gain" },
	// { value: 46, label: "Hp Regen" },
	// { value: 47, label: "Mana Regen" },
	// { value: 48, label: "Move Regen" },
	// { value: 49, label: "Secret" },
	{ value: 50, label: "Immunity", desc: "Items with this apply must not be obtainable by mortals." },
	{ value: 51, label: "Kinetic Damroll" },
	{ value: 52, label: "Xp Gain Modifier" },
	{ value: 53, label: "Hp Regen Modifier" },
	{ value: 54, label: "Mana Regen Modifier" },
	{ value: 55, label: "Move Regen Modifier" },

	{ value: 63, label: "Resist Cold", desc: "On objects, apply to: legs, feet, hands. Max 5% at Hero, max 10% at Lord." },
	{ value: 64, label: "Resist Stasis", desc: "On objects, apply to: weapon, shield, held. Max 5% at Hero, max 10% at Lord." },
	{ value: 65, label: "Resist Biological", desc: "On objects, apply to: held. Max 5% at Hero, max 10% at Lord." },
	{ value: 66, label: "Resist Sonic", desc: "On objects, apply to: head, held. Max 5% at Hero, max 10% at Lord." },
	{ value: 67, label: "Resist Pressure", desc: "On objects, apply to: held. Max 5% at Hero, max 10% at Lord." },
	{ value: 68, label: "Resist Radiant", desc: "On objects, apply to: held. Max 5% at Hero, max 10% at Lord." },
	{ value: 69, label: "Resist Electric", desc: "On objects, apply to: feet (rubber-like), hands, held. Max 5% at Hero, max 10% at Lord." },
	{ value: 70, label: "Resist Leeching", desc: "On objects, apply to: weapon, shield. Max 5% at Hero, max 10% at Lord." },
	{ value: 71, label: "Resist Poison", desc: "On objects, apply to: weapon, shield, hands. Max 5% at Hero, max 10% at Lord." },
	{ value: 72, label: "Resist Chemical", desc: "On objects, apply to: weapon, shield, held. Max 5% at Hero, max 10% at Lord." },
	{ value: 73, label: "Resist Mental", desc: "On objects, apply to: head, hands, held. Max 5% at Hero, max 10% at Lord." },
	{ value: 74, label: "Resist Arcane", desc: "On objects, apply to: hands, shield, held. Max 5% at Hero, max 10% at Lord." },
	{ value: 75, label: "Resist Divine", desc: "On objects, apply to: hands, shield, held. Max 5% at Hero, max 10% at Lord." },
	{ value: 78, label: "Resist Cursed", desc: "On objects, apply to: hands, shield, held. Max 5% at Hero, max 10% at Lord." },
	{ value: 79, label: "Resist Fire", desc: "On objects, apply to: weapon, shield, held. Max 5% at Hero, max 10% at Lord." },
	{ value: 80, label: "Resist Mind Control", desc: "On objects, apply to: head, held, hands. Max 5% at Hero, max 10% at Lord." },
	{ value: 84, label: "Resist Air", desc: "On objects, apply to: feet, shield, held. Max 5% at Hero, max 10% at Lord." },
	{ value: 85, label: "Resist Earth", desc: "On objects, apply to: weapon, shield, held. Max 5% at Hero, max 10% at Lord." },
	{ value: 86, label: "Resist Water", desc: "On objects, apply to: waist, legs, feet. Max 5% at Hero, max 10% at Lord." },
	{ value: 76, label: "Resist Falling", desc: "Subject to change and should not be used." },
	{ value: 77, label: "Resist Portal", desc: "Subject to change and should not be used." },
	{ value: 81, label: "Resist Polymorph", desc: "Subject to change and should not be used." },
	{ value: 82, label: "Resist Antimagic", desc: "Subject to change and should not be used." },
	{ value: 83, label: "Resist Natural", desc: "Subject to change and should not be used." },
	{ value: 87, label: "Resist Piercing", desc: "Unavailable pending a further code project." },
	{ value: 88, label: "Resist Slicing", desc: "Unavailable pending a further code project." },
	{ value: 89, label: "Resist Chopping", desc: "Unavailable pending a further code project." },
	{ value: 90, label: "Resist Blunt", desc: "Unavailable pending a further code project." },
	{ value: 91, label: "Resist Whipping", desc: "Unavailable pending a further code project." },
	{ value: 92, label: "Resist Blasting", desc: "Unavailable pending a further code project." },
	{ value: 93, label: "Damage type" },
	{ value: 94, label: "Open hand damage type" },
	{ value: 95, label: "Sneakiness" },

	{ value: 100, label: "Spell Cost", desc: "Chance to halve spell cost. Do not apply this to sub-Lord objects." },
	{ value: 101, label: "Spell Level", desc: "Chance to increase spell level. Do not apply this to sub-Lord objects." },
	{ value: 102, label: "Spell Fail", desc: "Chance to negate cast failure. Do not apply this to sub-Lord objects." },
	{ value: 103, label: "Spell Lag", desc: "Chance to halve spell lag. Do not apply this to sub-Lord objects." },
	{ value: 110, label: "Arcane Spell Cost", desc: "Chance to halve arcane spell cost. Do not apply this to sub-Lord objects." },
	{ value: 111, label: "Arcane Spell Level", desc: "Chance to increase arcane spell level. Do not apply this to sub-Lord objects." },
	{ value: 112, label: "Arcane Spell Fail", desc: "Chance to negate arcane cast failure. Do not apply this to sub-Lord objects." },
	{ value: 113, label: "Arcane Spell Lag", desc: "Chance to halve arcane spell lag. Do not apply this to sub-Lord objects." },
	{ value: 120, label: "Divine Spell Cost", desc: "Chance to halve divine spell cost. Do not apply this to sub-Lord objects." },
	{ value: 121, label: "Divine Spell Level", desc: "Chance to increase divine spell level. Do not apply this to sub-Lord objects." },
	{ value: 122, label: "Divine Spell Fail", desc: "Chance to negate divine cast failure. Do not apply this to sub-Lord objects." },
	{ value: 123, label: "Divine Spell Lag", desc: "Chance to halve divine spell lag. Do not apply this to sub-Lord objects." },
	{ value: 130, label: "Psionic Spell Cost", desc: "Chance to halve psionic spell cost. Do not apply this to sub-Lord objects." },
	{ value: 131, label: "Psionic Spell Level", desc: "Chance to increase psionic spell level. Do not apply this to sub-Lord objects." },
	{ value: 132, label: "Psionic Spell Fail", desc: "Chance to negate psionic cast failure. Do not apply this to sub-Lord objects." },
	{ value: 133, label: "Psionic Spell Lag", desc: "Chance to halve psionic spell lag. Do not apply this to sub-Lord objects." },
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

const DAMAGE_TYPE: { value: number, label: string, desc?: string }[] = [
	{ value: 2, label: "Cold" },
	{ value: 3, label: "Stasis" },
	{ value: 4, label: "Biological" },
	{ value: 5, label: "Sonic" },
	{ value: 6, label: "Pressure" },
	{ value: 7, label: "Radiant" },
	{ value: 8, label: "Electric" },
	{ value: 9, label: "Leeching" },
	{ value: 10, label: "Poison" },
	{ value: 11, label: "Chemical" },
	{ value: 12, label: "Mental" },
	{ value: 13, label: "Arcane" },
	{ value: 14, label: "Divine" },
	{ value: 15, label: "Falling", desc: "Subject to change and should not be used." },
	{ value: 16, label: "Portal", desc: "Subject to change and should not be used." },
	{ value: 17, label: "Cursed" },
	{ value: 18, label: "Fire" },
	{ value: 19, label: "Mind_control" },
	{ value: 20, label: "Polymorph", desc: "Subject to change and should not be used." },
	{ value: 21, label: "Antimagic", desc: "Subject to change and should not be used." },
	{ value: 22, label: "Natural", desc: "Subject to change and should not be used." },
	{ value: 23, label: "Air" },
	{ value: 24, label: "Earth" },
	{ value: 25, label: "Water" },
];

const OPEN_HAND_DAMAGE_TYPE: { value: number, label: string, desc?: string }[] = [
	{ value: 0, label: "Piercing" },
	{ value: 1, label: "Slicing" },
	{ value: 2, label: "Chopping" },
	{ value: 3, label: "Blunt" },
	{ value: 4, label: "Whipping" },
	{ value: 5, label: "Blasting" },
];
