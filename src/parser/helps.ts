import { parseKeywords } from "./helpers";

export interface ParseHelpReturn {
	errors: string[];
	help: Help;
}

export interface Help {
	level: number;
	keywords: string[];
	body: string;
}

export default function parseHelps(section: string): ParseHelpReturn[] {
	let parts = section.split('~');
	let helps: ParseHelpReturn[] = [];
	let helpHeader = "";

	while (parts.length > 0) {
		let part = parts.shift();
		if (!part) continue;
		part = part.trim();
		if (part.length === 0) continue;
		if (part == "0$") {
			continue;
		}

		if (!helpHeader && part.indexOf("\n") === -1) {
			helpHeader = part;
		} else {
			helps.push(makeHelp(helpHeader, part));
			helpHeader = "";
		}
	}

	if (helpHeader) {
		let { errors: errs, help } = makeHelp(helpHeader, "");
		errs.push("Missing help body");
		helps.push({ errors: errs, help });
	}

	return helps;
}

function makeHelp(header: string, body: string): { errors: string[], help: Help} {
	let errors: string[] = [];
	let level = 1;
	let keywords: string[] = [];
	let match = header.match(/^(\S+)\s+(.*)/);
	if (match) {
		let maybeLevel = parseInt(match[1]);
		if (Number.isNaN(maybeLevel)) {
			errors.push(`Help level ${match[1]} is not a number`);
		} else {
			level = maybeLevel;
		}
		let { errors: errs, keywords: parsedKeywords } = parseKeywords(match[2]);
		for (let err of errs) {
			errors.push(err);
		}
		keywords = parsedKeywords;
	}

	return { errors, help: { level, keywords, body } };
}
