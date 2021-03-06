import React, { useState, useEffect, useRef } from "react";
import classnames from "classnames";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import * as Actions from "../../app/store/objects";
import { selectedObjectId } from "../../app/store/ui";
import { Objekt, newId } from "../../app/models";
import { VnumItemList } from "../VnumList";
import {
	ApplyFields,
	BitsField,
	Button,
	DeleteButton,
	KeywordField,
	EdescFields,
	NumberField,
	Row,
	SelectField,
	TextArea,
	TextField,
	ToolRow,
} from "../components";
import {
	ObjectResets,
	ObjectValues,
	ReciprocalResets,
} from "../objects";
import { TabsContents } from "./tabs-layout";
import sharedStyles from "../components/shared.module.css";
import tabStyles from "./tabs-layout.module.css";

export default function ObjectsTab() {
	const dispatch = useAppDispatch();
	const objects = useAppSelector(state => state.objects.objects);
	const currentId = useAppSelector(state => state.ui.selectedObjectId);
	const [kb, setKb] = useState(false);
	const object = objects.find(m => m.id === currentId);

	function onSelect(id: string, kbInteraction: boolean) {
		dispatch(selectedObjectId(id));
		setKb(kbInteraction);
	}

	function onAdd() {
		const id = newId();
		dispatch(Actions.addedObject(id));
		dispatch(selectedObjectId(id));
	}

	return (
		<>
			{objects.length > 0 && <VnumItemList itemName="Object" items={objects} selected={currentId} onChange={onSelect} onAdd={onAdd} />}
			<TabsContents>
				{object ? <ObjectForm key={currentId} kbInteraction={kb} object={object} /> : <BlankWorkspace onAdd={onAdd} />}
			</TabsContents>
		</>
	);
}

interface Props {
	object: Objekt;
	kbInteraction: boolean;
}

function BlankWorkspace({ onAdd }: { onAdd: () => void }) {
	return (
		<div className={tabStyles.blankWorkspace}>
			<div>
				<p>Select an object from the side bar →</p>
				or <Button onClick={onAdd}>Create a new object</Button>
			</div>
		</div>
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

function ObjectForm({ object, kbInteraction }: Props) {
	const dispatch = useAppDispatch();
	const [danger, setDanger] = useState(false);
	const vnumField = useRef<HTMLInputElement>(null);
	const id = object.id;

	useEffect(() => {
		if (kbInteraction) vnumField.current?.focus();
	}, [id]);

	const wearFlags = object.wearFlags.reduce((sum, b) => sum + b, 0);

	const updatedVnum = (n: number) => dispatch(Actions.updatedVnum([id, n]));
	const updatedKeywords = (ks: string[]) => dispatch(Actions.updatedKeywords([id, ks]));
	const updatedShortDesc = (s: string) => dispatch(Actions.updatedShortDesc([id, s]));
	const updatedLongDesc = (s: string) => dispatch(Actions.updatedLongDesc([id, s]));
	const updatedActionDesc = (s: string) => dispatch(Actions.updatedActionDesc([id, s]));
	const updatedExtraFlags = (bs: number[]) => dispatch(Actions.updatedExtraFlags([id, bs]));
	const updatedWearFlags = (n: number) => dispatch(Actions.updatedWearFlags([id, factor(n)]));
	const updatedWeight = (n: number) => dispatch(Actions.updatedWeight([id, n]));
	const updatedWorth = (n: number) => dispatch(Actions.updatedWorth([id, n]));
	const updatedRacialFlags = (bs: number[]) => dispatch(Actions.updatedRacialFlags([id, bs]));
	const updatedQuality = (n: number) => dispatch(Actions.updatedQuality([id, n]));
	const removedObject = () => dispatch(Actions.removedObject(id));

	return (
		<div className={classnames(tabStyles.tabDangerTarget, danger && sharedStyles.dangerTarget)}>
			<ToolRow style={{justifyContent: "space-between"}}>
				<NumberField name="VNUM" inline value={object.vnum} min={0} onUpdate={updatedVnum} inputRef={vnumField} />
				<DeleteButton onHoverState={setDanger} onClick={removedObject}>Delete object</DeleteButton>
			</ToolRow>
			<KeywordField name="Keywords" value={object.keywords} onUpdate={updatedKeywords} />
			<Row>
				<TextField name="Short desc" value={object.shortDesc} onUpdate={updatedShortDesc} />
			</Row>
			<Row>
				<TextField name="Long desc" value={object.longDesc} onUpdate={updatedLongDesc} />
			</Row>
			<TextArea name="Action desc" value={object.actionDesc} onUpdate={updatedActionDesc} />
			<ObjectValues object={object} />
			<BitsField name="Extra flags" value={object.extraFlags} map={EXTRA_FLAGS} onUpdate={updatedExtraFlags} />
			<ToolRow>
				<SelectField name="Wear flags" value={wearFlags} options={WEAR_FLAGS} defaultValue={WEAR_FLAGS[0]} onUpdate={updatedWearFlags} />
				<NumberField name="Weight" value={object.weight} onUpdate={updatedWeight} />
				<NumberField name="Worth" value={object.worth} onUpdate={updatedWorth} />
				<NumberField name="Quality" value={object.quality} min={1} onUpdate={updatedQuality} />
			</ToolRow>
			<BitsField name="Racial wear flags" value={object.racialFlags} map={RACIAL_WEAR_FLAGS} onUpdate={updatedRacialFlags} />
			<EdescFields edescs={object.extraDescs} id={id} updatedEdesc={Actions.updatedExtraDesc} addedEdesc={Actions.addedExtraDesc} removedEdesc={Actions.removedExtraDesc} />
			<ApplyFields applies={object.applies} id={id} updatedApply={Actions.updatedApply} addedApply={Actions.addedApply} removedApply={Actions.removedApply} />
			<ObjectResets objectId={id} itemType={object.itemType} />
			<ReciprocalResets objectId={id} vnum={object.vnum} />
		</div>
	);
}

const EXTRA_FLAGS: [number, string, string][] = [
	[1, "Glow", "Makes item glow; no effect, but can be altered by enchanting, illuminate, or conceal object"],
	[2, "Hum", "Makes item hum; no effect, but can be added by enchanting"],
	[4, "Dark", "Makes item dark; affects levers (ITEM_MARKINGS: see Table L: Item Type Values, type 30); affects harmonize spell; added by violate spell"],
	[8, "Lock", "Gives item lock flag. If item is on the ground it can only be addressed by the full keyword. This is true both for looking at the object's extra descriptions and the object's name. No affect on carried objects."],
	[16, "Evil", "Makes item evil; no effect"],
	[32, "Invis", "Makes item invisible; cannot be seen by players 4 levels below item level even with detect invis (for weapons, 6 levels below)"],
	[64, "Magic", "Makes item magic; affects transmute spell; added by enchanting, transmuting"],
	[128, "Nodrop", "Makes item undroppable; requires remove curse"],
	[256, "Bless", "Makes item blessed; item takes half damage; added by consecrate spell"],
	[512, "Anti Good", "Makes item unholdable by good players; affects cleanse spell"],
	[1024, "Anti Evil", "Makes item unholdable by evil players"],
	[2048, "Anti Neutral", "Makes item unholdable by neutral players"],
	[4096, "Noremove", "Cannot remove item once worn"],
	[8192, "Inventory", "Item disappears when character dies"],
	[16384, "Timed", "Item vanishes after timer expires; consult the Immortal in charge of your project if you need to use this"],
	[32768, "Charity", "Item requires fence to sell, cannot be sacrificed; flag added when item is donated"],
	[65536, "Good", "Makes item good; no effect"],
	[131072, "Nolocate", "Item not located using 'locate object'; removed by illuminate spell"],
	[262144, "Haggled", "Lowers value on item DO NOT USE IN BUILDING"],
	[524288, "Sharp", "Item has a (Sharp) before it; no effect; can be added by sharpening an item"],
	[1048576, "Dull", "Item has a (Dull) before it; no effect"],
	[2097152, "Reinforced", "Item is reinforced; item cannot be shattered by monk skill shatter strike; added by reinforce spell"],
	[4194304, "Electric Ward", "Item has an electric ward; added by ward spell"],
	[8388608, "Fire Ward", "Item has a fire ward; added by ward spell"],
	[16777216, "Ice Ward", "Item has an ice ward; added by ward spell"],
	[33554432, "Magic Ward", "Item has a caustic ward; added by ward spell"],
	[67108864, "Major Ward", "Item has all wards; added by major ward spell FOR LORD ITEMS ONLY"],
	[134217728, "Nocharm", "Wearer immune to charm and invis. If wearer is a mobile, player attempts to cast invis will send the player to jail instantly."],
	[268435456, "Spiritlink", "Item has a spiritlink to character"],
	[536870912, "Etch", "Item has been etched"],
	[1073741824, "Rune", "Item has been runed "],
];

const WEAR_FLAGS: { value: number, label: string }[] = [
	{ value: 0, label: "Not carryable" },
	{ value: 1, label: "Not wearable" },
	{ value: 1 | 2, label: "Finger" },
	{ value: 1 | 4, label: "Neck" },
	{ value: 1 | 8, label: "On body" },
	{ value: 1 | 16, label: "Head" },
	{ value: 1 | 32, label: "Legs" },
	{ value: 1 | 64, label: "Feet" },
	{ value: 1 | 128, label: "Hands" },
	{ value: 1 | 256, label: "Arms" },
	{ value: 1 | 512, label: "Shield" },
	{ value: 1 | 1024, label: "About body" },
	{ value: 1 | 2048, label: "Waist" },
	{ value: 1 | 4096, label: "Wrist" },
	{ value: 1 | 8192, label: "Wield" },
	{ value: 1 | 16384, label: "Hold" },
	// { value: 1 | 32768, label: "Floating" },
	// { value: 1 | 65536, label: "Insignia" },
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
