import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { updatedShop } from "../../app/store/mobiles";
import { Shop } from "../../app/models/shops";
import { NumberField, SelectField, ToolRow } from "../components";

interface Props {
	mobId: string;
	shop: Shop;
}

export default function ShopFields(props: Props) {
	const { mobId, shop } = props;
	const dispatch = useAppDispatch();
	return (
		<div>
			<ToolRow>
				<SelectObjectType value={shop.oType1} onUpdate={oType1 => dispatch(updatedShop([mobId, {...shop, oType1}]))} />
				<SelectObjectType value={shop.oType2} onUpdate={oType2 => dispatch(updatedShop([mobId, {...shop, oType2}]))} />
				<SelectObjectType value={shop.oType3} onUpdate={oType3 => dispatch(updatedShop([mobId, {...shop, oType3}]))} />
				<SelectObjectType value={shop.oType4} onUpdate={oType4 => dispatch(updatedShop([mobId, {...shop, oType4}]))} />
				<SelectObjectType value={shop.oType5} onUpdate={oType5 => dispatch(updatedShop([mobId, {...shop, oType5}]))} />
			</ToolRow>
			<ToolRow>
				<NumberField name="Profit Buy" value={shop.profitBuy} onUpdate={profitBuy => dispatch(updatedShop([mobId, {...shop, profitBuy}]))} />
				<NumberField name="Profit Sell" value={shop.profitSell} onUpdate={profitSell => dispatch(updatedShop([mobId, {...shop, profitSell}]))} />
				<NumberField name="Opening hour" value={shop.firstHour} min={0} max={23} onUpdate={firstHour => dispatch(updatedShop([mobId, {...shop, firstHour}]))} />
				<NumberField name="Closing hour" value={shop.lastHour} min={0} max={23} onUpdate={lastHour => dispatch(updatedShop([mobId, {...shop, lastHour}]))} />
			</ToolRow>
		</div>
	);
}

interface SelectObjectTypeProps {
	value: number;
	onUpdate: (n: number) => void;
	disabled?: boolean;
}

export function SelectObjectType({ value, onUpdate, disabled }: SelectObjectTypeProps) {
	return <SelectField disabled={disabled} value={value} options={ITEM_TYPE} onUpdate={onUpdate} />;
}

const ITEM_TYPE: { value: number, label: string }[] = [
	{ value: 0, label: "None" },
	{ value: 1, label: "Light" },
	{ value: 2, label: "Scroll" },
	{ value: 3, label: "Wand" },
	{ value: 4, label: "Staff" },
	{ value: 5, label: "Weapon" },
	{ value: 6, label: "Ticket" },
	{ value: 7, label: "Rogue Tool" },
	{ value: 8, label: "Treasure" },
	{ value: 9, label: "Armor" },
	{ value: 10, label: "Potion" },
	{ value: 11, label: "Poisoned Weapon" },
	{ value: 12, label: "Furniture" },
	{ value: 13, label: "Trash" },
	{ value: 14, label: "Poison" },
	{ value: 15, label: "Container" },
	// { value: 16, label: "" },
	{ value: 17, label: "Drink container" },
	{ value: 18, label: "Key" },
	{ value: 19, label: "Food" },
	{ value: 20, label: "Money" },
	// { value: 21, label: "" },
	{ value: 22, label: "Boat" },
	{ value: 23, label: "NPC Corpse" },
	{ value: 24, label: "PC Corpse" },
	{ value: 25, label: "Fountain" },
	{ value: 26, label: "Pill" },
	// { value: 27, label: "Sign_type_one" },
	{ value: 28, label: "Portal" },
	{ value: 29, label: "Nexus" },
	{ value: 30, label: "Marking" },
	{ value: 31, label: "Bow" },
	{ value: 32, label: "Arrow" },
	{ value: 33, label: "Gemstone" },
	{ value: 34, label: "Perfect gemstone" },
	{ value: 35, label: "Throwing weapon" },
	{ value: 36, label: "Perfect metal" },
	{ value: 37, label: "Spellbook" },
	// { value: 38, label: "" },
	{ value: 39, label: "Trap kit" },
];
