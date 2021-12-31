import parseAreadata from "../parser/areadata";
import serializeAreadata from "./areadata";

describe(`serializeAreadata`, () => {
	const AREADATA = `#AREADATA
P 2 1
F 1|2
O 101 102 103 104 105
K 1 2 100 150 text~
M 11 12 13 14 15 16 17 18
G 11 12 13 14 15 16 17 18
V 100 199
B 10000 100000
S
`

	it("serializes all of the areadata lines", () => {
		const state = parseState(AREADATA);
		expect(serializeAreadata(state)).toBe(AREADATA);
	});

	it("serializes a plane without a zone", () => {
		const AREADATA_WITHOUT_ZONE = `#AREADATA
P 1
S
`;
		const state = parseState(AREADATA_WITHOUT_ZONE);
		expect(serializeAreadata(state)).toBe(AREADATA_WITHOUT_ZONE);
	});

	it("omits areadata when it is empty", () => {
		const state = parseState("#AREADATA\nS\n");
		expect(serializeAreadata(state)).toBe("");
	});
});

function parseState(string) {
	const areadata = parseAreadata(string.substring("#AREADATA\n".length));
	const areadataBits = {};
	for (let key of Object.keys(areadata)) {
		areadataBits[key] = true;
	}
	const state = {
		...areadata,
		areadataBits,
	};
	return state;
}
