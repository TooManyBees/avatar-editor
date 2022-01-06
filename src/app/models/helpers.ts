declare global {
	interface Crypto {
		randomUUID: () => string;
	}
}

export function newId(): string {
	try {
		return crypto.randomUUID();
	} catch (_) {
		let rand = Math.floor(Math.random() * 1000000);
		let time = Date.now();
		return `id-${rand}${time}`;
	}
}

type ErrorMarkers2<T> = {
	[Field in keyof T]?: boolean;
}

export type ErrorMarkers<T> = ErrorMarkers2<T> & { all?: boolean };

interface EdescFields {
	keywords: string[];
	body: string;
}

export interface Edesc extends EdescFields {
	id: string;
	_error: ErrorMarkers<EdescFields>;
}

export function blankEdesc(): Edesc {
	return { id: newId(), keywords: [], body: "", _error: {} };
}

interface HasVnum {
	vnum: number | null;
}

export function sortByVnum<T extends HasVnum>(items: T[]) {
	items.sort((a, b) => {
		if (a.vnum == null) return -1;
		if (b.vnum == null) return 1;
		return a.vnum - b.vnum;
	});
}

interface HasId {
	id: string;
}

export function findVnum<T extends HasId & HasVnum>(items: T[], id: string): number | null {
	let parsed = Number(id);
	if (Number.isInteger(parsed) && parsed >= 0) return parsed;
	let found = items.find(item => item.id === id);
	if (found) return found.vnum;
	return null;
}

export interface Apply {
	readonly id: string;
	type: number;
	value: number;
}

export function blankApply() {
	return { id: newId(), type: 1, value: 0 };
}
