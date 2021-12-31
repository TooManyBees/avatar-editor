import { Help } from "../app/models";
import { quote } from "./helpers";

export default function serializeHelps(helps: Help[]): string {
	let buffer = "";

	for (let help of helps) {
		buffer += `${help.level}`;
		for (let keyword of help.keywords) {
			buffer += ` ${quote(keyword)}`;
		}
		buffer += "~\n";
		buffer += help.body;
		if (!buffer.endsWith("\n")) buffer += "\n";
		buffer += "~\n\n";
	}

	if (buffer !== "") return `#HELPS\n${buffer}0$~\n`;
	else return "";
}
