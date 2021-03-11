import { CheckCircleOutlined, CloseCircleOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Col, Row, Tag } from 'antd';
import React from 'react';
import ReactMarkdown from 'react-markdown';

import { Combat, Combatant } from '../../models/combat';
import { Monster } from '../../models/monster';
import { PC } from '../../models/party';

import { Gygax } from '../../utils/gygax';

import { RenderError } from '../error';
import { ConfirmButton } from '../controls/confirm-button';
import { Group } from '../controls/group';
import { Note } from '../controls/note';
import { NumberSpin } from '../controls/number-spin';
import { HitPointGauge } from './hit-point-gauge';
import { PortraitPanel } from './portrait-panel';

interface InitiativeEntryProps {
	combatant: Combatant;
	playerView: boolean;
	selectedText: string;
	combat: Combat;
	selected: boolean;
	select: (combatant: Combatant, ctrl: boolean) => void;
}

export class InitiativeEntry extends React.Component<InitiativeEntryProps> {
	private getInformationTag() {
		if (this.props.combatant.current) {
			return <Tag className='info'>current turn</Tag>;
		}

		if (this.props.selected) {
			return <Tag className='info'>{this.props.selectedText}</Tag>;
		}

		return null;
	}

	private onClick(e: React.MouseEvent) {
		e.stopPropagation();
		if (this.props.select) {
			this.props.select(this.props.combatant, e.ctrlKey);
		}
	}

	private getStats() {
		if ((this.props.combatant.type === 'monster') && !this.props.playerView) {
			const monster = this.props.combatant as (Combatant & Monster);

			let hp = (this.props.combatant.hpCurrent ?? 0).toString();
			if ((this.props.combatant.hpTemp ?? 0) > 0) {
				hp += '+' + this.props.combatant.hpTemp;
			}

			return (
				<div>
					<Row align='middle'>
						<Col span={12}>
							<div className='information'>
								<div>ac</div>
								<div className='information-value'>{monster.ac}</div>
							</div>
						</Col>
						<Col span={12}>
							<div className='information'>
								<div className='information-value'>{hp}</div>
								<div>hp</div>
							</div>
						</Col>
					</Row>
					<HitPointGauge combatant={this.props.combatant} />
				</div>
			);
		}

		return null;
	}

	private getTags() {
		const tags = [];

		// Ridden by
		const rider = this.props.combat.combatants.find(c => c.mountID === this.props.combatant.id);
		if (rider) {
			tags.push(
				<Tag key='rider'>
					<span>ridden by: </span>
					<button
						className='link'
						onClick={e => {
							e.stopPropagation();
							this.props.select(rider, false);
						}}
					>
						{rider.displayName}
					</button>
				</Tag>
			);
		}

		// Engaged with
		const engaged: string[] = [];
		this.props.combatant.tags.filter(tag => tag.startsWith('engaged')).forEach(tag => {
			engaged.push(Gygax.getTagDescription(tag));
		});
		if (engaged.length > 0) {
			tags.push(
				<Tag key='engaged'>
					engaged with: {engaged.join(', ')}
				</Tag>
			);
		}

		// Not on the map
		if (this.props.combat.map && !this.props.combat.map.items.find(i => i.id === this.props.combatant.id)) {
			tags.push(
				<Tag key='not-on-map'>
					not on the map
				</Tag>
			);
		}

		// Hidden
		if (!this.props.combatant.showOnMap) {
			tags.push(
				<Tag key='hidden'>
					hidden
				</Tag>
			);
		}

		return tags;
	}

	private getNotes() {
		const notes = [];

		// Mounted on
		if (!!this.props.combatant.mountID) {
			const mount = this.props.combat.combatants.find(c => c.id === this.props.combatant.mountID);
			if (mount) {
				let info = null;
				if (this.props.combatant.mountType === 'controlled') {
					info = (
						<div className='note-details'>
							your mount moves as directed; it can only take dash, disengage, or dodge actions
						</div>
					);
				}
				notes.push(
					<Note key='mount'>
						<div className='note-heading'>
							<span>mounted on: </span>
							<button
								className='link'
								onClick={e => {
									e.stopPropagation();
									this.props.select(mount, false);
								}}
							>
								{mount.displayName}
							</button>
						</div>
						{info}
						<div className='note-details'>
							if you’re knocked prone, or an effect moves your mount against its will, you must succeed on a dex save (dc 10) or land prone in a space within 5 feet of your mount
						</div>
						<div className='note-details'>
							if your mount is knocked prone, you can use your reaction to land on your feet; otherwise, you fall prone in a space within 5 feet of your mount
						</div>
					</Note>
				);
			}
		}

		// Other tags
		this.props.combatant.tags.filter(tag => !tag.startsWith('engaged')).forEach(tag => {
			notes.push(
				<Note key={tag}>
					<div className='note-heading'>{Gygax.getTagTitle(tag)}</div>
					<div className='note-details'>{Gygax.getTagDescription(tag)}</div>
				</Note>
			);
		});

		// Conditions
		if (this.props.combatant.conditions) {
			this.props.combatant.conditions.forEach(c => {
				let name = c.name;
				if (c.name === 'exhaustion') {
					name += ' (' + c.level + ')';
				}
				if (c.duration) {
					name += ' ' + Gygax.conditionDurationText(c, this.props.combat.combatants);
				}
				let heading = null;
				if (c.name !== 'custom') {
					heading = (
						<div className='note-heading'>{name}</div>
					);
				}
				const description = [];
				const text = Gygax.conditionText(c);
				for (let n = 0; n !== text.length; ++n) {
					description.push(<div key={n} className='note-details'>{text[n]}</div>);
				}
				notes.push(
					<Note key={c.id}>
						{heading}
						{description}
					</Note>
				);
			});
		}

		// Custom text
		if (this.props.combatant.note) {
			notes.push(
				<Note key='text'>
					<ReactMarkdown source={this.props.combatant.note} />
				</Note>
			);
		}

		return notes;
	}

	public render() {
		try {
			let style = 'initiative-list-item';
			if (this.props.combatant.current) {
				style += ' current';
			}
			if (this.props.selected) {
				style += ' highlight';
			}
			if (this.props.combatant.defeated) {
				style += ' defeated';
			}

			let portrait = null;
			const pcOrMonster = this.props.combatant as (Combatant & Monster) | (Combatant & PC);
			if (pcOrMonster.portrait) {
				portrait = <PortraitPanel source={pcOrMonster} inline={true} />;
			}

			let name = this.props.combatant.displayName || 'combatant';
			if (!!this.props.combatant.mountID) {
				const mount = this.props.combat.combatants.find(c => c.id === this.props.combatant.mountID);
				if (mount) {
					name += ' on ' + (mount.displayName || 'unnamed mount');
				}
			}

			const stats = this.getStats();
			const tags = this.getTags();
			const notes = this.getNotes();
			let content = null;
			if (stats || (tags.length > 0) || (notes.length > 0)) {
				content = (
					<div className='init-entry-content'>
						{this.getStats()}
						{this.getTags()}
						{this.getNotes()}
					</div>
				);
			}

			return (
				<div className={style} onClick={e => this.onClick(e)} role='button'>
					<div className='header'>
						{portrait}
						<div className='name'>{name}</div>
						{this.getInformationTag()}
					</div>
					{content}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='InitiativeEntry' error={e} />;
		}
	}
}

interface PendingProps {
	combatant: Combatant;
	changeValue: (combatant: Combatant, field: string, value: number) => void;
	nudgeValue: (combatant: Combatant, field: string, delta: number) => void;
	makeActive: (combatant: Combatant) => void;
	remove: (combatant: Combatant) => void;
}

export class PendingInitiativeEntry extends React.Component<PendingProps> {
	public render() {
		try {
			let portrait = null;
			const pcOrMonster = this.props.combatant as (Combatant & Monster) | (Combatant & PC);
			if (pcOrMonster.portrait) {
				portrait = <PortraitPanel source={pcOrMonster} inline={true} />;
			}

			return (
				<Group>
					<div className='content-then-icons'>
						<div className='content'>
							<div className='subheading'>
								{portrait}
								{this.props.combatant.displayName || 'combatant'}
							</div>
							<NumberSpin
								label='initiative'
								value={this.props.combatant.initiative ?? 10}
								onNudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'initiative', delta)}
							/>
						</div>
						<div className='icons vertical'>
							<CheckCircleOutlined title='add to encounter' onClick={() => this.props.makeActive(this.props.combatant)} />
							<ConfirmButton onConfirm={() => this.props.remove(this.props.combatant)}>
								<CloseCircleOutlined title='remove from encounter' />
							</ConfirmButton>
						</div>
					</div>
				</Group>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='PendingInitiativeEntry' error={e} />;
		}
	}
}

interface NotOnMapProps {
	combatant: Combatant;
	addToMap: (combatant: Combatant) => void;
}

export class NotOnMapInitiativeEntry extends React.Component<NotOnMapProps> {
	private addToMap(e: React.MouseEvent) {
		e.stopPropagation();
		this.props.addToMap(this.props.combatant);
	}

	public render() {
		try {
			let portrait = null;
			const pcOrMonster = this.props.combatant as (Combatant & Monster) | (Combatant & PC);
			if (pcOrMonster.portrait) {
				portrait = <PortraitPanel source={pcOrMonster} inline={true} />;
			}

			return (
				<Group>
					<div className='content-then-icons'>
						<div className='content'>
							<div className='subheading'>
								{portrait}
								{this.props.combatant.displayName || 'combatant'}
							</div>
						</div>
						<div className='icons'>
							<EnvironmentOutlined title='place on map' onClick={e => this.addToMap(e)} />
						</div>
					</div>
				</Group>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='NotOnMapInitiativeEntry' error={e} />;
		}
	}
}
