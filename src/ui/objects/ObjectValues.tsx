import React from "react";
import { useAppDispatch } from "../../app/hooks";
import {
	updatedValue0,
	updatedValue1,
	updatedValue2,
	updatedValue3,
} from "../../app/store/objects";
import {
	BitsField,
	CheckBox,
	NumberField,
	SelectField,
	ToolRow,
} from "../components";

import { parseBits } from "../../parser/helpers";

interface ObjectValuesComponentProps {
	id: string;
	type: number;
	value0: string;
	value1: string;
	value2: string;
	value3: string;
}

export default function ObjectValues(props: ObjectValuesComponentProps) {
	const { type, ...values } = props;
	switch (type) {
		case 1:
			return <LightValues {...values} />;
		case 2:
			return <ConsumableValues {...values} />;
		case 3:
		case 4:
			return <BrandishValues {...values} />;
		case 5:
			return <WeaponValues {...values} />;
		case 6:
			return <TicketValues {...values} />;
		case 7:
			return <RogueToolValues {...values} />;
		case 8:
			return null;
		case 9:
			return <ArmorValues {...values} />;
		case 10:
			return <ConsumableValues {...values} />;
		case 11:
			return <PoisonedWeaponValues {...values} />;
		case 12:
		case 13:
			return null;
		case 14:
			return <PoisonValues {...values} />;
		case 15:
			return <ContainerValues {...values} />;
		case 16:
			return null;
		case 17:
			return <DrinkContainerValues {...values} />;
		case 18:
			return <KeyValues {...values} />;
		case 19:
			return <FoodValues {...values} />;
		case 20:
			return <MoneyValues {...values} />;
		case 21:
		case 22:
		case 23:
		case 24:
			return null;
		case 25:
			return <FountainValues {...values} />;
		case 26:
			return <ConsumableValues {...values} />;
		case 27:
			return null;
		case 28:
		case 29:
			return <PortalValues {...values} />;
		case 30:
			return <MarkingValues {...values} />;
		case 31:
			return <BowValues {...values} />;
		case 32:
			return <ArrowValues {...values} />;
		case 33:
		case 34:
			return null;
		case 35:
			return <ThrowingWeaponValues {...values} />;
		case 36:
			return null;
		case 37:
			return <SpellbookValues {...values} />;
		case 38:
			return null;
		default:
			return null;
	}
}

function VnumWarning() {
	return <span>⚠ <em>Any VNUMs in these fields will <u>not</u> auto-update if you modify the mob/object/room that they point to.</em></span>;
}

interface ObjectValuesProps {
	id: string;
	value0: string;
	value1: string;
	value2: string;
	value3: string;
}

function LightValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value2 } = props;
	return (
		<>
			<NumberField name="Duration" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<em style={{width: "100%"}}>0: infinite but provides no light; -1: infinite, does provide light.</em>
		</>
	);
}

function ConsumableValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	return (
		<>
			<NumberField name="Spell Level" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Spell Slot #" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<NumberField name="Spell Slot #" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<NumberField name="Spell Slot #" value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		</>
	);
}

function BrandishValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	return (
		<>
			<NumberField name="Spell Level" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Max Charges" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<NumberField name="Current Charges" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<NumberField name="Spell Slot #" value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		</>
	);
}

const WEAPON_TYPE: { value: number, label: string }[] = [
	{ value: 0, label: "One-handed only" },
	{ value: 1, label: "Two-handed only" },
	{ value: 2, label: "One or two-handed" },
	{ value: 3, label: "Hafted" },
	{ value: 4, label: "Chained" },
	{ value: 5, label: "Double-headed" },
	{ value: 6, label: "Ethereal" },
	{ value: 7, label: "Concealable" },
];

const WEAPON_DAMAGE: { value: number, label: string }[] = [
	{ value: 0, label: "Hitting" },
	{ value: 1, label: "Slicing" },
	{ value: 2, label: "Stabbing" },
	{ value: 3, label: "Slashing" },
	{ value: 4, label: "Whipping" },
	{ value: 5, label: "Clawing" },
	{ value: 6, label: "Blasting" },
	{ value: 7, label: "Pounding" },
	{ value: 8, label: "Crushing" },
	{ value: 9, label: "Puncturing" },
	{ value: 10, label: "Biting" },
	{ value: 11, label: "Piercing" },
	{ value: 12, label: "Chopping" },
	{ value: 13, label: "Smacking" },
];

function value2wtypes(value3: string): [number, number] {
	const value = Number(value3);
	if (Number.isInteger(value)) {
		const damageType = value % 100;
		const weaponType = Math.floor(value / 100);
		return [weaponType, damageType];
	} else {
		return [0 ,0];
	}
}

function wtypes2value(weaponType: number, damageType: number): string {
	const value = weaponType * 100 + damageType;
	if (value > 0) return value.toString().padStart(3, "0");
	else return value.toString();
}

function WeaponValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value3 } = props;
	const [weaponType, damageType] = value2wtypes(value3);
	return (
		<>
			<SelectField name="Weapon Type" options={WEAPON_TYPE} value={weaponType} onUpdate={n => dispatch(updatedValue3([id, wtypes2value(n, damageType)]))} />
			<SelectField name="Damage Type" options={WEAPON_DAMAGE} value={damageType} onUpdate={n => dispatch(updatedValue3([id, wtypes2value(weaponType, n)]))} />
		</>
	);
}

const TICKET_TYPE: { value: number, label: string }[] = [
	{ value: 0, label: "Transport player" },
	{ value: 6, label: "Transport group" },
	{ value: 1, label: "Give object" },
	{ value: 5, label: "Give object (bound)" },
	{ value: 3, label: "Cast spell" },
	{ value: 4, label: "Authorize access" },
];

function TicketValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	const ticketType = Number(value3);

	let ticketFields;
	switch (ticketType) {
		case 0:
		case 6:
			ticketFields = <>
				<NumberField name="Destination Vnum" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
				<NumberField name="Max Level" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			</>;
			break;
		case 1:
		case 5:
			ticketFields = <>
				<NumberField name="Object Vnum" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
				<NumberField name="Object Level" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			</>
			break;
		case 3:
			ticketFields = <>
				<NumberField name="Spell SN" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
				<NumberField name="Spell Level" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			</>
			break;
		case 4:
			ticketFields = <NumberField name="Port #" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			break;
	}

	return (
		<>
			<NumberField name="Mob Vnum" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<SelectField name="Ticket type" options={TICKET_TYPE} value={ticketType} onUpdate={n => dispatch(updatedValue3([id, n]))} />
			{ticketFields}
			<VnumWarning />
		</>
	);
}

const ROGUE_TOOL_USAGE: [number, string, string][] = [
	[1, "lock pick (doors)", ""],
	[2, "lock pick (chests)", ""],
	[4, "trap disarming kit", ""],
	[8, "blackjack", ""],
	[16, "poisoning kit", ""],
	[64, "key copy kit", ""],
];

function value2bits(value: string): number[] {
	let { bits } = parseBits(value);
	return bits;
}

function bits2pipedValue(bits: number[]): string {
	return bits.map(b => b.toString()).join("|");
}

function RogueToolValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2 } = props;
	const usageBits = value2bits(value0);
	return (
		<>
			<NumberField name="Number of uses" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<NumberField name="Quality" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<BitsField style={{width: "100%"}} name="Rogue tool usage" map={ROGUE_TOOL_USAGE} value={usageBits} onUpdate={bits => dispatch(updatedValue0([id, bits2pipedValue(bits)]))} />
		</>
	);
}

const CHARGE_SHIELD: { value: number, label: string }[] = [
	{ value: 0, label: "None" },
	{ value: 1, label: "Venom (poison)" },
	{ value: 2, label: "Flash (blindness)" },
	{ value: 3, label: "Jolt" },
	{ value: 4, label: "Frostbite" },
	{ value: 5, label: "Flametongue" },
	{ value: 6, label: "Retribution (Imm only)" },
	{ value: 7, label: "Pulse (lord+)" },
	{ value: 8, label: "Arc lightning" },
];

const ARCHERY_MODS: [number, string, string][] = [
	[4, "Critical", "Improves odds of critical hits"],
	[8, "Hinder", "Hinders archery"],
	[16, "Longshot", "Improves longshot skill"],
	[32, "Scattershot", "Improves scattershot skill"],
	[64, "Aimed shot", "Improves aimed shot skill"],
	[128, "Fleeing", "Improves fleeing shot skill"],
	[256, "Damage", "Improves archery damage"],
	[512, "Hit", "Improves accuracy"],
	[1024, "Held shot", "Improves held shot skill"],
];

function ArmorValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value1, value2, value3 } = props;
	const archeryMods = value2bits(value3);
	return (
		<>
			<SelectField name="Charge shield type" options={CHARGE_SHIELD} value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<BitsField style={{width: "100%"}} name="Archery modifiers" map={ARCHERY_MODS} value={archeryMods} onUpdate={bits => dispatch(updatedValue3([id, bits2pipedValue(bits)]))} />
		</>
	);
}

const POISONS: { value: number, label: string, desc: string }[] = [
	{ value: 0, label: "Poison", desc: "Min level 5. Strength -2, 6 HP damage per tick." },
	{ value: 1, label: "Toxin", desc: "Min level 20. Hitroll -5, Dexterity -3, 47 HP damage per tick." },
	{ value: 2, label: "Biotoxin", desc: "Min level 35. Constitution -4, approx -7% damage to max HP, HP damage per tick based on max HP." },
	{ value: 3, label: "Virus", desc: "Min level 50. Strength/Constitution/Dexterity -6, 1 HP damage per tick." },
	{ value: 4, label: "Venom", desc: "Min level 50. % current HP damage per tick." },
	{ value: 5, label: "Plague", desc: "Min level 50. Causes plague on character." },
	{ value: 6, label: "Necrotia", desc: "Min level 124. HP damage on hit, none per tick." },
	{ value: 7, label: "Heartbane", desc: "Min level 124. Hinders healing until cured." },
	{ value: 8, label: "Doom toxin", desc: "Min level 124. Vicim dies when poison ticks off. Players must never loot these." },
	{ value: 9, label: "Psychotia", desc: "Min level 249. Causes scramble and overconfidence effects." },
	{ value: 10, label: "Pyrovirus", desc: "Min level 249. HP damage on hit, none per tick." },
	{ value: 11, label: "Liquid pain", desc: "Min level 249. HP damage on first and every tick until cured." },
];

function PoisonedWeaponValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value3 } = props;
	return (
		<>
			<SelectField name="Poison" options={POISONS} value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Number of doses" value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		</>
	);
}

function PoisonValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value3 } = props;
	return (
		<>
			<SelectField name="Poison" options={POISONS} value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Number of doses" value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		</>
	);
}

const CONTAINER_FLAGS: [number, string, string][] = [
	[1, "Openable, closeable", ""],
	[2, "Pickproof", ""],
	[4, "Closed", ""],
	[8, "Locked", ""],
	[16, "Breakable", ""],
];

const TRAP_TYPE: { value: number, label: string }[] = [
	{ value: 0, label: "None" },
	{ value: 1, label: "Poison gas" },
	{ value: 2, label: "Poison darts" },
	{ value: 3, label: "Poison needle" },
	{ value: 4, label: "Gas spores" },
	{ value: 5, label: "Venom (poison)" },
	{ value: 6, label: "Blade" },
	{ value: 7, label: "Detonator" },
	{ value: 8, label: "Electric" },
];

function ContainerValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	const containerFlags = value2bits(value1);
	return (
		<>
			<NumberField name="Weight Capacity" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Key Vnum" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<SelectField name="Trap" options={TRAP_TYPE} value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
			<BitsField style={{width: "100%"}} name="Container accessibility" map={CONTAINER_FLAGS} value={containerFlags} onUpdate={bits => dispatch(updatedValue1([id, bits2pipedValue(bits)]))} />
			<VnumWarning />
		</>
	);
}

const DRINKS: { value: number, label: string }[] = [
	{ value: 0, label: "Water" },
	{ value: 1, label: "Beer" },
	{ value: 2, label: "Wine" },
	{ value: 3, label: "Ale" },
	{ value: 4, label: "Darkale" },
	{ value: 5, label: "Whiskey" },
	{ value: 6, label: "Lemonade" },
	{ value: 7, label: "Firebreather" },
	{ value: 8, label: "Local specialty" },
	{ value: 9, label: "Slime mold juice" },
	{ value: 10, label: "Milk" },
	{ value: 11, label: "Tea" },
	{ value: 12, label: "Coffee" },
	{ value: 13, label: "Blood" },
	{ value: 14, label: "Salt water" },
	{ value: 15, label: "Cherry Cola" },
	{ value: 16, label: "Pepsi" },
	{ value: 17, label: "Orange Juice" },
	{ value: 18, label: "Grape Juice" },
	{ value: 19, label: "Champagne " },
];

function DrinkContainerValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	return (
		<>
			<NumberField name="Capacity" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Current quantity" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<SelectField name="Drink" options={DRINKS} value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<CheckBox name="Poisoned" value={Number(value3)} onUpdate={checked => dispatch(updatedValue3([id, checked ? "1" : "0"]))} />
		</>
	);
}

function KeyValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2 } = props;
	return (
		<>
			<NumberField name="Uses" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Failure rate" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<CheckBox name="Forgery" value={Number(value2)} onUpdate={checked => dispatch(updatedValue2([id, checked ? "1" : "0"]))} />
		</>
	);
}

function FoodValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value3 } = props;
	return (
		<>
			<NumberField name="Nutritive value" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<CheckBox name="Poisoned" value={Number(value3)} onUpdate={checked => dispatch(updatedValue3([id, checked ? "1" : "0"]))} />
		</>
	);
}

function MoneyValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	return (
		<>
			<NumberField name="Value" value={Number(props.value0)} onUpdate={n => dispatch(updatedValue0([props.id, n]))} />
		</>
	);
}

const FOUNTAIN_FLAGS: [number, string, string][] = [
	[1, "Poisons drinker", ""],
	[4, "Transfers drinker", "Destination room vnum is fountain vnum."],
	[8, "Loads mob", "Mob vnum is fountain vnum. Mob is aggie to drinker. Fountain disappears after."],
];

const FOUNTAIN_MODE: { value: string, label: string }[] = [
	{ value: "transfer", label: "Transfer drinker to room" },
	{ value: "flags", label: "Use fountain flags"},
];

function FountainValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	const rawValue3 = Number(value3);
	const destinationVnum = Number.isInteger(rawValue3) && rawValue3 < 0 ? rawValue3 * -1 : null;
	const fountainFlags = value2bits(value3);
	const mode = destinationVnum != null ? "transfer" : "flags";

	function toggleMode(mode: string) {
		if (mode === "transfer") {
			dispatch(updatedValue3([id, -1]))
		} else {
			dispatch(updatedValue3([id, "0"]))
		}
	}

	return <>
		<NumberField name='"Good" spell slot #' value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
		<NumberField name='"Bad" spell slot #' value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
		<SelectField name="Drink" options={DRINKS} value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />

		<ToolRow style={{width: "100%"}}>
			<SelectField name="Fountain mode" options={FOUNTAIN_MODE} value={mode} onUpdate={toggleMode} />
			{destinationVnum != null
				? <>
					<NumberField name="Transport destination" value={destinationVnum} onUpdate={n => dispatch(updatedValue3([id, n * -1]))} />
					<VnumWarning />
				</>
				: <BitsField name="Flags" map={FOUNTAIN_FLAGS} value={fountainFlags} onUpdate={bits => dispatch(updatedValue3([id, bits2pipedValue(bits)]))} />}
		</ToolRow>
	</>;
}

const PORTAL_DRAIN: { value: number, label: string }[] = [
	{ value: 0, label: "Random chance" },
	{ value: 1, label: "Always drains" },
	{ value: 2, label: "Never drains" },
];

function PortalValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1 } = props;
	return (
		<>
			<NumberField name="Destination Vnum" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<SelectField name="Portal drain" options={PORTAL_DRAIN} value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<VnumWarning />
		</>
	);
}

const MARKING_VISIBILITY: [number, string, string][] = [
	[1, "Thief mark", "Cannot be seen without rogue lore."],
	[2, "Magical", "Cannot be seen without detect magic."],
	[4, "Hidden", "Cannot be seen without detect hidden."],
	[8, "Psionic", "Can only be seen by Psionicists."],
	[16, "Alertness", "Alertness required to see this."],
	[32, "Woodcraft", "Woodcraft required to see this."],
];

const MARKING_DOOR_FLAGS: [number, string, string][] = [
	[1, "Door", "Can be opened or closed."],
	[2, "Closed", ""],
	[4, "Locked", ""],
	[32, "Pickproof", ""],
	[64, "Bashproof", ""],
	[128, "Phaseproof", ""],
	[256, "Slamming", "Door will slam after a group passes through it."],
	[512, "Slamming (1)", "Door will slam after a single player passes through it."],
	[1024, "Slamming (random)", "Door has a chance to slam shut after a player passes through it."],
	[2048, "Slamming (random group)", "Same as Slamming (random) but always slams shut after a group passes through it."],
];

function value2markingDir(value: string): { direction: number, roomVnum: number } {
	let result = { direction: 0, roomVnum: 0 };

	let number = Number(value);
	if (Number.isNaN(number)) return result;
	if (number < 0) {
		number = number * -1;
		result.direction = number % 10;
		number = Math.floor(number / 10);
		result.roomVnum = number;
	} else {
		result.direction = number;
	}

	return result;
}

function markingDir2value(direction: number, roomVnum: number): string {
	if (roomVnum > 0) {
		const number = (roomVnum * 10 + direction) * -1;
		return number.toString();
	} else {
		return direction.toString();
	}
}

function MarkingValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	const { direction, roomVnum } = value2markingDir(value1);
	const visibility = value2bits(value2);
	const doorEffects = value2bits(value3);
	return (
		<>
			<NumberField name="Min level to see" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Direction to affect" value={direction} onUpdate={n => dispatch(updatedValue1([id, markingDir2value(n, roomVnum)]))} />
			<NumberField name="Room to affect (0 for this room)" value={roomVnum} onUpdate={n => dispatch(updatedValue1([id, markingDir2value(direction, n)]))} />
			<VnumWarning />
			<BitsField style={{width: "100%"}} name="Visibility" map={MARKING_VISIBILITY} value={visibility} onUpdate={bits => dispatch(updatedValue2([id, bits2pipedValue(bits)]))} />
			<BitsField style={{width: "100%"}} name="Door effects" map={MARKING_DOOR_FLAGS} value={doorEffects} onUpdate={bits => dispatch(updatedValue3([id, bits2pipedValue(bits)]))} />
		</>
	);
}

const BOW_TYPE: { value: number, label: string }[] = [
	{ value: 0, label: "Short bow" },
	{ value: 1, label: "Long bow" },
	{ value: 2, label: "Light crossbow" },
	{ value: 3, label: "Heavy crossbow" },
	{ value: 4, label: "Compound bow" },
	{ value: 5, label: "Sling" },
	{ value: 6, label: "Gun (arbalest)" },
	{ value: 7, label: "Dart gun" },
	{ value: 8, label: "Generic" },
];

function BowValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0 } = props;
	return (
		<>
			<SelectField name="Bow type" options={BOW_TYPE} value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
		</>
	);
}

const ARROW_TYPE: { value: number, label: string, desc: string }[] = [
	{ value: 0, label: "Standard", desc: "Min level 4." },
	{ value: 1, label: "Steel", desc: "Min level 16. Nigh unbreakable." },
	{ value: 2, label: "Barbed", desc: "Min level 26. Barb effect." },
	{ value: 3, label: "Splinter", desc: "Min level 54. Weak vs. armor." },
	{ value: 4, label: "Flaming", desc: "Min level 45." },
	{ value: 5, label: "Explosive", desc: "Min level 54. Rare." },
	{ value: 6, label: "Piercing", desc: "Min level 53. Ignores armor." },
	{ value: 7, label: "Poison", desc: "Carries poison" },
	{ value: 8, label: "Ice", desc: "Min level 128." },
	{ value: 9, label: "Lightning", desc: "Min level 128. Ignores shield, stuns." },
	{ value: 10, label: "Ebony", desc: "Min level 128. Ignores armor and shield, rare." },
	{ value: 11, label: "Mithril", desc: "Min level 128. Nigh unbreakable." },
	{ value: 12, label: "Sableroix", desc: "Min level 4. Quest prize arrow for low mortals." },
	{ value: 13, label: "Glass", desc: "Min level 1. Quest prize arrow for higher players." },
	{ value: 14, label: "Cluster", desc: "Min level 253. Weak vs. armor." },
	{ value: 15, label: "Sunray", desc: "Min level 253. Ignores armor and shield, rare." },
	{ value: 16, label: "Displacement", desc: "Min level 253. Ignores armor." },
	{ value: 17, label: "Terror", desc: "Min level 253. Barb effect, carries poison." },
	{ value: 18, label: "Faerie arrow", desc: "Min level 54. Reduces AC and defense against archery damage." },
	{ value: 19, label: "Green arrow", desc: "Min level 54. Nigh unbreakable, harms undead." },
	{ value: 20, label: "Moonshard arrow", desc: "Min level 54. Ignores armor, applies cold vulnerability." },
	{ value: 21, label: "Autumn arrow", desc: "Min level 54. Applies hitroll penalty, fire vulnerability." },
	{ value: 22, label: "Thundercrack arrow", desc: "Min level 128. Ignores armor and shield, stuns." },
];

const AMMO_TYPE: { value: number, label: string, desc: string }[] = [
	{ value: 0, label: "Arrow", desc: "Used by long bow, short bow, compound bow." },
	{ value: 1, label: "Bolt", desc: "Used by light crossbow, heavy crossbow." },
	{ value: 2, label: "Stone", desc: "Used by sling." },
	{ value: 3, label: "Bullet", desc: "Used by arbalest." },
	{ value: 4, label: "Dart", desc: "Used by dart guns." },
	{ value: 5, label: "Shot", desc: "Used by generic projectile weapons." },
];

function ArrowValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	const warhead = Number(value0);
	const warheadMessage = ARROW_TYPE.find((arrow) => arrow.value === warhead)
	const ammoType = Number(value1);
	const ammoMessage = AMMO_TYPE.find((ammo) => ammo.value === ammoType);
	const isPoisonArrow = warhead === 7 || warhead === 17;
	return <>
		<SelectField name="Warhead" options={ARROW_TYPE} value={warhead} onUpdate={n => dispatch(updatedValue0([id, n]))} />
		<SelectField name="Ammo type" options={AMMO_TYPE} value={ammoType} onUpdate={n => dispatch(updatedValue1([id, n]))} />
		<SelectField name="Poison" options={POISONS} value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} disabled={!isPoisonArrow} />
		<NumberField name="Number of arrows" value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		<em style={{width: "100%"}}>
			{ammoMessage && ammoMessage.desc} {warheadMessage && warheadMessage.desc}
		</em>
	</>;
}

const THROWING_WEAPON_FLAGS: [number, string, string][] = [
	[1, 'Drop on hit', 'Drops to ground when it hits.'],
	[2, 'Disappear on hit', 'Disappears when it hits.'],
	[4, 'Disappear on miss', 'Disappears when it misses.'],
	[8, 'Return on hit', 'Returns when it hits.'],
	[16, 'Return on miss', 'Returns when it misses.'],
	[32, 'Good melee weapon', 'Good as a melee weapon.'],
	[64, 'Bad melee weapon', 'Bad as a melee weapon.'],
	[128, 'Nil melee damage', 'Nil melee damage.'],
	[256, '"Sting"', 'High chance of poisoning on hit.'],
	[512, '"Area"', 'Damages multiple mobs.'],
	[1024, 'Not catchable', 'Not catchable.'],
	[2048, 'Easy to catch', 'Easy to catch.'],
	[4096, 'Quick to throw', 'Can throw from offhand.'],
];

const THROWING_WEAPON_POISON: { value: number, label: string, desc: string }[] = [
	{ value: -2, label: "Not poisonable", desc: "" },
	{ value: -1, label: "Poisonable, empty", desc: "" },
	...POISONS,
];

function ThrowingWeaponValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	const throwingFlags = value2bits(value0);
	return (
		<>
			<NumberField name="Min damage" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<NumberField name="Max damage" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<SelectField name="Poison" options={THROWING_WEAPON_POISON} value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
			<BitsField style={{width: "100%"}} name="Weapon effects" map={THROWING_WEAPON_FLAGS} value={throwingFlags} onUpdate={bits => dispatch(updatedValue0([id, bits2pipedValue(bits)]))} />
		</>
	);
}

function SpellbookValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	return (
		<>
			<NumberField name="Spell SN" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Min level to read" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<NumberField name="% gain" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<NumberField name="Max % teachable" value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		</>
	);
}
