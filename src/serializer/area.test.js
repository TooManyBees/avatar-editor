import serializeArea from "./area";

describe("serializeArea", () => {
	test("serializes an area section line", () => {
		let area = { levelRange: "LEGEND", author: "Bees", name: "The Hive" };
		expect(serializeArea(area)).toBe("#AREA {LEGEND} Bees    The Hive~\n");
	});

	test("truncates author name", () => {
		let area = { levelRange: "LEGEND", author: "ScevineXYZ", name: "The Hive" };
		expect(serializeArea(area)).toBe("#AREA {LEGEND} Scevine The Hive~\n");
	});

	test("centers word level range", () => {
		let area = { levelRange: "LORD", author: "Bees", name: "The Hive" };
		expect(serializeArea(area)).toBe("#AREA { LORD } Bees    The Hive~\n");
	});

	test("spaces out numeric level range", () => {
		let area = { levelRange: "5 8", author: "Bees", name: "The Hive" };
		expect(serializeArea(area)).toBe("#AREA { 5   8} Bees    The Hive~\n");
	});

	test("centers odd-length word level range", () => {
		let area = { levelRange: "A", author: "Bees", name: "The Hive" };
		expect(serializeArea(area)).toBe("#AREA {  A   } Bees    The Hive~\n");
	});
});
