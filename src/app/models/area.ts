import { AreaSection, BLANK_AREA_SECTION } from "./area-section";
import { AreadataSection } from "./areadata";
import { Help } from "./helps";
import { Mobile } from "./mobiles";
import { Objekt } from "./objects";
import { Room } from "./rooms";
import { Resets, UncorellatedResets } from "./resets";
import { Shop } from "./shops";
import { Special, SpecialU } from "./specials";

export interface Area {
	area: AreaSection;
	areadata: AreadataSection;
	helps: Help[];
	mobiles: Mobile[];
	objects: Objekt[];
	rooms: Room[];
	resets: Resets;
	orphanedResets: UncorellatedResets;
	shops: Shop[];
	// orphanedShops: [];
	specials: Special[];
	orphanedSpecials: SpecialU[];
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
