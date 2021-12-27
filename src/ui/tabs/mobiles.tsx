import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Actions from "../../app/store/mobiles";
import { selectedId } from "../../app/store/ui";
import { Mobile, Kspawn } from "../../app/models";
import {
	ApplyFields,
	BitsField,
	KeywordField,
	NumberField,
	SelectField,
	TextField,
	TextArea,
} from "../fields";
import { VnumItemList } from "../VnumList";
import TabsNav from "./tabs-nav";
import MobResets from "../MobResets";

import "./tabs.css";
import "../VnumList.css";

export default function MobilesTab() {
	const dispatch = useAppDispatch();
	const mobiles = useAppSelector(state => state.mobiles.mobiles);
	const currentId = useAppSelector(state => state.ui.currentId);
	const mobile = mobiles.find(m => m.id === currentId);

	function onSelect(id: string) {
		dispatch(selectedId(id));
	}

	return (
		<div className="Tabs">
			<div className={mobile ? "TabsContents" : "VnumItemEditorPlaceholder"}>
				<TabsNav />
				{mobile ? <MobileForm key={currentId} mobile={mobile} /> : null }
			</div>
			<VnumItemList items={mobiles} selected={currentId} onChange={onSelect} />
		</div>
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
	const updatedRace = (n: number) => dispatch(Actions.updatedRace([id, n]));
	const updatedClass = (n: number) => dispatch(Actions.updatedClass([id, n]));
	const updatedTeam = (n: number) => dispatch(Actions.updatedTeam([id, n]));

	return (
		<div>
			<NumberField name="VNUM" value={mobile.vnum} min={0} onUpdate={updatedVnum} />
			<KeywordField name="Keywords" value={mobile.keywords} onUpdate={updatedKeywords} />
			<TextField name="Short desc" value={mobile.name} onUpdate={updatedShortDesc} />
			<TextField name="Long desc" value={mobile.longDesc} onUpdate={updatedLongDesc} />
			<TextArea name="Description" value={mobile.description} onUpdate={updatedDescription} />
			<BitsField name="Act Flags" value={mobile.act} map={ACT_FLAGS} onUpdate={updatedAct} />
			<BitsField name="Affected Flags" value={mobile.affected} map={AFF_FLAGS} onUpdate={updatedAffected} />
			<NumberField name="Alignment" value={mobile.align} min={-1000} max={1000} onUpdate={updatedAlign} />
			<NumberField name="Level" value={mobile.level} min={0} onUpdate={updatedLevel} />
			<SelectField name="Sex" value={mobile.sex} map={SEX} onUpdate={updatedSex} />
			<SelectField name="Race" value={mobile.race} map={RACE} onUpdate={updatedRace} />
			<SelectField name="Class" value={mobile.klass} map={CLASS} onUpdate={updatedClass} />
			<SelectField name="Team" value={mobile.team} map={TEAM} onUpdate={updatedTeam} />
			<ApplyFields applies={mobile.applies} id={id} updatedApply={Actions.updatedApply} addedApply={Actions.addedApply} removedApply={Actions.removedApply} />
			{mobile.kspawn ? (
				<fieldset>
					<legend>Kspawn</legend>
					<SelectField name="Condition" value={mobile.kspawn.condition} map={KSPAWN_CONDITION} />
					<BitsField name="Type" value={mobile.kspawn.spawnType} map={KSPAWN_TYPE} />
					<NumberField name="Spawn VNUM" value={mobile.kspawn.spawnVnum} min={-1} />
					<NumberField name="Room VNUM" value={mobile.kspawn.roomVnum} min={-1} />
					<TextArea name="Text" value={mobile.kspawn.message} />
				</fieldset>
			) : null}
			<h2>Resets</h2>
			<MobResets mobId={id} />
		</div>
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

const SEX: [number, string, string][] = [
	[0, "Neither", ""],
	[1, "Male", ""],
	[2, "Female", ""],
];

const RACE: [number, string, string][] = [
	[0, "Human", ""],
	[1, "Deep Gnome", ""],
	[2, "Drow", ""],
	[3, "Duergar", ""],
	[4, "Dwarf", ""],
	[5, "Elf", ""],
	[6, "Gnome", ""],
	[7, "Halfling", ""],
	[8, "Half-Elf", ""],
	[9, "Half-Orc", ""],
	[10, "Lizard Man", ""],
	[11, "Sprite", ""],
	[12, "Troglodyte", ""],
	[13, "Dragon", ""],
	[14, "Ogre", ""],
	[15, "Troll", ""],
	[16, "Kzinti", ""],
	[17, "Centaur", ""],
	[18, "Orc", ""],
	[19, "Giant", ""],
	[20, "Golem", ""],
	[21, "Cyborg", ""],
	[22, "Mobile", ""],
	[23, "Goblin", ""],
	[24, "Animal", ""],
	[25, "Griffon", ""],
	[26, "Gargoyle", ""],
	[27, "Demon", ""],
	[28, "Devil", ""],
	[29, "Miraar", ""],
	[30, "Elemental", ""],
	[31, "Ent", ""],
	[32, "Ghost", ""],
	[33, "Gith", ""],
	[34, "Harpy", ""],
	[35, "Insectoid", ""],
	[36, "Merman", ""],
	[37, "High Elf", ""],
	[38, "Minotaur", ""],
	[39, "Demonseed", ""],
	[40, "Fungoid", ""],
	[41, "Kobold", ""],
	[42, "Hobgoblin", ""],
	[43, "Slug", ""],
	[44, "Verbit", ""],
	[45, "Verburg", ""],
	[46, "Verbull", ""],
	[47, "Varbin", ""],
	[48, "Varsil", ""],
	[49, "Firedrake (Level 1)", ""],
	[50, "Firedrake (Level 25)", ""],
	[51, "Firedrake (Hero 1)", ""],
	[52, "Firedrake (Hero 250)", ""],
	[53, "Firedrake (Hero 500)", ""],
	[54, "Firedrake (Hero 750)", ""],
	[55, "Firedrake (Lord 1)", ""],
	[56, "Firedrake (Lord 250)", ""],
	[57, "Firedrake (Lord 500)", ""],
	[58, "Draconian", ""],
	[59, "Tuataur", ""],
	[60, "Pit Fiend", ""],
	[61, "True Fae", ""],
	[62, "Lesser Imp", ""],
	[63, "Minor Imp", ""],
	[64, "Dust Imp", ""],
	[65, "Wave Imp", ""],
	[66, "Vapour Imp", ""],
	[67, "Pyro Imp", ""],
	[68, "Lesser Elemental", ""],
	[69, "Pain Elemental", ""],
	[70, "Water Elemental", ""],
	[71, "Fire Elemental", ""],
	[72, "Earth Elemental", ""],
	[73, "Air Elemental", ""],
	[74, "Frost Giant", ""],
	[75, "Fire Giant", ""],
	[76, "Cloud Giant", ""],
	[77, "Stone Giant", ""],
	[78, "Black Dragon", ""],
	[79, "Blue Dragon", ""],
	[80, "Green Dragon", ""],
	[81, "White Dragon", ""],
	[82, "Ignatur ", ""],
];

const CLASS: [number, string, string][] = [
	[0, "Mage", ""],
	[1, "Cleric", ""],
	[2, "Rogue", ""],
	[3, "Warrior", ""],
	[4, "Paladin", ""],
	[5, "Ranger", ""],
	[6, "Psionicist", ""],
	[7, "Monk", ""],
	[8, "Archer", ""],
	[9, "Sorcerer", ""],
	[10, "Soldier", ""],
	[11, "Priest", ""],
	[12, "Berserker", ""],
	[13, "Assassin", ""],
	[14, "Wizard", ""],
	[15, "Shadowfist", ""],
	[16, "Mindbender", ""],
	[17, "Druid", ""],
	[18, "Black", ""],
	[19, "Bodyguard", ""],
	[20, "Fusilier", ""],
	[21, "Stormlord", ""],
	[22, "Ripper", ""],
	[23, "Bladedancer", ""],
	[24, "Vizier", ""],
	[25, "Forsaken", ""],
	[26, "Fury", ""],
];

const TEAM: [number, string, string][] = [
	[0, "None", ""],
	[1, "Silver", ""],
	[2, "Gold", ""],
	[3, "Azure", ""],
	[4, "PC team", ""],
	[10, "Quest 1", ""],
	[11, "Quest 2", ""],
	[12, "Quest 3", ""],
	[13, "Quest 4", ""],
];

const KSPAWN_CONDITION: [number, string, string][] = [
	[1, "Death", "When the mob dies, the spawn is invoked"],
	[2, "Clear", "When the mob dies and the room is empty, the spawn is invoked"],
	[3, "Genocide", "When the mob dies and no other mobs with the same VNUM exist, the spawn is invoked"],
	[4, "Massacre", "When the mob dies and no other mobs with massacre-type spawn exist in the area, the spawn is invoked"],
];

const KSPAWN_TYPE: [number, string, string][] = [
	[1, "load mob", "a mob specified with <spawn-vnum#> is loaded."],
	[2, "load obj", "an object specified with <spawn-vnum#> is loaded on the ground."],
	[4, "equip obj", "If a mob and object specified with <spawn-vnum#> is loaded (with 1 and 2), the mob attempts to wear object. Depending on object and mob’s alignment, object might zap and fall to the ground. The object must also have a wear location set."],
	[8, "hunt", "If a mob with <spawn-vnum#> is successfully loaded (with 1), it is set to hunt killer."],
	[16, "give obj", "If an object with <spawn-vnum#> is successfully loaded (with 2), the object is given to killer."],
	[32, "bind obj", "If an object with <spawn-vnum#> is successfully loaded (with 2), the object is bound to killer."],
	[64, "KS trigger", "send the <death message> to the room and execute a mobprog check for the \"KS\" mobprog option on a mob with <spawn-vnum#>."],
	[128, "KS with argument", "No death message is played to the room. Instead, the death message field is used as a text parameter for the mobprog C command = \"msg\". This allows a mob to react to diferent K-Spawns. Again, a mobprog check for the \"KS\" option on the mob with <spawn-vnum#> is done."]
];
