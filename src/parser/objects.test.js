import parseObjects, { parseObject } from "./objects";

describe("parseObject", () => {
	test("parses an object", () => {
		let object = parseObject(OBJECT);
		expectNoErrors(object);
		expect(object.vnum).toBe(8129);
		expect(object.keywords).toEqual(["tattoo", "letters", "newbie", "tattoos"]);
		expect(object.name).toBe("Official 'Avatar' Tattoos");
		expect(object.longDesc).toBe("A small pile of painted letters sit on the ground here.");
		expect(object.actionDesc).toBe("You suddenly have the urge to get more tattoos!");
		expect(object.itemType).toBe(9);
		expect(object.extraFlags).toEqual([]);
		expect(object.wearFlags).toEqual([1, 256]);
		expect(object.value0).toBe("0");
		expect(object.value1).toBe("0");
		expect(object.value2).toBe("0");
		expect(object.value3).toBe("0");
		expect(object.weight).toBe(1);
		expect(object.worth).toBe(0);
		expect(object.racialFlags).toEqual([]);
		expect(object.extraDescs).toHaveLength(1);
		expect(object.extraDescs[0]).toMatchObject({
			keywords: ["official", "Avatar", "tattoos", "tattoo"],
			body: `.     In deep red across both your arms is
    'Avatar RULES' and 'Avatar...JUST DO IT'
        Welcome to AVATAR, adventurer.
`
		});
		expect(object.applies).toHaveLength(1);
		expect(object.applies[0]).toEqual([18, 1]);
	});

	test.skip("marks error on more than 2 wear flags", () => {
		let object = parseObject(EXTRA_WEAR_FLAGS);
		expectSingleError(object, "wearFlags");
		expect(object.wearFlags).toEqual([1, 256, 8192]);
	});

	test("marks error on action desc without a tilde", () => {
		let object = parseObject(OPEN_ACTION_DESC);
		expect(object._error.actionDesc).toBe(true);
		expect(object._error.itemType).toBe(true);
		expect(object._error.extraFlags).toBe(true);
		expect(object._error.wearFlags).toBe(true);
		expect(object._error.value0).toBe(true);
		expect(object._error.value1).toBe(true);
		expect(object._error.value2).toBe(true);
		expect(object._error.value3).toBe(true);
		expect(object._error.weight).toBe(true);
		expect(object._error.worth).toBe(true);
		expect(object._error.racialFlags).toBe(true);
	});

	test("marks error on extra desc without a tilde", () => {
		let object = parseObject(OPEN_EDESC);
		expectSingleError(object, "extraDescs");
	});

	[
		["vnum", "vnum"],
		["itemType", "itemType"],
		["extraFlags", "extraFlags"],
		["wearFlags", "wearFlags"],
		["value0", "value0"],
		["value1", "value1"],
		["value2", "value2"],
		["value3", "value3"],
		["weight", "weight"],
		["worth", "worth"],
		["racialFlags", "racialFlags"],
		["applyType", "applies"],
		["applyValue", "applies"],
		["quality", "quality"],
	].forEach(([inputField, outputField]) => {
		test(`marks error on invalid ${inputField}`, () => {
			let invalidObj = parseObject(makeInvalidObject(inputField));
			expectSingleError(invalidObj, outputField);
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

const OBJECT = `
#8129
tattoo letters newbie tattoos~
Official 'Avatar' Tattoos~
A small pile of painted letters sit on the ground here.~
You suddenly have the urge to get more tattoos!~
9 0 1|256
0 0 0 0
1 0 0 0
E
official Avatar tattoos tattoo~
.     In deep red across both your arms is
    'Avatar RULES' and 'Avatar...JUST DO IT'
        Welcome to AVATAR, adventurer.
~
A 18 1
`;

const EXTRA_WEAR_FLAGS = `
#8129
tattoo letters newbie tattoos~
Official 'Avatar' Tattoos~
A small pile of painted letters sit on the ground here.~
You suddenly have the urge to get more tattoos!~
9 0 1|256|8192
0 0 0 0
1 0 0 0
E
official Avatar tattoos tattoo~
.     In deep red across both your arms is
    'Avatar RULES' and 'Avatar...JUST DO IT'
        Welcome to AVATAR, adventurer.
~
A 18 1
`;

const OPEN_ACTION_DESC = `
#8129
tattoo letters newbie tattoos~
Official 'Avatar' Tattoos~
A small pile of painted letters sit on the ground here.~
You suddenly have the urge to get more tattoos!
9 0 1|256
0 0 0 0
1 0 0 0
A 18 1
`;

const OPEN_EDESC = `
#8129
tattoo letters newbie tattoos~
Official 'Avatar' Tattoos~
A small pile of painted letters sit on the ground here.~
You suddenly have the urge to get more tattoos!~
9 0 1|256
0 0 0 0
1 0 0 0
E
official Avatar tattoos tattoo~
.     In deep red across both your arms is
    'Avatar RULES' and 'Avatar...JUST DO IT'
        Welcome to AVATAR, adventurer.
A 18 1
`;

function makeInvalidObject(field, value = null) {
	return TAGGED_FIELDS.replace(/\{\w+\}/g, function(match) {
		if (`{${field}}` == match) {
			return value || "asdf";
		} else {
			return "1";
		}
	});
}

const TAGGED_FIELDS = `
#{vnum}
some keywords~
short desc~
long desc~
action desc~
{itemType} {extraFlags} {wearFlags}
{value0} {value1} {value2} {value3}
{weight} {worth} {racialFlags} 0
A {applyType} {applyValue}
Q {quality}
`;
