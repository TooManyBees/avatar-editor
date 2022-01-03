import { Mobile } from "../app/models";

export default function serializeSpecials(mobiles: Mobile[]): string {
	let buffer = "";

	for (let mob of mobiles) {
		if (mob.specFun != null) buffer += `M ${mob.vnum} ${mob.specFun}\n`;
	}

	if (buffer !== "") return `#SPECIALS\n${buffer}S\n`;
	else return "";
}
