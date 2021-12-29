import parseMobiles, { parseMobile } from "./mobiles";

describe("parseMobile", () => {
	test("parses a mob", () => {
		let mobile = parseMobile(NOM);
		expectNoErrors(mobile);
		expect(mobile.vnum).toBe(8113);
		expect(mobile.keywords).toEqual(["nom", "meadow", "shaman"]);
		expect(mobile.shortDesc).toBe("Nom");
		expect(mobile.longDesc).toBe("An ageless shaman sits here smiling at you.");
		expect(mobile.description).toBe(`This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also
sells items of vital importance to those who are in need.  To see those,
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.`);
		expect(mobile.act).toEqual([1, 2, 2048]);
		expect(mobile.affected).toEqual([8, 32, 128]);
		expect(mobile.align).toBe(1000);
		expect(mobile.level).toBe(60);
		expect(mobile.sex).toBe(1);
		expect(mobile.race).toBe(0);
		expect(mobile.klass).toBe(1);
		expect(mobile.kspawn).toBeTruthy();
		expect(mobile.kspawn.condition).toBe(1);
		expect(mobile.kspawn.spawnType).toEqual([1, 2, 8]);
		expect(mobile.kspawn.spawnVnum).toBe(8100);
		expect(mobile.kspawn.roomVnum).toBe(-1);
		expect(mobile.kspawn.message).toBe('Nom screams, "You\'ll pay for your treachery!"');
		expect(mobile.team).toBe(4);
		expect(mobile.applies).toEqual([[1, 2], [2, 3]]);
	});

	test("parses a mob with blank lines in its description", () => {
		let mobile = parseMobile(BLANK_DESC_LINES);
		expectNoErrors(mobile);
		expect(mobile.description).toBe(`This is Nom.  He's the eternal keeper of the Tree of Knowledge.

Throughout time he's been here and could teach you a thing or two.

He can HEAL you.

If you type 'heal', you can peruse his pricing for this service.  He also
sells items of vital importance to those who are in need.  To see those,
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.`);
	});

	test("parses a mob with a multi-line kspawn", () => {
		let mobile = parseMobile(MULTILINE_KSPAWN);
		expectNoErrors(mobile);
		expect(mobile.vnum).toBe(8113);
		expect(mobile.keywords).toEqual(["nom", "meadow", "shaman"]);
		expect(mobile.shortDesc).toBe("Nom");
		expect(mobile.longDesc).toBe("An ageless shaman sits here smiling at you.");
		expect(mobile.description).toBe(`This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also
sells items of vital importance to those who are in need.  To see those,
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.`);
		expect(mobile.act).toEqual([1, 2, 2048]);
		expect(mobile.affected).toEqual([8, 32, 128]);
		expect(mobile.align).toBe(1000);
		expect(mobile.level).toBe(60);
		expect(mobile.sex).toBe(1);
		expect(mobile.race).toBe(0);
		expect(mobile.klass).toBe(1);
		expect(mobile.kspawn).toBeTruthy();
		expect(mobile.kspawn.condition).toBe(1);
		expect(mobile.kspawn.spawnType).toEqual([1, 2, 8]);
		expect(mobile.kspawn.spawnVnum).toBe(8100);
		expect(mobile.kspawn.roomVnum).toBe(-1);
		expect(mobile.kspawn.message).toBe(`|BK|The clouds on the horizon darken|N|
|BC|A sudden |BW|**CRASH**|BC| of lightning sets your nerves on edge!
Nom screams, "You'll pay for your treachery!"`);
		expect(mobile.team).toBe(4);
	})

	test("parses the long desc and description when the tildes aren't on their own lines", () => {
		let mobile = parseMobile(WRONG_TILDES);
		expectNoErrors(mobile);
		expect(mobile.longDesc).toBe("An ageless shaman sits here smiling at you.");
		expect(mobile.description).toBe(`This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also
sells items of vital importance to those who are in need.  To see those,
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.`);
	});

	test("marks errors when description has been left open", () => {
		let mobile = parseMobile(OPEN_DESCRIPTION);
		expect(mobile.description).toBe(`This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also
sells items of vital importance to those who are in need.  To see those,
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.
1|2|2048 8|32|128 1000 S
60 0 0`);
		expect(mobile._error.description).toBe(true);
		expect(mobile._error.act).toBe(true);
		expect(mobile._error.affected).toBe(true);
		expect(mobile._error.align).toBe(true);
		expect(mobile._error.level).toBe(true);
	});

	test("marks errors when the kspawn message has been left open", () => {
		let mobile = parseMobile(OPEN_KSPAWN);
		expectSingleError(mobile, "kspawn");
	});

	test("marks errors when there are 2 kspawns", () => {
		let mobile = parseMobile(TWO_KSPAWNS);
		expectSingleError(mobile, "kspawn");
	});

	test("marks errors when the mob is unfinished", () => {
		let mobile = parseMobile(UNFINISHED);
		expectSingleError(mobile, "all");
	});

	test("marks errors on unknown extra line types", () => {
		let mobile = parseMobile(INVALID_EXTRA_LINES);
		expectSingleError(mobile, "all");
	});

	[
		["vnum", "vnum"],
		["act", "act"],
		["affected", "affected"],
		["align", "align"],
		["level", "level"],
		["sex", "sex"],
		["race", "race"],
		["klass", "klass"],
		["team", "team"],
		["kspawnCondition", "kspawn"],
		["kspawnType", "kspawn"],
		["kspawnMobVnum", "kspawn"],
		["kspawnRoomVnum", "kspawn"],
		["applyType", "applies"],
		["applyValue", "applies"],
	].forEach(([inputField, outputField]) => {
		test(`marks error on invalid ${inputField}`, () => {
			let invalidMob = makeInvalidMobile(inputField);
			let mobile = parseMobile(invalidMob);
			expectSingleError(mobile, outputField);
		});
	});
});

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

const NOM = `
#8113
nom meadow shaman~
Nom~
An ageless shaman sits here smiling at you.
~
This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also 
sells items of vital importance to those who are in need.  To see those, 
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.  
~
1|2|2048 8|32|128 1000 S
60 0 0
0d0+0 0d0+0 0 0
0 0 1
R 0
C 1
A 1 2
K 1 1|2|8 8100 -1 Nom screams, "You'll pay for your treachery!"~
L 4
A 2 3
`;

const BLANK_DESC_LINES = `
#8113
nom meadow shaman~
Nom~
An ageless shaman sits here smiling at you.
~
This is Nom.  He's the eternal keeper of the Tree of Knowledge.

Throughout time he's been here and could teach you a thing or two.

He can HEAL you.

If you type 'heal', you can peruse his pricing for this service.  He also 
sells items of vital importance to those who are in need.  To see those, 
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.  
~
1|2|2048 8|32|128 1000 S
60 0 0
0d0+0 0d0+0 0 0
0 0 1
R 0
C 1
A 1 2
K 1 1|2|8 8100 -1 Nom screams, "You'll pay for your treachery!"~
L 4
A 2 3
`;

const MULTILINE_KSPAWN = `
#8113
nom meadow shaman~
Nom~
An ageless shaman sits here smiling at you.
~
This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also 
sells items of vital importance to those who are in need.  To see those, 
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.  
~
1|2|2048 8|32|128 1000 S
60 0 0
0d0+0 0d0+0 0 0
0 0 1
R 0
C 1
K 1 1|2|8 8100 -1 |BK|The clouds on the horizon darken|N|
|BC|A sudden |BW|**CRASH**|BC| of lightning sets your nerves on edge!
Nom screams, "You'll pay for your treachery!"~
L 4
`;

const WRONG_TILDES = `
#8113
nom meadow shaman~
Nom~
An ageless shaman sits here smiling at you.~
This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also
sells items of vital importance to those who are in need.  To see those,
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.~
1|2|2048 8|32|128 1000 S
60 0 0
0d0+0 0d0+0 0 0
0 0 1
R 0
C 1
`;

const OPEN_DESCRIPTION = `
#8113
nom meadow shaman~
Nom~
An ageless shaman sits here smiling at you.~
This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also
sells items of vital importance to those who are in need.  To see those,
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.
1|2|2048 8|32|128 1000 S
60 0 0
0d0+0 0d0+0 0 0
0 0 1
R 0
C 1
`;

const OPEN_KSPAWN = `
#8113
nom meadow shaman~
Nom~
An ageless shaman sits here smiling at you.
~
This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also 
sells items of vital importance to those who are in need.  To see those, 
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.  
~
1|2|2048 8|32|128 1000 S
60 0 0
0d0+0 0d0+0 0 0
0 0 1
R 0
C 1
K 1 1|2|8 8100 -1 |BK|The clouds on the horizon darken|N|
|BC|A sudden |BW|**CRASH**|BC| of lightning sets your nerves on edge!
Nom screams, "You'll pay for your treachery!"
L 4
`;

const TWO_KSPAWNS = `
#8113
nom meadow shaman~
Nom~
An ageless shaman sits here smiling at you.
~
This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also 
sells items of vital importance to those who are in need.  To see those, 
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.  
~
1|2|2048 8|32|128 1000 S
60 0 0
0d0+0 0d0+0 0 0
0 0 1
R 0
C 1
A 1 2
K 1 1|2|8 8100 -1 Nom screams, "You'll pay for your treachery!"~
L 4
A 2 3
K 1 1|2|8 8100 -1 Nom cries, "Not like this. Not like this."~
`;

const UNFINISHED = `
#8113
nom meadow shaman~
Nom~
An ageless shaman sits here smiling at you.
~
This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also 
sells items of vital importance to those who are in need.  To see those, 
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.  
~
1|2|2048 8|32|128 1000 S
60 0 0
0d0+0 0d0+0 0 0
`;

const INVALID_EXTRA_LINES = `
#8113
nom meadow shaman~
Nom~
An ageless shaman sits here smiling at you.
~
This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also 
sells items of vital importance to those who are in need.  To see those, 
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.  
~
1|2|2048 8|32|128 1000 S
60 0 0
0d0+0 0d0+0 0 0
0 0 1
R 0
C 1
B 1
A 1 2
K 1 1|2|8 8100 -1 Nom screams, "You'll pay for your treachery!"~
L 4
A 2 3
`;

function makeInvalidMobile(field) {
	return TAGGED_FIELDS.replace(/\{\w+\}/g, function(match) {
		if (`{${field}}` == match) {
			return "asdf";
		} else {
			return "1";
		}
	});
}

const TAGGED_FIELDS = `
#{vnum}
some keywords~
short desc~
long desc
~
description
~
{act} {affected} {align} S
{level} 0 0
0d0+0 0d0+0 0 0
0 0 {sex}
R {race}
C {klass}
L {team}
K {kspawnCondition} {kspawnType} {kspawnMobVnum} {kspawnRoomVnum} death message~
A {applyType} {applyValue}
`;

describe("parseMobiles", () => {
	test("parses a list of mobiles", () => {
		let mobiles = parseMobiles(TWO_MOBS);
		expect(mobiles).toHaveLength(2);
	});
});

const TWO_MOBS = `
#8113
nom meadow shaman~
Nom~
An ageless shaman sits here smiling at you.
~
This is Nom.  He's the eternal keeper of the Tree of Knowledge. Throughout
time he's been here and could teach you a thing or two.  He can HEAL you.
If you type 'heal', you can peruse his pricing for this service.  He also 
sells items of vital importance to those who are in need.  To see those, 
type 'list' and perhaps haggle with him. Feel welcome to stay awhile.  
~
1|2|2048 8|32|128 1000 S
60 0 0
0d0+0 0d0+0 0 0
0 0 1
R 0
C 1

#8114
peddler jim~
Jim~
Jim the Peddler sits here, waiting to sell you something.
~
Jim has traveled the East Road for 12 years doing this business. Every year
he comes back to this field and stays a tiny bit longer than last time.
He will soon have to go to Midgaard to pick up supplies.
~
1|2 8|32 300 S
1 0 0
0d0+0 0d0+0 0 0
0 0 1
R 0
C 5

#0
`
