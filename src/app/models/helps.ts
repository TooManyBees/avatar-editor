export interface Help {
	id: string,
	level: number;
	keywords: string[];
	body: string;
	_error: {
		level?: boolean;
		keywords?: boolean;
		body?: boolean;
	};
}
