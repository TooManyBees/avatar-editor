import serializeSpecials from "./specials";

describe("serializeSpecials", () => {
	const MOBILES = [
		{ id: "mobile-1111", vnum: 1111, specFun: { special: "SPEC_WARLORD", comment: "   the boss" } },
		{ id: "mobile-2222", vnum: 2222, specFun: { special: "SPEC_CAST_MAGE", comment: " the sidekick" } },
	];

	test("serializes specials", () => {
		expect(serializeSpecials(MOBILES, [])).toBe(`#SPECIALS
M 1111 SPEC_WARLORD   the boss
M 2222 SPEC_CAST_MAGE the sidekick
S
`);
	});

	test("serializes orphaned specials", () => {
		const orphans = [{ mobVnum: 3333, special: "SPEC_BODYGUARD", comment: " the boyfriend" }];
		expect(serializeSpecials(MOBILES, orphans)).toBe(`#SPECIALS
M 1111 SPEC_WARLORD   the boss
M 2222 SPEC_CAST_MAGE the sidekick
M 3333 SPEC_BODYGUARD the boyfriend
S
`);
	});

	test("skips specials that are 'None'", () => {
		const mobiles = [
			{ vnum: 1111, specFun: { special: null, comment: " no spec for you!" } },
			{ vnum: 2222, specFun: { special: "SPEC_ROGUE_LITE", comment: "" } },
		];
		const orphans = [{ mobVnum: 3333, special: null, comment: " no specs for anyone!" }];
		expect(serializeSpecials(mobiles, orphans)).toBe(`#SPECIALS
M 2222 SPEC_ROGUE_LITE
S
`);
	});

	test("skips the section if there are no specials", () => {
		const mobiles = [{ vnum: 1111, specFun: { special: null, comment: " no spec for you!" } }];
		const orphans = [{ mobVnum: 3333, special: null, comment: " no specs for anyone!" }];
		expect(serializeSpecials(mobiles, orphans)).toBe("");
	});
});
