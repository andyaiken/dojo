import React from 'react';

import { Icon } from 'antd';
import Showdown from 'showdown';

import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Monster, Trait, TRAIT_TYPES } from '../../models/monster-group';

import Note from '../panels/note';

const showdown = new Showdown.Converter();

interface Props {
    combatant: Monster | (Combatant & Monster);
    mode: 'view' | 'template' | 'combat' | 'legendary' | 'lair';
    copyTrait: (trait: Trait) => void;
    useTrait: (trait: Trait) => void;
    rechargeTrait: (trait: Trait) => void;
}

export default class TraitsPanel extends React.Component<Props> {
    public static defaultProps = {
        mode: 'view',
        copyTrait: null,
        useTrait: null,
        rechargeTrait: null
    };

    private createSection(traitsByType: { [id: string]: JSX.Element[] }, type: string) {
        const traits = traitsByType[type];
        if (traits.length === 0) {
            return null;
        }

        let info = null;
        if ((this.props.mode === 'legendary') || (this.props.mode === 'lair')) {
            switch (type) {
                case 'legendary':
                    let count = null;
                    let usage = null;
                    if (this.props.combatant.legendaryActions > 0) {
                        count = (
                            <div>
                                <div><b>{this.props.combatant.legendaryActions}</b> legendary actions per round</div>
                                <div className='divider' />
                            </div>
                        );
                        if (this.props.mode === 'legendary') {
                            let used = 0;
                            this.props.combatant.traits.filter(t => (t.type === 'legendary') && (t.uses > 0)).forEach(t => {
                                let value = 1;
                                if (t.usage) {
                                    // Action usage might be: '[costs|counts as] N [legendary actions|actions]'
                                    const found = t.usage.toLowerCase().match(/\D*(\d*)\D*/);
                                    if (found) {
                                        value = parseInt(found[1], 10);
                                    }
                                }
                                used += value;
                            });
                            used = Math.min(used, this.props.combatant.legendaryActions);
                            const unused = Math.max(this.props.combatant.legendaryActions - used, 0);
                            const icons = [];
                            for (let n = 0; n !== used; ++n) {
                                icons.push(
                                    <Icon key={'used ' + n} type='crown' theme='filled' />
                                );
                            }
                            for (let n = 0; n !== unused; ++n) {
                                icons.push(
                                    <Icon key={'unused ' + n} type='crown' />
                                );
                            }
                            usage = (
                                <div>
                                    <div className='divider' />
                                    <div className='section centered legendary-usage'>
                                        {icons}
                                    </div>
                                </div>
                            );
                        }
                    }
                    /* tslint:disable:max-line-length */
                    info = (
                        <Note white={true}>
                            {count}
                            one legendary action can be used at the end of each other combatant's turn; spent actions are refreshed at the start of the monster's turn
                            {usage}
                        </Note>
                    );
                    /* tslint:enable:max-line-length */
                    break;
                case 'lair':
                    info = (
                        <Note white={true}>
                            one lair action can be taken each round on initiative 20
                        </Note>
                    );
                    break;
            }
        } else {
            if (type === 'legendary') {
                info = (
                    <Note white={true}>
                        <b>{this.props.combatant.legendaryActions}</b> legendary actions per round
                    </Note>
                );
            }
        }

        return (
            <div>
                <div className='section subheading'>{Utils.traitType(type, true)}</div>
                {info}
                {traits}
            </div>
        );
    }

    public render() {
        try {
            const traitsByType: { [id: string]: JSX.Element[] } = {};
            TRAIT_TYPES.forEach(type => {
                traitsByType[type] = this.props.combatant.traits.filter(t => t.type === type).map(trait => (
                    <TraitPanel
                        key={trait.id}
                        trait={trait}
                        mode={this.props.mode}
                        copyTrait={action => this.props.copyTrait(action)}
                        useTrait={action => this.props.useTrait(action)}
                        rechargeTrait={action => this.props.rechargeTrait(action)}
                    />
                ));
            });

            if (this.props.combatant.traits.length === 0) {
                return (
                    <div><i>no traits or actions</i></div>
                );
            }

            if (this.props.mode === 'combat') {
                return (
                    <div>
                        {this.createSection(traitsByType, 'trait')}
                        {this.createSection(traitsByType, 'action')}
                        {this.createSection(traitsByType, 'bonus')}
                        {this.createSection(traitsByType, 'reaction')}
                    </div>
                );
            }

            if (this.props.mode === 'legendary') {
                return (
                    <div>
                        {this.createSection(traitsByType, 'legendary')}
                    </div>
                );
            }

            if (this.props.mode === 'lair') {
                return (
                    <div>
                        {this.createSection(traitsByType, 'lair')}
                    </div>
                );
            }

            return (
                <div>
                    {this.createSection(traitsByType, 'trait')}
                    {this.createSection(traitsByType, 'action')}
                    {this.createSection(traitsByType, 'bonus')}
                    {this.createSection(traitsByType, 'reaction')}
                    {this.createSection(traitsByType, 'legendary')}
                    {this.createSection(traitsByType, 'lair')}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface TraitPanelProps {
    trait: Trait;
    mode: 'view' | 'template' | 'combat' | 'legendary' | 'lair';
    copyTrait: (trait: Trait) => void;
    useTrait: (trait: Trait) => void;
    rechargeTrait: (trait: Trait) => void;
}

class TraitPanel extends React.Component<TraitPanelProps> {
    public render() {
        try {
            let maxUses = 0;
            let heading = this.props.trait.name || 'unnamed ' + Utils.traitType(this.props.trait.type, false);

            if (this.props.trait.usage) {
                let used = '';
                if (this.props.trait.usage.toLowerCase().startsWith('recharge ')) {
                    maxUses = 1;
                    if (this.props.trait.uses > 0) {
                        used = '; used';
                    }
                }
                const found = this.props.trait.usage.toLowerCase().match(/(\d+)\s*\/\s*day/);
                if (found) {
                    maxUses = parseInt(found[1], 10);
                    if (this.props.trait.uses > 0) {
                        used = '; used ' + this.props.trait.uses;
                    }
                }
                heading += ' *(' + this.props.trait.usage + used + ')*';
            }
            if (this.props.trait.type === 'legendary') {
                maxUses = 1;
                if (this.props.trait.uses > 0) {
                    heading += ' *(used)*';
                }
            }
            const markdown = '**' + heading + '** ' + this.props.trait.text;

            switch (this.props.mode) {
                case 'view':
                    return (
                        <div key={this.props.trait.id} className='section trait'>
                            <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(markdown) }} />
                        </div>
                    );
                case 'template':
                    return (
                        <div key={this.props.trait.id} className='section trait trait-template' onClick={() => this.props.copyTrait(this.props.trait)}>
                            <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(markdown) }} />
                        </div>
                    );
                case 'combat':
                case 'legendary':
                case 'lair':
                    let style = '';
                    let usage = null;
                    if (maxUses > 0) {
                        if (this.props.trait.uses >= maxUses) {
                            style = 'strikethrough';
                            usage = <button onClick={() => this.props.rechargeTrait(this.props.trait)}>recharge</button>;
                        } else {
                            usage = <button onClick={() => this.props.useTrait(this.props.trait)}>use</button>;
                        }
                    }
                    return (
                        <div key={this.props.trait.id} className='section trait'>
                            <div className={style} dangerouslySetInnerHTML={{ __html: showdown.makeHtml(markdown) }} />
                            {usage}
                        </div>
                    );
            }
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
