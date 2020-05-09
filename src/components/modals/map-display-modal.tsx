import { Col, Row } from 'antd';
import React from 'react';

import Factory from '../../utils/factory';
import Mercator from '../../utils/mercator';
import Napoleon from '../../utils/napoleon';
import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Map } from '../../models/map';
import { Party } from '../../models/party';

import Checkbox from '../controls/checkbox';
import Dropdown from '../controls/dropdown';
import Expander from '../controls/expander';
import NumberSpin from '../controls/number-spin';
import Radial from '../controls/radial';
import Selector from '../controls/selector';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';
import Popout from '../panels/popout';

interface Props {
    map: Map;
    parties: Party[];
}

interface State {
    map: Map;
    mapSize: number;
    playerMapSize: number;
    playerViewOpen: boolean;
    editFog: boolean;
    selectedCombatantID: string | null;
    fog: { x: number, y: number }[];
    combatants: Combatant[];
}

export default class MapDisplayModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            map: props.map,
            mapSize: 50,
            playerMapSize: 50,
            playerViewOpen: false,
            editFog: false,
            selectedCombatantID: null,
            fog: [],
            combatants: []
        };
    }

    private nudgeMapSize(value: number) {
        this.setState({
            mapSize: Math.max(this.state.mapSize + value, 3)
        });
    }

    private nudgePlayerMapSize(value: number) {
        this.setState({
            playerMapSize: Math.max(this.state.playerMapSize + value, 3)
        });
    }

    private setPlayerViewOpen(open: boolean) {
        this.setState({
            playerViewOpen: open
        });
    }

    private toggleEditFog() {
        this.setState({
            editFog: !this.state.editFog,
            selectedCombatantID: null
        });
    }

    private setSelectedCombatantID(id: string | null) {
        this.setState({
            editFog: false,
            selectedCombatantID: id
        });
    }

    private toggleFog(x: number, y: number) {
        const index = this.state.fog.findIndex(i => (i.x === x) && (i.y === y));
        if (index === -1) {
            this.state.fog.push({ x: x, y: y });
        } else {
            this.state.fog.splice(index, 1);
        }
        this.setState({
            fog: this.state.fog
        });
    }

    private rotateMap() {
        Mercator.rotateMap(this.state.map);
        this.setState({
            map: this.state.map
        });
    }

    private setParty(party: Party | null) {
        // Get rid of all PC / companion tokens
        const map = this.state.map;
        map.items = map.items.filter(i => (i.type !== 'pc') && (i.type !== 'companion'));

        const combatants: Combatant[] = [];
        if (party) {
            party.pcs.forEach(pc => {
                combatants.push(Napoleon.convertPCToCombatant(pc));
                pc.companions.forEach(comp => {
                    combatants.push(Napoleon.convertCompanionToCombatant(comp));
                });
            });
        }

        this.setState({
            map: this.state.map,
            combatants: combatants
        });
    }

    private fillFog() {
        const fog: { x: number, y: number }[] = [];
        const dims = Mercator.mapDimensions(this.state.map);
        if (dims) {
            for (let x = dims.minX; x <= dims.maxX; ++x) {
                for (let y = dims.minY; y <= dims.maxY; ++y) {
                    fog.push({ x: x, y: y });
                }
            }
            this.setState({
                fog: fog
            });
        }
    }

    private clearFog() {
        this.setState({
            fog: []
        });
    }

    private mapMove(combatant: Combatant, dir: string) {
        const item = this.state.map.items.find(i => i.id === combatant.id);
        if (item) {
            switch (dir) {
                case 'N':
                    item.y -= 1;
                    break;
                case 'NE':
                    item.x += 1;
                    item.y -= 1;
                    break;
                case 'E':
                    item.x += 1;
                    break;
                case 'SE':
                    item.x += 1;
                    item.y += 1;
                    break;
                case 'S':
                    item.y += 1;
                    break;
                case 'SW':
                    item.x -= 1;
                    item.y += 1;
                    break;
                case 'W':
                    item.x -= 1;
                    break;
                case 'NW':
                    item.x -= 1;
                    item.y -= 1;
                    break;
                default:
                    // Do nothing
                    break;
            }

            this.setState({
                map: this.state.map
            });
        }
    }

    private mapRemove(combatant: Combatant) {
        const item = this.state.map.items.find(i => i.id === combatant.id);
        if (item) {
            const index = this.state.map.items.indexOf(item);
            this.state.map.items.splice(index, 1);

            this.setState({
                map: this.state.map,
                selectedCombatantID: null
            });
        }
    }

    private changeValue(source: any, field: string, value: any) {
        source[field] = value;
        this.setState({
            map: this.state.map
        });
    }

    private nudgeValue(source: any, field: string, delta: number) {
        let value = source[field] + delta;
        if (field === 'radius') {
            value = Math.max(value, 0);
        }
        this.changeValue(source, field, value);
    }

    private gridSquareClicked(x: number, y: number, playerView: boolean) {
        const combatant = this.state.combatants.find(c => c.id === this.state.selectedCombatantID);
        if (combatant) {

            const item = Factory.createMapItem();
            item.id = combatant.id;
            item.type = combatant.type as 'pc' | 'companion';
            item.x = x;
            item.y = y;

            const size = Utils.miniSize(combatant.displaySize);
            item.height = size;
            item.width = size;

            this.state.map.items.push(item);

            this.setState({
                map: this.state.map
            });
        }

        if (this.state.editFog && !playerView) {
            this.toggleFog(x, y);
        }
    }

    private getPlayerView() {
        if (this.state.playerViewOpen) {
            return (
                <Popout title='Map' closeWindow={() => this.setPlayerViewOpen(false)}>
                    <div className='scrollable both-ways'>
                        {this.getMap(true)}
                    </div>
                </Popout>
            );
        }

        return null;
    }

    private getMap(playerView: boolean) {
        return (
            <MapPanel
                map={this.state.map}
                mode={playerView ? 'combat-player' : 'combat'}
                size={playerView ? this.state.playerMapSize : this.state.mapSize}
                combatants={this.state.combatants}
                showOverlay={!!this.state.selectedCombatantID && !this.state.map.items.find(i => i.id === this.state.selectedCombatantID)}
                selectedItemIDs={this.state.selectedCombatantID ? [this.state.selectedCombatantID] : []}
                fog={this.state.fog}
                editFog={this.state.editFog && !playerView}
                gridSquareEntered={() => null}
                gridSquareClicked={(x, y) => this.gridSquareClicked(x, y, playerView)}
                itemSelected={item => this.setSelectedCombatantID(item)}
            />
        );
    }

    public render() {
        try {
            let sidebar = null;
            const selection = this.state.combatants.find(c => c.id === this.state.selectedCombatantID);
            const item = this.state.map.items.find(i => i.id === this.state.selectedCombatantID);
            if (selection && item) {
                let auraDetails = null;
                if (selection.aura.radius > 0) {
                    const auraStyleOptions = [
                        {
                            id: 'square',
                            text: 'square'
                        },
                        {
                            id: 'rounded',
                            text: 'rounded'
                        },
                        {
                            id: 'circle',
                            text: 'circle'
                        }
                    ];
                    auraDetails = (
                        <div>
                            <Selector
                                options={auraStyleOptions}
                                selectedID={selection.aura.style}
                                select={optionID => this.changeValue(selection.aura, 'style', optionID)}
                            />
                            <input
                                type='color'
                                value={selection.aura.color}
                                onChange={event => this.changeValue(selection.aura, 'color', event.target.value)}
                            />
                        </div>
                    );
                }

                sidebar = (
                    <div className='section'>
                        <div className='subheading'>{selection.displayName}</div>
                        <div className='section centered'>
                            <Radial
                                direction='eight'
                                click={dir => this.mapMove(selection, dir)}
                            />
                        </div>
                        <div className='divider' />
                        <NumberSpin
                            source={selection}
                            name='altitude'
                            label='altitude'
                            display={value => value + ' ft.'}
                            nudgeValue={delta => this.nudgeValue(selection, 'altitude', delta * 5)}
                        />
                        <Expander text='aura'>
                            <NumberSpin
                                source={selection.aura}
                                name='radius'
                                label='size'
                                display={value => value + ' ft.'}
                                nudgeValue={delta => this.nudgeValue(selection.aura, 'radius', delta * 5)}
                            />
                            {auraDetails}
                        </Expander>
                        <div className='divider' />
                        <button onClick={() => this.mapRemove(selection)}>remove from map</button>
                    </div>
                );
            } else {
                let pcSection = null;
                if (this.state.combatants.length) {
                    const pcs = this.state.combatants
                        .filter(pc => !this.state.map.items.find(i => i.id === pc.id))
                        .map(pc => {
                            let note = null;
                            if (this.state.selectedCombatantID === pc.id) {
                                note = (
                                    <Note>
                                        click on the map to place this person
                                    </Note>
                                );
                            }
                            return (
                                <div key={pc.id} className='group-panel clickable'>
                                    <div onClick={() => this.setSelectedCombatantID(pc.id)}>{pc.displayName}</div>
                                    {note}
                                </div>
                            );
                        });
                    pcSection = (
                        <div>
                            {pcs}
                            <button onClick={() => this.setParty(null)}>choose a different party</button>
                        </div>
                    );
                } else {
                    pcSection = (
                        <Dropdown
                            options={this.props.parties.map(p => ({ id: p.id, text: p.name }))}
                            placeholder='select a party'
                            select={id => this.setParty(this.props.parties.find(p => p.id === id) ?? null)}
                        />
                    );
                }

                let fogSection = null;
                if (this.state.editFog) {
                    fogSection = (
                        <div>
                            <Note>you can now click on map squares to turn fog of war on and off</Note>
                            <button onClick={() => this.fillFog()}>
                                fill fog of war
                            </button>
                            <button className={this.state.fog.length === 0 ? 'disabled' : ''} onClick={() => this.clearFog()}>
                                clear fog of war
                            </button>
                        </div>
                    );
                }

                sidebar = (
                    <div>
                        <div className='section'>
                            <div className='subheading'>options</div>
                            <NumberSpin
                                source={this.state}
                                name={'mapSize'}
                                display={() => 'zoom'}
                                nudgeValue={delta => this.nudgeMapSize(delta * 3)}
                            />
                            <button onClick={() => this.rotateMap()}>rotate map</button>
                        </div>
                        <div className='divider' />
                        <div className='section'>
                            <div className='subheading'>fog of war</div>
                            <Checkbox label='edit fog of war' checked={this.state.editFog} changeValue={() => this.toggleEditFog()} />
                            {fogSection}
                        </div>
                        <div className='divider' />
                        <div className='section'>
                            <div className='subheading'>pcs</div>
                            {pcSection}
                        </div>
                        <div className='divider' />
                        <div className='section'>
                            <div className='subheading'>player view</div>
                            <Checkbox
                                label='show player view'
                                checked={this.state.playerViewOpen}
                                changeValue={value => this.setPlayerViewOpen(value)}
                            />
                            <NumberSpin
                                source={this.state}
                                name={'playerMapSize'}
                                display={() => 'zoom'}
                                nudgeValue={delta => this.nudgePlayerMapSize(delta * 3)}
                            />
                        </div>
                    </div>
                );
            }

            return (
                <Row className='full-height'>
                    <Col span={6} className='scrollable sidebar sidebar-left'>
                        {sidebar}
                    </Col>
                    <Col span={18} className='scrollable both-ways'>
                        {this.getMap(false)}
                    </Col>
                    {this.getPlayerView()}
                </Row>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
