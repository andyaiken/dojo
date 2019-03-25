import React from 'react';

import Utils from '../../utils/utils';

import { Monster, Trait } from '../../models/monster-group';

import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';

interface Props {
    combatant: Monster;
    mode: 'view' | 'edit' | 'template';
    addTrait: (traitType: 'trait' | 'action' | 'legendary' | 'lair' | 'regional') => void;
    copyTrait: (trait: Trait) => void;
    removeTrait: (trait: Trait) => void;
    changeTrait: (trait: Trait, field: 'name' | 'usage' | 'text', value: string) => void;
}

export default class TraitsPanel extends React.Component<Props> {
    public static defaultProps = {
        mode: 'view',
        addTrait: null,
        copyTrait: null,
        removeTrait: null,
        changeTrait: null
    };

    public render() {
        try {
            const traits = [];
            const actions = [];
            const legendaryActions = [];
            const lairActions = [];
            const regionalEffects = [];

            for (var n = 0; n !== this.props.combatant.traits.length; ++n) {
                const a = this.props.combatant.traits[n];
                const item = (
                    <TraitPanel
                        key={a.id}
                        trait={a}
                        mode={this.props.mode}
                        changeTrait={(action, type, value) => this.props.changeTrait(action, type, value)}
                        removeTrait={action => this.props.removeTrait(action)}
                        copyTrait={action => this.props.copyTrait(action)}
                    />
                );

                switch (a.type) {
                    case 'trait':
                        traits.push(item);
                        break;
                    case 'action':
                        actions.push(item);
                        break;
                    case 'legendary':
                        legendaryActions.push(item);
                        break;
                    case 'lair':
                        lairActions.push(item);
                        break;
                    case 'regional':
                        regionalEffects.push(item);
                        break;
                    default:
                        // Do nothing
                        break;
                }
            }

            if (this.props.mode === 'edit') {
                traits.push(
                    <button key='add' onClick={() => this.props.addTrait('trait')}>add a new trait</button>
                );
                actions.push(
                    <button key='add' onClick={() => this.props.addTrait('action')}>add a new action</button>
                );
                legendaryActions.push(
                    <button key='add' onClick={() => this.props.addTrait('legendary')}>add a new legendary action</button>
                );
                lairActions.push(
                    <button key='add' onClick={() => this.props.addTrait('lair')}>add a new lair action</button>
                );
                regionalEffects.push(
                    <button key='add' onClick={() => this.props.addTrait('regional')}>add a new regional effect</button>
                );

                return (
                    <div className='row collapse'>
                        <div className='columns small-4 medium-4 large-4 list-column'>
                            <div className='section subheading'>traits</div>
                            {traits}
                        </div>
                        <div className='columns small-4 medium-4 large-4 list-column'>
                            <div className='section subheading'>actions</div>
                            {actions}
                        </div>
                        <div className='columns small-4 medium-4 large-4 list-column'>
                            <div className='section subheading'>legendary actions</div>
                            {legendaryActions}
                            <div className='section subheading'>lair actions</div>
                            {lairActions}
                            <div className='section subheading'>regional effects</div>
                            {regionalEffects}
                        </div>
                    </div>
                );
            }

            return (
                <div>
                    <div style={{ display: traits.length > 0 ? '' : 'none' }}>
                        <div className='section subheading'>traits</div>
                        {traits}
                    </div>
                    <div style={{ display: actions.length > 0 ? '' : 'none' }}>
                        <div className='section subheading'>actions</div>
                        {actions}
                    </div>
                    <div style={{ display: legendaryActions.length > 0 ? '' : 'none' }}>
                        <div className='section subheading'>legendary actions</div>
                        {legendaryActions}
                    </div>
                    <div style={{ display: lairActions.length > 0 ? '' : 'none' }}>
                        <div className='section subheading'>lair actions</div>
                        {lairActions}
                    </div>
                    <div style={{ display: regionalEffects.length > 0 ? '' : 'none' }}>
                        <div className='section subheading'>regional effects</div>
                        {regionalEffects}
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
    mode: 'view' | 'edit' | 'template';
    changeTrait: (trait: Trait, field: 'name' | 'usage' | 'text', value: string) => void;
    copyTrait: (trait: Trait) => void;
    removeTrait: (trait: Trait) => void;
}

class TraitPanel extends React.Component<TraitPanelProps> {
    public render() {
        try {
            var heading = this.props.trait.name || 'unnamed ' + Utils.traitType(this.props.trait.type);
            if (this.props.trait.usage) {
                heading += ' (' + this.props.trait.usage + ')';
            }

            switch (this.props.mode) {
                case 'view':
                    return (
                        <div key={this.props.trait.id} className='section trait'>
                            <b>{heading}</b> {this.props.trait.text}
                        </div>
                    );
                case 'edit':
                    const details = (
                        <div className='section'>
                            <input type='text' placeholder='name' value={this.props.trait.name} onChange={event => this.props.changeTrait(this.props.trait, 'name', event.target.value)} />
                            <input type='text' placeholder='usage' value={this.props.trait.usage} onChange={event => this.props.changeTrait(this.props.trait, 'usage', event.target.value)} />
                            <textarea placeholder='details' value={this.props.trait.text} onChange={event => this.props.changeTrait(this.props.trait, 'text', event.target.value)} />
                            <div className='divider' />
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
                            <b>{heading}</b> {this.props.trait.text}
                            <button onClick={() => this.props.copyTrait(this.props.trait)}>copy</button>
                        </div>
                    );
            }
        } catch (e) {
            console.error(e);
        }
    }
}
