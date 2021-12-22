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
		let bits = factor(number);
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
