import parseRooms, { parseRoom, corellateDoors } from "./rooms";
import { Objekt } from "../app/models";

describe("parseRoom", () => {
	test("parses a room", () => {
		let room = parseRoom(ROOM);
		expectNoErrors(room);
		expect(room.vnum).toBe(8100);
		expect(room.name).toBe("The Silver Tunnel of Light");
		expect(room.description).toBe(`.  A clutter of small pieces of paper and fragments of large boards are
scattered throughout this tunnel. You can go to the north or south.  A
voice whispers in your mind...

   'Non-verbal communication is the best way to keep in touch with friends
    and to voice your opinions.  Learn of this system by typing "look notes"
    and "look board"'`);
		expect(room.flags).toEqual([8]);
		expect(room.sector).toBe(0);
		expect(room.alignFlags).toEqual([1, 2]);
		expect(room.classFlags).toEqual([2, 4]);
		expect(room.doors).toHaveLength(2);
		expectNoErrors(room.doors[0]);
		expect(room.doors[0].direction).toBe(0);
		expect(room.doors[0].description).toBe("");
		expect(room.doors[0].keywords).toEqual([]);
		expect(room.doors[0].locks).toEqual(0);
		expect(room.doors[0].toVnum).toBe(8182);
		expectNoErrors(room.doors[1]);
		expect(room.doors[1].direction).toBe(2);
		expect(room.doors[1].description).toBe("");
		expect(room.doors[1].keywords).toEqual([]);
		expect(room.doors[1].locks).toEqual(0);
		expect(room.doors[1].toVnum).toBe(8181);
		expect(room.extraDescs).toHaveLength(2);
		expect(room.extraDescs[0]).toMatchObject({
			keywords: ["notes"],
			body: `.  All of this information is explained further by the help system.
(type: help notes)   This is only a brief explanation to get you started.

   After reaching second level, when you log in, AVATAR will tell you how
many UNREAD notes you have on each of the different boards.  (type:  board
to see which board you are currently active on )  To list all notes on
your active board type:  note list  .   To read a specific note type:
note read <note number>   .

   To write a note you need to issue several commands.  They are:

   note to <all, immortal, or a character name>
   note subject <note subject>
   note + <first line>
   note + <second line>
   note show
   note post
`
		});
		expect(room.extraDescs[1]).toMatchObject({
			keywords: ["board"],
			body: `.  There are currently SEVEN boards on AVATAR.  These are explained in more
detail with <help boards>

For now, let's do a quick overview...  Type:  board

   This shows you the 7 boards and how many notes you have read and how many
you have not.  It also shows you which board is currently 'active'.  To
change a board, just type:  board <board number>   Whatever board you are
on has its own set of notes.  If you choose to write a note or read a note on
a certain board, just make that board active and do so... have fun. :)
`
		});
	});

	[
		["vnum", "vnum"],
		["flags", "flags"],
		["sector", "sector"],
		["doorDirection", "door.direction"],
		["doorLocks", "door.locks"],
		["doorKey", "door.key"],
		["doorToVnum", "door.toVnum"],
		["alignFlags", "alignFlags"],
		["classFlags", "classFlags"],
	].forEach(([inputField, outputField]) => {
		test(`marks error on invalid ${inputField} field`, () => {
			let room = parseRoom(makeInvalidRoom(inputField));
			if (outputField.startsWith("door")) {
				let doorField = outputField.substring(5);
				expectSingleError(room.doors[0], doorField);
			} else {
				expectSingleError(room, outputField);
			}
		});
	});

	test("marks error when description is left open", () => {
		let room = parseRoom(OPEN_DESCRIPTION);
		expect(room._error.description).toBe(true);
		expect(room._error.flags).toBe(true);
		expect(room._error.sector).toBe(true);
	});

	test("marks error when extra desc message is left open", () => {
		let room = parseRoom(OPEN_EDESC);
		expectSingleError(room, "extraDescs");
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

const ROOM = `
#8100
The Silver Tunnel of Light~
.  A clutter of small pieces of paper and fragments of large boards are
scattered throughout this tunnel. You can go to the north or south.  A
voice whispers in your mind...

   'Non-verbal communication is the best way to keep in touch with friends
    and to voice your opinions.  Learn of this system by typing "look notes"
    and "look board"'
~
0 8 0
D0
~
~
0 0 8182
D2
~
~
0 0 8181
E
notes~
.  All of this information is explained further by the help system.
(type: help notes)   This is only a brief explanation to get you started.

   After reaching second level, when you log in, AVATAR will tell you how
many UNREAD notes you have on each of the different boards.  (type:  board
to see which board you are currently active on )  To list all notes on
your active board type:  note list  .   To read a specific note type:
note read <note number>   .

   To write a note you need to issue several commands.  They are:

   note to <all, immortal, or a character name>
   note subject <note subject>
   note + <first line>
   note + <second line>
   note show
   note post
~
A 1|2
E
board~
.  There are currently SEVEN boards on AVATAR.  These are explained in more
detail with <help boards>

For now, let's do a quick overview...  Type:  board

   This shows you the 7 boards and how many notes you have read and how many
you have not.  It also shows you which board is currently 'active'.  To
change a board, just type:  board <board number>   Whatever board you are
on has its own set of notes.  If you choose to write a note or read a note on
a certain board, just make that board active and do so... have fun. :)
~
C 2|4
S
`;

const OPEN_DESCRIPTION = `
#8100
The Silver Tunnel of Light~
.  A clutter of small pieces of paper and fragments of large boards are
scattered throughout this tunnel. You can go to the north or south.  A
voice whispers in your mind...

   'Non-verbal communication is the best way to keep in touch with friends
    and to voice your opinions.  Learn of this system by typing "look notes"
    and "look board"'
0 8 0
S
`;

const OPEN_EDESC = `
#8111
Northern Meadow~
.  A pile of stones are stacked here, holding up a small sign.  As you step
around it you notice a skeletal hand sticking out from under one of the rocks.
Poor fellow probably got devoured by a vicious field mouse.
~
0 0 2
D0
~
~
0 0 8103
D1
~
~
0 0 8112
D2
~
~
0 0 8119
D3
~
~
0 0 8110
E
sign~
Here I lie for eternity.  If only I had learned to SCAN the land better.
S
`;

function makeInvalidRoom(field, value = null) {
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
name~
description
~
0 {flags} {sector}
D{doorDirection}
door description
~
door keywords~
{doorLocks} {doorKey} {doorToVnum}
A {alignFlags}
C {classFlags}
`;

describe("parseRooms", () => {

});

describe("corellateDoors", () => {
	const OBJECTS = [
		{
			id: "object-id-12698",
			vnum: 12698,
			keywords: ["scarf", "key"],
			name: "a key tied to a colorful scarf",
			longDesc: "This key waits to be claimed by the winner of the fighting pit!",
			actionDesc: "",
			itemType: 18,
			extraFlags: [131072],
			wearFlags: [1],
			value0: 0,
			value1: 0,
			value2: 0,
			value3: 0,
			weight: 0,
			worth: 0,
			racialFlags: [],
			extraDescs: [],
			applies: [],
			quality: 50,
		},
	];

	test("links rooms and keys together by id", () => {
		const uncorellatedRooms = parseRooms(ROOMS);
		const rooms = corellateDoors(OBJECTS, uncorellatedRooms);
		expect(rooms).toHaveLength(uncorellatedRooms.length);

		const room12652 = rooms.find(r => r.vnum === 12652);
		expectNoErrors(room12652);
		const room12655 = rooms.find(r => r.vnum === 12655);
		expectNoErrors(room12655);
		const room12656 = rooms.find(r => r.vnum === 12656);
		expectNoErrors(room12656);
		const room12659 = rooms.find(r => r.vnum === 12659);
		expectNoErrors(room12659);

		expectNoErrors(room12652.doors[0]);
		expect(room12652.doors[0].direction).toBe(2);
		expect(room12652.doors[0].toRoomId).toBe(room12655.id);

		expectNoErrors(room12655.doors[0]);
		expect(room12655.doors[0].direction).toBe(0);
		expect(room12655.doors[0].toRoomId).toBe(room12652.id);
		expectNoErrors(room12655.doors[1]);
		expect(room12655.doors[1].direction).toBe(1);
		expect(room12655.doors[1].toRoomId).toBe(room12656.id);
		expectNoErrors(room12655.doors[2]);
		expect(room12655.doors[2].direction).toBe(4);
		expect(room12655.doors[2].toRoomId).toBe(room12659.id);
		expect(room12655.doors[2].locks).toBe(8);
		expect(room12655.doors[2].keyId).toBe('object-id-12698');

		expectNoErrors(room12656.doors[0]);
		expect(room12656.doors[0].direction).toBe(3);
		expect(room12656.doors[0].toRoomId).toBe(room12655.id);

		expectNoErrors(room12659.doors[0]);
		expect(room12659.doors[0].direction).toBe(5);
		expect(room12659.doors[0].toRoomId).toBe(room12655.id);
		expect(room12659.doors[0].locks).toBe(8);
		expect(room12659.doors[0].keyId).toBe('object-id-12698');
	});

	test("marks error when door destination vnum doesn't exist", () => {
		const uncorellatedRooms = parseRooms(ROOMS.replace("8 12698 12655", "8 12698 12699"));
		const rooms = corellateDoors(OBJECTS, uncorellatedRooms);

		const room12659 = rooms.find(r => r.vnum === 12659);
		expectNoErrors(room12659);

		expectSingleError(room12659.doors[0], "toRoomId");
	});

	test("marks error when door key vnum doesn't exist", () => {
		const uncorellatedRooms = parseRooms(ROOMS);
		const rooms = corellateDoors([], uncorellatedRooms);

		const room12655 = rooms.find(r => r.vnum === 12655);
		expectNoErrors(room12655);

		const room12659 = rooms.find(r => r.vnum === 12659);
		expectNoErrors(room12659);

		expectSingleError(room12655.doors[2], "keyId");
		expectSingleError(room12659.doors[0], "keyId");
	});
});

const ROOMS = `
#12652
Center stage of the arena!~
~
0 8|8192 0
D2
~
~
0 0 12655
S
#12655
A cage in the corner of the arena~
~
0 4|8|8192 0
D0
~
~
0 0 12652
D1
~
~
0 0 12656
D4
The grate above you keeps you from escaping the cage for the relative
safety of the bar above. Even if you could pick it open, the screaming
mob above probably wouldn't let you out without first seeing you bleed
a bit. Countless fingers reach through the openings for you.
~
door cage grate~
8 12698 12659
S
#12656
The edge of the arena~
~
0 8|8192 0
D3
~
~
0 0 12655
S
#12659
Overlooking the fighting pit~
~
0 8|8192 1
D5
~
cage grate door~
8 12698 12655
S
`;
