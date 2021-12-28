export interface AreaSection {
	line: string;
	_error: {
		levelRange?: boolean;
		author?: boolean;
		name?: boolean;
	};
}

export const BLANK_AREA_SECTION: AreaSection = {
	line: "",
	_error: {},
};
