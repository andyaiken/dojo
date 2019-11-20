import React from 'react';

import { Col, Icon, Row } from 'antd';
import { List } from 'react-movable';

import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Monster, Trait, TRAIT_TYPES } from '../../models/monster-group';

import Dropdown from '../controls/dropdown';
import Textbox from '../controls/textbox';
import Note from './note';

interface Props {
    combatant: Monster | (Combatant & Monster);
    addTrait: (traitType: 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair') => void;
    copyTrait: (trait: Trait) => void;
    moveTrait: (oldIndex: number, newIndex: number) => void;
    removeTrait: (trait: Trait) => void;
    changeValue: (trait: Trait, field: string, value: any) => void;
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

    private createTraitBar(trait: Trait) {
        return (
            <TraitBarPanel
                key={trait.id}
                trait={trait}
                isSelected={trait.id === this.state.selectedTraitID}
                select={id => this.setSelectedTraitID(id)}
            />
        );
    }

    private createSection(traitsByType: { [id: string]: Trait[] }, type: string) {
        const traits = traitsByType[type];
        if (traits.length === 0) {
            return null;
        }

        return (
            <div>
                <div className='section heading'>{Utils.traitType(type, true)}</div>
                <List
                    values={traits}
                    lockVertically={true}
                    onChange={({ oldIndex, newIndex }) => this.props.moveTrait(oldIndex, newIndex)}
                    renderList={({ children, props }) => <div {...props}>{children}</div>}
                    renderItem={({ value, props, isDragged }) => (
                        <div {...props} className={isDragged ? 'dragged' : ''}>
                            {this.createTraitBar(value)}
                        </div>
                    )}
                />
            </div>
        );
    }

    public render() {
        try {
            const options: { id: string, text: string }[] = [];
            const traitsByType: { [id: string]: Trait[] } = {};

            TRAIT_TYPES.forEach(type => {
                options.push({ id: type, text: Utils.traitType(type, false) });
                traitsByType[type] = this.props.combatant.traits.filter(t => t.type === type);
            });

            const selectedTrait = this.props.combatant.traits.find(t => t.id === this.state.selectedTraitID);
            let selection = null;
            if (selectedTrait) {
                selection = (
                    <TraitPanel
                        trait={selectedTrait}
                        removeTrait={trait => this.props.removeTrait(trait)}
                        changeValue={(trait, type, value) => this.props.changeValue(trait, type, value)}
                    />
                );
            } else {
                selection = (
                    <Note>select one of the traits or actions from the column to the left to edit its details here</Note>
                );
            }

            return (
                <Row gutter={10}>
                    <Col span={12}>
                        <Dropdown
                            options={options}
                            placeholder='add a new...'
                            select={id => this.props.addTrait(id as 'trait' | 'action' | 'bonus' | 'reaction' | 'legendary' | 'lair')}
                        />
                        {this.createSection(traitsByType, 'trait')}
                        {this.createSection(traitsByType, 'action')}
                        {this.createSection(traitsByType, 'bonus')}
                        {this.createSection(traitsByType, 'reaction')}
                        {this.createSection(traitsByType, 'legendary')}
                        {this.createSection(traitsByType, 'lair')}
                    </Col>
                    <Col span={12}>
                        {selection}
                    </Col>
                </Row>
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
    select: (id: string) => void;
}

class TraitBarPanel extends React.Component<TraitBarProps> {
    public render() {
        try {
            return (
                <div className={this.props.isSelected ? 'trait-bar selected' : 'trait-bar'} onClick={() => this.props.select(this.props.trait.id)}>
                    <Icon type='menu' className='grabber small' data-movable-handle={true} />
                    <div className='name'>
                        {this.props.trait.name || 'unnamed ' + Utils.traitType(this.props.trait.type, false)}
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
    removeTrait: (trait: Trait) => void;
    changeValue: (trait: Trait, field: string, value: any) => void;
}

class TraitPanel extends React.Component<TraitPanelProps> {
    public render() {
        try {
            return (
                <div className='section'>
                    <div className='subheading'>trait name</div>
                    <Textbox
                        text={this.props.trait.name}
                        onChange={value => this.props.changeValue(this.props.trait, 'name', value)}
                    />
                    <div className='subheading'>usage</div>
                    <Textbox
                        text={this.props.trait.usage}
                        onChange={value => this.props.changeValue(this.props.trait, 'usage', value)}
                    />
                    <div className='subheading'>details</div>
                    <Textbox
                        text={this.props.trait.text}
                        placeholder='details'
                        lines={5}
                        onChange={value => this.props.changeValue(this.props.trait, 'text', value)}
                    />
                    <div className='divider' />
                    <button onClick={() => this.props.removeTrait(this.props.trait)}>remove this trait</button>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
