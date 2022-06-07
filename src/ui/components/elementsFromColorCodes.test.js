import React from 'react';
import { render, screen } from '@testing-library/react';
import elementsFromColorCodes from "./elementsFromColorCodes";

describe.skip("elementsFromColorCodes", () => {
	it("parses color codes surrounding a string", () => {
		let { container } = render(elementsFromColorCodes("|BK|Hi there!"));
		expect(container.firstElementChild).toMatchInlineSnapshot('<span><span class="colorBK">Hi there!</span></span>');
	});

	it("handles the |N| code", () => {
		let { container } = render(elementsFromColorCodes("|BK|Hi there|N|, I say"));
		expect(container.firstElementChild).toMatchInlineSnapshot('<span><span class="colorBK">Hi there</span>, I say</span>');
	});

	it("handles lowercase codes", () => {
		let { container } = render(elementsFromColorCodes("|bk|Hi there|n|!"));
		expect(container.firstElementChild).toMatchInlineSnapshot('<span><span class="colorBK">Hi there</span>!</span>');
	})

	it("handles leading uncolored code", () => {
		let { container } = render(elementsFromColorCodes("This is |Y|so cool!"));
		expect(container.firstElementChild).toMatchInlineSnapshot('<span>This is <span class="colorY">so cool!</span></span>');
	});

	it("responds to all color codes", () => {
		let input = "|K|R|R|A|Y|I|G|N|W|B|C|O|B|W|P|S|N| upon |BK|R|BR|A|BY|I|BG|N|BW|B|BC|O|BB|W|BP|S";
		let { container } = render(elementsFromColorCodes(input));
		expect(container.firstElementChild).toMatchInlineSnapshot('<span><span class="colorK">R</span><span class="colorR">A</span><span class="colorY">I</span><span class="colorG">N</span><span class="colorW">B</span><span class="colorC">O</span><span class="colorB">W</span><span class="colorP">S</span> upon <span class="colorBK">R</span><span class="colorBR">A</span><span class="colorBY">I</span><span class="colorBG">N</span><span class="colorBW">B</span><span class="colorBC">O</span><span class="colorBB">W</span><span class="colorBP">S</span></span>');
	});
});
