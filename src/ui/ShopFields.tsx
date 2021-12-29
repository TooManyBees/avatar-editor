import React from "react";
import { useAppDispatch } from "../app/hooks";
import { updatedShop } from "../app/store/shops";
import { Shop } from "../app/models/shops";
import { NumberField, SelectField } from "./fields";

interface Props {
	shop: Shop;
}

export default function ShopFields(props: Props) {
	const { shop } = props;
	const dispatch = useAppDispatch();
	return (
		<div>
			<SelectField name="Object Type" value={shop.oType1} map={ITEM_TYPE} onUpdate={oType1 => dispatch(updatedShop({...shop, oType1}))} />
			<SelectField name="Object Type" value={shop.oType2} map={ITEM_TYPE} onUpdate={oType2 => dispatch(updatedShop({...shop, oType2}))} />
			<SelectField name="Object Type" value={shop.oType3} map={ITEM_TYPE} onUpdate={oType3 => dispatch(updatedShop({...shop, oType3}))} />
			<SelectField name="Object Type" value={shop.oType4} map={ITEM_TYPE} onUpdate={oType4 => dispatch(updatedShop({...shop, oType4}))} />
			<SelectField name="Object Type" value={shop.oType5} map={ITEM_TYPE} onUpdate={oType5 => dispatch(updatedShop({...shop, oType5}))} />
			<NumberField name="Profit Buy" value={shop.profitBuy} onUpdate={profitBuy => dispatch(updatedShop({...shop, profitBuy}))} />
			<NumberField name="Profit Sell" value={shop.profitSell} onUpdate={profitSell => dispatch(updatedShop({...shop, profitSell}))} />
			<NumberField name="Opening hour" value={shop.firstHour} onUpdate={firstHour => dispatch(updatedShop({...shop, firstHour}))} />
			<NumberField name="Closing hour" value={shop.lastHour} onUpdate={lastHour => dispatch(updatedShop({...shop, lastHour}))} />
		</div>
	);
}

const ITEM_TYPE: [number, string][] = [
	[0, "none"],
	[1, "Light"],
	[2, "Scroll"],
	[3, "Wand"],
	[4, "Staff"],
	[5, "Weapon"],
	[6, "Ticket"],
	[7, "Rogue Tool"],
	[8, "Treasure"],
	[9, "Armor"],
	[10, "Potion"],
	[11, "Poisoned Weapon"],
	[12, "Furniture"],
	[13, "Trash"],
	[14, "Poison"],
	[15, "Container"],
	// [16, ""],
	[17, "Drink container"],
	[18, "Key"],
	[19, "Food"],
	[20, "Money"],
	// [21, ""],
	[22, "Boat"],
	[23, "NPC Corpse"],
	[24, "PC Corpse"],
	[25, "Fountain"],
	[26, "Pill"],
	// [27, "Sign_type_one"],
	[28, "Portal"],
	[29, "Nexus"],
	[30, "Marking"],
	[31, "Bow"],
	[32, "Arrow"],
	[33, "Gemstone"],
	[34, "Perfect gemstone"],
	[35, "Throwing weapon"],
	[36, "Perfect metal"],
	[37, "Spellbook"],
	// [38, ""],
	[39, "Trap kit"],
];
