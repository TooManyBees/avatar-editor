import {
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
		expect(reset.comment).toBe("");
		expectNoErrors(reset);
	});

	test("parses an inventory reset with a limit", () => {
		let line = "G -2 1234 0";
		let reset = parseInventoryReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.limit).toBe(1);
		expect(reset.comment).toBe("");
		expectNoErrors(reset);
	});

	test("parses an inventory reset with a comment", () => {
		let line = "G 0 1234 0 * Load the cool item";
		let reset = parseInventoryReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.limit).toBe(0);
		expect(reset.comment).toBe(" * Load the cool item");
		expectNoErrors(reset);
	});

	test("marks error on invalid limit", () => {
		let line = "G z 1234 0";
		let reset = parseInventoryReset(line);
		expect(reset.objectVnum).toBe(1234);
		expect(reset.limit).toBe(0);
		expect(reset.comment).toBe("");
		expectSingleError(reset, "limit");;
	});

	test("marks error on invalid object vnum", () => {
		let line = "G 0 12z34 0";
		let reset = parseInventoryReset(line);
		expect(reset.objectVnum).toBe(0);
		expect(reset.limit).toBe(0);
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
