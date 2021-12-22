import parseArea, { AreaSection, BLANK_AREA_SECTION } from "./area";
import parseAreadata, { AreadataSection, BLANK_AREADATA_SECTION } from "./areadata";
import parseHelps, { Help } from "./helps";
import parseMobiles, { Mobile } from "./mobiles";
import parseObjects, { Objekt } from "./objects";
import parseRooms, { Room } from "./rooms";
import parseResets from "./resets";
import parseShops from "./shops";
import parseSpecials from "./specials";

function splitSections(file: string): string[] {
	let sections = file.split(/^(?=#(?:[a-zA-Z\$]+))/m);
	return sections.filter(s => s.trim().length > 0);
}

type Dict = { [key: string]: string };

function labelSections(unlabeledSections: string[]): Dict {
	let sections = unlabeledSections.reduce((acc: Dict, section) => {
		let match = section.match(/^#(?!0)(\w+)\b/)
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

export interface Area {
	area: AreaSection;
	areadata: AreadataSection;
	helps: Help[],
	mobiles: Mobile[],
	objects: Objekt[],
	rooms: Room[],
}

export const BLANK_AREA: Area = {
	area: BLANK_AREA_SECTION,
	areadata: BLANK_AREADATA_SECTION,
	helps: [],
	mobiles: [],
	objects: [],
	rooms: [],
};

export default function parseFile(file: string): Area {
	let unlabeledSections = splitSections(file);
	let unparsedSections = labelSections(unlabeledSections);
	let parsedSections: Area = {
		area: BLANK_AREA_SECTION,
		areadata: BLANK_AREADATA_SECTION,
		helps: [],
		mobiles: [],
		objects: [],
		rooms: [],
	};
	for (let [name, section] of Object.entries(unparsedSections)) {
		switch (name.toUpperCase()) {
			case "AREA": {
				parsedSections.area = parseArea(section);
				break;
			}
			case "AREADATA": {
				parsedSections.areadata = parseAreadata(section);
				break;
			}
			case "HELPS": {
				parsedSections.helps = parseHelps(section);
				break;
			}
			case "MOBILES": {
				parsedSections.mobiles = parseMobiles(section);
				break;
			}
			case "OBJECTS": {
				parsedSections.objects = parseObjects(section);
				break;
			}
			case "ROOMS": {
				parsedSections.rooms = parseRooms(section);
				break;
			}
			case "RESETS": {
				break;
			}
			case "SHOPS": {
				break;
			}
			case "SPECIALS": {
				break;
			}
		}
	}
	return parsedSections;
}
