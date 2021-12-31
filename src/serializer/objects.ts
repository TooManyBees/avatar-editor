import { Objekt } from "../app/models";
import { joinBits, quote } from "./helpers";

export default function serializeObjects(objects: Objekt[]): string {
	let buffer = "";

	for (let object of objects) {
		buffer += serializeObject(object) + "\n";
	}

	if (buffer != "") return `#OBJECTS\n\n${buffer}#0\n`;
	else return "";
}

export function serializeObject(object: Objekt): string {
	let base = `#${object.vnum}
${object.keywords.map(kw => quote(kw)).join(" ")}~
${object.shortDesc}~
${object.longDesc}~
${object.actionDesc}~
${object.itemType} ${joinBits(object.extraFlags)} ${joinBits(object.wearFlags)}
${object.value0} ${object.value1} ${object.value2} ${object.value3}
${object.weight} ${object.worth} ${joinBits(object.racialFlags)} 0
`;

	for (let [applyType, applyValue] of object.applies) {
		base += `A ${applyType} ${applyValue}\n`;
	}

	if (object.quality != null) base += `Q ${object.quality}\n`;

	for (let edesc of object.extraDescs) {
		base += "E\n";
		base += edesc.keywords.map(kw => quote(kw)).join(" ") + "~\n";
		base += edesc.body;
		if (edesc.body.endsWith("\n")) base += "~\n";
		else base += "\n~\n";
	}

	return base;
}
