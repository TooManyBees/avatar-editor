import { newId, ErrorMarkers } from "./helpers";

export interface ShopU {
	readonly id: string;
	mobVnum: number;
	oType1: number;
	oType2: number;
	oType3: number;
	oType4: number;
	oType5: number;
	profitBuy: number;
	profitSell: number;
	firstHour: number;
	lastHour: number;
	_error: {
		all?: boolean;
		mobVnum?: boolean;
		oType1?: boolean;
		oType2?: boolean;
		oType3?: boolean;
		oType4?: boolean;
		oType5?: boolean;
		profitBuy?: boolean;
		profitSell?: boolean;
		firstHour?: boolean;
		lastHour?: boolean;
	};
}

export const newShopU = (): ShopU => ({
	id: newId(),
	mobVnum: 0,
	oType1: 0,
	oType2: 0,
	oType3: 0,
	oType4: 0,
	oType5: 0,
	profitBuy: 150,
	profitSell: 50,
	firstHour: 0,
	lastHour: 23,
	_error: {},
});

interface ShopFields {
	mobId: string;
	oType1: number;
	oType2: number;
	oType3: number;
	oType4: number;
	oType5: number;
	profitBuy: number;
	profitSell: number;
	firstHour: number;
	lastHour: number;
}

export interface Shop extends ShopFields {
	readonly id: string;
	_error: ErrorMarkers<ShopFields>;
}

export const newShop = (mobId: string): Shop => ({
	id: newId(),
	mobId,
	oType1: 0,
	oType2: 0,
	oType3: 0,
	oType4: 0,
	oType5: 0,
	profitBuy: 150,
	profitSell: 50,
	firstHour: 0,
	lastHour: 23,
	_error: {},
});
