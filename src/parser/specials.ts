import { Mobile, newId } from "../app/models";
import { SpecialU } from "../app/models/specials";
import { parseNumber } from "./helpers";

export function parseSpecials(section: string): SpecialU[] {
	let specials: SpecialU[] = [];

	let lines = section.split(/\r?\n/).map(l => l.trim());

	for (let line of lines) {
		if (!line) continue;
		let [m, mobVnumString, specWord] = line.split(/\s+/);
		if (!m || m.toUpperCase() !== "M") {
			// FIXME: some sort of error marking here
			continue;
		}

		let special: SpecialU = { id: newId(), mobVnum: 0, special: "none", _error: {} };

		let mobVnum = parseNumber(mobVnumString);
		if (mobVnum != null) special.mobVnum = mobVnum;
		else special._error.mobVnum = true;

		if (specWord) special.special = specWord.toUpperCase();
		else special._error.special = true;

		if (special.mobVnum > 0 && special.special !== "none") {
			specials.push(special);
		}
	}

	return specials;
}

export function corellateSpecials(mobiles: Mobile[], specialsU: SpecialU[]): SpecialU[] {
	let orphans: SpecialU[] = [];
	for (let specialU of specialsU) {
		if (specialU.special === "none") continue;
		let mobile = mobiles.find(m => m.vnum === specialU.mobVnum);
		if (mobile) {
			mobile.specFun = specialU.special;
		} else {
			orphans.push(specialU);
		}
	}

	return orphans;
}
