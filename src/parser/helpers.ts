import { Apply, blankApply } from "../app/models/helpers";

const enum KeywordState {
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

export function parseBits(s: string): { error: boolean, bits: number[] } {
	let error = false;
	if (!s) return { error, bits: [] };
	let bitStrings = s.split("|");

	let bitSet: Set<number> = new Set();
	for (let b of bitStrings) {
		if (b.length === 0) continue;
		let number = parseInt(b);
		if (Number.isNaN(number)) {
			error = true;
			continue;
		}
		if (number === 0) {
			continue;
		}
		let bits = number > 0 ? factor(number) : [number];
		for (let bit of bits) {
			bitSet.add(bit);
		}
	}

	let bits = Array.from(bitSet).sort((a, b) => a - b);
	return { error, bits };
}

function factor(n: number): number[] {
	let factors: number[] = [];
	for (let power = 0; power < 32; power++) {
		if ((n & 1<<power) > 0) {
			factors.push(1<<power);
		}
	}
	return factors;
}

export function splitOnVnums(section: string): string[] {
	return section.trim().split(/^(?=#\d+)/m)
		.map(s => s.trim())
		.filter(s => s && !s.match(/^#0\b/));
}

export function parseNumber(s: string): number | null {
	let n = Number(s);
	return Number.isInteger(n) ? n : null;
}

export function parseApply(typeString: string, valueString: string): { error: boolean, apply: Apply} {
	let error = false;
	let applyType = parseNumber(typeString);
	if (applyType == null) {
		applyType = 1;
		error = true;
	}
	let { error: valueError, bits } = parseBits(valueString); // Apply 50 (immunity) can be represented as bits
	if (valueError) error = true;
	let applyValue = bits.reduce((a, b) => a + b, 0);
	let apply = blankApply();
	apply.type = applyType;
	apply.value = applyValue;
	return { error, apply };
}

export function parseNumTokens(line: string, n: number): string[] {
	let result: string[] = [];
	let pos = line.search(/\s/);
	if (pos < 0) return result;

	for (let i = pos; i <= line.length && result.length < n; i++) {
		if (line[i] === undefined || line[i].match(/\s/)) {
			if (i - pos > 0) {
				result.push(line.substring(pos, i));
			}
			pos = i;
		}
	}

	let rest = line.substring(pos).trimRight();
	if (rest.match(/\S/)) {
		result.push(rest);
	} else {
		result.push("");
	}

	return result;
}
