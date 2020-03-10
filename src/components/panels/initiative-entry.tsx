import React from 'react';

import { Icon, Tag } from 'antd';
import Showdown from 'showdown';

import { Combat, Combatant } from '../../models/combat';
import { Monster } from '../../models/monster-group';
import { PC } from '../../models/party';

import Utils from '../../utils/utils';

import NumberSpin from '../controls/number-spin';
import HitPointGauge from './hit-point-gauge';
import Note from './note';
import PortraitPanel from './portrait-panel';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
    combatant: Combatant;
    minimal: boolean;
    combat: Combat;
    selected: boolean;
    select: (combatant: Combatant, ctrl: boolean) => void;
    nudgeValue: (combatant: Combatant, field: string, delta: number) => void;
    makeActive: (combatant: Combatant) => void;
    addToMap: (combatant: Combatant) => void;
}

export default class InitiativeEntry extends React.Component<Props> {
    private getInformationTag() {
        if (this.props.combatant.current) {
            return <Tag className='info'>current turn</Tag>;
        }

        if (this.props.selected) {
            return <Tag className='info'>selected</Tag>;
        }

        return null;
    }

    private onClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (this.props.select) {
            this.props.select(this.props.combatant, e.ctrlKey);
        }
    }

    private getContent() {
        if (this.props.combatant.pending) {
            return (
                <div>
                    <NumberSpin
                        source={this.props.combatant}
                        name='initiative'
                        label='initiative'
                        nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'initiative', delta)}
                    />
                    <button onClick={e => { e.stopPropagation(); this.props.makeActive(this.props.combatant); }}>add to encounter</button>
                </div>
            );
        }

        const notes = [];

        // HP, AC stats
        if ((this.props.combatant.type === 'monster') && !this.props.minimal) {
            const monster = this.props.combatant as (Combatant & Monster);

            let hp = (this.props.combatant.hpCurrent ?? 0).toString();
            if ((this.props.combatant.hpTemp ?? 0) > 0) {
                hp += '+' + this.props.combatant.hpTemp;
            }

            notes.push(
                <div key='stats'>
                    <div className='section key-stats'>
                        <div className='key-stat'>
                            <div className='stat-label'>ac</div>
                            <div className='stat-value'>{monster.ac}</div>
                        </div>
                        <div className='key-stat'>
                            <div className='stat-value'>{hp}</div>
                            <div className='stat-label'>hp</div>
                        </div>
                    </div>
                    <HitPointGauge combatant={this.props.combatant} />
                </div>
            );
        }

        // Not on the map
        if (this.props.combat.map && !this.props.combat.map.items.find(i => i.id === this.props.combatant.id)) {
            notes.push(
                <Note key='not-on-map'>
                    <span>not on the map</span>
                    <Icon
                        type='environment'
                        className='icon-button'
                        onClick={() => this.props.addToMap(this.props.combatant)}
                    />
                </Note>
            );
        }

        // Hidden
        if (!this.props.combatant.showOnMap) {
            notes.push(
                <Note key='hidden'>hidden</Note>
            );
        }

        // Tags
        this.props.combatant.tags.forEach(tag => {
            notes.push(
                <Note key={tag}>
                    <div className='condition'>
                        <div className='condition-name'>{Utils.getTagTitle(tag)}</div>
                        {Utils.getTagDescription(tag)}
                    </div>
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
                    name += ' ' + Utils.conditionDurationText(c, this.props.combat);
                }
                const description = [];
                const text = Utils.conditionText(c);
                for (let n = 0; n !== text.length; ++n) {
                    description.push(<div key={n} className='condition-text'>{text[n]}</div>);
                }
                notes.push(
                    <Note key={c.id}>
                        <div className='condition'>
                            <div className='condition-name'>{name}</div>
                            {description}
                        </div>
                    </Note>
                );
            });
        }

        // Custom text
        if (this.props.combatant.note) {
            notes.push(
                <Note key='text'>
                    <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.props.combatant.note) }} />
                </Note>
            );
        }

        return notes;
    }

    public render() {
        try {
            let style = 'initiative-list-item ' + this.props.combatant.type;
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

            return (
                <div className={style} onClick={e => this.onClick(e)}>
                    <div className='header'>
                        {portrait}
                        <div className='name'>
                            {this.props.combatant.displayName || 'combatant'}
                        </div>
                        {this.getInformationTag()}
                    </div>
                    <div className='content'>
                        {this.getContent()}
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
