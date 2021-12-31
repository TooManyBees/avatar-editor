import { Help } from "../app/models";

export default function serializeHelps(helps: Help[]): string {
	let buffer = "";

	for (let help of helps) {
		buffer += `${help.level}`;
		for (let keyword of help.keywords) {
			let quoted = keyword;
			if (keyword.match(/\s/))
				quoted = keyword.includes("'") ? `"${keyword}"` : `'${keyword}'`;
			buffer += ` ${quoted}`;
		}
		buffer += "~\n";
		buffer += help.body;
		if (!buffer.endsWith("\n")) buffer += "\n";
		buffer += "~\n\n";
	}

	if (buffer !== "") return `#HELPS\n${buffer}0$~\n`;
	else return "";
}
