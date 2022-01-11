export interface Special {
	special: string | null;
	comment: string;
}

export interface SpecialU {
	id: string;
	mobVnum: number;
	special: string | null;
	comment: string;
	_error: {
		mobVnum?: boolean;
		special?: boolean;
	};
}
