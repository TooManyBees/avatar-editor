import parseAreadata from './areadata';

function makeAreadata(line) {
	return parseAreadata(`\n${line}\nS`);
}

function unwrapSection(thing) {
	expect(thing).toBeTruthy();
	expect(thing.errors).toHaveLength(0);
	expect(thing.section).toBeTruthy();
	return thing.section;
}

function unwrapData(thing) {
	expect(thing).toBeTruthy();
	expect(thing.errors).toHaveLength(0);
	expect(thing.data).toBeTruthy();
	return thing.data;
}

describe('parsePlane', () => {
	test('parses a plane', () => {
		let result = makeAreadata('P 1');
		let plane = unwrapSection(result).plane;
		let data = unwrapData(plane);
		expect(data.plane).toBe(1);
		expect(data.zone).toBeUndefined();
	});

	test('parses a plane and a zone', () => {
		let result = makeAreadata('P 1 1');
		let plane = unwrapSection(result).plane;
		let data = unwrapData(plane);
		expect(data.plane).toBe(1);
		expect(data.zone).toBe(1);
	});

	test('raises error on invalid plane', () => {
		let result = makeAreadata('P abcd 1');
		let plane = unwrapSection(result).plane;
		expect(plane.errors).toContain("AREADATA plane abcd is not a number");
		expect(plane.data).toBeTruthy()
		expect(plane.data.zone).toBe(1);
	});

	test('raises error on invalid zone', () => {
		let result = makeAreadata('P 1 abcd');
		let plane = unwrapSection(result).plane;
		expect(plane.errors).toContain("AREADATA zone abcd is not a number");
		expect(plane.data).toBeTruthy()
		expect(plane.data.plane).toBe(1);
	});

	test('returns nothing when line is empty', () => {
		let result = makeAreadata('P');
		let plane = unwrapSection(result).plane;
		expect(plane).toBeUndefined();
	});

	test('raises an error on extra tokens on line', () => {
		let result = makeAreadata('P 1 2 3');
		let plane = unwrapSection(result).plane;
		expect(plane.errors).toContain("Dropped invalid text at the end of AREADATA P line:\n3");
	});
});

describe('parseFlags', () => {
	test("parses flags separated by pipes", () => {
		let result = makeAreadata('F 1|2|128');
		let flags = unwrapSection(result).flags;
		let data = unwrapData(flags);
		expect(data).toEqual([1, 2, 128]);
	});

	test("parses flags from one big number", () => {
		let result = makeAreadata('F 2|4112');
		let flags = unwrapSection(result).flags;
		let data = unwrapData(flags);
		expect(data).toEqual([2, 16, 4096]);
	});

	test("does not duplicate flags", () => {
		let result = makeAreadata('F 2|4|2|12');
		let flags = unwrapSection(result).flags;
		let data = unwrapData(flags);
		expect(data).toEqual([2, 4, 8]);
	});

	test("raises error on invalid flags", () => {
		let result = makeAreadata('F 2|abcd');
		let flags = unwrapSection(result).flags;
		expect(flags.errors).toContain('AREADATA flag abcd is not a number');
		expect(flags.data).toEqual([2]);
	});

	test("raises error on extra tokens on line", () => {
		let result = makeAreadata('F 2|4 8');
		let flags = unwrapSection(result).flags;
		expect(flags.errors).toContain('Dropped invalid text at the end of AREADATA F line:\n8');
		expect(flags.data).toEqual([2, 4]);
	});
});

describe("parseOutlaw", () => {
	test("parses an outlaw line", () => {
		let result = makeAreadata('O -1 2 3 4 100');
		let outlaw = unwrapSection(result).outlaw;
		let data = unwrapData(outlaw);
		expect(data.dumpVnum).toBe(-1);
		expect(data.jailVnum).toBe(2);
		expect(data.deathVnum).toBe(3);
		expect(data.execVnum).toBe(4);
		expect(data.justice).toBe(100);
	});

	test("raises an error on invalid numbers", () => {
		let result = makeAreadata('O -1 abcd 3 4 100');
		let outlaw = unwrapSection(result).outlaw;
		expect(outlaw.errors).toContain('AREADATA outlaw jail vnum abcd is not a number');
	});

	test("raises an error on extra tokens on line", () => {
		let result = makeAreadata('O 1 2 3 4 100 1');
		let outlaw = unwrapSection(result).outlaw;
		expect(outlaw.errors).toContain('Dropped invalid text at the end of AREADATA O line:\n1');
	});
});

describe("parseKspawn", () => {
	test("parses a kspawn line", () => {
		let result = makeAreadata('K 1 1 100 200 time to die, buddy~');
		let kspawn = unwrapSection(result).kspawn;
		let data = unwrapData(kspawn);
		expect(data.condition).toBe(1);
		expect(data.command).toBe(1);
		expect(data.mobVnum).toBe(100);
		expect(data.roomVnum).toBe(200);
		expect(data.text).toBe("time to die, buddy");
	});

	test("parses a kspawn line without a message", () => {
		let result = makeAreadata('K 1 1 100 200~');
		let kspawn = unwrapSection(result).kspawn;
		let data = unwrapData(kspawn);
		expect(data.condition).toBe(1);
		expect(data.command).toBe(1);
		expect(data.mobVnum).toBe(100);
		expect(data.roomVnum).toBe(200);
		expect(data.text).toBe("");
	});

	test("parses a kspawn line without a tilde", () => {
		let result = makeAreadata('K 1 1 100 200 time to die, buddy');
		let kspawn = unwrapSection(result).kspawn;
		let data = unwrapData(kspawn);
		expect(data.condition).toBe(1);
		expect(data.command).toBe(1);
		expect(data.mobVnum).toBe(100);
		expect(data.roomVnum).toBe(200);
		expect(data.text).toBe("time to die, buddy");
	})

	test("raises an error on invalid kspawn line", () => {
		let result = makeAreadata('K 1 1 100');
		expect(result.errors).toContain("AREADATA kspawn line is malformed:\nK 1 1 100");
		expect(result.section).toBeTruthy()
		expect(result.section.kspawn).toBeUndefined();
	});

	test("raises an error on invalid kspawn value", () => {
		let result = makeAreadata('K 1 1 abcd 200 time to die, buddy~');
		let kspawn = unwrapSection(result).kspawn;
		expect(kspawn.errors).toContain("AREADATA kspawn mob vnum abcd is not a number");
		let data = kspawn.data;
		expect(data.condition).toBe(1);
		expect(data.command).toBe(1);
		expect(data.mobVnum).toBe(-1);
		expect(data.roomVnum).toBe(200);
		expect(data.text).toBe("time to die, buddy"); 
	});

	test("raises an error on extra tokens after the tilde", () => {
		let result = makeAreadata('K 1 1 100 200 time to die~ buddy');
		let kspawn = unwrapSection(result).kspawn;
		expect(kspawn.errors).toContain("Dropped invalid text at the end of AREADATA K line:\n buddy");
		let data = kspawn.data;
		expect(data.condition).toBe(1);
		expect(data.command).toBe(1);
		expect(data.mobVnum).toBe(100);
		expect(data.roomVnum).toBe(200);
		expect(data.text).toBe("time to die"); 
	});
});

describe("parseModifier", () => {
	test("parses a modifier line", () => {
		let result = makeAreadata("M 101 102 103 104 105 1234 0 1");
		let modifier = unwrapSection(result).modifier;
		let data = unwrapData(modifier);
		expect(data.xpGain).toBe(101);
		expect(data.hpRegen).toBe(102);
		expect(data.manaRegen).toBe(103);
		expect(data.moveRegen).toBe(104);
		expect(data.statloss).toBe(105);
		expect(data.respawnRoom).toBe(1234);
		expect(data.tbd1).toBe(0);
		expect(data.tbd2).toBe(1);
	});

	test("raises an error on invalid numbers", () => {
		let result = makeAreadata("M 101 102 103 abcd 105 1234 0 1");
		let modifier = unwrapSection(result).modifier;
		expect(modifier.errors).toContain("AREADATA moveRegen modifier abcd is not a number");
	});

	test("raises an error on extra tokens on the line", () => {
		let result = makeAreadata("M 101 102 103 104 105 1234 0 1 0");
		let modifier = unwrapSection(result).modifier;
		expect(modifier.errors).toContain("Dropped invalid text at the end of AREADATA M line:\n0")
	});
});

describe("parseGroupSize", () => {
	test("parses a groupSize line", () => {
		let result = makeAreadata("G 1 3 100 5 1 1 25 0");
		let groupSize = unwrapSection(result).groupSize;
		let data = unwrapData(groupSize);
		expect(data.pct0).toBe(1);
		expect(data.num1).toBe(3);
		expect(data.pct1).toBe(100);
		expect(data.num2).toBe(5);
		expect(data.pct2).toBe(1);
		expect(data.pct3).toBe(1);
		expect(data.div).toBe(25);
		expect(data.tbd).toBe(0);
	});

	test("raises an error on invalid numbers", () => {
		let result = makeAreadata("G 1 3 abcd 5 1 1 25 0");
		let groupSize = unwrapSection(result).groupSize;
		expect(groupSize.errors).toContain("AREADATA pct1 groupSize abcd is not a number");
	});

	test("raises an error on extra tokens on the line", () => {
		let result = makeAreadata("G 1 3 100 5 1 1 25 0 0");
		let groupSize = unwrapSection(result).groupSize;
		expect(groupSize.errors).toContain("Dropped invalid text at the end of AREADATA G line:\n0")
	});
});

describe("parseVnumRange", () => {
	test("parses a vnumRange line", () => {
		let result = makeAreadata("V 800 850");
		let vnumRange = unwrapSection(result).vnumRange;
		let data = unwrapData(vnumRange);
		expect(data.min).toBe(800);
		expect(data.max).toBe(850);
	});

	test("raises an error on an invalid min vnum", () => {
		let result = makeAreadata("V abcd");
		expect(result.errors).toContain("AREADATA vnum range min abcd is not a number");
		expect(result.section.vnumRange).toBeUndefined();
	});

	test("raises an error on an invalid max vnum", () => {
		let result = makeAreadata("V 800 abcd");
		let vnumRange = unwrapSection(result).vnumRange;
		expect(vnumRange.errors).toContain("AREADATA vnum range max abcd is not a number");
		expect(vnumRange.data).toBeTruthy();
		let data = vnumRange.data;
		expect(data.min).toBe(800);
		expect(data.max).toBe(800);
	});

	test("raises an error on extra tokens on the line", () => {
		let result = makeAreadata("V 800 850 900");
		let vnumRange = unwrapSection(result).vnumRange;
		expect(vnumRange.errors).toContain("Dropped invalid text at the end of AREADATA V line:\n900");
	});
});

describe("parseScaling", () => {
	test("parses a scaling line", () => {
		let result = makeAreadata("B 490 180000");
		let scaling = unwrapSection(result).scaling;
		let data = unwrapData(scaling);
		expect(data.maxGroupPower).toBe(490);
		expect(data.maxGroupToughness).toBe(180000);
	});

	test("raises an error on an invalid number", () => {
		let result = makeAreadata("B 490 abcd");
		let scaling = unwrapSection(result).scaling
		expect(scaling.errors).toContain("AREADATA scaling max group toughness abcd is not a number");
		let data = scaling.data;
		expect(data).toBeTruthy();
		expect(data.maxGroupPower).toBe(490);
		expect(data.maxGroupToughness).toBe(180000);
	});

	test("raises an error on extra tokens on the line", () => {
		let result = makeAreadata("B 490 180000 900");
		let scaling = unwrapSection(result).scaling;
		expect(scaling.errors).toContain("Dropped invalid text at the end of AREADATA B line:\n900");
	});
})