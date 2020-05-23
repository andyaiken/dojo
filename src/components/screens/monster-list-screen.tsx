import { Col, Row } from 'antd';
import React from 'react';

import Utils from '../../utils/utils';

import { Monster, MonsterGroup } from '../../models/monster-group';

import MonsterGroupCard from '../cards/monster-group-card';
import GridPanel from '../panels/grid-panel';
import Note from '../panels/note';

interface Props {
	library: MonsterGroup[];
	hasMonsters: boolean;
	addMonsterGroup: () => void;
	importMonsterGroup: () => void;
	selectMonsterGroup: (group: MonsterGroup) => void;
	deleteMonsterGroup: (group: MonsterGroup) => void;
	addOpenGameContent: () => void;
	openStatBlock: (monster: Monster) => void;
	openDemographics: (group: MonsterGroup | null) => void;
}

export default class MonsterListScreen extends React.Component<Props> {
	public render() {
		try {
			if (!this.props.hasMonsters) {
				/* tslint:disable:max-line-length */
				return (
					<Row align='middle' justify='center' className='scrollable'>
						<Col xs={20} sm={18} md={16} lg={12} xl={10}>
							<Note>
								<div className='section'>
									to kickstart your monster collection, let's import all the monsters from the <a href='http://dnd.wizards.com/articles/features/systems-reference-document-srd' target='_blank' rel='noopener noreferrer'>d&amp;d system reference document</a>
								</div>
								<div className='divider' />
								<button onClick={() => this.props.addOpenGameContent()}>import monsters</button>
							</Note>
						</Col>
					</Row>
				);
				/* tslint:enable:max-line-length */
			}

			const groups = this.props.library;
			Utils.sort(groups);
			const listItems = groups.map(group => (
				<MonsterGroupCard
					key={group.id}
					group={group}
					open={grp => this.props.selectMonsterGroup(grp)}
					delete={grp => this.props.deleteMonsterGroup(grp)}
					openStatBlock={monster => this.props.openStatBlock(monster)}
				/>
			));

			return (
				<Row className='full-height'>
					<Col xs={12} sm={12} md={8} lg={6} xl={4} className='scrollable sidebar sidebar-left'>
						<Note>
							<div className='section'>you can maintain your menagerie of monsters here</div>
							<div className='section'>you can then use these monsters to design combat encounters in the encounter builder</div>
							<div className='divider'/>
							<div className='section'>on the right you will see a list of monster groups</div>
							<div className='section'>select a monster group from the list to see stat blocks for monsters in that group</div>
							<div className='divider'/>
							<div className='section'>to start adding monsters, press the <b>create a new monster group</b> button</div>
						</Note>
						<button onClick={() => this.props.addMonsterGroup()}>create a new monster group</button>
						<button onClick={() => this.props.importMonsterGroup()}>import a monster group</button>
						<button onClick={() => this.props.openDemographics(null)}>show demographics</button>
					</Col>
					<Col xs={12} sm={12} md={16} lg={18} xl={20} className='scrollable'>
						<GridPanel heading='monster groups' content={listItems} />
					</Col>
				</Row>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
