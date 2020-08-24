export interface DieRoll {
	id: string;
	sides: number;
	value: number;
}

export interface DieRollResult {
	id: string;
	rolls: DieRoll[];
	constant: number;
	mode: '' | 'advantage' | 'disadvantage';
}
