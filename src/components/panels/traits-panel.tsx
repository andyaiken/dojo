import React from 'react';
import Showdown from 'showdown';

import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Monster, Trait, TRAIT_TYPES } from '../../models/monster-group';

import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';

const showdown = new Showdown.Converter();

interface Props {
    combatant: Monster | (Combatant & Monster);
    mode: 'view' | 'edit' | 'template' | 'combat';
    addTrait: (traitType: 'trait' | 'action' | 'legendary' | 'lair' | 'regional') => void;
    copyTrait: (trait: Trait) => void;
    removeTrait: (trait: Trait) => void;
    changeValue: (trait: Trait, field: string, value: any) => void;
    swapTraits: (t1: Trait, t2: Trait) => void;
}

export default class TraitsPanel extends React.Component<Props> {
    public static defaultProps = {
        mode: 'view',
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

    public render() {
        try {
            const traitsByType: { [id: string]: JSX.Element[] } = {};

            TRAIT_TYPES.forEach(type => {
                const traits = this.props.combatant.traits.filter(t => t.type === type);

                const list: JSX.Element[] = [];
                for (let n = 0; n !== traits.length; ++n) {
                    const trait = traits[n];
                    const prevTrait = n !== 0 ? traits[n - 1] : null;
                    const nextTrait = n !== traits.length - 1 ? traits[n + 1] : null;
                    list.push(this.createTraitPanel(trait, prevTrait, nextTrait));
                }

                if (this.props.mode === 'edit') {
                    list.push(
                        <button key='add' onClick={() => this.props.addTrait(type as 'trait' | 'action' | 'legendary' | 'lair' | 'regional')}>add a new {Utils.traitType(type)}</button>
                    );
                }

                traitsByType[type] = list;
            });

            if (this.props.mode === 'edit') {
                return (
                    <div className='row collapse'>
                        <div className='columns small-4 medium-4 large-4 list-column'>
                            <div className='section subheading'>traits</div>
                            {traitsByType['trait']}
                        </div>
                        <div className='columns small-4 medium-4 large-4 list-column'>
                            <div className='section subheading'>actions</div>
                            {traitsByType['action']}
                        </div>
                        <div className='columns small-4 medium-4 large-4 list-column'>
                            <div className='section subheading'>legendary actions</div>
                            {traitsByType['legendary']}
                            <div className='section subheading'>lair actions</div>
                            {traitsByType['lair']}
                            <div className='section subheading'>regional effects</div>
                            {traitsByType['regional']}
                        </div>
                    </div>
                );
            }

            return (
                <div>
                    <div style={{ display: traitsByType['trait'].length > 0 ? '' : 'none' }}>
                        <div className='section subheading'>traits</div>
                        {traitsByType['trait']}
                    </div>
                    <div style={{ display: traitsByType['action'].length > 0 ? '' : 'none' }}>
                        <div className='section subheading'>actions</div>
                        {traitsByType['action']}
                    </div>
                    <div style={{ display: traitsByType['legendary'].length > 0 ? '' : 'none' }}>
                        <div className='section subheading'>legendary actions</div>
                        {traitsByType['legendary']}
                    </div>
                    <div style={{ display: traitsByType['lair'].length > 0 ? '' : 'none' }}>
                        <div className='section subheading'>lair actions</div>
                        {traitsByType['lair']}
                    </div>
                    <div style={{ display: traitsByType['regional'].length > 0 ? '' : 'none' }}>
                        <div className='section subheading'>regional effects</div>
                        {traitsByType['regional']}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}

interface TraitPanelProps {
    trait: Trait;
    mode: 'view' | 'edit' | 'template' | 'combat';
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
            let heading = this.props.trait.name || 'unnamed ' + Utils.traitType(this.props.trait.type);

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
                            <textarea
                                placeholder='details'
                                value={this.props.trait.text}
                                onChange={event => this.props.changeValue(this.props.trait, 'text', event.target.value)}
                            />
                            <div className='divider' />
                            <button className={this.props.prevTrait ? '' : 'disabled'} onClick={() => this.props.swapTraits(this.props.trait, this.props.prevTrait as Trait)}>move up</button>
                            <button className={this.props.nextTrait ? '' : 'disabled'} onClick={() => this.props.swapTraits(this.props.trait, this.props.nextTrait as Trait)}>move down</button>
                            <ConfirmButton text='delete' callback={() => this.props.removeTrait(this.props.trait)} />
                        </div>
                    );

                    return (
                        <Expander
                            text={this.props.trait.name || 'unnamed ' + Utils.traitType(this.props.trait.type)}
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
