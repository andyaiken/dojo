import React from 'react';
import Showdown from 'showdown';

import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Monster, Trait, TRAIT_TYPES } from '../../models/monster-group';

import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';
import Note from '../panels/note';

import arrow from '../../resources/icons/down-arrow-black.svg';

const showdown = new Showdown.Converter();

interface Props {
    combatant: Monster | (Combatant & Monster);
    mode: 'view' | 'edit' | 'template' | 'combat' | 'combat-special';
    filter: string;
    addTrait: (traitType: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair') => void;
    copyTrait: (trait: Trait) => void;
    removeTrait: (trait: Trait) => void;
    changeValue: (trait: Trait, field: string, value: any) => void;
    swapTraits: (t1: Trait, t2: Trait) => void;
}

export default class TraitsPanel extends React.Component<Props> {
    public static defaultProps = {
        mode: 'view',
        filter: '',
        addTrait: null,
        copyTrait: null,
        removeTrait: null,
        changeValue: null,
        swapTraits: null
    };

    private createTraitPanel(trait: Trait, prevTrait: Trait | null, nextTrait: Trait | null) {
        return (
            <TraitPanel
                key={trait.id}
                trait={trait}
                mode={this.props.mode}
                prevTrait={prevTrait}
                nextTrait={nextTrait}
                changeValue={(action, type, value) => this.props.changeValue(action, type, value)}
                removeTrait={action => this.props.removeTrait(action)}
                copyTrait={action => this.props.copyTrait(action)}
                swapTraits={(t1, t2) => this.props.swapTraits(t1, t2)}
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
                        <Note
                            content={'one legendary action can be used at the end of each other combatant\'s turn; spent actions are refreshed at the start of the monster\'s turn'}
                            white={true}
                        />
                    );
                    /* tslint:enable:max-line-length */
                    break;
                case 'lair':
                    info = (
                        <Note
                            content={'one lair action can be taken each round on initiative 20'}
                            white={true}
                        />
                    );
                    break;
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
                const traits = this.props.combatant.traits
                    .filter(t => t.type === type)
                    .filter(t => Utils.match(this.props.filter, t.name));

                const list: JSX.Element[] = [];
                for (let n = 0; n !== traits.length; ++n) {
                    const trait = traits[n];
                    const prevTrait = n !== 0 ? traits[n - 1] : null;
                    const nextTrait = n !== traits.length - 1 ? traits[n + 1] : null;
                    list.push(this.createTraitPanel(trait, prevTrait, nextTrait));
                }

                if (this.props.mode === 'edit') {
                    list.push(
                        <button key='add' onClick={() => this.props.addTrait(type as 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair')}>
                            add a new {Utils.traitType(type, false)}
                        </button>
                    );
                }

                traitsByType[type] = list;
            });

            if (this.props.mode === 'edit') {
                return (
                    <div className='row collapse'>
                        <div className='columns small-4 medium-4 large-4 wide-column'>
                            {this.createSection(traitsByType, 'trait')}
                        </div>
                        <div className='columns small-4 medium-4 large-4 wide-column'>
                            {this.createSection(traitsByType, 'action')}
                        </div>
                        <div className='columns small-4 medium-4 large-4 wide-column'>
                            {this.createSection(traitsByType, 'bonus')}
                            {this.createSection(traitsByType, 'reaction')}
                            {this.createSection(traitsByType, 'legendary')}
                            {this.createSection(traitsByType, 'lair')}
                        </div>
                    </div>
                );
            }

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
        }
    }
}

interface TraitPanelProps {
    trait: Trait;
    mode: 'view' | 'edit' | 'template' | 'combat' | 'combat-special';
    prevTrait: Trait | null;
    nextTrait: Trait | null;
    changeValue: (trait: Trait, field: string, value: any) => void;
    copyTrait: (trait: Trait) => void;
    removeTrait: (trait: Trait) => void;
    swapTraits: (t1: Trait, t2: Trait) => void;
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
                case 'edit':
                    const details = (
                        <div className='section'>
                            <div className='row collapse'>
                                <div className='columns small-6 medium-8 large-9'>
                                    <input
                                        type='text'
                                        placeholder='name'
                                        value={this.props.trait.name}
                                        onChange={event => this.props.changeValue(this.props.trait, 'name', event.target.value)}
                                    />
                                    <input
                                        type='text'
                                        placeholder='usage'
                                        value={this.props.trait.usage}
                                        onChange={event => this.props.changeValue(this.props.trait, 'usage', event.target.value)}
                                    />
                                </div>
                                <div className='columns small-6 medium-4 large-3'>
                                    <div className='trait-ordering'>
                                        <div className='vertical-center-outer'>
                                            <div className='vertical-center-middle'>
                                                <div>
                                                    <img
                                                        className={this.props.prevTrait ? 'rotate' : 'rotate disabled'}
                                                        src={arrow}
                                                        alt='move up'
                                                        onClick={() => this.props.swapTraits(this.props.trait, this.props.prevTrait as Trait)}
                                                    />
                                                </div>
                                                <div>
                                                    <img
                                                        className={this.props.nextTrait ? '' : 'disabled'}
                                                        src={arrow}
                                                        alt='move down'
                                                        onClick={() => this.props.swapTraits(this.props.trait, this.props.nextTrait as Trait)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <textarea
                                placeholder='details'
                                value={this.props.trait.text}
                                onChange={event => this.props.changeValue(this.props.trait, 'text', event.target.value)}
                            />
                            <div className='divider' />
                            <ConfirmButton text='delete' callback={() => this.props.removeTrait(this.props.trait)} />
                        </div>
                    );

                    let name = this.props.trait.name || 'unnamed ' + Utils.traitType(this.props.trait.type, false);
                    if (this.props.trait.usage) {
                        name += ' (' + this.props.trait.usage + ')';
                    }
                    return (
                        <Expander
                            text={name}
                            content={details}
                        />
                    );
                case 'template':
                    return (
                        <div key={this.props.trait.id} className='section trait'>
                            <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(markdown) }} />
                            <button onClick={() => this.props.copyTrait(this.props.trait)}>copy</button>
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
        }
    }
}
