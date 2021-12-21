export interface AreaSection {
	levelRange: string;
	author: string;
	name: string;
}

export interface ParseAreaReturn {
	section: AreaSection,
	errors: string[],
}

export default function parseArea(section: string): ParseAreaReturn {
	let errors: string[] = [];
	let area = { levelRange: "", author: "", name: "" };
	return { errors, section: area };
}
