import React from 'react';

import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Monster, Trait, TRAIT_TYPES } from '../../models/monster-group';

import Menu from '../controls/menu';
import Note from './note';

import arrow from '../../resources/icons/down-arrow-black.svg';
import del from '../../resources/icons/x.svg';

interface Props {
    combatant: Monster | (Combatant & Monster);
    addTrait: (traitType: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair') => void;
    copyTrait: (trait: Trait) => void;
    removeTrait: (trait: Trait) => void;
    changeValue: (trait: Trait, field: string, value: any) => void;
    swapTraits: (t1: Trait, t2: Trait) => void;
}

interface State {
    selectedTraitID: string | null;
}

export default class TraitsPanel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedTraitID: null
        };
    }

    public static defaultProps = {
        addTrait: null,
        copyTrait: null,
        removeTrait: null,
        changeValue: null,
        swapTraits: null
    };

    private setSelectedTraitID(id: string | null) {
        this.setState({
            selectedTraitID: id
        });
    }

    private createTraitPanel(trait: Trait, prevTrait: Trait | null, nextTrait: Trait | null) {
        return (
            <TraitBarPanel
                key={trait.id}
                trait={trait}
                isSelected={trait.id === this.state.selectedTraitID}
                prevTrait={prevTrait}
                nextTrait={nextTrait}
                select={id => this.setSelectedTraitID(id)}
                removeTrait={action => this.props.removeTrait(action)}
                swapTraits={(t1, t2) => this.props.swapTraits(t1, t2)}
            />
        );
    }

    private createSection(traitsByType: { [id: string]: JSX.Element[] }, type: string) {
        const traits = traitsByType[type];
        if (traits.length === 0) {
            return null;
        }

        return (
            <div>
                <div className='section heading'>{Utils.traitType(type, true)}</div>
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
                    const prevTrait = n !== 0 ? traits[n - 1] : null;
                    const nextTrait = n !== traits.length - 1 ? traits[n + 1] : null;
                    list.push(this.createTraitPanel(trait, prevTrait, nextTrait));
                }

                traitsByType[type] = list;
            });

            const selectedTrait = this.props.combatant.traits.find(t => t.id === this.state.selectedTraitID);
            let selection = null;
            if (selectedTrait) {
                selection = (
                    <TraitPanel
                        trait={selectedTrait}
                        changeValue={(action, type, value) => this.props.changeValue(action, type, value)}
                    />
                );
            } else {
                selection = (
                    <Note>select one of the traits or actions from the column to the left to edit its details here</Note>
                );
            }

            return (
                <div className='row'>
                    <div className='columns small-6 medium-6 large-6'>
                        <Menu text='add a new...'>
                            <button key='trait' onClick={() => this.props.addTrait('trait')}>add a new trait</button>
                            <button key='action' onClick={() => this.props.addTrait('action')}>add a new action</button>
                            <button key='bonus' onClick={() => this.props.addTrait('bonus')}>add a new bonus action</button>
                            <button key='reaction' onClick={() => this.props.addTrait('reaction')}>add a new reaction</button>
                            <button key='legendary' onClick={() => this.props.addTrait('legendary')}>add a new legendary action</button>
                            <button key='lair' onClick={() => this.props.addTrait('lair')}>add a new lair action</button>
                        </Menu>
                        {this.createSection(traitsByType, 'trait')}
                        {this.createSection(traitsByType, 'action')}
                        {this.createSection(traitsByType, 'bonus')}
                        {this.createSection(traitsByType, 'reaction')}
                        {this.createSection(traitsByType, 'legendary')}
                        {this.createSection(traitsByType, 'lair')}
                    </div>
                    <div className='columns small-6 medium-6 large-6'>
                        {selection}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface TraitBarProps {
    trait: Trait;
    isSelected: boolean;
    prevTrait: Trait | null;
    nextTrait: Trait | null;
    select: (id: string) => void;
    removeTrait: (trait: Trait) => void;
    swapTraits: (t1: Trait, t2: Trait) => void;
}

class TraitBarPanel extends React.Component<TraitBarProps> {
    private moveUp(e: React.MouseEvent) {
        e.stopPropagation();
        this.props.swapTraits(this.props.trait, this.props.prevTrait as Trait);
    }

    private moveDown(e: React.MouseEvent) {
        e.stopPropagation();
        this.props.swapTraits(this.props.trait, this.props.nextTrait as Trait);
    }

    private delete(e: React.MouseEvent) {
        e.stopPropagation();
        this.props.removeTrait(this.props.trait);
    }

    public render() {
        try {
            return (
                <div className={this.props.isSelected ? 'trait-bar selected' : 'trait-bar'} onClick={() => this.props.select(this.props.trait.id)}>
                    <div className='text'>{this.props.trait.name || 'unnamed ' + Utils.traitType(this.props.trait.type, false)}</div>
                    <div className='icons'>
                        <img
                            className={this.props.prevTrait ? 'up' : 'up disabled'}
                            src={arrow}
                            alt='move up'
                            onClick={e => this.moveUp(e)}
                        />
                        <img
                            className={this.props.nextTrait ? 'down' : 'down disabled'}
                            src={arrow}
                            alt='move down'
                            onClick={e => this.moveDown(e)}
                        />
                        <img
                            className='delete'
                            src={del}
                            alt='delete'
                            onClick={e => this.delete(e)}
                        />
                    </div>
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
    changeValue: (trait: Trait, field: string, value: any) => void;
}

class TraitPanel extends React.Component<TraitPanelProps> {
    public render() {
        try {
            return (
                <div className='section'>
                    <div className='subheading'>trait name</div>
                    <input
                        type='text'
                        placeholder='name'
                        value={this.props.trait.name}
                        onChange={event => this.props.changeValue(this.props.trait, 'name', event.target.value)}
                    />
                    <div className='subheading'>usage</div>
                    <input
                        type='text'
                        placeholder='usage'
                        value={this.props.trait.usage}
                        onChange={event => this.props.changeValue(this.props.trait, 'usage', event.target.value)}
                    />
                    <div className='subheading'>details</div>
                    <textarea
                        placeholder='details'
                        value={this.props.trait.text}
                        onChange={event => this.props.changeValue(this.props.trait, 'text', event.target.value)}
                    />
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
