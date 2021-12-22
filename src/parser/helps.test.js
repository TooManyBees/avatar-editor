import parseHelps from './helps';
import { parseKeywords, parseBits } from "./helpers";

const SINGLE_HELP = `
800 secret~
this is a very secret help file

none may view it
~
`;

const MULTIPLE_HELPS = `
1 secret~
there are no secrets here!
~

800 secret~
this is a very secret help file

none may view it
~
`;

const WONKY_HELPS = `
1 secret~
there are no secrets here!
~
800 secret~
`;

const MOTD = `
-1 MOTD~
welcome to the club!
~
`;

const INVALID_LEVEL = `
so secret~
this is a very secret help file

none may view it
~
`;

function makeHelps(help) {
	return parseHelps(`\n${help}\n0$~\n`);
}

describe("parseHelps", () => {
	test("parses a help", () => {
		let helps = makeHelps(SINGLE_HELP);
		expect(helps).toHaveLength(1);
		let help = helps[0];
		expectNoErrors(help);
		expect(help.level).toBe(800);
		expect(help.keywords).toEqual(["secret"]);
		expect(help.body).toEqual("this is a very secret help file\n\nnone may view it");
	});

	test("parses multiple helps", () => {
		let helps = makeHelps(MULTIPLE_HELPS);
		expect(helps).toHaveLength(2);
		{
			let help = helps[0];
			expectNoErrors(help);
			expect(help.level).toBe(1);
			expect(help.keywords).toEqual(["secret"]);
			expect(help.body).toEqual("there are no secrets here!");
		}
		{
			let help = helps[1];
			expectNoErrors(help);
			expect(help.level).toBe(800);
			expect(help.keywords).toEqual(["secret"]);
			expect(help.body).toEqual("this is a very secret help file\n\nnone may view it");
		}
	});

	test("parses a help with a negative level", () => {
		let helps = makeHelps(MOTD);
		expect(helps).toHaveLength(1);
		let help = helps[0];
		expectNoErrors(help);
		expect(help.level).toBe(-1);
		expect(help.keywords).toEqual(["MOTD"]);
		expect(help.body).toEqual("welcome to the club!");
	});

	test("parses when headers and bodies don't match up", () => {
		let helps = makeHelps(WONKY_HELPS);
		expect(helps).toHaveLength(2);
		{
			let help = helps[0];
			expectNoErrors(help);
			expect(help.level).toBe(1);
			expect(help.keywords).toEqual(["secret"]);
			expect(help.body).toBe("there are no secrets here!");
		}
		{
			let help = helps[1];
			expectSingleError(help, "body");
			expect(help.level).toBe(800);
			expect(help.keywords).toEqual(["secret"]);
			expect(help.body).toEqual("");
		}
	});

	test("raises error when level is invalid", () => {
		let helps = makeHelps(INVALID_LEVEL);
		expect(helps).toHaveLength(1);
		let help = helps[0];
		expectSingleError(help, "level");
	});

	test("silently accepts helps after the 0$~", () => {
		let helps = parseHelps("\n1 keyword~\nbody\nbody\nbody\n~\n\n0$~\n1 keyword~\ntechnically invalid\n~\n");
		expect(helps).toHaveLength(2);
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
