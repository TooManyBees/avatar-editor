import React from "react";
import styles from "./elementsFromColorCodes.module.css";

const colorMap: { [s: string]: string } = {
	K: styles.colorK,
	BK: styles.colorBK,
	B: styles.colorB,
	BB: styles.colorBB,
	C: styles.colorC,
	BC: styles.colorBC,
	G: styles.colorG,
	BG: styles.colorBG,
	R: styles.colorR,
	BR: styles.colorBR,
	Y: styles.colorY,
	BY: styles.colorBY,
	W: styles.colorW,
	BW: styles.colorBW,
	P: styles.colorP,
	BP: styles.colorBP,
};

export default function elementsFromColorCodes(input: string, showColorCodes: boolean = false) {
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
				console.log(colorMap[currentColor]);
				output.push(<span key={currentPos} className={colorMap[currentColor]}>{text}</span>);
			}
		}

		if (match[1] === "N") currentColor = null;
		else currentColor = match[1];
		currentPos = (match.index || 0) + match[0].length;
	}

	let remainingText = input.slice(currentPos);
	if (remainingText.length > 0) {
		if (currentColor === null) output.push(<React.Fragment key={currentPos}>{remainingText}</React.Fragment>);
		else output.push(<span key={currentPos} className={colorMap[currentColor]}>{remainingText}</span>);
	}

	return <span>{output}</span>;
}
