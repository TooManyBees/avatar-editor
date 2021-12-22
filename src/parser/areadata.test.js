import parseAreadata, {
	parsePlane,
	parseFlags,
	parseOutlaw,
	parseKspawn,
	parseModifier,
	parseGroupSize,
	parseVnumRange,
	parseScaling,
} from './areadata';

function makeAreadata(line) {
	return parseAreadata(`\n${line}\nS`);
}

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

describe('parsePlane', () => {
	test('parses a plane', () => {
		let plane = parsePlane('1');
		expectNoErrors(plane);
		expect(plane.plane).toBe(1);
		expect(plane.zone).toBeUndefined();
	});

	test('parses a plane and a zone', () => {
		let plane = parsePlane(['1', '1']);
		expectNoErrors(plane);
		expect(plane.plane).toBe(1);
		expect(plane.zone).toBe(1);
	});

	test('marks error on invalid plane', () => {
		let plane = parsePlane(['abcd', '1']);
		expectSingleError(plane, "plane");
		expect(plane.plane).toBe(1);
		expect(plane.zone).toBe(1);
	});

	test('marks error on invalid zone', () => {
		let plane = parsePlane(['1', 'abcd']);
		expectSingleError(plane, "zone");
		expect(plane).toBeTruthy()
		expect(plane.plane).toBe(1);
		expect(plane.zone).toBeUndefined();
	});

	test('marks error on plane 0', () => {
		let plane = parsePlane(['0']);
		expectSingleError(plane, "plane");
		expect(plane.plane).toBe(1);
	});

	test('marks error when line is empty', () => {
		let plane = parsePlane([]);
		expectSingleError(plane, "all");
	});
});

describe('parseFlags', () => {
	test("parses flags separated by pipes", () => {
		let flags = parseFlags(['1|2|128']);
		expectNoErrors(flags);
		expect(flags.flags).toEqual([1, 2, 128]);
	});

	test("parses flags from one big number", () => {
		let flags = parseFlags(['2|4112']);
		expectNoErrors(flags);
		expect(flags.flags).toEqual([2, 16, 4096]);
	});

	test("does not duplicate flags", () => {
		let flags = parseFlags(['2|4|2|12']);
		expectNoErrors(flags);
		expect(flags.flags).toEqual([2, 4, 8]);
	});

	test("raises error on invalid flags", () => {
		let flags = parseFlags(['2|abcd']);
		expectSingleError(flags, "flags");
		expect(flags.flags).toEqual([2]);
	});
});

describe("parseOutlaw", () => {
	test("parses an outlaw line", () => {
		let outlaw = parseOutlaw(['-1', '2', '3', '4', '100']);
		expectNoErrors(outlaw);
		expect(outlaw.dumpVnum).toBe(-1);
		expect(outlaw.jailVnum).toBe(2);
		expect(outlaw.deathVnum).toBe(3);
		expect(outlaw.execVnum).toBe(4);
		expect(outlaw.justice).toBe(100);
	});

	[
		"dumpVnum",
		"jailVnum",
		"deathVnum",
		"execVnum",
		"justice",
	].forEach(field => {
		test(`raises an error on invalid ${field}`, () => {
			let outlawFields = '{dumpVnum} {jailVnum} {deathVnum} {execVnum} {justice}'
				.replace(/\{\w+\}/g, (f) => `{${field}}` === f ? "asdf" : "10")
				.split(/\s+/g);
			let outlaw = parseOutlaw(outlawFields);
			expectSingleError(outlaw, field);
		});
	});
});

describe("parseKspawn", () => {
	test("parses a kspawn line", () => {
		let kspawn = parseKspawn('K 1 1 100 200 time to die, buddy~');
		expectNoErrors(kspawn);
		expect(kspawn.condition).toBe(1);
		expect(kspawn.command).toBe(1);
		expect(kspawn.mobVnum).toBe(100);
		expect(kspawn.roomVnum).toBe(200);
		expect(kspawn.text).toBe("time to die, buddy");
	});

	test("parses a kspawn line without a message", () => {
		let kspawn = parseKspawn('K 1 1 100 200~');
		expectNoErrors(kspawn);
		expect(kspawn.condition).toBe(1);
		expect(kspawn.command).toBe(1);
		expect(kspawn.mobVnum).toBe(100);
		expect(kspawn.roomVnum).toBe(200);
		expect(kspawn.text).toBe("");
	});

	test("parses a kspawn line without a tilde", () => {
		let kspawn = parseKspawn('K 1 1 100 200 time to die, buddy');
		expectNoErrors(kspawn);
		expect(kspawn.condition).toBe(1);
		expect(kspawn.command).toBe(1);
		expect(kspawn.mobVnum).toBe(100);
		expect(kspawn.roomVnum).toBe(200);
		expect(kspawn.text).toBe("time to die, buddy");
	})

	test("raises an error on invalid kspawn line", () => {
		let kspawn = parseKspawn('K 1 1 100');
		expectSingleError(kspawn, "all");
	});

	test("raises an error on invalid kspawn value", () => {
		let kspawn = parseKspawn('K 1 1 abcd 200 time to die, buddy~');
		expectSingleError(kspawn, "mobVnum")
		expect(kspawn.condition).toBe(1);
		expect(kspawn.command).toBe(1);
		expect(kspawn.mobVnum).toBe(-1);
		expect(kspawn.roomVnum).toBe(200);
		expect(kspawn.text).toBe("time to die, buddy"); 
	});
});

describe("parseModifier", () => {
	test("parses a modifier line", () => {
		let modifier = parseModifier(["101", "102", "103", "104", "105", "1234", "0", "1"]);
		expectNoErrors(modifier);
		expect(modifier.xpGain).toBe(101);
		expect(modifier.hpRegen).toBe(102);
		expect(modifier.manaRegen).toBe(103);
		expect(modifier.moveRegen).toBe(104);
		expect(modifier.statloss).toBe(105);
		expect(modifier.respawnRoom).toBe(1234);
		expect(modifier.tbd1).toBe(0);
		expect(modifier.tbd2).toBe(1);
	});

	[
		"xpGain",
		"hpRegen",
		"manaRegen",
		"moveRegen",
		"statloss",
		"respawnRoom",
	].forEach(field => {
		test(`raises an error on invalid ${field}`, () => {
			let modifierFields = '{xpGain} {hpRegen} {manaRegen} {moveRegen} {statloss} {respawnRoom}'
				.replace(/\{\w+\}/g, (f) => `{${field}}` === f ? "asdf" : "10")
				.split(/\s+/g);
			let modifier = parseModifier(modifierFields);
			expectSingleError(modifier, field);
		});
	});
});

describe("parseGroupSize", () => {
	test("parses a groupSize line", () => {
		let groupSize = parseGroupSize(["1", "3", "100", "5", "1", "1", "25", "0"]);
		expectNoErrors(groupSize);
		expect(groupSize.pct0).toBe(1);
		expect(groupSize.num1).toBe(3);
		expect(groupSize.pct1).toBe(100);
		expect(groupSize.num2).toBe(5);
		expect(groupSize.pct2).toBe(1);
		expect(groupSize.pct3).toBe(1);
		expect(groupSize.div).toBe(25);
		expect(groupSize.tbd).toBe(0);
	});

	[
		"pct0",
		"num1",
		"pct1",
		"num2",
		"pct2",
		"pct3",
		"div",
	].forEach(field => {
		test(`raises an error on invalid ${field}`, () => {
			let groupSizeFields = '{pct0} {num1} {pct1} {num2} {pct2} {pct3} {div} {tbd}'
				.replace(/\{\w+\}/g, (f) => `{${field}}` === f ? "asdf" : "10")
				.split(/\s+/g);
			let groupSize = parseGroupSize(groupSizeFields);
			expectSingleError(groupSize, field);
		});
	});
});

describe("parseVnumRange", () => {
	test("parses a vnumRange line", () => {
		let vnumRange = parseVnumRange(["800", "850"]);
		expectNoErrors(vnumRange)
		expect(vnumRange.min).toBe(800);
		expect(vnumRange.max).toBe(850);
	});

	test("raises an error on an invalid min vnum", () => {
		let vnumRange = parseVnumRange(["abcd"]);
		expect(vnumRange._error.min).toBe(true);
		expect(vnumRange._error.max).toBe(true);
		expect(vnumRange.min).toBe(0);
		expect(vnumRange.max).toBe(0);
	});

	test("raises an error on an invalid max vnum", () => {
		let vnumRange = parseVnumRange(["800", "abcd"]);
		expectSingleError(vnumRange, "max");
		expect(vnumRange.min).toBe(800);
		expect(vnumRange.max).toBe(800);
	});
});

describe("parseScaling", () => {
	test("parses a scaling line", () => {
		let scaling = parseScaling(["490", "180000"]);
		expectNoErrors(scaling);
		expect(scaling.maxGroupPower).toBe(490);
		expect(scaling.maxGroupToughness).toBe(180000);
	});

	test("raises an error on an invalid maxGroupPower", () => {
		let scaling = parseScaling(["abcd", "180000"]);
		expectSingleError(scaling, "maxGroupPower");
		expect(scaling.maxGroupPower).toBe(490);
		expect(scaling.maxGroupToughness).toBe(180000);
	});

	test("raises an error on an invalid maxGroupToughness", () => {
		let scaling = parseScaling(["490", "abcd"]);
		expectSingleError(scaling, "maxGroupToughness");
		expect(scaling.maxGroupPower).toBe(490);
		expect(scaling.maxGroupToughness).toBe(180000);
	});
});