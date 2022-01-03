import React from "react";
import { Dispatch } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Actions from "../../app/store/mobiles";
import * as ResetsActions from "../../app/store/resets";
import * as ShopsActions from "../../app/store/shops";
import { Mobile, Shop } from "../../app/models";
import {
	ApplyFields,
	KeywordField,
	BitsField,
	DeleteButton,
	NumberField,
	Row,
	SelectField,
	TextArea,
	TextField,
	ToggleContainer,
	ToolRow,
} from "../components";
import ShopFields from "../mobiles/ShopFields";
import { VnumItemList } from "../VnumList";
import MobResets from "../mobiles/MobResets";
import KspawnFields from "../mobiles/KspawnFields";

import TabsLayout from "./tabs-layout";

import "../VnumList.css";

export default function MobilesTab() {
	const dispatch = useAppDispatch();
	const mobiles = useAppSelector(state => state.mobiles.mobiles);
	const currentId = useAppSelector(state => state.mobiles.selectedId);
	const mobile = mobiles.find(m => m.id === currentId);

	function onSelect(id: string) {
		dispatch(Actions.selectedId(id));
	}

	function onAdd() {
		dispatch(Actions.addedMobile());
	}

	const sideNav = <VnumItemList itemName="Mobile" items={mobiles} selected={currentId} onChange={onSelect} onAdd={onAdd} />;

	return (
		<TabsLayout sideNav={sideNav}>
			{mobile && <MobileForm key={currentId} mobile={mobile} />}
		</TabsLayout>
	);
}

interface Props {
	mobile: Mobile;
}

function MobileForm(props: Props) {
	const dispatch = useAppDispatch();
	const { mobile } = props;
	const id = mobile.id;

	const updatedVnum = (n: number) => dispatch(Actions.updatedVnum([id, n]));
	const updatedKeywords = (ks: string[]) => dispatch(Actions.updatedKeywords([id, ks]));
	const updatedShortDesc = (s: string) => dispatch(Actions.updatedShortDesc([id, s]));
	const updatedLongDesc = (s: string) => dispatch(Actions.updatedLongDesc([id, s]));
	const updatedDescription = (s: string) => dispatch(Actions.updatedDescription([id, s]));
	const updatedAct = (bs: number[]) => dispatch(Actions.updatedAct([id, bs]));
	const updatedAffected = (bs: number[]) => dispatch(Actions.updatedAffected([id, bs]));
	const updatedAlign = (n: number) => dispatch(Actions.updatedAlign([id, n]));
	const updatedLevel = (n: number) => dispatch(Actions.updatedLevel([id, n]));
	const updatedSex = (n: number) => dispatch(Actions.updatedSex([id, n]));
	const updatedRace = (n: number | null) => dispatch(Actions.updatedRace([id, n]));
	const updatedClass = (n: number | null) => dispatch(Actions.updatedClass([id, n]));
	const updatedTeam = (n: number | null) => dispatch(Actions.updatedTeam([id, n]));
	const updatedSpecial = (s: string | null) => dispatch(Actions.updatedSpecial([id, s]));
	const removedMobile = () => {
		dispatch(Actions.removedMobile(id));
		dispatch(ResetsActions.removedAllMobResets(id)); // FIXME: we *could* leave them orphaned, nbd
	};

	return (
		<>
			<ToolRow style={{ justifyContent: "space-between" }}>
				<NumberField name="VNUM" inline value={mobile.vnum} min={0} onUpdate={updatedVnum} />
				<DeleteButton onClick={removedMobile}>Delete mob</DeleteButton>
			</ToolRow>
			<Row>
				<KeywordField name="Keywords" value={mobile.keywords} onUpdate={updatedKeywords} />
			</Row>
			<Row>
				<TextField name="Short desc" value={mobile.shortDesc} onUpdate={updatedShortDesc} />
			</Row>
			<Row>
				<TextField name="Long desc" value={mobile.longDesc} onUpdate={updatedLongDesc} />
			</Row>
			<TextArea name="Description" value={mobile.description} onUpdate={updatedDescription} />
			<BitsField name="Act Flags" value={mobile.act} map={ACT_FLAGS} onUpdate={updatedAct} />
			<BitsField name="Affected Flags" value={mobile.affected} map={AFF_FLAGS} onUpdate={updatedAffected} />
			<ToolRow>
				<NumberField name="Level" inline value={mobile.level} min={0} onUpdate={updatedLevel} />
				<SelectField name="Race" inline value={mobile.race} options={RACE} defaultValue={RACE[0]} onUpdate={updatedRace} />
				<SelectField name="Class" inline value={mobile.klass} options={CLASS} defaultValue={CLASS[0]} onUpdate={updatedClass} />
			</ToolRow>
			<ToolRow>
				<NumberField name="Alignment" inline value={mobile.align} min={-1000} max={1000} onUpdate={updatedAlign} />
				<SelectField name="Sex" inline value={mobile.sex} options={SEX} defaultValue={SEX[0]} onUpdate={updatedSex} />
				<SelectField name="Team" inline value={mobile.team} options={TEAM} defaultValue={TEAM[0]} onUpdate={updatedTeam} />
			</ToolRow>
			<SelectField name="Spec" inline value={mobile.specFun} options={SPEC_FUNS} defaultValue={SPEC_FUNS[0]} onUpdate={updatedSpecial} />
			<ApplyFields applies={mobile.applies} id={id} updatedApply={Actions.updatedApply} addedApply={Actions.addedApply} removedApply={Actions.removedApply} />
			<ShopComponent mobId={id} />
			<KspawnFields mobId={id} kspawn={mobile.kspawn || null} />
			<MobResets mobId={id} />
		</>
	);
}

interface ShopProps {
	mobId: string;
}

function ShopComponent(props: ShopProps) {
	const dispatch = useAppDispatch();
	const shop = useAppSelector(state => state.shops.shops[props.mobId]);

	return (
		<ToggleContainer
			label="Shop"
			opened={!!shop}
			onEnabled={() => dispatch(ShopsActions.addedShop(props.mobId))}
			onDisabled={() => dispatch(ShopsActions.removedShop(props.mobId))}>
			{shop && <ShopFields shop={shop} />}
		</ToggleContainer>
	);
}

const ACT_FLAGS: [number, string, string][] = [
	[1, "Is NPC", "All mobiles require this flag!"],
	[2, "Sentinel", "Mob will not walk out of the room it is loaded in."],
	[4, "Scavenger", "Mob will pick up any takeable items from the ground."],
	[8, "Aggie All", "Mob will attack ALL mortal players."],
	[16, "Citizen", "See OUTLAW section of this guide."],
	[32, "Aggressive", "Mob will attack all players who are below its level or are as many as 5 levels above its level."],
	[64, "Stay Area", "Mob will stay in any area it is placed in."],
	[128, "Wimpy", "Mob will flee when it's hurt. Overrides ACT_SENTINEL, and ACT_STAY_TERRAIN, but will still obey ACT_STAY_AREA."],
	// [256, "Pet", "Mob is a pet; DO NOT USE THIS ACT_FLAG."],
	[512, "Train", "Can train players attributes; deprecated since players can train anywhere."],
	[1024, "Practice", "Can teach players skills up to and including the level of the mob; for skills levels 16 to 51, mob level must be at least the skill level."],
	[2048, "Is Healer", "Can heal players for a cost (through the heal command)."],
	[4096, "Undead", "Identifies mob as undead creature; this flag is required for the proper functioning of some spells and skills that only affect the undead."],
	// [8192, "Live Corpse", "This act_flag is ONLY used by a special function - DO NOT USE THIS ACT_FLAG."],
	// [16384, "Is Soulstealer", "This act_flag is ONLY used by a special function - DO NOT USE THIS ACT_FLAG."],
	[32768, "Identify", "Mob identifies items for a price (via the identify command). Mob will also label items via the label command."],
	[65536, "Stay Terrain", "Mob will stay in one terrain, wherever placed. Mob cannot be forced to switch terrain (except by a mobprog directional command or roam)."],
	[131072, "Smith", "Mob repairs items for a price (smith command). T TE progs will not work with this."],
	[262144, "Skin Item", "Mob yields an object when skinned; the object vnum will be the same as the mobile vnum."],
	[524288, "Capture", "If mob kills a player, the player is transported to the \"jail room vnum\" specified in #AREADATA (see Section III.2). This capture does not result in the player's death - it is like an arena death. See also Outlaw section, Appendix A: Legal System."],
	[1048576, "Graverobber", "If mob kills a player, the player's corpse is moved to the vnum specified in #AREADATA (see Section III.2). The player dies as normal, but the corpse is moved. See also the Outlaw Information in Appendix A: Legal System."],
	[2097152, "Etcher", "Mob will etch items for players for a price."],
	[4194304, "Drift", "Mob will ignore room exits and move up or down 1 vnum at a time. This act_flag also prevents the mobile from leaving the terrain it is placed in."],
	[8388608, "Quest Bit", "Special act_flag used in once per character quests; do not use without special permission. Does not have any effect without associated code changes."],
	[16777216, "Obfuscated", "The mob cannot be teleported to, portaled to, nexused to - etc. "],
];

const AFF_FLAGS: [number, string, string][] = [
	[1, "Blind", "Mob is blind (this cannot be dispelled)"],
	[2, "Invisible", "Mob is invisible"],
	[4, "Detect Evil", "Mob can detect evil (has no effect)"],
	[8, "Detect Invis", "Mob can detect invisibility"],
	[16, "Detect Magic", "Mob can detect magic"],
	[32, "Detect Hidden", "Mob can detect hidden"],
	[64, "Bless", "Mob is blessed"],
	[128, "Sanctuary", "Mob is affected by Sanctuary"],
	[256, "Faerie Fire", "Mob is affected by Faerie Fire"],
	[512, "Infrared", "Mob can see in the dark"],
	[1024, "Curse", "Mob is cursed"],
	[2048, "Demonfire", "Mob takes double damage"],
	[4096, "Poison", "Mob suffers from poison"],
	[8192, "Protect Evil", "Mob is affected by Protect Evil or Good, depending on alignment"],
	[16384, "Werrebocler", "Mob takes 25% less damage"],
	[32768, "Sneak", "Mob is affected by Sneak"],
	[65536, "Hide", "Mob is affected by Hide"],
	[131072, "Sleep", "Mob is asleep"],
	[262144, "Charm", "Mob is charmed (cannot be attacked because it belongs to someone). Don't use unless you want an unkillable mobile."],
	[524288, "Flying", "Mob is flying"],
	[1048576, "Pass Door", "Mob is affected by Pass Door"],
	[2097152, "Plague", "Mob is plagued"],
	[4194304, "Endurance", "Mob is affected by Endurance"],
	[8388608, "Movehide", "Mob may move while hidden"],
	[16777216, "Detect Align", "Mob can detect alignments (has no effect)"],
	[33554432, "Str", "Mob has boosted str (has no effect)"],
	[67108864, "Alert", "Mob has alertness; cannot be stolen from"],
	// [134217728, "Paralyze", "Internal effect. DO NOT USE IN BUILDING."],
	[268435456, "Dex", "Mob has boosted dex (has no effect)"],
	[536870912, "Regeneration", "Mob has increased hp regeneration rate"],
	[1073741824, "Calm", "Mob is affected by calm "],
];

const SEX: { value: number, label: string }[] = [
	{ value: 0, label: "Neither" },
	{ value: 1, label: "Male" },
	{ value: 2, label: "Female" },
];

const RACE: { value: number | null, label: string }[] = [
	{ value: null, label: "Undefined" },
	{ value: 0, label: "Human" },
	{ value: 1, label: "Deep Gnome" },
	{ value: 2, label: "Drow" },
	{ value: 3, label: "Duergar" },
	{ value: 4, label: "Dwarf" },
	{ value: 5, label: "Elf" },
	{ value: 6, label: "Gnome" },
	{ value: 7, label: "Halfling" },
	{ value: 8, label: "Half-Elf" },
	{ value: 9, label: "Half-Orc" },
	{ value: 10, label: "Lizard Man" },
	{ value: 11, label: "Sprite" },
	{ value: 12, label: "Troglodyte" },
	{ value: 13, label: "Dragon" },
	{ value: 14, label: "Ogre" },
	{ value: 15, label: "Troll" },
	{ value: 16, label: "Kzinti" },
	{ value: 17, label: "Centaur" },
	{ value: 18, label: "Orc" },
	{ value: 19, label: "Giant" },
	{ value: 20, label: "Golem" },
	{ value: 21, label: "Cyborg" },
	{ value: 22, label: "Mobile" },
	{ value: 23, label: "Goblin" },
	{ value: 24, label: "Animal" },
	{ value: 25, label: "Griffon" },
	{ value: 26, label: "Gargoyle" },
	{ value: 27, label: "Demon" },
	{ value: 28, label: "Devil" },
	{ value: 29, label: "Miraar" },
	{ value: 30, label: "Elemental" },
	{ value: 31, label: "Ent" },
	{ value: 32, label: "Ghost" },
	{ value: 33, label: "Gith" },
	{ value: 34, label: "Harpy" },
	{ value: 35, label: "Insectoid" },
	{ value: 36, label: "Merman" },
	{ value: 37, label: "High Elf" },
	{ value: 38, label: "Minotaur" },
	{ value: 39, label: "Demonseed" },
	{ value: 40, label: "Fungoid" },
	{ value: 41, label: "Kobold" },
	{ value: 42, label: "Hobgoblin" },
	{ value: 43, label: "Slug" },
	{ value: 44, label: "Verbit" },
	{ value: 45, label: "Verburg" },
	{ value: 46, label: "Verbull" },
	{ value: 47, label: "Varbin" },
	{ value: 48, label: "Varsil" },
	{ value: 49, label: "Firedrake (Level 1)" },
	{ value: 50, label: "Firedrake (Level 25)" },
	{ value: 51, label: "Firedrake (Hero 1)" },
	{ value: 52, label: "Firedrake (Hero 250)" },
	{ value: 53, label: "Firedrake (Hero 500)" },
	{ value: 54, label: "Firedrake (Hero 750)" },
	{ value: 55, label: "Firedrake (Lord 1)" },
	{ value: 56, label: "Firedrake (Lord 250)" },
	{ value: 57, label: "Firedrake (Lord 500)" },
	{ value: 58, label: "Draconian" },
	{ value: 59, label: "Tuataur" },
	{ value: 60, label: "Pit Fiend" },
	{ value: 61, label: "True Fae" },
	{ value: 62, label: "Lesser Imp" },
	{ value: 63, label: "Minor Imp" },
	{ value: 64, label: "Dust Imp" },
	{ value: 65, label: "Wave Imp" },
	{ value: 66, label: "Vapour Imp" },
	{ value: 67, label: "Pyro Imp" },
	{ value: 68, label: "Lesser Elemental" },
	{ value: 69, label: "Pain Elemental" },
	{ value: 70, label: "Water Elemental" },
	{ value: 71, label: "Fire Elemental" },
	{ value: 72, label: "Earth Elemental" },
	{ value: 73, label: "Air Elemental" },
	{ value: 74, label: "Frost Giant" },
	{ value: 75, label: "Fire Giant" },
	{ value: 76, label: "Cloud Giant" },
	{ value: 77, label: "Stone Giant" },
	{ value: 78, label: "Black Dragon" },
	{ value: 79, label: "Blue Dragon" },
	{ value: 80, label: "Green Dragon" },
	{ value: 81, label: "White Dragon" },
	{ value: 82, label: "Ignatur " },
];

const CLASS: { value: number, label: string }[] = [
	{ value: 0, label: "Mage" },
	{ value: 1, label: "Cleric" },
	{ value: 2, label: "Rogue" },
	{ value: 3, label: "Warrior" },
	{ value: 4, label: "Paladin" },
	{ value: 5, label: "Ranger" },
	{ value: 6, label: "Psionicist" },
	{ value: 7, label: "Monk" },
	{ value: 8, label: "Archer" },
	{ value: 9, label: "Sorcerer" },
	{ value: 10, label: "Soldier" },
	{ value: 11, label: "Priest" },
	{ value: 12, label: "Berserker" },
	{ value: 13, label: "Assassin" },
	{ value: 14, label: "Wizard" },
	{ value: 15, label: "Shadowfist" },
	{ value: 16, label: "Mindbender" },
	{ value: 17, label: "Druid" },
	{ value: 18, label: "Black" },
	{ value: 19, label: "Bodyguard" },
	{ value: 20, label: "Fusilier" },
	{ value: 21, label: "Stormlord" },
	{ value: 22, label: "Ripper" },
	{ value: 23, label: "Bladedancer" },
	{ value: 24, label: "Vizier" },
	{ value: 25, label: "Forsaken" },
	{ value: 26, label: "Fury" },
];

const TEAM: { value: number, label: string }[] = [
	{ value: 0, label: "None" },
	{ value: 1, label: "Silver" },
	{ value: 2, label: "Gold" },
	{ value: 3, label: "Azure" },
	{ value: 4, label: "PC team" },
	{ value: 10, label: "Quest 1" },
	{ value: 11, label: "Quest 2" },
	{ value: 12, label: "Quest 3" },
	{ value: 13, label: "Quest 4" },
];

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
