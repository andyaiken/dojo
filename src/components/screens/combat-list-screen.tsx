import React from 'react';

import { Combat } from '../../models/combat';

import GridPanel from '../panels/grid-panel';
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
            const listItems = this.props.combats.map(c => (
                <ListItem
                    key={c.id}
                    combat={c}
                    setSelection={combat => this.props.resumeCombat(combat)}
                />
            ));

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable sidebar'>
                        <Note>
                            <div className='section'>
                                here you can run a combat encounter by specifying a party and an encounter, and optionally a tactical map
                            </div>
                            <div className='divider' />
                            <div className='section'>on the right you will see a list of combats that you have paused</div>
                            <div className='section'>you can resume a paused combat by selecting it</div>
                            <div className='divider' />
                            <div className='section'>to start a combat encounter, press the <b>start a new combat</b> button</div>
                        </Note>
                        <button onClick={() => this.props.createCombat()}>start a new combat</button>
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <GridPanel heading='combats' content={listItems} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
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
                <div className='column'>
                    <div className='card combat'>
                        <div className='heading'>
                            <div className='title'>
                                {this.props.combat.name || 'unnamed combat'}
                            </div>
                        </div>
                        <div className='card-content'>
                            <div className='grid'>
                                <div className='section'>paused at {this.props.combat.timestamp}</div>
                                {map}
                            </div>
                            <div className='divider'/>
                            <button onClick={() => this.props.setSelection(this.props.combat)}>resume</button>
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
