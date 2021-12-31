export function quote(word: string): string {
	if (!word.match(/\s/)) return word;
	if (word.includes("'")) return `"${word}"`;
	return `'${word}'`;
}

export function joinBits(bits: number[]) {
	if (bits.length > 0) return bits.join("|");
	else return "0";
}
