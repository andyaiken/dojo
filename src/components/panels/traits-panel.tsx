import React from 'react';
import Showdown from 'showdown';

import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Monster, Trait, TRAIT_TYPES } from '../../models/monster-group';

import Note from '../panels/note';

const showdown = new Showdown.Converter();

interface Props {
    combatant: Monster | (Combatant & Monster);
    mode: 'view' | 'template' | 'combat' | 'combat-special';
    copyTrait: (trait: Trait) => void;
    changeValue: (trait: Trait, field: string, value: any) => void;
}

export default class TraitsPanel extends React.Component<Props> {
    public static defaultProps = {
        mode: 'view',
        copyTrait: null,
        changeValue: null
    };

    private createTraitPanel(trait: Trait) {
        return (
            <TraitPanel
                key={trait.id}
                trait={trait}
                mode={this.props.mode}
                changeValue={(action, type, value) => this.props.changeValue(action, type, value)}
                copyTrait={action => this.props.copyTrait(action)}
            />
        );
    }

    private createSection(traitsByType: { [id: string]: JSX.Element[] }, type: string, showInfo: boolean = false) {
        const traits = traitsByType[type];
        if (traits.length === 0) {
            return null;
        }

        let info: JSX.Element | null = null;
        if (showInfo) {
            switch (type) {
                case 'legendary':
                    /* tslint:disable:max-line-length */
                    info = (
                        <Note white={true}>
                            one legendary action can be used at the end of each other combatant's turn; spent actions are refreshed at the start of the monster's turn
                        </Note>
                    );
                    /* tslint:enable:max-line-length */
                    break;
                case 'lair':
                    info = (
                        <Note white={true}>one lair action can be taken each round on initiative 20</Note>
                    );
                    break;
            }
        }

        return (
            <div className='section'>
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
                const list: JSX.Element[] = [];
                const traits = this.props.combatant.traits.filter(t => t.type === type);
                for (let n = 0; n !== traits.length; ++n) {
                    const trait = traits[n];
                    list.push(this.createTraitPanel(trait));
                }

                traitsByType[type] = list;
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

            if (this.props.mode === 'combat-special') {
                return (
                    <div>
                        {this.createSection(traitsByType, 'legendary', true)}
                        {this.createSection(traitsByType, 'lair', true)}
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
    mode: 'view' | 'template' | 'combat' | 'combat-special';
    changeValue: (trait: Trait, field: string, value: any) => void;
    copyTrait: (trait: Trait) => void;
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
                case 'combat-special':
                    let style = '';
                    let usage = null;
                    if (maxUses > 0) {
                        const isTapped = this.props.trait.uses >= maxUses;
                        if (isTapped) {
                            style = 'strikethrough';
                            usage = <button onClick={() => this.props.changeValue(this.props.trait, 'uses', 0)}>recharge</button>;
                        } else {
                            usage = <button onClick={() => this.props.changeValue(this.props.trait, 'uses', this.props.trait.uses + 1)}>use</button>;
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
