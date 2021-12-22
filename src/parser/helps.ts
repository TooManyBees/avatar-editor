export interface Help {
	level: number;
	keywords: string[];
	body: string;
}

export interface HelpsSection {
	helps: Help[];
}

export interface ParseHelpsReturn {
	errors: string[];
	section: HelpsSection;
}

export default function parseHelps(section: string): ParseHelpsReturn {
	let errors: string[] = [];
	let parts = section.split('~');
	let helps: Help[] = [];
	let sectionClosed = false;
	let helpHeader = "";

	while (parts.length > 0) {
		let part = parts.shift();
		if (!part) continue;
		part = part.trim();
		if (part.length === 0) continue;
		if (part == "0$") {
			sectionClosed = true;
			continue;
		}

		if (part.match(/^-?[\d\.]+/) && part.indexOf("\n") === -1) {
			helpHeader = part;
		} else {
			let { errors: helpErrors, help } = makeHelp(helpHeader, part);
			helps.push(help);
			helpHeader = "";
		}
	}

	return { errors, section: { helps } }
}

function makeHelp(header: string, body: string): { errors: string[], help: Help} {
	let errors: string[] = [];
	let level = 1;
	let keywords: string[] = [];
	let match = header.match(/^(-?[\d\.]+)\s+(.*)/);
	if (match) {
		let maybeLevel = parseInt(match[1]);
		if (Number.isNaN(maybeLevel)) {
			errors.push(`Help level ${match[1]} is not a number`);
		}
		let { errors: errs, keywords: parsedKeywords } = parseKeywords(match[2]);
		keywords = parsedKeywords;
	}

	return { errors, help: { level, keywords, body } };
}

enum KeywordState {
	BetweenWords,
	Unquoted,
	SingleQuoted,
	DoubleQuoted,
}

export function parseKeywords(line: string): { errors: string[], keywords: string[] } {
	let errors: string[] = [];
	let state = KeywordState.BetweenWords;
	let startOfWord = 0;
	let keywords: string[] = [];

	for (let i = 0; i < line.length; i++) {
		let c = line[i];

		if (state === KeywordState.BetweenWords) {
			if (c.match(/\S/)) {
				if (c === '"') {
					state = KeywordState.DoubleQuoted;
					startOfWord = i + 1;
				} else if (c === "'") {
					state = KeywordState.SingleQuoted;
					startOfWord = i + 1;
				} else {
					state = KeywordState.Unquoted;
					startOfWord = i;
				}
			}
			continue;
		}

		if (state === KeywordState.Unquoted) {
			if (c.match(/\s/)) {
				keywords.push(line.substring(startOfWord, i));
				state = KeywordState.BetweenWords;
			}
			continue;
		}

		if (state === KeywordState.DoubleQuoted) {
			if (c === '"') {
				state = KeywordState.BetweenWords;
				keywords.push(line.substring(startOfWord, i));
			}
			continue;
		}

		if (state === KeywordState.SingleQuoted) {
			if (c === "'") {
				state = KeywordState.BetweenWords;
				keywords.push(line.substring(startOfWord, i));
			}
			continue;
		}
	}

	if (state != KeywordState.BetweenWords) {
		keywords.push(line.substring(startOfWord));
		if (state === KeywordState.SingleQuoted) {
			errors.push(`Quoted keyword without closing quote:\n'${line.substring(startOfWord)}`);
		} else if (state === KeywordState.DoubleQuoted) {
			errors.push(`Quoted keyword without closing quote:\n"${line.substring(startOfWord)}`);
		}
	}

	return { errors, keywords };
}
