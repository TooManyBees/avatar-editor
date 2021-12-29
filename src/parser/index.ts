import parseArea from "./area";
import parseAreadata from "./areadata";
import parseHelps from "./helps";
import parseMobiles from "./mobiles";
import parseObjects from "./objects";
import parseRooms, { corellateDoors } from "./rooms";
import { RoomU, DoorU } from "../app/models/rooms";
import { UncorellatedResets } from "../app/models/resets";
import { SpecialU } from "../app/models/specials";
import { parseResets, corellateResets } from "./resets";
import { parseShops, corellateShops } from "./shops";
import { ShopU } from "../app/models/shops";
import { parseSpecials, corellateSpecials } from "./specials";

import {
	Area, AreaSection, AreadataSection, Door, Help, Mobile, Objekt, Room, Shop, Resets, Special,
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
		orphanedResets: {
			mobile: [],
			object: [],
			inObject: [],
			door: [],
			randomExit: [],
		},
		shops: [],
		orphanedShops: [],
		specials: [],
		orphanedSpecials: [],
	};

	let uncorellatedResets: UncorellatedResets = {
		mobile: [],
		object: [],
		inObject: [],
		door: [],
		randomExit: [],
	};
	let uncorellatedRooms: RoomU[] = [];
	let uncorellatedSpecials: SpecialU[] = [];
	let uncorellatedShops: ShopU[] = [];

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
				uncorellatedRooms = parseRooms(section);
				break;
			}
			case "RESETS": {
				uncorellatedResets = parseResets(section);
				break;
			}
			case "SHOPS": {
				uncorellatedShops = parseShops(section);
				break;
			}
			case "SPECIALS": {
				uncorellatedSpecials = parseSpecials(section);
				break;
			}
		}
	}

	parsedSections.rooms = corellateDoors(parsedSections.objects, uncorellatedRooms);

	let [resets, orphanedResets] = corellateResets(uncorellatedResets, parsedSections.mobiles, parsedSections.objects, parsedSections.rooms);
	parsedSections.resets = resets;
	parsedSections.orphanedResets = orphanedResets;

	let [specials, orphanedSpecials] = corellateSpecials(parsedSections.mobiles, uncorellatedSpecials);
	parsedSections.specials = specials;
	parsedSections.orphanedSpecials = orphanedSpecials;
	let [shops, orphanedShops] = corellateShops(parsedSections.mobiles, uncorellatedShops);
	parsedSections.shops = shops;
	parsedSections.orphanedShops = orphanedShops;

	return parsedSections;
}
