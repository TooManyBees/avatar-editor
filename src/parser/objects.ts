import { Objekt, blankObject, blankEdesc } from "../app/models/objects";

import {
	parseBits,
	parseKeywords,
	parseNumber,
	splitOnVnums,
} from "./helpers";

export default function parseObjects(section: string) {
	let parts = splitOnVnums(section);
	return parts.map(part => parseObject(part));
}

const enum ParseState {
	Vnum,
	Keywords,
	ShortDesc,
	LongDesc,
	ActionDesc,
	TypeExtraWear,
	Values,
	WeightWorthRacial,
	ExtraLines,
	EdescKeywords,
	EdescMessage,
}

export function parseObject(objectString: string): Objekt {
	let state = ParseState.Vnum;
	let object = blankObject();

	let edesc = blankEdesc();
	let multiLineBuffer = "";

	let lines = objectString.trim().split("\n");
	for (let line of lines) {
		line = line.trimRight();
		switch (state as ParseState) {
			case ParseState.Vnum: {
				state = ParseState.Keywords;
				let match = line.match(/^\s*#(\d+)/);
				if (!match) {
					object._error.vnum = true;
					continue;
				}
				let vnum = parseNumber(match[1]);
				if (vnum != null) object.vnum = vnum;
				else object._error.vnum = true;
				break;
			}
			case ParseState.Keywords: {
				state = ParseState.ShortDesc;
				let tilde = line.indexOf("~");
				let string = tilde === -1 ? line : line.substring(0, tilde);
				let { errors, keywords } = parseKeywords(string);
				if (errors.length > 0 || tilde === -1) object._error.keywords = true;
				object.keywords = keywords;
				break;
			}
			case ParseState.ShortDesc: {
				state = ParseState.LongDesc;
				let tilde = line.indexOf("~");
				let string = tilde === -1 ? line : line.substring(0, tilde);
				if (tilde === -1) object._error.shortDesc = true;
				object.shortDesc = string;
				break;
			}
			case ParseState.LongDesc: {
				state = ParseState.ActionDesc;
				let tilde = line.indexOf("~");
				let string = tilde === -1 ? line : line.substring(0, tilde);
				if (tilde === -1) object._error.longDesc = true;
				object.longDesc = string;
				break;
			}
			case ParseState.ActionDesc: {
				let tilde = line.indexOf("~")
				if (tilde > -1) {
					multiLineBuffer += line.substring(0, tilde);
					object.actionDesc = multiLineBuffer.trimRight();
					multiLineBuffer = "";
					state = ParseState.TypeExtraWear;
				} else {
					multiLineBuffer += line;
					multiLineBuffer += "\n";
				}
				break;
			}
			case ParseState.TypeExtraWear: {
				state = ParseState.Values;
				let [typeString, extraString, wearString, ...rest] = line.trimLeft().split(/\s+/);
				{
					let itemType = parseNumber(typeString);
					if (itemType != null) object.itemType = itemType;
					else object._error.itemType = true;
				}
				{
					let { error, bits } = parseBits(extraString);
					if (error) object._error.extraFlags = true;
					object.extraFlags = bits;
				}
				{
					let { error, bits } = parseBits(wearString);
					if (error) object._error.wearFlags = true;
					if (bits.filter(b => b !== 1).length > 1) {
						object._error.wearFlags = true;
						let newBits = [];
						if (bits.includes(1)) newBits.push(1);
						let otherBit = bits.filter(b => b !== 1)[0];
						if (otherBit) bits.push(otherBit);
						bits = newBits;
					}
					object.wearFlags = bits;
				}
				break;
			}
			case ParseState.Values: {
				state = ParseState.WeightWorthRacial;
				let [string0, string1, string2, string3, ...rest] = line.trimLeft().split(/\s+/);
				{
					if (string0 && (string0.match(/^-?\d+$/) || string0.match(/^[\d|]+$/))) {
						object.value0 = string0;
					} else {
						object._error.value0 = true;
					}
				}
				{
					if (string1 && (string1.match(/^-?\d+$/) || string1.match(/^[\d|]+$/))) {
						object.value1 = string1;
					} else {
						object._error.value1 = true;
					}
				}
				{
					if (string2 && (string2.match(/^-?\d+$/) || string2.match(/^[\d|]+$/))) {
						object.value2 = string2;
					} else {
						object._error.value2 = true;
					}
				}
				{
					if (string3 && (string3.match(/^-?\d+$/) || string3.match(/^[\d|]+$/))) {
						object.value3 = string3;
					} else {
						object._error.value3 = true;
					}
				}
				break;
			}
			case ParseState.WeightWorthRacial: {
				state = ParseState.ExtraLines;
				let [weightString, worthString, racialString, ...rest] = line.trimLeft().split(/\s+/);
				{
					let weight = parseNumber(weightString);
					if (weight != null) object.weight = weight;
					else object._error.weight = true;
				}
				{
					let worth = parseNumber(worthString);
					if (worth != null) object.worth = worth;
					else object._error.worth = true;
				}
				{
					let { error, bits } = parseBits(racialString);
					if (error) object._error.racialFlags = true;
					object.racialFlags = bits;
				}
				break;
			}
			case ParseState.ExtraLines: {
				let [type, ...tokens] = line.trimLeft().split(/\s+/);
				if (!type) break;
				switch (type.toUpperCase()) {
					case 'E': {
						state = ParseState.EdescKeywords;
						edesc = blankEdesc();
						break;
					}
					case 'A': {
						let [typeString, valueString] = tokens;
						let applyType = parseNumber(typeString);
						let applyValue = parseNumber(valueString);
						if (applyType == null) {
							object._error.applies = true;
							break;
						}
						if (applyValue == null) {
							object._error.applies = true;
							applyValue = 1;
						}
						object.applies.push([applyType, applyValue]);
						break;
					}
					case 'Q': {
						let quality = parseNumber(tokens[0]);
						if (quality != null) object.quality = quality;
						else object._error.quality = true;
						break;
					}
					default: {
						object._error.all = true;
					}
				}
				break;
			}
			case ParseState.EdescKeywords: {
				state = ParseState.EdescMessage;
				let tilde = line.indexOf("~");
				line = tilde === -1 ? line : line.substring(0, tilde);
				let { errors, keywords } = parseKeywords(line);
				if (errors.length > 0) object._error.extraDescs = true;
				edesc.keywords = keywords;
				break;
			}
			case ParseState.EdescMessage: {
				let tilde = line.indexOf("~");
				if (tilde === -1) {
					edesc.body += line;
					edesc.body += "\n";
				} else {
					state = ParseState.ExtraLines;
					edesc.body += line.substring(0, tilde);
					object.extraDescs.push(edesc);
				}
				break;
			}
		}
	}

	if (state === ParseState.ActionDesc) {
		object._error.actionDesc = true;
		object._error.itemType = true;
		object._error.extraFlags = true;
		object._error.wearFlags = true;
		object._error.value0 = true;
		object._error.value1 = true;
		object._error.value2 = true;
		object._error.value3 = true;
		object._error.weight = true;
		object._error.worth = true;
		object._error.racialFlags = true;
	} else if (state === ParseState.EdescKeywords) {
		object._error.extraDescs = true;
	} else if (state === ParseState.EdescMessage) {
		object._error.extraDescs = true;
		object.extraDescs.push(edesc);
	} else if (state !== ParseState.ExtraLines) {
		object._error.all = true;
	}

	return object;
}
