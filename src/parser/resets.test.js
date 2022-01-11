import {
	parseResets,
	corellateResets,
	parseMobReset,
	parseInventoryReset,
	parseEquipmentReset,
	parseObjectReset,
	parseInObjectReset,
	parseDoorReset,
	parseRandomExitReset,
} from "./resets";

describe("parseMobReset", () => {
	test("parses a mob reset line", () => {
		let line = "M 0 1234 2 5678";
		let reset = parseMobReset(line);
		expect(reset.mobVnum).toBe(1234);
		expect(reset.limit).toBe(2);
		expect(reset.roomVnum).toBe(5678);
		expect(reset.comment).toBe("");
		expectNoErrors(reset);
	});

	test("parses a mob reset with a comment", () => {
		let line = "M 0 1234 2 5678 * This is a cool mob";
		let reset = parseMobReset(line);
		expect(reset.mobVnum).toBe(1234);
		expect(reset.limit).toBe(2);
		expect(reset.roomVnum).toBe(5678);
		expect(reset.comment).toBe(" * This is a cool mob");
		expectNoErrors(reset);
	});

	test("marks error on invalid mob vnum", () => {
		let line = "M 0 12z34 2 5678";
		let reset = parseMobReset(line);
		expect(reset.mobVnum).toBe(0);
		expect(reset.limit).toBe(2);
		expect(reset.roomVnum).toBe(5678);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "mobVnum");;
	});

	test("marks error on invalid limit", () => {
		let line = "M 0 1234 2z 5678";
		let reset = parseMobReset(line);
		expect(reset.mobVnum).toBe(1234);
		expect(reset.limit).toBe(1);
		expect(reset.roomVnum).toBe(5678);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "limit");;
	});

	test('marks error on invalid room vnum', () => {
		let line = "M 0 1234 2 56z78";
		let reset = parseMobReset(line);
		expect(reset.mobVnum).toBe(1234);
		expect(reset.limit).toBe(2);
		expect(reset.roomVnum).toBe(0);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "roomVnum");;
	});
});

describe("parseInventoryReset", () => {
	test("parses an inventory reset line", () => {
		let line = "G 0 1234 0";
		let reset = parseInventoryReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.limit).toBe(0);
		expect(reset.wearLocation).toBe(-1);
		expect(reset.comment).toBe("");
		expectNoErrors(reset);
	});

	test("parses an inventory reset with a limit", () => {
		let line = "G -2 1234 0";
		let reset = parseInventoryReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.limit).toBe(1);
		expect(reset.wearLocation).toBe(-1);
		expect(reset.comment).toBe("");
		expectNoErrors(reset);
	});

	test("parses an inventory reset with a comment", () => {
		let line = "G 0 1234 0 * Load the cool item";
		let reset = parseInventoryReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.limit).toBe(0);
		expect(reset.wearLocation).toBe(-1);
		expect(reset.comment).toBe(" * Load the cool item");
		expectNoErrors(reset);
	});

	test("marks error on invalid limit", () => {
		let line = "G z 1234 0";
		let reset = parseInventoryReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.limit).toBe(0);
		expect(reset.wearLocation).toBe(-1);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "limit");;
	});

	test("marks error on invalid object vnum", () => {
		let line = "G 0 12z34 0";
		let reset = parseInventoryReset(line);
		expect(reset.objectVnum).toBe(0);
		expect(reset.limit).toBe(0);
		expect(reset.wearLocation).toBe(-1);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "objectVnum");;
	});
});

describe("parseEquipmentReset", () => {
	test("parses an inventory reset line", () => {
		let line = "E 0 1234 0 8";
		let reset = parseEquipmentReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.limit).toBe(0);
		expect(reset.wearLocation).toBe(8);
		expect(reset.comment).toBe("");
		expectNoErrors(reset);
	});

	test("parses an inventory reset with a limit", () => {
		let line = "E -2 1234 0 8";
		let reset = parseEquipmentReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.limit).toBe(1);
		expect(reset.wearLocation).toBe(8);
		expect(reset.comment).toBe("");
		expectNoErrors(reset);
	});

	test("parses an inventory reset with a comment", () => {
		let line = "E 0 1234 0 8 * Load the cool item on feet";
		let reset = parseEquipmentReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.limit).toBe(0);
		expect(reset.wearLocation).toBe(8);
		expect(reset.comment).toBe(" * Load the cool item on feet");
		expectNoErrors(reset);
	});

	test("marks error on invalid limit", () => {
		let line = "E z 1234 0 8";
		let reset = parseEquipmentReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.limit).toBe(0);
		expect(reset.comment).toBe("");
		expect(reset.wearLocation).toBe(8);
		expectSingleError(reset, "limit");;
	});

	test("marks error on invalid object vnum", () => {
		let line = "E 0 12z34 0 8";
		let reset = parseEquipmentReset(line);
		expect(reset.objectVnum).toBe(0);
		expect(reset.limit).toBe(0);
		expect(reset.comment).toBe("");
		expect(reset.wearLocation).toBe(8);
		expectSingleError(reset, "objectVnum");;
	});

	test("marks error on invalid wear location", () => {
		let line = "E 0 1234 0 z";
		let reset = parseEquipmentReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.limit).toBe(0);
		expect(reset.comment).toBe("");
		expect(reset.wearLocation).toBe(0);
		expectSingleError(reset, "wearLocation");;
	});
});

describe("parseObjectReset", () => {
	test("parses an object reset line", () => {
		let line = "O 0 1234 0 5678";
		let reset = parseObjectReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.roomVnum).toBe(5678);
		expect(reset.comment).toBe("");
		expectNoErrors(reset);
	});

	test("parses an object reset with a comment", () => {
		let line = "O 0 1234 0 5678 * Load cool item in cool room";
		let reset = parseObjectReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.roomVnum).toBe(5678);
		expect(reset.comment).toBe(" * Load cool item in cool room");
		expectNoErrors(reset);
	});

	test("marks error on invalid object vnum", () => {
		let line = "O 0 12z34 0 5678";
		let reset = parseObjectReset(line);
		expect(reset.objectVnum).toBe(0);
		expect(reset.roomVnum).toBe(5678);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "objectVnum");
	});

	test("marks error on invalid room vnum", () => {
		let line = "O 0 1234 0 56z78";
		let reset = parseObjectReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.roomVnum).toBe(0);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "roomVnum");
	});
});

describe("parseInObjectReset", () => {
	test("parses an in-object reset line", () => {
		let line = "P 0 1234 0 5678";
		let reset = parseInObjectReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.containerVnum).toBe(5678);
		expect(reset.comment).toBe("");
		expectNoErrors(reset);
	});

	test("parses an in-object reset with a comment", () => {
		let line = "P 0 1234 0 5678 * Load cool item in cool container";
		let reset = parseInObjectReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.containerVnum).toBe(5678);
		expect(reset.comment).toBe(" * Load cool item in cool container");
		expectNoErrors(reset);
	});

	test("marks error on invalid object vnum", () => {
		let line = "P 0 12z34 0 5678";
		let reset = parseInObjectReset(line);
		expect(reset.objectVnum).toBe(0);
		expect(reset.containerVnum).toBe(5678);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "objectVnum");
	});

	test("marks error on invalid container vnum", () => {
		let line = "P 0 1234 0 56z78";
		let reset = parseInObjectReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.containerVnum).toBe(0);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "containerVnum");
	});
});

describe("parseDoorReset", () => {
	test("parses a door reset line", () => {
		let line = "D 0 1234 1 2";
		let reset = parseDoorReset(line);
		expect(reset.roomVnum).toBe(1234);
		expect(reset.direction).toBe(1);
		expect(reset.state).toBe(2);
		expectNoErrors(reset);
	});

	test("parses a door reset with a comment", () => {
		let line = "D 0 1234 1 2 * Lock the cool door in the cool room";
		let reset = parseDoorReset(line);
		expect(reset.roomVnum).toBe(1234);
		expect(reset.direction).toBe(1);
		expect(reset.state).toBe(2);
		expect(reset.comment).toBe(" * Lock the cool door in the cool room");
		expectNoErrors(reset);
	});

	test("marks error on invalid room vnum", () => {
		let line = "D 0 12z34 1 2";
		let reset = parseDoorReset(line);
		expect(reset.roomVnum).toBe(0);
		expect(reset.direction).toBe(1);
		expect(reset.state).toBe(2);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "roomVnum");
	});

	test("marks error on invalid direction", () => {
		let line = "D 0 1234 z 2";
		let reset = parseDoorReset(line);
		expect(reset.roomVnum).toBe(1234);
		expect(reset.direction).toBe(0);
		expect(reset.state).toBe(2);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "direction");
	});

	test("marks error on out-of-bounds direction", () => {
		let line = "D 0 1234 7 2";
		let reset = parseDoorReset(line);
		expect(reset.roomVnum).toBe(1234);
		expect(reset.direction).toBe(7);
		expect(reset.state).toBe(2);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "direction")
	});

	test("marks error on invalid state", () => {
		let line = "D 0 1234 1 z";
		let reset = parseDoorReset(line);
		expect(reset.roomVnum).toBe(1234);
		expect(reset.direction).toBe(1);
		expect(reset.state).toBe(0);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "state");
	});

	test("marks error on out-of-bounds state", () => {
		let line = "D 0 1234 5 3";
		let reset = parseDoorReset(line);
		expect(reset.roomVnum).toBe(1234);
		expect(reset.direction).toBe(5);
		expect(reset.state).toBe(3);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "state")
	});
});

describe("parseRandomExitReset", () => {
	test("parses a random exit reset line", () => {
		let line = "R 0 1234 3";
		let reset = parseRandomExitReset(line);
		expect(reset.roomVnum).toBe(1234);
		expect(reset.numExits).toBe(3);
		expect(reset.comment).toBe("");
		expectNoErrors(reset);
	});

	test("parses a random exit reset with a comment", () => {
		let line = "R 0 1234 3 * Randomize 3 cool exits in the cool room";
		let reset = parseRandomExitReset(line);
		expect(reset.roomVnum).toBe(1234);
		expect(reset.numExits).toBe(3);
		expect(reset.comment).toBe(" * Randomize 3 cool exits in the cool room")
		expectNoErrors(reset);
	});

	test("marks error on invalid room vnum", () => {
		let line = "R 0 12z34 3";
		let reset = parseRandomExitReset(line);
		expect(reset.roomVnum).toBe(0);
		expect(reset.numExits).toBe(3);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "roomVnum");
	});

	test("marks error on invalid number of exits", () => {
		let line = "R 0 1234 z";
		let reset = parseRandomExitReset(line);
		expect(reset.roomVnum).toBe(1234);
		expect(reset.numExits).toBe(0);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "numExits");
	});
});

describe("parseResets & corellateResets", () => {
	const MOBILES = [
		{ id: "mob-id-1111", vnum: 1111 },
		{ id: "mob-id-1112", vnum: 1112 },
		{ id: "mob-id-1113", vnum: 1113 },
	];
	const OBJECTS = [
		{ id: "object-id-2222", vnum: 2222 },
		{ id: "object-id-2223", vnum: 2223 },
		{ id: "object-id-2224", vnum: 2224 },
		{ id: "object-id-2225", vnum: 2225 },
	];
	const ROOMS = [
		{ id: "room-id-3333", vnum: 3333, doors: [
			{ direction: 0 },
			{ direction: 2 },
		] },
		{ id: "room-id-3334", vnum: 3334, doors: [
			{ direction: 0 },
			{ direction: 1 },
			{ direction: 2 },
			{ direction: 3 },
		]},
	];
	const SECTION = `
M 0 1111 1 3333
M 0 1112 1 3333

G 0 2222 0
E 0 2223 0

M 0 1113 1 3334

O 0 2224 0 3334
P 0 2225 0 2224

D 0 3333 2 1
R 0 3334 4
`;
	const parsedResets = parseResets(SECTION);
	const PARSED_RESETS = corellateResets(parsedResets, MOBILES, OBJECTS, ROOMS);

	test("links mob resets to already-parsed mob", () => {
		let resets = PARSED_RESETS
		expectNoErrors(resets.mobile[0]);
		expectNoErrors(resets.mobile[1]);
		expectNoErrors(resets.mobile[2]);
		expect(resets.mobile[0].mobId).toBe("mob-id-1111");
		expect(resets.mobile[1].mobId).toBe("mob-id-1112")
		expect(resets.mobile[2].mobId).toBe("mob-id-1113")
	});

	test("links mob resets to already-parsed room", () => {
		let resets = PARSED_RESETS
		expectNoErrors(resets.mobile[0]);
		expectNoErrors(resets.mobile[1]);
		expectNoErrors(resets.mobile[2]);
		expect(resets.mobile[0].roomId).toBe("room-id-3333");
		expect(resets.mobile[1].roomId).toBe("room-id-3333");
		expect(resets.mobile[2].roomId).toBe("room-id-3334");
	});

	test("marks error on mob reset when mob vnum doesn't exist", () => {
		let resets = parseResets("M 0 9999 1 3333");
		let orphaned = corellateResets(resets, MOBILES, OBJECTS, ROOMS);
		expect(orphaned.mobile[0].mobId).toBe("9999");
		expect(orphaned.mobile[0].orphan).toBe(true);
	});

	test("marks error on mob reset when room vnum doesn't exist", () => {
		let parsed = parseResets("M 0 1111 1 9999");
		let resets = corellateResets(parsed, MOBILES, OBJECTS, ROOMS);
		expectSingleError(resets.mobile[0], "roomId");
	});

	test("links inventory resets to already-parsed object", () => {
		let resets = PARSED_RESETS
		expectNoErrors(resets.mobile[1].equipment[0]);
		expect(resets.mobile[1].equipment[0].objectId).toBe("object-id-2222");
	});

	test("marks error on inventory reset when object vnum doesn't exist", () => {
		let parsed = parseResets("M 0 1111 1 3333\nG 0 9999 0");
		let resets = corellateResets(parsed, MOBILES, OBJECTS, ROOMS);
		expectSingleError(resets.mobile[0].equipment[0], "objectId");
	});

	test("links equipment resets to already-parsed object", () => {
		let resets = PARSED_RESETS
		expectNoErrors(resets.mobile[1].equipment[1]);
		expect(resets.mobile[1].equipment[1].objectId).toBe("object-id-2223");
	});


	test("marks error on equipment reset when object vnum doesn't exist", () => {
		let parsed = parseResets("M 0 1111 1 3333\nE 0 9999 0");
		let resets = corellateResets(parsed, MOBILES, OBJECTS, ROOMS);
		expectSingleError(resets.mobile[0].equipment[0], "objectId");
	});

	test("links object resets to already-parsed object", () => {
		let resets = PARSED_RESETS
		expectNoErrors(resets.object[0]);
		expect(resets.object[0].objectId).toBe("object-id-2224");
	});

	test("links object resets to already-parsed room", () => {
		let resets = PARSED_RESETS
		expectNoErrors(resets.object[0]);
		expect(resets.object[0].roomId).toBe("room-id-3334");
	});

	test("marks error on object reset when object vnum doesn't exist", () => {
		let resets = parseResets("O 0 9999 0 3334");
		let orphaned = corellateResets(resets, MOBILES, OBJECTS, ROOMS);
		expect(orphaned.object[0].objectId).toBe("9999");
		expect(orphaned.object[0].orphan).toBe(true);
	});

	test("marks error on object reset when room vnum doesn't exist", () => {
		let parsed = parseResets("O 0 2224 0 9999");
		let resets = corellateResets(parsed, MOBILES, OBJECTS, ROOMS);
		expectSingleError(resets.object[0], "roomId");
	});

	test("links in-object resets to already-parsed object", () => {
		let resets = PARSED_RESETS
		expectNoErrors(resets.inObject[0]);
		expect(resets.inObject[0].objectId).toBe("object-id-2225");
	});

	test("links in-object resets to already-parsed container", () => {
		let resets = PARSED_RESETS
		expectNoErrors(resets.inObject[0]);
		expect(resets.inObject[0].containerId).toBe("object-id-2224");
	});

	test("marks error on in-object reset when object vnum doesn't exist", () => {
		let resets = parseResets("P 0 9999 0 2224");
		let orphaned = corellateResets(resets, MOBILES, OBJECTS, ROOMS);
		expectSingleError(orphaned.inObject[0], "objectId");
		expect(orphaned.inObject[0].objectId).toBe("9999");
	});

	test("marks error on in-object reset when container vnum doesn't exist", () => {
		let parsed = parseResets("P 0 2225 0 9999");
		let resets = corellateResets(parsed, MOBILES, OBJECTS, ROOMS);
		expect(resets.inObject[0].containerId).toBe("9999");
		expect(resets.inObject[0].orphan).toBe(true);
	});

	test("links door resets to already-parsed room", () => {
		let resets = PARSED_RESETS;
		expectNoErrors(resets.door[0]);
		expect(resets.door[0].roomId).toBe("room-id-3333");
	});

	test("marks error on door reset when room vnum doesn't exist", () => {
		let resets = parseResets("D 0 9999 2 1");
		let orphaned = corellateResets(resets, MOBILES, OBJECTS, ROOMS);
		expect(orphaned.door[0].roomId).toBe("9999")
		expect(orphaned.door[0].orphan).toBe(true);
	});

	test("marks error on door reset when room exit direction doesn't exist", () => {
		let resets = parseResets("D 0 3333 1 1");
		let orphaned = corellateResets(resets, MOBILES, OBJECTS, ROOMS);
		expectSingleError(resets.door[0], "direction");
	});

	test("links random exit resets to already-parsed room", () => {
		let resets = PARSED_RESETS
		expect(resets.randomExit).toHaveLength(1);
		expect(resets.randomExit[0].roomId).toBe("room-id-3334");
	});

	test("marks error on random exit reset when room vnum doesn't exist", () => {
		let resets = parseResets("R 0 9999 4");
		let orphaned = corellateResets(resets, MOBILES, OBJECTS, ROOMS);
		expect(orphaned.randomExit[0].roomId).toBe("9999");
		expect(orphaned.randomExit[0].orphan).toBe(true);
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
