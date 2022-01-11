import { Mobile } from "../app/models";
import { SpecialU } from "../app/models/specials";

export default function serializeSpecials(mobiles: Mobile[], orphans: SpecialU[]): string {
	let buffer = "";

	for (let mob of mobiles) {
		if (mob.specFun.special != null) buffer += `M ${mob.vnum} ${mob.specFun.special}${mob.specFun.comment}\n`;
	}

	for (let special of orphans) {
		if (special.special != null) buffer += `M ${special.mobVnum} ${special.special}${special.comment}\n`;
	}

	if (buffer !== "") return `#SPECIALS\n${buffer}S\n`;
	else return "";
}
