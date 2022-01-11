import { Mobile, newId } from "../app/models";
import { Special, SpecialU } from "../app/models/specials";
import { parseNumber, parseNumTokens } from "./helpers";

export function parseSpecials(section: string): SpecialU[] {
	let specials: SpecialU[] = [];

	let lines = section.split(/\r?\n/).map(l => l.trim());

	for (let line of lines) {
		if (!line) continue;
		let [mobVnumString, specWord, comment] = parseNumTokens(line, 2);

		let special: SpecialU = { id: newId(), mobVnum: 0, special: null, comment: comment || "", _error: {} };

		let mobVnum = parseNumber(mobVnumString);
		if (mobVnum != null) special.mobVnum = mobVnum;
		else special._error.mobVnum = true;

		specWord = specWord?.trimStart();
		if (specWord && specWord.toUpperCase() !== "NONE") special.special = specWord.toUpperCase();
		else if (!specWord) special._error.special = true;

		specials.push(special);
	}

	return specials;
}

export function corellateSpecials(mobiles: Mobile[], specialsU: SpecialU[]): SpecialU[] {
	let orphans: SpecialU[] = [];
	for (let specialU of specialsU) {
		if (specialU.special === "none") continue;
		let mobile = mobiles.find(m => m.vnum === specialU.mobVnum);
		if (mobile) {
			let special = { special: specialU.special, comment: specialU.comment };
			mobile.specFun = special;
		} else {
			orphans.push(specialU);
		}
	}

	return orphans;
}
