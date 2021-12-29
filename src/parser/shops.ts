import { Shop, ShopU, newShopU } from "../app/models/shops";
import { Mobile } from "../app/models";
import { parseNumber } from "./helpers";

enum ParseState {
	MobVnum,
	ObjectTypes,
	Profit,
	Hours,
}

export function parseShops(section: string): ShopU[] {
	let shops: ShopU[] = [];
	let parseState = ParseState.MobVnum;
	let shop = newShopU();

	let lines = section.split(/\r?\n/).map(l => l.trim());

	for (let line of lines) {
		if (!line) continue;

		if (line === "0") {
			// whatever
		}

		let tokens = line.split(/\s+/);

		switch (parseState as ParseState) {
			case ParseState.MobVnum: {
				parseState = ParseState.ObjectTypes;
				let [mobVnumString] = tokens;

				let mobVnum = parseNumber(mobVnumString);
				if (mobVnum != null) shop.mobVnum = mobVnum
				else shop._error.mobVnum = true;

				break;
			}
			case ParseState.ObjectTypes: {
				parseState = ParseState.Profit;
				let [oType1String, oType2String, oType3String, oType4String, oType5String] = tokens;

				let oType1 = parseNumber(oType1String);
				if (oType1 != null) shop.oType1 = oType1;
				else shop._error.oType1 = true;

				let oType2 = parseNumber(oType2String);
				if (oType2 != null) shop.oType2 = oType2;
				else shop._error.oType2 = true;

				let oType3 = parseNumber(oType3String);
				if (oType3 != null) shop.oType3 = oType3;
				else shop._error.oType3 = true;

				let oType4 = parseNumber(oType4String);
				if (oType4 != null) shop.oType4 = oType4;
				else shop._error.oType4 = true;

				let oType5 = parseNumber(oType5String);
				if (oType5 != null) shop.oType5 = oType5;
				else shop._error.oType5 = true;

				break;
			}
			case ParseState.Profit: {
				parseState = ParseState.Hours;
				let [profitBuyString, profitSellString] = tokens;

				let profitBuy = parseNumber(profitBuyString);
				if (profitBuy != null) shop.profitBuy = profitBuy;
				else shop._error.profitBuy = true;

				let profitSell = parseNumber(profitSellString);
				if (profitSell != null) shop.profitSell = profitSell;
				else shop._error.profitSell = true;

				break;
			}
			case ParseState.Hours: {
				parseState = ParseState.MobVnum;
				let [firstHourString, lastHourString] = tokens;

				let firstHour = parseNumber(firstHourString);
				if (firstHour != null) shop.firstHour = firstHour;
				else shop._error.firstHour = true;

				let lastHour = parseNumber(lastHourString);
				if (lastHour != null) shop.lastHour = lastHour;
				else shop._error.lastHour = true;

				shops.push(shop);
				shop = newShopU();
				break;
			}
		}
	}

	return shops;
}

export function corellateShops(mobiles: Mobile[], shopsU: ShopU[]): [Shop[], ShopU[]] {
	let shops: Shop[] = [];
	let orphaned: ShopU[] = [];

	for (let shopU of shopsU) {
		let mobile = mobiles.find(m => m.vnum === shopU.mobVnum);
		if (mobile) {
			let shop: Shop = {
				id: shopU.id,
				mobId: mobile.id,
				oType1: shopU.oType1,
				oType2: shopU.oType2,
				oType3: shopU.oType3,
				oType4: shopU.oType4,
				oType5: shopU.oType5,
				profitBuy: shopU.profitBuy,
				profitSell: shopU.profitSell,
				firstHour: shopU.firstHour,
				lastHour: shopU.lastHour,
				_error: shopU._error,
			};
			shops.push(shop);
		} else {
			shopU._error.mobVnum = true;
			orphaned.push(shopU);
		}
	}

	return [shops, orphaned];
}
