import React from "react";
import { SelectField } from "../components";

interface Props {
	value: string | null;
	onUpdate: (s: string | null) => void;
	disabled?: boolean;
}

export default function SelectSpecial({ value, onUpdate, disabled }: Props) {
	return <SelectField name="Spec" inline disabled={disabled} value={value} options={SPEC_FUNS} onUpdate={onUpdate} />;
}

const SPEC_FUNS: { value: string | null, label: string }[] = [
	{ value: null, label: "None"},
	{ value: "SPEC_ANIMATE_DEAD", label: "SPEC_ANIMATE_DEAD" },
	{ value: "SPEC_ARCHER", label: "SPEC_ARCHER" },
	{ value: "SPEC_ASSASSIN", label: "SPEC_ASSASSIN" },
	{ value: "SPEC_BCI_LITE", label: "SPEC_BCI_LITE" },
	{ value: "SPEC_BERSERKER", label: "SPEC_BERSERKER" },
	{ value: "SPEC_BODYGUARD", label: "SPEC_BODYGUARD" },
	{ value: "SPEC_BREATH_ANY", label: "SPEC_BREATH_ANY" },
	{ value: "SPEC_BREATH_ACID", label: "SPEC_BREATH_ACID" },
	{ value: "SPEC_BREATH_FIRE", label: "SPEC_BREATH_FIRE" },
	{ value: "SPEC_BREATH_FROST", label: "SPEC_BREATH_FROST" },
	{ value: "SPEC_BREATH_GAS", label: "SPEC_BREATH_GAS" },
	{ value: "SPEC_BREATH_LIGHTNING", label: "SPEC_BREATH_LIGHTNING" },
	{ value: "SPEC_BUDDHA", label: "SPEC_BUDDHA" },
	{ value: "SPEC_BUTTKICKER", label: "SPEC_BUTTKICKER" },
	{ value: "SPEC_CAST_ADEPT", label: "SPEC_CAST_ADEPT" },
	{ value: "SPEC_CAST_CLERIC", label: "SPEC_CAST_CLERIC" },
	{ value: "SPEC_CAST_KINETIC", label: "SPEC_CAST_KINETIC" },
	{ value: "SPEC_CAST_MAGE", label: "SPEC_CAST_MAGE" },
	{ value: "SPEC_CAST_PSION", label: "SPEC_CAST_PSION" },
	{ value: "SPEC_CAST_STORMLORD", label: "SPEC_CAST_STORMLORD" },
	{ value: "SPEC_CAST_UNDEAD", label: "SPEC_CAST_UNDEAD" },
	{ value: "SPEC_DOPPLEGANGER", label: "SPEC_DOPPLEGANGER" },
	{ value: "SPEC_DRUID", label: "SPEC_DRUID" },
	{ value: "SPEC_FIDO", label: "SPEC_FIDO" },
	{ value: "SPEC_FUSILIER", label: "SPEC_FUSILIER" },
	{ value: "SPEC_GUARD", label: "SPEC_GUARD" },
	{ value: "SPEC_GUARD_WHITE", label: "SPEC_GUARD_WHITE" },
	{ value: "SPEC_GUILD_GUARD", label: "SPEC_GUILD_GUARD" },
	{ value: "SPEC_KINETIC_LITE", label: "SPEC_KINETIC_LITE" },
	{ value: "SPEC_KUNGFU_POISON", label: "SPEC_KUNGFU_POISON" },
	{ value: "SPEC_KZIN", label: "SPEC_KZIN" },
	{ value: "SPEC_JANITOR", label: "SPEC_JANITOR" },
	{ value: "SPEC_MINDBENDER", label: "SPEC_MINDBENDER" },
	{ value: "SPEC_MONK", label: "SPEC_MONK" },
	{ value: "SPEC_POISON", label: "SPEC_POISON" },
	{ value: "SPEC_PLAGUE", label: "SPEC_PLAGUE" },
	{ value: "SPEC_PRIEST_LITE", label: "SPEC_PRIEST_LITE" },
	{ value: "SPEC_PUFF", label: "SPEC_PUFF" },
	{ value: "SPEC_PUFF_ORIG", label: "SPEC_PUFF_ORIG" },
	{ value: "SPEC_ROGUE", label: "SPEC_ROGUE" },
	{ value: "SPEC_ROGUE_LITE", label: "SPEC_ROGUE_LITE" },
	{ value: "SPEC_SNIPER", label: "SPEC_SNIPER" },
	{ value: "SPEC_SORCEROR", label: "SPEC_SORCEROR" },
	{ value: "SPEC_SOULBOUND", label: "SPEC_SOULBOUND" },
	{ value: "SPEC_STOMP_EM", label: "SPEC_STOMP_EM" },
	{ value: "SPEC_TEACHER", label: "SPEC_TEACHER" },
	{ value: "SPEC_THIEF", label: "SPEC_THIEF" },
	{ value: "SPEC_WARLORD", label: "SPEC_WARLORD" },
	{ value: "SPEC_WARRIOR", label: "SPEC_WARRIOR" },
	{ value: "SPEC_ARCHERALL", label: "SPEC_ARCHERALL" },
	{ value: "SPEC_BATTLE_CLERIC", label: "SPEC_BATTLE_CLERIC" },
	{ value: "SPEC_BATTLE_MAGE", label: "SPEC_BATTLE_MAGE" },
	{ value: "SPEC_BATTLE_SOR", label: "SPEC_BATTLE_SOR" },
	{ value: "SPEC_BREATH_SUPER", label: "SPEC_BREATH_SUPER" },
	{ value: "SPEC_CAST_WIZARD", label: "SPEC_CAST_WIZARD" },
	{ value: "SPEC_DEMON", label: "SPEC_DEMON" },
	{ value: "SPEC_ILLUSIONIST", label: "SPEC_ILLUSIONIST" },
	{ value: "SPEC_VOLLEY", label: "SPEC_VOLLEY" },
];
