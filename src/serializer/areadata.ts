import { AreadataState } from "../app/store/areadata";
import { joinBits } from "./helpers";

export default function serializeAreadata(state: AreadataState): string {
	let buffer = "";

	if (state.areadataBits.plane && state.plane) {
		if (state.plane.zone)
			buffer += `P ${state.plane.plane} ${state.plane.zone}\n`;
		else
			buffer += `P ${state.plane.plane}\n`;
	}
	if (state.areadataBits.flags && state.flags) {
		buffer += `F ${joinBits(state.flags.flags)}\n`;
	}
	if (state.areadataBits.outlaw && state.outlaw) {
		let { dumpVnum, jailVnum, deathVnum, execVnum, justice } = state.outlaw;
		buffer += `O ${dumpVnum} ${jailVnum} ${deathVnum} ${execVnum} ${justice}\n`;
	}
	if (state.areadataBits.kspawn && state.kspawn) {
		let { condition, command, mobVnum, roomVnum, text } = state.kspawn;
		buffer += `K ${condition} ${command} ${mobVnum} ${roomVnum} ${text}~\n`;
	}
	if (state.areadataBits.modifier && state.modifier) {
		const { xpGain, hpRegen, manaRegen, moveRegen, statloss, respawnRoom, tbd1, tbd2 } = state.modifier;
		buffer += `M ${xpGain} ${hpRegen} ${manaRegen} ${moveRegen} ${statloss} ${respawnRoom} ${tbd1} ${tbd2}\n`;
	}
	if (state.areadataBits.groupSize && state.groupSize) {
		const { pct0, num1, pct1, num2, pct2, pct3, div, tbd } = state.groupSize;
		buffer += `G ${pct0} ${num1} ${pct1} ${num2} ${pct2} ${pct3} ${div} ${tbd}\n`;
	}
	if (state.areadataBits.vnumRange && state.vnumRange) {
		buffer += `V ${state.vnumRange.min} ${state.vnumRange.max}\n`;
	}
	if (state.areadataBits.scaling && state.scaling) {
		buffer += `B ${state.scaling.maxGroupPower} ${state.scaling.maxGroupToughness}\n`;
	}

	if (buffer !== "") return `#AREADATA\n${buffer}S\n`;
	else return "";
}
