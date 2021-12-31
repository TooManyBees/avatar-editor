import { Edesc } from "../app/models";

export function quote(word: string): string {
	if (!word.match(/\s/)) return word;
	if (word.includes("'")) return `"${word}"`;
	return `'${word}'`;
}

export function joinBits(bits: number[]) {
	if (bits.length > 0) return bits.join("|");
	else return "0";
}

export function serializeEdescs(edescs: Edesc[]): string {
	let base = "";

	for (let edesc of edescs) {
		base += "E\n";
		base += edesc.keywords.map(kw => quote(kw)).join(" ") + "~\n";
		base += edesc.body;
		if (edesc.body.endsWith("\n")) base += "~\n";
		else base += "\n~\n";
	}

	return base;
}
