import serializeObjects, { serializeObject } from "./objects";
import parseObjects, { parseObject } from "../parser/objects";

describe("serializeObject", () => {
	test("serializes an object", () => {
		const object = parseObject(OBJECT);
		expect(serializeObject(object)).toBe(OBJECT);
	});

	const OBJECT = `#729
eria sceptre silver glowing eye~
the Eria sceptre~
An unadorned silver sceptre with a glowing eye at the top is here.~
A pale green light bursts from the sceptre's eye!~
1 1|64 1
0 0 -1 0
3 0 0 0
A 14 150
A 19 2
A 18 2
Q 40
E
Eria sceptre silver glowing eye~
The eye of the sceptre lights your way, and its piercing gaze
punishes those who stand against you.
~
`;
});

describe("serializeObjects", () => {
	test("serializes an objects section", () => {
		const state = parseState(OBJECTS);
		expect(serializeObjects(state)).toBe(OBJECTS);
	});

	test("omits an empty section", () => {
		const state = parseState("#OBJECTS\n\n\n#0\n");
		expect(serializeObjects(state)).toBe("");
	});

	const OBJECTS = `#OBJECTS

#17321
armor silvermail mail silver~
silvermail armor~
A tunic is here, made of silvery mail links and large silver plates.~
~
9 64|1024 1|8
0 0 0 0
8 0 0 0
A 17 -15
E
armor silvermail mail silver~
Upon close inspection, the links of this gleaming mail seem to look
more like scales.
~

#17322
sleeves silvermail mail silver~
silvermail sleeves silver~
Made of intricate silver links, a pair of armored sleeves lie here.~
~
9 64|1024 1|256
0 0 0 0
8 0 0 0
A 2 1
A 17 -5
E
sleeves silvermail mail silver~
The tiny links look almost like the scaly skin of a fish, or a
Dragon.
~

#0
`;
});

function parseState(section) {
	const objects = parseObjects(section.substring("#OBJECTS\n".length));
	return objects;
}
