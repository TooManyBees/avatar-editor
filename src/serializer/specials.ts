import { Mobile } from "../app/models";
import { findVnum } from "../app/models/helpers";

type Specials = { [s: string]: string };

export default function serializeSpecials(specials: Specials, mobiles: Mobile[]): string {
	let buffer = "";

	for (let [mobId, specFun] of Object.entries(specials)) {
		let vnum = findVnum(mobiles, mobId);
		buffer += `M ${vnum} ${specFun}\n`;
	}

	if (buffer !== "") return `#SPECIALS\n${buffer}S\n`;
	else return "";
}
