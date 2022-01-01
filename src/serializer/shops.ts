import { Mobile, Shop } from "../app/models";
import { findVnum } from "../app/models/helpers";

type Shops = { [s: string]: Shop };

export default function serializeShops(shops: Shops, mobiles: Mobile[]): string {
	let buffer = "";

	for (let shop of Object.values(shops)) {
		buffer += serializeShop(shop, mobiles) + "\n";
	}

	if (buffer !== "") return `#SHOPS\n\n${buffer}0\n`;
	else return "";
}

export function serializeShop(shop: Shop, mobiles: Mobile[]): string {
	let vnum = findVnum(mobiles, shop.mobId);

	return `${vnum}
${shop.oType1} ${shop.oType2} ${shop.oType3} ${shop.oType4} ${shop.oType5}
${shop.profitBuy} ${shop.profitSell}
${shop.firstHour} ${shop.lastHour}
`;
}
