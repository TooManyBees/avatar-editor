export interface Help {
	level: number;
	keywords: string[];
	body: string;
	_error: {
		level?: boolean;
		keywords?: boolean;
		body?: boolean;
	};
}
