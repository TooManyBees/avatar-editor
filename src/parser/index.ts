import parseArea from "./area";
import parseAreadata from "./areadata";
import parseHelps from "./helps";
import parseMobiles from "./mobiles";
import parseObjects from "./objects";
import parseRooms from "./rooms";
import { parseResets, corellateResets, UncorellatedResets } from "./resets";
import parseShops from "./shops";
import parseSpecials from "./specials";

import {
	Area, AreaSection, AreadataSection, Help, Mobile, Objekt, Room, Shop, Resets, Special,
	BLANK_AREA_SECTION, BLANK_RESETS_SECTION,
} from "./../app/models";

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

export default function parseFile(file: string): Area {
	let unlabeledSections = splitSections(file);
	let unparsedSections = labelSections(unlabeledSections);
	let parsedSections: Area = {
		area: BLANK_AREA_SECTION,
		areadata: {},
		helps: [],
		mobiles: [],
		objects: [],
		rooms: [],
		resets: BLANK_RESETS_SECTION,
		shops: [],
		specials: [],
	};

	let uncorellatedResets: UncorellatedResets = {
		mobile: [],
		equipment: [],
		inventory: [],
		object: [],
		inObject: [],
		door: [],
		randomExit: [],
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
				uncorellatedResets = parseResets(section);
				break;
			}
			case "SHOPS": {
				parsedSections.shops = parseShops(section);
				break;
			}
			case "SPECIALS": {
				parsedSections.specials = parseSpecials(section);
				break;
			}
		}
	}

	let [resets, orphanedResets] = corellateResets(uncorellatedResets, parsedSections.mobiles, parsedSections.objects, parsedSections.rooms);
	parsedSections.resets = resets;

	return parsedSections;
}
