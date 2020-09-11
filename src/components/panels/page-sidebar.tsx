import { BookOutlined, BulbOutlined, InfoCircleOutlined, SearchOutlined, ShareAltOutlined, ToolOutlined } from '@ant-design/icons';
import React from 'react';

import Utils from '../../utils/utils';

import { Combat } from '../../models/combat';
import { Encounter } from '../../models/encounter';
import { Exploration, Map } from '../../models/map';
import { Monster, MonsterGroup } from '../../models/monster';
import { Party } from '../../models/party';

import AboutSidebar from '../sidebars/about-sidebar';
import GeneratorsSidebar from '../sidebars/generators-sidebar';
import ReferenceSidebar from '../sidebars/reference-sidebar';
import SearchSidebar from '../sidebars/search-sidebar';
import SessionDMSidebar from '../sidebars/session-dm-sidebar';
import SessionPlayerSidebar from '../sidebars/session-player-sidebar';
import ToolsSidebar from '../sidebars/tools-sidebar';

export interface Sidebar {
	visible: boolean;
	type: string;
	subtype: string;
	dice: { [sides: number]: number };
	constant: number;
	selectedPartyID: string | null;
	selectedMonsterID: string | null;
}

interface Props {
	sidebar: Sidebar;
	user: 'dm' | 'player';
	parties: Party[];
	library: MonsterGroup[];
	encounters: Encounter[];
	maps: Map[];
	combats: Combat[];
	explorations: Exploration[];
	currentCombat: Combat | null;
	currentExploration: Exploration | null;
	onSelectSidebar: (type: string) => void;
	onUpdateSidebar: (sidebar: any) => void;
	selectParty: (id: string) => void;
	selectMonsterGroup: (id: string) => void;
	selectEncounter: (id: string) => void;
	selectMap: (id: string) => void;
	openImage: (data: string) => void;
	editPC: (id: string) => void;
}

export default class PageSidebar extends React.Component<Props> {
	public static defaultProps = {
		parties: [],
		library: [],
		encounters: [],
		maps: [],
		combats: [],
		explorations: [],
		currentCombat: null,
		currentExploration: null,
		selectParty: null,
		selectMonsterGroup: null,
		selectEncounter: null,
		selectMap: null,
		openImage: null,
		openStatBlock: null,
		editPC: null
	};

	public render() {
		try {
			if (!this.props.sidebar.visible) {
				return null;
			}

			const options = [];
			if (this.props.user === 'player') {
				options.push(
					<ShareAltOutlined
						key='session-player'
						className={this.props.sidebar.type === 'session-player' ? 'sidebar-icon selected' : 'sidebar-icon'}
						title='session'
						onClick={() => this.props.onSelectSidebar('session-player')}
					/>
				);
			}
			if (this.props.user === 'dm') {
				options.push(
					<ToolOutlined
						key='tools'
						className={this.props.sidebar.type === 'tools' ? 'sidebar-icon selected' : 'sidebar-icon'}
						title='tools'
						onClick={() => this.props.onSelectSidebar('tools')}
					/>
				);
				options.push(
					<BulbOutlined
						key='generators'
						className={this.props.sidebar.type === 'generators' ? 'sidebar-icon selected' : 'sidebar-icon'}
						title='generators'
						onClick={() => this.props.onSelectSidebar('generators')}
					/>
				);
			}
			options.push(
				<BookOutlined
					key='reference'
					className={this.props.sidebar.type === 'reference' ? 'sidebar-icon selected' : 'sidebar-icon'}
					title='reference'
					onClick={() => this.props.onSelectSidebar('reference')}
				/>
			);
			if (this.props.user === 'dm') {
				options.push(
					<ShareAltOutlined
						key='session-dm'
						className={this.props.sidebar.type === 'session-dm' ? 'sidebar-icon selected' : 'sidebar-icon'}
						title='session'
						onClick={() => this.props.onSelectSidebar('session-dm')}
					/>
				);
				options.push(
					<SearchOutlined
						key='search'
						className={this.props.sidebar.type === 'search' ? 'sidebar-icon selected' : 'sidebar-icon'}
						title='search'
						onClick={() => this.props.onSelectSidebar('search')}
					/>
				);
			}
			options.push(
				<InfoCircleOutlined
					key='about'
					className={this.props.sidebar.type === 'about' ? 'sidebar-icon selected' : 'sidebar-icon'}
					title='about'
					onClick={() => this.props.onSelectSidebar('about')}
				/>
			);

			let content = null;
			switch (this.props.sidebar.type) {
				case 'tools':
					content = (
						<ToolsSidebar
							view={this.props.sidebar.subtype}
							setView={view => {
								const sidebar = this.props.sidebar;
								sidebar.subtype = view;
								this.props.onUpdateSidebar(this.props.sidebar);
							}}
							dice={this.props.sidebar.dice}
							constant={this.props.sidebar.constant}
							setDie={(sides, count) => {
								const sidebar = this.props.sidebar;
								sidebar.dice[sides] = count;
								this.props.onUpdateSidebar(this.props.sidebar);
							}}
							setConstant={value => {
								const sidebar = this.props.sidebar;
								sidebar.constant = value;
								this.props.onUpdateSidebar(this.props.sidebar);
							}}
							resetDice={() => {
								const sidebar = this.props.sidebar;
								[4, 6, 8, 10, 12, 20, 100].forEach(n => sidebar.dice[n] = 0);
								sidebar.constant = 0;
								this.props.onUpdateSidebar(this.props.sidebar);
							}}
						/>
					);
					break;
				case 'generators':
					content = (
						<GeneratorsSidebar
							view={this.props.sidebar.subtype}
							setView={view => {
								const sidebar = this.props.sidebar;
								sidebar.subtype = view;
								this.props.onUpdateSidebar(this.props.sidebar);
							}}
						/>
					);
					break;
				case 'reference':
					const monsters: Monster[] = [];
					this.props.library.forEach(g => {
						g.monsters.forEach(m => monsters.push(m));
					});
					Utils.sort(monsters);
					content = (
						<ReferenceSidebar
							view={this.props.sidebar.subtype}
							setView={view => {
								const sidebar = this.props.sidebar;
								sidebar.subtype = view;
								this.props.onUpdateSidebar(this.props.sidebar);
							}}
							selectedPartyID={this.props.sidebar.selectedPartyID}
							parties={this.props.parties}
							selectPartyID={id => {
								const sidebar = this.props.sidebar;
								sidebar.selectedPartyID = id;
								this.props.onUpdateSidebar(this.props.sidebar);
							}}
							selectedMonsterID={this.props.sidebar.selectedMonsterID}
							monsters={monsters}
							selectMonsterID={id => {
								const sidebar = this.props.sidebar;
								sidebar.selectedMonsterID = id;
								this.props.onUpdateSidebar(this.props.sidebar);
							}}
						/>
					);
					break;
				case 'session-dm':
					content = (
						<SessionDMSidebar
							view={this.props.sidebar.subtype}
							setView={view => {
								const sidebar = this.props.sidebar;
								sidebar.subtype = view;
								this.props.onUpdateSidebar(this.props.sidebar);
							}}
							parties={this.props.parties}
							combat={this.props.currentCombat}
							exploration={this.props.currentExploration}
							openImage={data => this.props.openImage(data)}
						/>
					);
					break;
				case 'session-player':
					content = (
						<SessionPlayerSidebar
							editPC={id => this.props.editPC(id)}
						/>
					);
					break;
				case 'search':
					content = (
						<SearchSidebar
							parties={this.props.parties}
							library={this.props.library}
							encounters={this.props.encounters}
							maps={this.props.maps}
							openParty={id => this.props.selectParty(id)}
							openGroup={id => this.props.selectMonsterGroup(id)}
							openEncounter={id => this.props.selectEncounter(id)}
							openMap={id => this.props.selectMap(id)}
						/>
					);
					break;
				case 'about':
					content = (
						<AboutSidebar
							parties={this.props.parties}
							library={this.props.library}
							maps={this.props.maps}
							combats={this.props.combats}
							explorations={this.props.explorations}
						/>
					);
					break;
			}

			return (
				<div className='sidebar sidebar-right'>
					<div className='sidebar-icons'>
						{options}
					</div>
					{content}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
