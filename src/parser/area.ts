import { AreaSection } from "../app/models";

export default function parseArea(section: string): AreaSection {
	let area: AreaSection = {
		line: "",
		_error: {},
	};

	let tilde = section.indexOf("~");
	area.line = tilde ? section.substring(0, tilde) : section;

	if (!section.match(/\{......\}/)) {
		area._error.levelRange = true;
	}

	return area;
};
