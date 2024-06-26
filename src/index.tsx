import localforage from 'localforage';
import { createRoot } from 'react-dom/client';

import 'react-mde/lib/styles/css/react-mde.css';
import 'react-mde/lib/styles/css/react-mde-editor.css';
import 'react-mde/lib/styles/css/react-mde-toolbar.css';

import './style/app.scss';

import { Main } from './components/main';

import { Party } from './models/party';
import { MonsterGroup } from './models/monster';
import { Encounter } from './models/encounter';
import { Exploration, Map } from './models/map';
import { Adventure } from './models/adventure';
import { Combat } from './models/combat';
import { Options, SavedImage } from './models/misc';

let defaultOptions: Options = {
	showMonsterDieRolls: false,
	diagonals: 'onepointfive',
	featureFlags: []
};

localforage
	.getItem<Party[]>('dojo-parties')
	.then(parties => {
		localforage
			.getItem<MonsterGroup[]>('dojo-library')
			.then(library => {
				localforage
					.getItem<Encounter[]>('dojo-encounters')
					.then(encounters => {
						localforage
							.getItem<Map[]>('dojo-maps')
							.then(maps => {
								localforage
									.getItem<Adventure[]>('dojo-adventures')
									.then(adventures => {
										localforage
											.getItem<Combat[]>('dojo-combats')
											.then(combats => {
												localforage
													.getItem<Exploration[]>('dojo-explorations')
													.then(explorations => {
														localforage
															.getItem<SavedImage[]>('dojo-images')
															.then(images => {
																localforage
																	.getItem<Options>('dojo-options')
																	.then(options => {
																		const container = document.getElementById('root');
																		createRoot(container!).render(
																			<Main
																				parties={parties || []}
																				library={library || []}
																				encounters={encounters || []}
																				maps={maps || []}
																				adventures={adventures || []}
																				combats={combats || []}
																				explorations={explorations || []}
																				images={images || []}
																				options={options || defaultOptions}
																			/>
																		);
																	});
															});
													});
											});
									});
							});
					});
			});
	});
