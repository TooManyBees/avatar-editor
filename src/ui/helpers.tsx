import React from "react";

export function htmlFromColorCodes(input: string, showColorCodes: boolean = false) {
	let currentColor: null | string = null;
	let currentPos = 0;
	let output = "";

	// Typescript won't let me iterate over the iterator, eh?
	for (let match of Array.from(input.matchAll(/\|(B?(?:K|B|C|G|R|Y|W|P)|N)\|/g))) {
		let text = input.slice(currentPos, match.index);
		if (currentColor === null) {
			output += text;
		} else {
			output += `<span class="color-${currentColor}">${text}</span>`
		}

		if (match[1] === "N") currentColor = null;
		else currentColor = match[1];
		currentPos = (match.index || 0) + match[0].length;
	}

	let remainingText = input.slice(currentPos);
	if (remainingText.length > 0) {
		if (currentColor === null) output += remainingText;
		else output += `<span class="color-${currentColor}">${remainingText}</span>`;
	}

	return output;
}

export function elementsFromColorCodes(input: string, showColorCodes: boolean = false) {
	let currentColor: null | string = null;
	let currentPos = 0;
	let output = [];

	// Typescript won't let me iterate over the iterator, eh?
	for (let match of Array.from(input.matchAll(/\|(B?(?:K|B|C|G|R|Y|W|P)|N)\|/g))) {
		let text = input.slice(currentPos, match.index);
		if (currentPos !== match.index) {
			if (currentColor === null) {
				output.push(<React.Fragment key={currentPos}>{text}</React.Fragment>);
			} else {
				output.push(<span key={currentPos} className={`color-${currentColor}`}>{text}</span>);
			}
		}

		if (match[1] === "N") currentColor = null;
		else currentColor = match[1];
		currentPos = (match.index || 0) + match[0].length;
	}

	let remainingText = input.slice(currentPos);
	if (remainingText.length > 0) {
		if (currentColor === null) output.push(<React.Fragment key={currentPos}>remainingText</React.Fragment>);
		else output.push(<span key={currentPos} className={`color-${currentColor}`}>{remainingText}</span>);
	}

	return <span>{output}</span>;
}
