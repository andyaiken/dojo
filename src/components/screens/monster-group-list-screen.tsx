import { Col, Row } from 'antd';
import React from 'react';

import { Utils } from '../../utils/utils';

import { Encounter } from '../../models/encounter';
import { Monster, MonsterGroup } from '../../models/monster';

import { RenderError } from '../error';
import { MonsterGroupCard } from '../cards/monster-group-card';
import { Note } from '../controls/note';
import { MonsterGroupListOptions } from '../options/monster-group-list-options';
import { GridPanel } from '../panels/grid-panel';

interface Props {
	library: MonsterGroup[];
	encounters: Encounter[];
	hasMonsters: boolean;
	addMonsterGroup: () => void;
	importMonsterGroup: () => void;
	openMonsterGroup: (group: MonsterGroup) => void;
	deleteMonsterGroup: (group: MonsterGroup) => void;
	addOpenGameContent: () => void;
	openStatBlock: (monster: Monster) => void;
	openDemographics: (group: MonsterGroup | null) => void;
	createEncounter: (monsterIDs: string[]) => void;
	addMonster: (monster: Monster | null) => void;
	importMonster: () => void;
}

export class MonsterGroupListScreen extends React.Component<Props> {
	public render() {
		try {
			if (!this.props.hasMonsters) {
				return (
					<Row align='middle' justify='center' className='scrollable'>
						<div style={{ width: '400px' }}>
							<Note>
								<div className='section'>
									to kickstart your monster collection, let's import all the monsters from the <a href='https://dnd.wizards.com/articles/features/systems-reference-document-srd' target='_blank' rel='noopener noreferrer'>d&amp;d system reference document</a>
								</div>
								<hr/>
								<button onClick={() => this.props.addOpenGameContent()}>import monsters</button>
							</Note>
						</div>
					</Row>
				);
			}

			const groups = this.props.library;
			Utils.sort(groups);
			const listItems = groups.map(group => (
				<MonsterGroupCard
					key={group.id}
					group={group}
					library={this.props.library}
					encounters={this.props.encounters}
					openMonsterGroup={grp => this.props.openMonsterGroup(grp)}
					addMonster={monster => this.props.addMonster(monster)}
					importMonster={() => this.props.importMonster()}
					openDemographics={grp => this.props.openDemographics(grp)}
					deleteMonsterGroup={grp => this.props.deleteMonsterGroup(grp)}
					openStatBlock={monster => this.props.openStatBlock(monster)}
					createEncounter={monsterIDs => this.props.createEncounter(monsterIDs)}
				/>
			));

			return (
				<Row className='full-height'>
					<Col span={6} className='scrollable sidebar sidebar-left'>
						<Note>
							<div className='section'>you can maintain your menagerie of monsters here</div>
							<div className='section'>you can then use these monsters to design combat encounters in the encounter builder</div>
							<hr/>
							<div className='section'>on the right you will see your monster groups</div>
							<div className='section'>select a monster group from the list to see stat blocks for monsters in that group</div>
							<div className='section'>press a group's <b>open group</b> button to see monster details</div>
							<hr/>
							<div className='section'>to start adding monsters, press the <b>add a new monster group</b> button</div>
						</Note>
						<MonsterGroupListOptions
							addMonsterGroup={() => this.props.addMonsterGroup()}
							importMonsterGroup={() => this.props.importMonsterGroup()}
							openDemographics={() => this.props.openDemographics(null)}
						/>
					</Col>
					<Col span={18} className='scrollable'>
						<GridPanel heading='monster groups' content={listItems} />
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MonsterGroupListScreen' error={e} />;
		}
	}
}
