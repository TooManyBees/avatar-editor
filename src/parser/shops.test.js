import { parseShops, corellateShops } from "./shops";

describe("parseShops", () => {
	test("parses a shop", () => {
		let [shop] = parseShops(SHOP);
		expect(shop.mobVnum).toBe(12657);
		expect(shop.oType1).toBe(5);
		expect(shop.oType2).toBe(7);
		expect(shop.oType3).toBe(11);
		expect(shop.oType4).toBe(14);
		expect(shop.oType5).toBe(35);
		expect(shop.profitBuy).toBe(200);
		expect(shop.profitSell).toBe(30);
		expect(shop.firstHour).toBe(0);
		expect(shop.lastHour).toBe(23);
	});

	[
		"mobVnum",
		"oType1",
		"oType2",
		"oType3",
		"oType4",
		"oType5",
		"profitSell",
		"profitBuy",
		"firstHour",
		"lastHour",
	].forEach((field) => {
		test(`marks error on invalid ${field} field`, () => {
			let [shop] = parseShops(makeInvalidShop(field));
			expectSingleError(shop, field);
		});
	});
});

describe("corellateShops", () => {
	test("links shops to mobiles by id", () => {
		const mobiles = [
			{
				id: "mobile-id",
				vnum: 12657,
				keywords: [],
				shortDesc: "",
				longDesc: "",
				description: "",
				act: [1],
				affected: [],
				align: 10,
				level: 10,
				sex: 0,
				applies: [],
				shop: null,
				special: null,
			}
		];
		const shops = parseShops(SHOP);
		const _ = corellateShops(mobiles, shops);
		expect(mobiles[0].shop).toBeTruthy();
	});

	test("marks error on missing mob vnum", () => {
		const _shops = parseShops(SHOP);
		const orphaned = corellateShops([], _shops);
		expectSingleError(orphaned[0], "mobVnum");
	});
});

function makeInvalidShop(field, value = null) {
	return TAGGED_FIELDS.replace(/\{[^}]+\}/g, function(match) {
		if (`{${field}}` == match) {
			return value || "asdf";
		} else {
			return "1";
		}
	});
}

const TAGGED_FIELDS = `
{mobVnum}
{oType1} {oType2} {oType3} {oType4} {oType5}
{profitBuy} {profitSell}
{firstHour} {lastHour}
`;

function expectNoErrors(thing) {
	expect(thing).toBeTruthy();
	expect(thing._error).toEqual({});
}

function expectSingleError(thing, key) {
	expect(thing._error[key]).toBe(true);
	for (let [k, v] of Object.entries(thing._error)) {
		if (key !== k) {
			expect(v).toBeFalsy();
		}
	}
}

const SHOP = `
12657
5 7 11 14 35
200 30
0 23
`;
