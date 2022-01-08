import { Mobile, Shop } from "../app/models";
import { findVnum } from "../app/models/helpers";

export default function serializeShops(mobiles: Mobile[]): string {
	let buffer = "";

	for (let mobile of mobiles) {
		if (mobile.shop) buffer += serializeShop(mobile.vnum, mobile.shop) + "\n";
	}

	if (buffer !== "") return `#SHOPS\n\n${buffer}0\n`;
	else return "";
}

export function serializeShop(vnum: number | null, shop: Shop): string {

	return `${vnum}
${shop.oType1} ${shop.oType2} ${shop.oType3} ${shop.oType4} ${shop.oType5}
${shop.profitBuy} ${shop.profitSell}
${shop.firstHour} ${shop.lastHour}
`;
}
