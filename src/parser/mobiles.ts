import { parseKeywords, parseBits, splitOnVnums } from "./helpers";

export default function parseMobiles(section: string): Mobile[] {
	let parts = splitOnVnums(section);
	return parts.map(part => parseMobile(part));
}

const enum ParseState {
	Vnum,
	Keywords,
	ShortDesc,
	LongDesc,
	Description,
	ActAffAlign,
	Level,
	ThatOneDeprecatedLine,
	Sex,
	ExtraLines,
	KspawnMessage,
}

export interface Kspawn {
	condition: number;
	spawnType: number[];
	spawnVnum: number;
	roomVnum: number;
	message: string;
}

export interface Mobile {
	vnum: number | null;
	keywords: string[];
	shortDesc: string;
	longDesc: string;
	description: string;
	act: number[];
	affected: number[];
	align: number;
	level: number;
	sex: number;
	race?: number;
	klass?: number;
	applies?: [number, number][];
	team?: number;
	kspawn?: Kspawn;
	_error: {
		all?: boolean;
		vnum?: boolean;
		keywords?: boolean;
		shortDesc?: boolean;
		longDesc?: boolean;
		description?: boolean;
		act?: boolean;
		affected?: boolean;
		align?: boolean;
		level?: boolean;
		sex?: boolean;
		race?: boolean;
		klass?: boolean;
		applies?: boolean;
		team?: boolean;
		kspawn?: boolean;
	};
}

export function parseMobile(mobString: string): Mobile {
	let state = ParseState.Vnum;
	let mobile: Mobile = {
		vnum: null,
		keywords: [],
		shortDesc: "",
		longDesc: "",
		description: "",
		act: [],
		affected: [],
		align: 0,
		level: 1,
		sex: 0,
		_error: {},
	};

	let kspawnBuffer: Kspawn = {
		condition: 0,
		spawnType: [],
		spawnVnum: -1,
		roomVnum: -1,
		message: "",
	};
	let multiLineBuffer = "";

	let lines = mobString.trim().split("\n");
	for (let line of lines) {
		line = line.trimRight();
		// if (!line || (state !== ParseState.Description && state !== ParseState.KspawnMessage)) continue;

		switch (state as ParseState) {
			case ParseState.Vnum: {
				state = ParseState.Keywords;
				let match = line.match(/^\s*#(\d+)/);
				if (!match) {
					mobile._error.vnum = true;
					continue;
				}
				let vnum = parseNumber(match[1]);
				if (vnum != null) mobile.vnum = vnum;
				else mobile._error.vnum = true;
				break;
			}
			case ParseState.Keywords: {
				state = ParseState.ShortDesc;
				let tilde = line.indexOf("~");
				let string = tilde === -1 ? line : line.substring(0, tilde);
				let { errors, keywords } = parseKeywords(string);
				if (errors.length > 0 || tilde === -1) mobile._error.keywords = true;
				mobile.keywords = keywords;
				break;
			}
			case ParseState.ShortDesc: {
				state = ParseState.LongDesc;
				let tilde = line.indexOf("~");
				let string = tilde === -1 ? line : line.substring(0, tilde);
				if (tilde === -1) mobile._error.shortDesc = true;
				mobile.shortDesc = string;
				break;
			}
			case ParseState.LongDesc: {
				let tilde = line.indexOf("~")
				if (tilde > -1) {
					multiLineBuffer += line.substring(0, tilde);
					mobile.longDesc = multiLineBuffer.trimRight();
					multiLineBuffer = "";
					state = ParseState.Description;
				} else {
					multiLineBuffer += line;
					multiLineBuffer += "\n";
				}
				break;
			}
			case ParseState.Description: {
				if (line.match(/^\s*\d+d\d+\+\d+ \d+d\d+\+\d+ \d+ \d+/)) {
					// Description was missing a tilde; mark errors and move on
					mobile.description = multiLineBuffer.trimRight();
					multiLineBuffer = "";
					mobile._error.description = true;
					mobile._error.act = true;
					mobile._error.affected = true;
					mobile._error.align = true;
					mobile._error.level = true;
					state = ParseState.Sex;
				}

				let tilde = line.indexOf("~")
				if (tilde > -1) {
					multiLineBuffer += line.substring(0, tilde);
					mobile.description = multiLineBuffer.trimRight();
					multiLineBuffer = "";
					state = ParseState.ActAffAlign;
				} else {
					multiLineBuffer += line;
					multiLineBuffer += "\n";
				}
				break;
			}
			case ParseState.ActAffAlign: {
				let [actString, affectedString, alignString, ...rest] = line.trimLeft().split(/\s+/);
				{
					let { error, bits } = parseBits(actString);
					if (error) mobile._error.act = true;
					mobile.act = bits;
				}
				{
					let { error, bits } = parseBits(affectedString);
					if (error) mobile._error.affected = true;
					mobile.affected = bits;
				}
				{
					let align = parseNumber(alignString);
					if (align != null) mobile.align = align;
					else mobile._error.align = true;
				}
				state = ParseState.Level;
				break;
			}
			case ParseState.Level: {
				let [levelSring, ...rest] = line.trimLeft().split(/\s+/);
				let level = parseNumber(levelSring);
				if (level != null) mobile.level = level;
				else mobile._error.level = true;
				state = ParseState.ThatOneDeprecatedLine;
				break;
			}
			case ParseState.ThatOneDeprecatedLine: {
				state = ParseState.Sex;
				break;
			}
			case ParseState.Sex: {
				let [x0, x1, sexString, ...rest] = line.trimLeft().split(/\s+/);
				let sex = parseNumber(sexString);
				if (sex != null) mobile.sex = sex;
				else mobile._error.sex = true;
				state = ParseState.ExtraLines;
				break;
			}
			case ParseState.ExtraLines: {
				let [type, ...tokens] = line.trimLeft().split(/\s+/);
				if (!type) continue;
				switch (type.toUpperCase()) {
					case 'R': {
						let race = parseNumber(tokens[0]);
						if (race != null) mobile.race = race;
						else mobile._error.race = true;
						break;
					}
					case 'C': {
						let klass = parseNumber(tokens[0]);
						if (klass != null) mobile.klass = klass;
						else mobile._error.klass = true;
						break;
					}
					case 'A': {
						let applyType = parseNumber(tokens[0]);
						let applyValue = parseNumber(tokens[1]);
						if (applyType == null) {
							mobile._error.applies = true;
							break;
						}
						if (applyValue == null) {
							mobile._error.applies = true;
							applyValue = 1;
						}
						if (mobile.applies == null) mobile.applies = [];
						mobile.applies.push([applyType, applyValue]);
						break;
					}
					case 'L': {
						let team = parseNumber(tokens[0]);
						if (team != null) mobile.team = team;
						else mobile._error.team = true;
						break;
					}
					case 'K': {
						if (mobile.kspawn) mobile._error.kspawn = true;
						let match = line.trimLeft().match(/^K\s+(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*(.*)/);
						if (match) {
							let [, conditionString, spawnTypeString, spawnVnumString, roomVnumString, message] = match;
							let condition = parseNumber(conditionString);
							if (condition != null) kspawnBuffer.condition = condition;
							else mobile._error.kspawn = true;
							let { error: typeError, bits: spawnType } = parseBits(spawnTypeString);
							kspawnBuffer.spawnType = spawnType;
							if (typeError) mobile._error.kspawn = true;
							let spawnVnum = parseNumber(spawnVnumString);
							if (spawnVnum != null) kspawnBuffer.spawnVnum = spawnVnum;
							else mobile._error.kspawn = true;
							let roomVnum = parseNumber(roomVnumString);
							if (roomVnum != null) kspawnBuffer.roomVnum = roomVnum;
							else mobile._error.kspawn = true;

							let tilde = message.indexOf("~");
							if (tilde === -1) {
								state = ParseState.KspawnMessage;
								kspawnBuffer.message = message;
							} else {
								kspawnBuffer.message = message.substring(0, tilde);
								mobile.kspawn = kspawnBuffer;
								kspawnBuffer = {
									condition: 0,
									spawnType: [],
									spawnVnum: -1,
									roomVnum: -1,
									message: "",
								};
							}
						} else {
							mobile._error.kspawn = true;
							mobile.kspawn = kspawnBuffer;
							kspawnBuffer = {
								condition: 0,
								spawnType: [],
								spawnVnum: -1,
								roomVnum: -1,
								message: "",
							};
						}
						break;
					}
					default: {
						mobile._error.all = true;
					}
				}
				break;
			}
			case ParseState.KspawnMessage: {
				let tilde = line.indexOf("~");
				if (tilde === -1) {
					kspawnBuffer.message += "\n";
					kspawnBuffer.message += line;
				} else {
					state = ParseState.ExtraLines;
					kspawnBuffer.message += "\n";
					kspawnBuffer.message += line.substring(0, tilde);
					mobile.kspawn = kspawnBuffer;
					kspawnBuffer = {
						condition: 0,
						spawnType: [],
						spawnVnum: -1,
						roomVnum: -1,
						message: "",
					};
				}
				break;
			}
		}
	}

	if (state == ParseState.KspawnMessage) {
		mobile.kspawn = kspawnBuffer;
		mobile._error.kspawn = true;
	} else if (state !== ParseState.ExtraLines) {
		mobile._error.all = true;
	}

	return mobile;
}

function parseNumber(s: string): number | null {
	let n = parseInt(s, 10);
	return Number.isNaN(n) ? null : n;
}
