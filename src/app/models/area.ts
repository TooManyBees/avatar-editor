import { AreaSection, BLANK_AREA_SECTION } from "./area-section";
import { AreadataSection } from "./areadata";
import { Help } from "./helps";
import { Mobile } from "./mobiles";
import { Objekt } from "./objects";
import { Room } from "./rooms";
import { Resets } from "./resets";
import { Shop } from "./shops";
import { Special } from "./specials";

export interface Area {
	area: AreaSection;
	areadata: AreadataSection;
	helps: Help[];
	mobiles: Mobile[];
	objects: Objekt[];
	rooms: Room[];
	resets: Resets;
	shops: Shop[];
	specials: Special[];
}

export const BLANK_AREA = {
	area: BLANK_AREA_SECTION,
	areadata: {},
	helps: [],
	mobiles: [],
	objects: [],
	rooms: [],
	resets: [],
	shops: [],
	specials: [],
};
