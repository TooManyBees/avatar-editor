import { parseKeywords, parseBits, splitOnVnums } from "./helpers";

describe("parseKeywords", () => {
	test("parses keywords", () => {
		let { keywords } = parseKeywords("key word");
		expect(keywords).toEqual(["key", "word"]);
	});

	test("parses keywords with single quotes", () => {
		let { keywords } = parseKeywords("a 'long keyword'");
		expect(keywords).toEqual(["a", "long keyword"]);
	});

	test("parses keywords with double quotes", () => {
		let { keywords } = parseKeywords('a "long keyword"');
		expect(keywords).toEqual(["a", "long keyword"]);
	});

	test("ignores a nested single quote inside double quotes", () => {
		let { keywords } = parseKeywords('a "giant\'s keyword"');
		expect(keywords).toEqual(["a", "giant's keyword"]);
	});

	test("ignores a nested double quote inside single quotes", () => {
		let { keywords } = parseKeywords("by 'steven \"steve\" smith'");
		expect(keywords).toEqual(["by", 'steven "steve" smith']);
	});

	test("ignores a single quote inside an unquoted word", () => {
		let { keywords } = parseKeywords("hakai ha'kai");
		expect(keywords).toEqual(["hakai", "ha'kai"]);
	});

	test("ignores a double quote inside an unquoted word", () => {
		let { keywords } = parseKeywords('hakai ha"kai');
		expect(keywords).toEqual(["hakai", 'ha"kai']);
	});

	test("ignores leading and trailing white space", () => {
		let { keywords } = parseKeywords("  a keyword  ");
		expect(keywords).toEqual(["a", "keyword"]);
	})

	test("raises error when a single quoted keyword is left open", () => {
		let { errors, keywords } = parseKeywords("a 'long keyword");
		expect(errors).toContain("Quoted keyword without closing quote:\n'long keyword");
		expect(keywords).toEqual(["a", "long keyword"]);
	});

	test("raises error when a double quoted keyword is left open", () => {
		let { errors, keywords } = parseKeywords('a "long keyword');
		expect(errors).toContain("Quoted keyword without closing quote:\n\"long keyword");
		expect(keywords).toEqual(["a", "long keyword"]);
	});
});

describe("parseBits", () => {
	test("parses bits separated by pipes", () => {
		let { error, bits } = parseBits('1|2|128');
		expect(error).toBe(false);
		expect(bits).toEqual([1, 2, 128]);
	});

	test("parses bits from one big number", () => {
		let { error, bits } = parseBits('2|4112');
		expect(error).toBe(false);
		expect(bits).toEqual([2, 16, 4096]);
	});

	test("does not duplicate bits", () => {
		let { error, bits } = parseBits('2|4|2|12');
		expect(error).toBe(false);
		expect(bits).toEqual([2, 4, 8]);
	});

	test("raises error on invalid bits", () => {
		let { error, bits } = parseBits('2|abcd');
		expect(error).toBe(true);
		expect(bits).toEqual([2]);
	});

	test("ignores zero", () => {
		let { error, bits } = parseBits('0|2|4');
		expect(error).toBe(false);
		expect(bits).toEqual([2, 4]);
	});
});

describe("splitOnVnums", () => {
	const ROOMS = `
#11443
An outcropping of rock~
Extending precipitously away from the rim of the crater, this outcropping
serves as a bridge toward the center of the mine, where it stands level
with the towering blast furnace. While the outcropping seems delicate, it
clearly supports the weight of multiple giants, so there should be nothing
to fear about crossing it. Nothing to fear except the fire giants, that is.
~
0 8192 4
D1
~
~
0 0 11444
D3
~
~
0 0 11431
S
#11444
Above the mouth of the furnace~
The outcropping ends but a stone's throw from from the mouth of the
blast furnace, bathing the precipice in intense heat and harsh yellow
light. The furnace's close proximity affords you a clear view through
the veil of smoke, but peering too far over the edge could prove scalding.
A row of empty buckets, which probably once contained ore, line the edge.
~
0 8192|268435456 5
D3
~
~
0 0 11443
D5
Are you crazy?? Don't look down!

|BW|            @
|BW|       /@    \/@     /@
|BW|    @\||BK|MMMMMMM|BW|||BK|MMMMM|BW|/|BK|MMMMMMM
|BK|  MMMM|BW|\|BK|MMMMMMM|BW|||BK|MMMMM|BW|||BK|MMMMM|BW|/@|BK|MMMM
|BK|MMMMMM|BW||  |BR|==== |BW|||R|mmww |BW|||R|wmm|BW| / @@|BK|MMMMM
|BK|MM    |BW|/   |BY|*       |BR|=====  |BW|| |BY|*    |BK|MM
|R|w  w|BY|*|R| mwwwm m|BR|== =|R| m wwm w|BW||\|R|wmmmm
|R|wwwm m|BR|=====|R|mm wmmwwm ww|BR|=====|R|  mm w
  |BR|====    |BY|*       |BR|=====      |BR|=
|R| mmm wwm w |Y|_________|R| wwwm|BY|*|R|  mm mwm
|BR|===    |Y|___/ -       \_  |BR|=====
|R|  wmm|Y|./   .         / \___|R|   mmm|BK|##
###|Y|./    ,            _  -\|R|wm|BK|####W
##|Y|/                . / \  .||BK|##WWWW
#|Y|/.   _      .             \|BK|WWWWWW
|Y|//   / \         //\       ,\|BK|WWWWW
~
~
0 0 -1
S
#11445
Against an abrupt escarpment~
The northern edge of the mine is nestled into the folds of a natural
scarp. Striations along its face flicker in the glow of the furnace.
The shallow embankment deposited at its base affords a clear overview
of the mine to the south, but the highest point of the mesa lies above.
Frightful silhouettes atop the cliff can be seen through the swirling
fumes. You can't shake the feeling that they are looking back at you.
~
0 8192 4
D1
~
~
0 0 11446
D2
~
~
0 0 11434
S
`;

	test("splits on the pattern #\\d+", () => {
		let rooms = splitOnVnums(ROOMS);
		expect(rooms).toHaveLength(3);
	});

	test("discards the #0 that ends a section of vnums", () => {
		let rooms = `
#123
#456
#0
`
		let parts = splitOnVnums(rooms);
		expect(parts).toHaveLength(2);
	});
});
