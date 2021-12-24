import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Actions from "../../app/store/objects";
import { selectedId } from "../../app/store/ui";
import { Objekt } from "../../app/models";
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
import "./tabs.css";
import "../VnumList.css";

export default function ObjectsTab() {
	const dispatch = useAppDispatch();
	const objects = useAppSelector(state => state.objects.objects);
	const currentId = useAppSelector(state => state.ui.currentId);
	const object = objects.find(m => m.id === currentId);

	function onSelect(id: string) {
		dispatch(selectedId(id));
	}

	return (
		<div className="Tabs">
			<div className={object ? undefined : "VnumItemEditorPlaceholder"}>
				<TabsNav />
				{object ? <ObjectForm key={currentId} item={object} /> : null }
			</div>
			<VnumItemList items={objects} selected={currentId} onChange={onSelect} />
		</div>
	);
}

interface Props {
	item: Objekt;
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

function ObjectForm({ item: object }: Props) {
	const dispatch = useAppDispatch();
	const id = object.id;

	const wearFlags = object.wearFlags.reduce((sum, b) => sum + b, 0);

	const updatedVnum = (n: number) => dispatch(Actions.updatedVnum([id, n]));
	const updatedKeywords = (ks: string[]) => dispatch(Actions.updatedKeywords([id, ks]));
	const updatedShortDesc = (s: string) => dispatch(Actions.updatedShortDesc([id, s]));
	const updatedLongDesc = (s: string) => dispatch(Actions.updatedLongDesc([id, s]));
	const updatedActionDesc = (s: string) => dispatch(Actions.updatedActionDesc([id, s]));
	const updatedItemType = (n: number) => dispatch(Actions.updatedItemType([id, n]));
	const updatedExtraFlags = (bs: number[]) => dispatch(Actions.updatedExtraFlags([id, bs]));
	const updatedWearFlags = (n: number) => dispatch(Actions.updatedWearFlags([id, factor(n)]));
	const updatedValue0 = (n: number) => dispatch(Actions.updatedValue0([id, n]));
	const updatedValue1 = (n: number) => dispatch(Actions.updatedValue1([id, n]));
	const updatedValue2 = (n: number) => dispatch(Actions.updatedValue2([id, n]));
	const updatedValue3 = (n: number) => dispatch(Actions.updatedValue3([id, n]));
	const updatedWeight = (n: number) => dispatch(Actions.updatedWeight([id, n]));
	const updatedWorth = (n: number) => dispatch(Actions.updatedWorth([id, n]));
	const updatedRacialFlags = (bs: number[]) => dispatch(Actions.updatedRacialFlags([id, bs]));
	const updatedQuality = (n: number) => dispatch(Actions.updatedQuality([id, n]));

	return (
		<div>
			<NumberField name="VNUM" value={object.vnum} min={0} onUpdate={updatedVnum} />
			<KeywordField name="Keywords" value={object.keywords} onUpdate={updatedKeywords} />
			<TextField name="Short desc" value={object.name} onUpdate={updatedShortDesc} />
			<TextField name="Long desc" value={object.longDesc} onUpdate={updatedLongDesc} />
			<TextField name="Action desc" value={object.actionDesc} onUpdate={updatedActionDesc} />
			<SelectField name="Type" value={object.itemType} map={ITEM_TYPE} onUpdate={updatedItemType} />
			<BitsField name="Extra flags" value={object.extraFlags} map={EXTRA_FLAGS} onUpdate={updatedExtraFlags} />
			<SelectField name="Wear flags" value={wearFlags} map={WEAR_FLAGS} onUpdate={updatedWearFlags} />
			{/* item type specific values */}
			<NumberField name="Weight" value={object.weight} onUpdate={updatedWeight} />
			<NumberField name="Worth" value={object.worth} onUpdate={updatedWorth} />
			<BitsField name="Racial wear flags" value={object.racialFlags} map={RACIAL_WEAR_FLAGS} onUpdate={updatedRacialFlags} />
			{/* extra descs */}
			{/* applies */}
			<NumberField name="Quality" value={object.quality} min={1} onUpdate={updatedQuality} />
			<ApplyFields applies={object.applies} id={id} updatedApply={Actions.updatedApply} />
		</div>
	);
}

const ITEM_TYPE: [number, string, string][] = [
	[1, "Light", ""],
	[2, "Scroll", ""],
	[3, "Wand", ""],
	[4, "Staff", ""],
	[5, "Weapon", ""],
	[6, "Ticket", ""],
	[7, "Rogue Tool", ""],
	[8, "Treasure", ""],
	[9, "Armor", ""],
	[10, "Potion", ""],
	[11, "Poisoned Weapon", ""],
	[12, "Furniture", ""],
	[13, "Trash", ""],
	[14, "Poison", ""],
	[15, "Container", ""],
	// [16, "", ""],
	[17, "Drink container", ""],
	[18, "Key", ""],
	[19, "Food", ""],
	[20, "Money", ""],
	// [21, "", ""],
	[22, "Boat", ""],
	// [23, "NPC Corpse", ""],
	// [24, "PC Corpse", ""],
	[25, "Fountain", ""],
	[26, "Pill", ""],
	// [27, "Sign_type_one", ""],
	[28, "Portal", ""],
	[29, "Nexus", ""],
	[30, "Marking", ""],
	[31, "Bow", ""],
	[32, "Arrow", ""],
	// [33, "Gemstone", ""],
	// [34, "Perfect gemstone", ""],
	[35, "Throwing weapon", ""],
	// [36, "Perfect metal", ""],
	[37, "Spellbook", ""],
	// [38, "", ""],
	[39, "Trap kit", ""],
];

const EXTRA_FLAGS: [number, string, string][] = [
	[1, "GLOW", "Makes item glow; no effect, but can be altered by enchanting, illuminate, or conceal object"],
	[2, "HUM", "Makes item hum; no effect, but can be added by enchanting"],
	[4, "DARK", "Makes item dark; affects levers (ITEM_MARKINGS: see Table L: Item Type Values, type 30); affects harmonize spell; added by violate spell"],
	[8, "LOCK", "Gives item lock flag. If item is on the ground it can only be addressed by the full keyword. This is true both for looking at the object’s extra descriptions and the object’s name. No affect on carried objects."],
	[16, "EVIL", "Makes item evil; no effect"],
	[32, "INVIS", "Makes item invisible; cannot be seen by players 4 levels below item level even with detect invis (for weapons, 6 levels below)"],
	[64, "MAGIC", "Makes item magic; affects transmute spell; added by enchanting, transmuting"],
	[128, "NODROP", "Makes item undroppable; requires remove curse"],
	[256, "BLESS", "Makes item blessed; item takes half damage; added by consecrate spell"],
	[512, "ANTI_GOOD", "Makes item unholdable by good players; affects cleanse spell"],
	[1024, "ANTI_EVIL", "Makes item unholdable by evil players"],
	[2048, "ANTI_NEUTRAL", "Makes item unholdable by neutral players"],
	[4096, "NOREMOVE", "Cannot remove item once worn"],
	[8192, "INVENTORY", "Item disappears when character dies"],
	[16384, "TIMED", "Item vanishes after timer expires; consult the Immortal in charge of your project if you need to use this"],
	[32768, "CHARITY", "Item requires fence to sell, cannot be sacrificed; flag added when item is donated"],
	[65536, "GOOD", "Makes item good; no effect"],
	[131072, "NOLOCATE", "Item not located using 'locate object'; removed by illuminate spell"],
	[262144, "HAGGLED", "Lowers value on item DO NOT USE IN BUILDING"],
	[524288, "SHARP", "Item has a (Sharp) before it; no effect; can be added by sharpening an item"],
	[1048576, "DULL", "Item has a (Dull) before it; no effect"],
	[2097152, "REINFORCED", "Item is reinforced; item cannot be shattered by monk skill shatter strike; added by reinforce spell"],
	[4194304, "ELECTRIC_WARD", "Item has an electric ward; added by ward spell"],
	[8388608, "FIRE_WARD", "Item has a fire ward; added by ward spell"],
	[16777216, "ICE_WARD", "Item has an ice ward; added by ward spell"],
	[33554432, "MAGIC_WARD", "Item has a caustic ward; added by ward spell"],
	[67108864, "MAJOR_WARD", "Item has all wards; added by major ward spell FOR LORD ITEMS ONLY"],
	[134217728, "NOCHARM", "Wearer immune to charm and invis. If wearer is a mobile, player attempts to cast invis will send the player to jail instantly."],
	[268435456, "SPIRITLINK", "Item has a spiritlink to character"],
	[536870912, "ETCH", "Item has been etched"],
	[1073741824, "RUNE", "Item has been runed "],
];

const WEAR_FLAGS: [number, string, string][] = [
	[0, "Not carryable", ""],
	[1, "Not wearable", ""],
	[1 | 2, "Finger", ""],
	[1 | 4, "Neck", ""],
	[1 | 8, "On body", ""],
	[1 | 16, "Head", ""],
	[1 | 32, "Legs", ""],
	[1 | 64, "Feet", ""],
	[1 | 128, "Hands", ""],
	[1 | 256, "Arms", ""],
	[1 | 512, "Shield", ""],
	[1 | 1024, "About body", ""],
	[1 | 2048, "Waist", ""],
	[1 | 4096, "Wrist", ""],
	[1 | 8192, "Wield", ""],
	[1 | 16384, "Hold", ""],
	// [1 | 32768, "Floating", ""],
	// [1 | 65536, "Insignia", ""],
];

const RACIAL_WEAR_FLAGS: [number, string, string][] = [
	[1, "Biped", "Deep Gnome, Deomon, Demonseed, Draconian, Drow, Duergar, Dwarf, Elf, Fae, Gargoyle, Giant (all), Gith, Gnome, Goblin, Golem, Harpy, Half-Elf, Half-Orc, Halfling, High Elf, Hobgoblin, Human, Ignatur, Kobold, Kzinti, Lizardman, Minotaur, Ogre, Orc, Sprite, Troglodyte, Troll, Tuataur, Lesser Imp, "],
	[2, "Quadruped", "Centaur, Dragon (all), Firedrake, Griffon"],
	[4, "Wings", "Demon, Dragon (all), Firedrake, Gargoyle, Griffon, Harpy, Sprite"],
	[8, "Horns", "Demon, Dragon (all), Firedrake, Minotaur"],
	[16, "Claws", "Demon, Draconian, Dragon (all), Firedrake, Gargoyle, Griffon, Harpy, Kzinti, Ogre, Troll"],
	[32, "Tail", "Draconian, Firedrake, Griffon, Lizardman, Tuataur"],
	[64, "Hooves", "Centaur, Minotaur"],
	[128, "Greater", "Centaur, Ent, Gargoyle, Giant (all), Golem, Ogre, Troll"],
	[256, "Faerie", "Drow, Elf, Fae, High Elf, Sprite"],
	[512, "Demonic", "Demon, Demonseed, Goblin, Hobgoblin, Kobold, Lesser Imp, Minor Imp"],
	[1024, "Light", "Dwarf, Gnome, Half-Elf, Halfing, Human, Vapour Imp"],
	[2048, "Dark", "Deep Gnome, Duergar, Half-Orc, Orc, Troll"],
	[4096, "Beast", "Centaur, Griffon, Harpy, Kzinti, Minotaur"],
	[8192, "Scaled", "Draconian, Dragon (all), Dust Imp, Firedrake, Lizardman, Pyro Imp, Troglodyte, Tuataur, Wave Imp"],
	[16384, "Draconic", "Draconian, Dragon (all), Firedrake, Lizardman, Tuataur"],
	// [?, "Planar", "Gith, Ignatur"],
];