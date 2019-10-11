import React from 'react';

import { Combat } from '../../models/combat';

import MapPanel from '../panels/map-panel';
import Note from '../panels/note';

interface Props {
    combats: Combat[];
    createCombat: () => void;
    resumeCombat: (combat: Combat) => void;
}

export default class CombatListScreen extends React.Component<Props> {
    public render() {
        try {
            const listItems = this.props.combats.map(c => {
                return (
                    <ListItem
                        key={c.id}
                        combat={c}
                        setSelection={combat => this.props.resumeCombat(combat)}
                    />
                );
            });
            if (listItems.length === 0) {
                listItems.push(
                    <Note
                        key='empty'
                        content={'you have no in-progress encounters'}
                    />
                );
            }

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                        <button onClick={() => this.props.createCombat()}>start a new combat</button>
                        <div className='divider' />
                        {listItems}
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <div className='vertical-center-outer'>
                            <div className='vertical-center-middle'>
                                <div className='vertical-center-inner'>
                                    <HelpCard combats={this.props.combats} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface HelpCardProps {
    combats: Combat[];
}

class HelpCard extends React.Component<HelpCardProps> {
    public render() {
        try {
            let action: JSX.Element | null = null;
            if (this.props.combats.length === 0) {
                action = (
                    <div className='section'>to start a combat encounter, press the <b>start a new combat</b> button</div>
                );
            } else {
                action = (
                    <div>
                        <div className='section'>on the left you will see a list of encounters that you have paused</div>
                        <div className='section'>you can resume a paused combat by selecting it</div>
                    </div>
                );
            }

            return (
                <Note
                    content={
                        <div>
                            <div className='section'>here you can run a combat encounter by specifying a party and an encounter, and optionally a map</div>
                            <div className='divider' />
                            {action}
                        </div>
                    }
                />
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

interface ListItemProps {
    combat: Combat;
    setSelection: (combat: Combat) => void;
}

class ListItem extends React.Component<ListItemProps> {
    public render() {
        try {
            let map = null;
            if (this.props.combat.map) {
                map = (
                    <MapPanel
                        map={this.props.combat.map}
                        mode='thumbnail'
                        size={10}
                        combatants={this.props.combat.combatants}
                    />
                );
            }

            return (
                <div className='list-item' onClick={() => this.props.setSelection(this.props.combat)}>
                    <div className='heading'>{this.props.combat.name || 'unnamed combat'}</div>
                    <div className='section'>paused at {this.props.combat.timestamp}</div>
                    {map}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
