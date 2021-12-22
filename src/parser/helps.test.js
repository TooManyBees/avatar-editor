import parseHelps, { parseKeywords } from './helps';

describe("parseKeywords", () => {
	test("parses keywords", () => {
		let { keywords } = parseKeywords("key word");
		expect(keywords).toEqual(["key", "word"]);
	});

	test("parses keywords with single quotes", () => {
		let { keywords } = parseKeywords("a 'long keyword'");
		expect(keywords).toEqual(["a", "long keyword"]);
	});

	test("parses keywords with double quotes", () => {
		let { keywords } = parseKeywords('a "long keyword"');
		expect(keywords).toEqual(["a", "long keyword"]);
	});

	test("ignores a nested single quote inside double quotes", () => {
		let { keywords } = parseKeywords('a "giant\'s keyword"');
		expect(keywords).toEqual(["a", "giant's keyword"]);
	});

	test("ignores a nested double quote inside single quotes", () => {
		let { keywords } = parseKeywords("by 'steven \"steve\" smith'");
		expect(keywords).toEqual(["by", 'steven "steve" smith']);
	});

	test("ignores a single quote inside an unquoted word", () => {
		let { keywords } = parseKeywords("hakai ha'kai");
		expect(keywords).toEqual(["hakai", "ha'kai"]);
	});

	test("ignores a double quote inside an unquoted word", () => {
		let { keywords } = parseKeywords('hakai ha"kai');
		expect(keywords).toEqual(["hakai", 'ha"kai']);
	});

	test("ignores leading and trailing white space", () => {
		let { keywords } = parseKeywords("  a keyword  ");
		expect(keywords).toEqual(["a", "keyword"]);
	})

	test("raises error when a single quoted keyword is left open", () => {
		let { errors, keywords } = parseKeywords("a 'long keyword");
		expect(errors).toContain("Quoted keyword without closing quote:\n'long keyword");
		expect(keywords).toEqual(["a", "long keyword"]);
	});

	test("raises error when a double quoted keyword is left open", () => {
		let { errors, keywords } = parseKeywords('a "long keyword');
		expect(errors).toContain("Quoted keyword without closing quote:\n\"long keyword");
		expect(keywords).toEqual(["a", "long keyword"]);
	});
});