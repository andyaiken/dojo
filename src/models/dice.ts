export interface DieRoll {
	id: string;
	sides: number;
	value: number;
}

export interface DieRollResult {
	id: string;
	text: string;
	rolls: DieRoll[];
	constant: number;
	mode: '' | 'advantage' | 'disadvantage';
}
