export function newId(): string {
	try {
		return crypto.randomUUID();
	} catch (_) {
		let rand = Math.floor(Math.random() * 1000000);
		let time = Date.now();
		return `${rand}${time}`;
	}
}

type ErrorMarkers2<T> = {
	[Field in keyof T]?: boolean;
}

export type ErrorMarkers<T> = ErrorMarkers2<T> & { all?: boolean };
