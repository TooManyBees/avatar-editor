import { AreaSection } from "./area-section";
import { AreadataSection } from "./areadata";
import { Help } from "./helps";
import { Mobile } from "./mobiles";
import { Objekt } from "./objects";
import { Room } from "./rooms";
import { Reset } from "./resets";
import { Shop } from "./shops";
import { Special } from "./specials";

export interface Area {
	area: AreaSection;
	areadata: AreadataSection;
	helps: Help[];
	mobiles: Mobile[];
	objects: Objekt[];
	rooms: Room[];
	resets: Reset[];
	shops: Shop[];
	specials: Special[];
}
