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
