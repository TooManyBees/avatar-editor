import { quote } from "./helpers";

describe("quote", () => {
	it("quotes a two-word keyword", () => {
		expect(quote("cool thing")).toBe("'cool thing'");
	});

	it("quotes a two-word keyword with an apostrophe in it", () => {
		expect(quote("scevine's cool thing")).toBe("\"scevine's cool thing\"");
	});

	it("quotes a two-word keyword with double quotes in it", () => {
		expect(quote('"cool" thing')).toBe('\'"cool" thing\'');
	});

	it("does not quote a single-word keyword", () => {
		expect(quote("ha'kai")).toBe("ha'kai");
	});
});
