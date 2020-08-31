export interface SavedImage {
	id: string;
	name: string;
	data: string;
}

export interface OracleCard {
	id: string;
	name: string;
	meanings: {
		upright: string,
		reversed: string
	};
}
