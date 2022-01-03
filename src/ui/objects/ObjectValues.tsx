import React from "react";
import { useAppDispatch } from "../app/hooks";
import {
	updatedValue0,
	updatedValue1,
	updatedValue2,
	updatedValue3,
} from "../app/store/objects";
import { NumberField, SelectField } from "./fields";
import BitsField from "./components/BitsField";

import { parseBits } from "../parser/helpers";

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
		<div>
			<NumberField name="Duration" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<p>Hours of light available. 0: infinite but provides no light; -1: infinite, does provide light.</p>
		</div>
	);
}

function ConsumableValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	return (
		<div>
			<NumberField name="Spell Level" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Spell Slot #" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<NumberField name="Spell Slot #" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<NumberField name="Spell Slot #" value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		</div>
	);
}

function BrandishValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	return (
		<div>
			<NumberField name="Spell Level" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Max Charges" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<NumberField name="Current Charges" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<NumberField name="Spell Slot #" value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		</div>
	);
}

const WEAPON_TYPE: [number, string][] = [
	[0, "one-handed only"],
	[1, "two-handed only"],
	[2, "one or two-handed"],
	[3, "hafted"],
	[4, "chained"],
	[5, "double-headed"],
	[6, "ethereal"],
	[7, "concealable"],
];

const WEAPON_DAMAGE: [number, string][] = [
	[0, "hitting"],
	[1, "slicing"],
	[2, "stabbing"],
	[3, "slashing"],
	[4, "whipping"],
	[5, "clawing"],
	[6, "blasting"],
	[7, "pounding"],
	[8, "crushing"],
	[9, "puncturing"],
	[10, "biting"],
	[11, "piercing"],
	[12, "chopping"],
	[13, "smacking"],
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
		<div>
			<SelectField name="Weapon Type" map={WEAPON_TYPE} value={weaponType} onUpdate={n => dispatch(updatedValue3([id, wtypes2value(n, damageType)]))} />
			<SelectField name="Damage Type" map={WEAPON_DAMAGE} value={damageType} onUpdate={n => dispatch(updatedValue3([id, wtypes2value(weaponType, n)]))} />
		</div>
	);
}

const TICKET_TYPE: [number, string][] = [
	[0, "Transport player"],
	[6, "Transport group"],
	[1, "Give object"],
	[5, "Give object (bound)"],
	[3, "Cast spell"],
	[4, "Authorize access"],
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
		<div>
			<NumberField name="Mob Vnum" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<SelectField name="Ticket type" map={TICKET_TYPE} value={ticketType} onUpdate={n => dispatch(updatedValue3([id, n]))} />
			{ticketFields}
		</div>
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
		<div>
			<BitsField name="Usage" map={ROGUE_TOOL_USAGE} value={usageBits} onUpdate={bits => dispatch(updatedValue0([id, bits2pipedValue(bits)]))} />
			<NumberField name="Number of uses" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<NumberField name="Quality" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
		</div>
	);
}

const CHARGE_SHIELD: [number, string][] = [
	[0, "none"],
	[1, "venom (poison)"],
	[2, "flash (blindness)"],
	[3, "jolt"],
	[4, "frostbite"],
	[5, "flametongue"],
	[6, "retribution (imm only)"],
	[7, "pulse (lord+)"],
	[8, "arc lightning"],
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
		<div>
			<SelectField name="Charge shield type" map={CHARGE_SHIELD} value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<BitsField name="Archery modifiers" map={ARCHERY_MODS} value={archeryMods} onUpdate={bits => dispatch(updatedValue3([id, bits2pipedValue(bits)]))} />
		</div>
	);
}

const POISONS: [number, string, string][] = [
	[0, "poison", "Min level 5. Strength -2, 6 HP damage per tick."],
	[1, "toxin", "Min level 20. Hitroll -5, Dexterity -3, 47 HP damage per tick."],
	[2, "biotoxin", "Min level 35. Constitution -4, approx -7% damage to max HP, HP damage per tick based on max HP."],
	[3, "virus", "Min level 50. Strength/Constitution/Dexterity -6, 1 HP damage per tick."],
	[4, "venom", "Min level 50. % current HP damage per tick."],
	[5, "plague", "Min level 50. Causes plague on character."],
	[6, "necrotia", "Min level 124. HP damage on hit, none per tick."],
	[7, "heartbane", "Min level 124. Hinders healing until cured."],
	[8, "doom toxin", "Min level 124. Vicim dies when poison ticks off. Players must never loot these."],
	[9, "psychotia", "Min level 249. Causes scramble and overconfidence effects."],
	[10, "pyrovirus", "Min level 249. HP damage on hit, none per tick."],
	[11, "liquid pain", "Min level 249. HP damage on first and every tick until cured."],
];

function PoisonedWeaponValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value3 } = props;
	return (
		<div>
			<SelectField name="Poison" map={POISONS} value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Number of doses" value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		</div>
	);
}

function PoisonValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value3 } = props;
	return (
		<div>
			<SelectField name="Poison" map={POISONS} value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Number of doses" value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		</div>
	);
}

const CONTAINER_FLAGS: [number, string, string][] = [
	[1, "openable/closeable", ""],
	[2, "pickproof", ""],
	[4, "closed", ""],
	[8, "locked", ""],
	[16, "breakable", ""],
];

const TRAP_TYPE: [number, string][] = [
	[0, "none"],
	[1, "poison gas"],
	[2, "poison darts"],
	[3, "poison needle"],
	[4, "gas spores"],
	[5, "venom (poison)"],
	[6, "blade"],
	[7, "detonator"],
	[8, "electric"],
];

function ContainerValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	const containerFlags = value2bits(value1);
	return (
		<div>
			<NumberField name="Weight Capacity" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<BitsField name="Accessibility" map={CONTAINER_FLAGS} value={containerFlags} onUpdate={bits => dispatch(updatedValue1([id, bits2pipedValue(bits)]))} />
			<NumberField name="Key Vnum" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<SelectField name="Trap" map={TRAP_TYPE} value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		</div>
	);
}

const DRINKS: [number, string][] = [
	[0, "Water"],
	[1, "Beer"],
	[2, "Wine"],
	[3, "Ale"],
	[4, "Darkale"],
	[5, "Whiskey"],
	[6, "Lemonade"],
	[7, "Firebreather"],
	[8, "Local specialty"],
	[9, "Slime mold juice"],
	[10, "Milk"],
	[11, "Tea"],
	[12, "Coffee"],
	[13, "Blood"],
	[14, "Salt water"],
	[15, "Cherry Cola"],
	[16, "Pepsi"],
	[17, "Orange Juice"],
	[18, "Grape Juice"],
	[19, "Champagne "],
];

function DrinkContainerValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	return (
		<div>
			<NumberField name="Capacity" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Current quantity" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<SelectField name="Drink" map={DRINKS} value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<label>Poisoned <input type="checkbox" checked={Number(value3) != 0} onChange={e => dispatch(updatedValue3([id, e.target.checked ? "1" : "0"]))} /></label>
		</div>
	);
}

function KeyValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2 } = props;
	return (
		<div>
			<NumberField name="Uses" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Failure rate" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<label>Forgery <input type="checkbox" checked={Number(value2) != 0} onChange={e => dispatch(updatedValue2([id, e.target.checked ? "1" : "0"]))} /></label>
		</div>
	);
}

function FoodValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value3 } = props;
	return (
		<div>
			<NumberField name="Nutritive value" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<label>Poisoned <input type="checkbox" value={Number(value3)} onChange={e => dispatch(updatedValue3([id, e.target.checked ? "1" : "0"]))} /></label>
		</div>
	);
}

function MoneyValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	return (
		<div>
			<NumberField name="Value" value={Number(props.value0)} onUpdate={n => dispatch(updatedValue0([props.id, n]))} />
		</div>
	);
}

const FOUNTAIN_FLAGS: [number, string, string][] = [
	[1, "poisons drinker", ""],
	[4, "Transfers drinker", "Destination room vnum is fountain vnum."],
	[8, "Loads mob", "Mob vnum is fountain vnum. Mob is aggie to drinker. Fountain disappears after."],
];

function value2destination(value: string): number | null {
	const number = Number(value);
	if (Number.isNaN(number)) return null;
	if (Number.isInteger(number) && number < 0) return number * -1;
	return null;
}

function FountainValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	// FIXME: allow toggling between transport destination and fountain flags
	const destinationVnum = value2destination(value3);
	const fountainFlags = value2bits(value3);
	return (
		<div>
			<NumberField name='"Good" Spell slot #' value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name='"Bad" Spell slot #' value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<SelectField name="Drink" map={DRINKS} value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			{destinationVnum != null
				? <NumberField name="Transport destination" value={destinationVnum} onUpdate={n => dispatch(updatedValue3([id, n * -1]))} />
				: <BitsField name="Flags" map={FOUNTAIN_FLAGS} value={fountainFlags} onUpdate={bits => dispatch(updatedValue3([id, bits2pipedValue(bits)]))} />
			}
		</div>
	);
}

const PORTAL_DRAIN: [number, string][] = [
	[0, "Random chance"],
	[1, "Always drains"],
	[2, "Never drains"],
];

function PortalValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1 } = props;
	return (
		<div>
			<NumberField name="Destination Vnum" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<SelectField name="Portal drain" map={PORTAL_DRAIN} value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
		</div>
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
		<div>
			<NumberField name="Min level to see" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<BitsField name="Visibility" map={MARKING_VISIBILITY} value={visibility} onUpdate={bits => dispatch(updatedValue2([id, bits2pipedValue(bits)]))} />
			<NumberField name="Direction to affect" value={direction} onUpdate={n => dispatch(updatedValue1([id, markingDir2value(n, roomVnum)]))} />
			<NumberField name="Room to affect (0 for this room)" value={roomVnum} onUpdate={n => dispatch(updatedValue1([id, markingDir2value(direction, n)]))} />
			<BitsField name="Door effects" map={MARKING_DOOR_FLAGS} value={doorEffects} onUpdate={bits => dispatch(updatedValue3([id, bits2pipedValue(bits)]))} />
		</div>
	);
}

const BOW_TYPE: [number, string][] = [
	[0, "short bow"],
	[1, "long bow"],
	[2, "light crossbow"],
	[3, "heavy crossbow"],
	[4, "compound bow"],
	[5, "sling"],
	[6, "gun (arbalest)"],
	[7, "dart gun"],
	[8, "generic"],
];

function BowValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0 } = props;
	return (
		<div>
			<SelectField name="Bow type" map={BOW_TYPE} value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
		</div>
	);
}

const ARROW_TYPE: [number, string, string][] = [
	[0, "Standard", "Min level 4."],
	[1, "Steel", "Min level 16. Nigh unbreakable."],
	[2, "Barbed", "Min level 26. Barb effect."],
	[3, "Splinter", "Min level 54. Weak vs. armor."],
	[4, "Flaming", "Min level 45."],
	[5, "Explosive", "Min level 54. Rare."],
	[6, "Piercing", "Min level 53. Ignores armor."],
	[7, "Poison", "Carries poison"],
	[8, "Ice", "Min level 128."],
	[9, "Lightning", "Min level 128. Ignores shield, stuns."],
	[10, "Ebony", "Min level 128. Ignores armor and shield, rare."],
	[11, "Mithril", "Min level 128. Nigh unbreakable."],
	[12, "Sableroix", "Min level 4. Quest prize arrow for low mortals."],
	[13, "Glass", "Min level 1. Quest prize arrow for higher players."],
	[14, "Cluster", "Min level 253. Weak vs. armor."],
	[15, "Sunray", "Min level 253. Ignores armor and shield, rare."],
	[16, "Displacement", "Min level 253. Ignores armor."],
	[17, "Terror", "Min level 253. Barb effect, carries poison."],
	[18, "Faerie arrow", "Min level 54. Reduces AC and defense against archery damage."],
	[19, "Green arrow", "Min level 54. Nigh unbreakable, harms undead."],
	[20, "Moonshard arrow", "Min level 54. Ignores armor, applies cold vulnerability."],
	[21, "Autumn arrow", "Min level 54. Applies hitroll penalty, fire vulnerability."],
	[22, "Thundercrack arrow", "Min level 128. Ignores armor and shield, stuns."],
];

const AMMO_TYPE: [number, string, string][] = [
	[0, "Arrow", "Used by long bow, short bow, compound bow."],
	[1, "Bolt", "Used by light crossbow, heavy crossbow."],
	[2, "Stone", "Used by sling."],
	[3, "Bullet", "Used by arbalest."],
	[4, "Dart", "Used by dart guns."],
	[5, "Shot", "Used by generic projectile weapons."],
];

function ArrowValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	const warhead = Number(value0);
	const warheadMessage = ARROW_TYPE.find(([w]) => w === warhead)
	const ammoType = Number(value1);
	const ammoMessage = AMMO_TYPE.find(([a]) => a === ammoType);
	return (
		<div>
			<SelectField name="Warhead" map={ARROW_TYPE} value={warhead} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<SelectField name="Ammo type" map={AMMO_TYPE} value={ammoType} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<SelectField name="Poison (for poison arrows)" map={POISONS} value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<NumberField name="Number of arrows" value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
			{ammoMessage && <p>{ammoMessage[2]}</p>}
			{warheadMessage && <p>{warheadMessage[2]}</p>}
		</div>
	);
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

const THROWING_WEAPON_POISON: [number, string, string][] = [
	[-2, "Not poisonable", ""],
	[-1, "Poisonable, empty", ""],
	...POISONS,
];

function ThrowingWeaponValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	const throwingFlags = value2bits(value0);
	return (
		<div>
			<BitsField name="Weapon effects" map={THROWING_WEAPON_FLAGS} value={throwingFlags} onUpdate={bits => dispatch(updatedValue0([id, bits2pipedValue(bits)]))} />
			<NumberField name="Min damage" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<NumberField name="Max damage" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<SelectField name="Poison" map={THROWING_WEAPON_POISON} value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		</div>
	);
}

function SpellbookValues(props: ObjectValuesProps) {
	const dispatch = useAppDispatch();
	const { id, value0, value1, value2, value3 } = props;
	return (
		<div>
			<NumberField name="Spell SN" value={Number(value0)} onUpdate={n => dispatch(updatedValue0([id, n]))} />
			<NumberField name="Min level to read" value={Number(value1)} onUpdate={n => dispatch(updatedValue1([id, n]))} />
			<NumberField name="% gain" value={Number(value2)} onUpdate={n => dispatch(updatedValue2([id, n]))} />
			<NumberField name="Max % teachable" value={Number(value3)} onUpdate={n => dispatch(updatedValue3([id, n]))} />
		</div>
	);
}
