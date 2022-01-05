import { AreaSectionState } from "../app/store/area-section";

export default function serializeArea(state: AreaSectionState): string {
	let levelRange = state.levelRange.trim().substring(0, 6);
	{
		let match = levelRange.match(/^(\d+)\s+(\d+)$/)
		if (match) {
			levelRange = match[1].padStart(2) + match[2].padStart(4);
		} else {
			while (levelRange.length < 6) {
				levelRange = ` ${levelRange} `;
				if (levelRange.length > 6) {
					levelRange = levelRange.substring(1);
				}
			}
		}
	}
	let author = state.author.trim().substring(0, 7).padEnd(7);
	let name = state.name.trim();

	return `#AREA {${levelRange}} ${author} ${name}~\n`
}
