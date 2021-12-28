export interface Special {
	mobId: string;
	special: string;
	_error: {
		mobId?: boolean;
		special?: boolean;
	};
}

export interface SpecialU {
	mobVnum: number;
	special: string;
	_error: {
		mobVnum?: boolean;
		special?: boolean;
	};
}
