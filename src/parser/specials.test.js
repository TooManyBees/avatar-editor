import { parseSpecials, corellateSpecials } from "./specials";

describe("parseSpecials", () => {
	test("parses a special line", () => {
		let line = "M 11403 SPEC_CAST_WIZARD";
		let specials = parseSpecials(line);
		expect(specials[0]).toMatchObject({ mobVnum: 11403, special: "SPEC_CAST_WIZARD" });
	});

	test("parses none as a null spec", () => {
		let line = "M 11403 none";
		let specials = parseSpecials(line);
		expect(specials[0].special).toBe(null)
	});

	test("parses comments", () => {
		let line = "M 11455 SPEC_CAST_STORMLORD ferromancer sturmiet (slag herder)";
		let specials = parseSpecials(line);
		expect(specials[0].comment).toBe(" ferromancer sturmiet (slag herder)");
	});
});

describe("corellateSpecials", () => {
	const SPECIALS = `
M 2222 SPEC_WARLORD 
M 3333 SPEC_BREATH_FIRE
`;

	test("assigns spec funs to mobiles", () => {
		const MOBILES = [
			{ id: "mob-id-1", vnum: 1111, specFun: { special: null, comment: "" } },
			{ id: "mob-id-2", vnum: 2222, specFun: { special: null, comment: "" } },
		];
		let specials = parseSpecials(SPECIALS);
		let orphans = corellateSpecials(MOBILES, specials);
		expect(MOBILES[0].vnum).toBe(1111);
		expect(MOBILES[0].specFun.special).toBe(null);
		expect(MOBILES[1].vnum).toBe(2222);
		expect(MOBILES[1].specFun.special).toBe("SPEC_WARLORD");
	});

	test("keeps unassigned specs as orphans", () => {
		const MOBILES = [
			{ id: "mob-id-1", vnum: 1111, specFun: { special: null, comment: "" } },
			{ id: "mob-id-2", vnum: 2222, specFun: { special: null, comment: "" } },
		];
		let specials = parseSpecials(SPECIALS);
		let orphans = corellateSpecials(MOBILES, specials);
		expect(orphans).toHaveLength(1);
		expect(orphans[0].mobVnum).toBe(3333);
		expect(orphans[0].special).toBe("SPEC_BREATH_FIRE");
	});
})
