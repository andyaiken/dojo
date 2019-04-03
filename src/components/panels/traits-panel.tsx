import React from 'react';
import Showdown from 'showdown';

import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Monster, Trait } from '../../models/monster-group';

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
}

export default class TraitsPanel extends React.Component<Props> {
    public static defaultProps = {
        mode: 'view',
        addTrait: null,
        copyTrait: null,
        removeTrait: null,
        changeValue: null
    };

    public render() {
        try {
            const traits = [];
            const actions = [];
            const legendaryActions = [];
            const lairActions = [];
            const regionalEffects = [];

            for (let n = 0; n !== this.props.combatant.traits.length; ++n) {
                const a = this.props.combatant.traits[n];

                const item = (
                    <TraitPanel
                        key={a.id}
                        trait={a}
                        mode={this.props.mode}
                        changeValue={(action, type, value) => this.props.changeValue(action, type, value)}
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
    mode: 'view' | 'edit' | 'template' | 'combat';
    changeValue: (trait: Trait, field: string, value: any) => void;
    copyTrait: (trait: Trait) => void;
    removeTrait: (trait: Trait) => void;
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
