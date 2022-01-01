import parseHelps from "../parser/helps";
import serializeHelps from "./helps";

describe(`serializeAreadata`, () => {
	const HELPS = `#HELPS
800 'PARIAHS PARADISE' UNDERWORLD 'MIDGAARD UNDERWORLD'~
It's pretty cool.

|BC|See also: |C|'PARIAHS PARADISE STORY'|N|
~

1 'PARIAHS PARADISE' UNDERWORLD 'MIDGAARD UNDERWORLD'~
It's pretty cool.
~

0$~
`

	test('serializes multiple helps', () => {
		const state = parseState(HELPS);
		expect(serializeHelps(state)).toBe(HELPS);
	});

	test('appends a newline to the end of the body', () => {
		const state = parseState(`#HELPS
1 keyword~
body~
0$~
`);
		expect(serializeHelps(state)).toBe("#HELPS\n1 keyword~\nbody\n~\n\n0$~\n");
	});

	test('omits an empty section', () => {
		const state = parseState("#HELPS\n\n\n\n0$~\n");
		expect(serializeHelps(state)).toBe("");
	});
});

function parseState(string) {
	const helps = parseHelps(string.substring("#HELPS\n".length));
	return helps;
}
