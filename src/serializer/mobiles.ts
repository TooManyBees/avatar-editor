import { Mobile } from "../app/models";
import { joinBits, quote } from "./helpers";

export default function serializeMobiles(mobiles: Mobile[]): string {
	let buffer = "";

	for (let mob of mobiles) {
		buffer += serializeMob(mob) + "\n";
	}

	if (buffer !== "") return `#MOBILES\n\n${buffer}#0\n`;
	else return "";
}

export function serializeMob(mob: Mobile): string {
	let base = `#${mob.vnum}
${mob.keywords.map(kw => quote(kw)).join(" ")}~
${mob.shortDesc}~
${mob.longDesc}
~
${mob.description}
~
${joinBits(mob.act)} ${joinBits(mob.affected)} ${mob.align} S
${mob.level} 0 0
0d0+0 0d0+0 0 0
0 0 ${mob.sex}
`;

	if (mob.race != null) base += `R ${mob.race}\n`;
	if (mob.klass != null) base += `C ${mob.klass}\n`;
	if (mob.team != null) base += `L ${mob.team}\n`;

	for (let apply of mob.applies) {
		base += `A ${apply.type} ${apply.value}\n`;
	}

	if (mob.kspawn) base += `K ${mob.kspawn.condition} ${mob.kspawn.spawnType.join("|")} ${mob.kspawn.spawnVnum} ${mob.kspawn.roomVnum} ${mob.kspawn.message}~\n`;

	return base;
}
