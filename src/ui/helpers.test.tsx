import React from 'react';
import { render, screen } from '@testing-library/react';
import { htmlFromColorCodes, elementsFromColorCodes } from "./helpers";

describe("htmlFromColorCodes", () => {
	it("parses color codes surrounding a string", () => {
		let output = htmlFromColorCodes("|BK|Hi there!");
		expect(output).toBe('<span class="color-BK">Hi there!</span>');
	});

	it("handles the |N| code", () => {
		let output = htmlFromColorCodes("|BK|Hi there|N|, I say");
		expect(output).toBe('<span class="color-BK">Hi there</span>, I say');
	});

	it("handles leading uncolored code", () => {
		let output = htmlFromColorCodes("This is |Y|so cool!");
		expect(output).toBe('This is <span class="color-Y">so cool!</span>');
	});

	it("responds to all color codes", () => {
		let input = "|K|R|R|A|Y|I|G|N|W|B|C|O|B|W|P|S|N| upon |BK|R|BR|A|BY|I|BG|N|BW|B|BC|O|BB|W|BP|S";
		let output = htmlFromColorCodes(input);
		expect(output).toBe('<span class="color-K">R</span><span class="color-R">A</span><span class="color-Y">I</span><span class="color-G">N</span><span class="color-W">B</span><span class="color-C">O</span><span class="color-B">W</span><span class="color-P">S</span> upon <span class="color-BK">R</span><span class="color-BR">A</span><span class="color-BY">I</span><span class="color-BG">N</span><span class="color-BW">B</span><span class="color-BC">O</span><span class="color-BB">W</span><span class="color-BP">S</span>');
	});
});


describe.skip("elementsFromColorCodes", () => {
	it("parses color codes surrounding a string", () => {
		let { container } = render(elementsFromColorCodes("|BK|Hi there!"));
		expect(container.firstElementChild).toMatchInlineSnapshot('<span><span class="color-BK">Hi there!</span></span>');
	});

	it("handles the |N| code", () => {
		let { container } = render(elementsFromColorCodes("|BK|Hi there|N|, I say"));
		expect(container.firstElementChild).toMatchInlineSnapshot('<span><span class="color-BK">Hi there</span>, I say</span>');
	});

	it("handles leading uncolored code", () => {
		let { container } = render(elementsFromColorCodes("This is |Y|so cool!"));
		expect(container.firstElementChild).toMatchInlineSnapshot('<span>This is <span class="color-Y">so cool!</span></span>');
	});

	it("responds to all color codes", () => {
		let input = "|K|R|R|A|Y|I|G|N|W|B|C|O|B|W|P|S|N| upon |BK|R|BR|A|BY|I|BG|N|BW|B|BC|O|BB|W|BP|S";
		let { container } = render(elementsFromColorCodes(input));
		expect(container.firstElementChild).toMatchInlineSnapshot('<span><span class="color-K">R</span><span class="color-R">A</span><span class="color-Y">I</span><span class="color-G">N</span><span class="color-W">B</span><span class="color-C">O</span><span class="color-B">W</span><span class="color-P">S</span> upon <span class="color-BK">R</span><span class="color-BR">A</span><span class="color-BY">I</span><span class="color-BG">N</span><span class="color-BW">B</span><span class="color-BC">O</span><span class="color-BB">W</span><span class="color-BP">S</span></span>');
	});
});
