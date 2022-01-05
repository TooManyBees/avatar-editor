import { AreaSection } from "../app/models";

export default function parseArea(section: string): AreaSection {
	let area: AreaSection = {
		levelRange: "",
		author: "",
		name: "",
		_error: {},
	};

	let tilde = section.indexOf("~");
	let line = (tilde > -1) ? section.substring(0, tilde) : section;
	
	let match = line.match(/^\s*(?:\{([^\}]+)\}\s+)?(\S+)\s+(.*)/);
	if (match) {
		if (match[1] != null) area.levelRange = match[1];
		else area._error.levelRange = true;

		area.author = match[2];
		area.name = match[3];
	} else {
		area._error.all = true;
	}

	if (!section.match(/\{......\}/)) {
		area._error.levelRange = true;
	}

	return area;
};
