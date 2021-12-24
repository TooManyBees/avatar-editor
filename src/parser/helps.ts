import { Help } from "../app/models";
import { parseKeywords, parseNumber } from "./helpers";

export default function parseHelps(section: string): Help[] {
	let parts = section.split('~');
	let helps: Help[] = [];
	let helpHeader = "";

	for (let part of parts) {
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
		helps.push(makeHelp(helpHeader, null));
	}

	return helps;
}

function makeHelp(header: string, body: string | null): Help {
	let help: Help = {
		level: 1,
		keywords: [],
		body: "",
		_error: {},
	};
	let match = header.match(/^(\S+)\s+(.*)/);
	if (match) {
		let level = parseNumber(match[1]);
		if (level != null) help.level = level;
		else help._error.level = true;
		
		let { errors, keywords } = parseKeywords(match[2]);
		if (errors.length > 0) help._error.keywords = true;
		help.keywords = keywords;
	}

	if (body) help.body = body;
	else help._error.body = true;

	return help;
}
