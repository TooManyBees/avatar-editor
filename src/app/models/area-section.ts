export interface AreaSection {
	levelRange: string;
	author: string;
	name: string;
	_error: {
		levelRange?: boolean;
		author?: boolean;
		name?: boolean;
	};
}

export const BLANK_AREA_SECTION: AreaSection = {
	levelRange: "",
	author: "",
	name: "",
	_error: {},
};
