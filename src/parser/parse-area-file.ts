import parseArea from "./area";
import parseAreadata from "./areadata";
import parseHelps from "./helps";
import parseMobiles from "./mobiles";
import parseObjects from "./objects";
import parseRooms from "./rooms";
import parseResets from "./resets";
import parseShops from "./shops";
import parseSpecials from "./specials";

function splitSections(file: string): string[] {
	let sections = file.split(/^(?=#(?:[a-zA-Z\$]+))/);
	return sections.filter(s => s.trim().length > 0);
}

type Dict = { [key: string]: string };

function labelSections(unlabeledSections: string[]): Dict {
	let sections = unlabeledSections.reduce((acc: Dict, section) => {
		let match = section.match(/^#(\w+)\b/)
		if (match) {
			let name = match[1];
			if (name) {
				let trimmed = section.substring(match[0].length).trim();
				acc[name] = trimmed;
			}
		}
		return acc;
	}, {});

	return sections;
}

export default function parseFile(file: string) {
	let unlabeledSections = splitSections(file);
	let unparsedSections = labelSections(unlabeledSections);

}
