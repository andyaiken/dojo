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
    fog: { x: number, y: number }[];
    partyID: string | null;
    combatants: Combatant[];
    parties: Party[];
    startCombat: (partyID: string | null, map: Map, fog: { x: number, y: number }[]) => void;
}

interface State {
    map: Map;
    mapSize: number;
    playerMapSize: number;
    playerViewOpen: boolean;
    editFog: boolean;
    selectedCombatantIDs: string[];
    fog: { x: number, y: number }[];
    partyID: string | null;
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
            selectedCombatantIDs: [],
            fog: props.fog,
            partyID: props.partyID,
            combatants: props.combatants
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
            selectedCombatantIDs: []
        });
    }

    private setSelectedCombatantIDs(ids: string[]) {
        this.setState({
            editFog: false,
            selectedCombatantIDs: ids
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

        Utils.sort(combatants, [{ field: 'displayName', dir: 'asc' }]);

        this.setState({
            map: this.state.map,
            partyID: party ? party.id : null,
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

    private toggleItemSelection(id: string | null, ctrl: boolean) {
        if (id && ctrl) {
            const ids = this.state.selectedCombatantIDs;
            if (ids.includes(id)) {
                const index = ids.indexOf(id);
                ids.splice(index, 1);
            } else {
                ids.push(id);
            }
            this.setSelectedCombatantIDs(ids);
        } else {
            this.setSelectedCombatantIDs(id ? [id] : []);
        }
    }

    private mapMove(combatants: Combatant[], dir: string) {
        combatants.forEach(combatant => {
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
            }
        });

        this.setState({
            map: this.state.map
        });
    }

    private mapRemove(combatants: Combatant[]) {
        combatants.forEach(combatant => {
            const item = this.state.map.items.find(i => i.id === combatant.id);
            if (item) {
                const index = this.state.map.items.indexOf(item);
                this.state.map.items.splice(index, 1);
            }
        });

        this.setState({
            map: this.state.map,
            selectedCombatantIDs: []
        });
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
        const combatant = this.state.combatants.find(c => c.id === this.state.selectedCombatantIDs[0]);
        const mapItem = this.state.map.items.find(i => i.id === this.state.selectedCombatantIDs[0]);
        if (combatant && !mapItem) {

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
        const adding = (this.state.selectedCombatantIDs.length === 1) && !this.state.map.items.find(i => i.id === this.state.selectedCombatantIDs[0]);

        let viewport = null;
        if (playerView && (this.state.fog.length > 0)) {
            const dims = Mercator.mapDimensions(this.state.map);
            if (dims) {
                // Invert the fog
                const visible: { x: number, y: number }[] = [];
                for (let x = dims.minX; x <= dims.maxX; ++x) {
                    for (let y = dims.minY; y <= dims.maxY; ++y) {
                        if (!this.state.fog.find(f => (f.x === x) && (f.y === y))) {
                            visible.push({ x: x, y: y });
                        }
                    }
                }
                if (visible.length > 0) {
                    const xs = visible.map(f => f.x);
                    const ys = visible.map(f => f.y);
                    viewport = {
                        minX: Math.min(...xs),
                        maxX: Math.max(...xs),
                        minY: Math.min(...ys),
                        maxY: Math.max(...ys)
                    };
                }
            }
        }

        return (
            <MapPanel
                map={this.state.map}
                mode={playerView ? 'combat-player' : 'combat'}
                size={playerView ? this.state.playerMapSize : this.state.mapSize}
                viewport={viewport}
                combatants={this.state.combatants}
                showOverlay={adding}
                selectedItemIDs={this.state.selectedCombatantIDs}
                fog={this.state.fog}
                editFog={this.state.editFog && !playerView}
                gridSquareEntered={() => null}
                gridSquareClicked={(x, y) => this.gridSquareClicked(x, y, playerView)}
                itemSelected={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
            />
        );
    }

    public render() {
        try {
            let sidebar = null;

            const selection = this.state.combatants.filter(c => this.state.selectedCombatantIDs.includes(c.id));
            const items = this.state.map.items.filter(i => this.state.selectedCombatantIDs.includes(i.id));
            if ((selection.length > 0) && (items.length === selection.length)) {
                let altitudeAndAura = null;
                if (selection.length === 1) {
                    let auraDetails = null;
                    if (selection[0].aura.radius > 0) {
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
                                    selectedID={selection[0].aura.style}
                                    select={optionID => this.changeValue(selection[0].aura, 'style', optionID)}
                                />
                                <input
                                    type='color'
                                    value={selection[0].aura.color}
                                    onChange={event => this.changeValue(selection[0].aura, 'color', event.target.value)}
                                />
                            </div>
                        );
                    }

                    altitudeAndAura = (
                        <div>
                            <div className='divider' />
                            <NumberSpin
                                source={selection[0]}
                                name='altitude'
                                label='altitude'
                                display={value => value + ' ft.'}
                                nudgeValue={delta => this.nudgeValue(selection[0], 'altitude', delta * 5)}
                            />
                            <Expander text='aura'>
                                <NumberSpin
                                    source={selection[0].aura}
                                    name='radius'
                                    label='size'
                                    display={value => value + ' ft.'}
                                    nudgeValue={delta => this.nudgeValue(selection[0].aura, 'radius', delta * 5)}
                                />
                                {auraDetails}
                            </Expander>
                        </div>
                    );
                }

                sidebar = (
                    <div className='section'>
                        <div className='subheading'>{selection.length === 1 ? selection[0].displayName : 'multiple tokens'}</div>
                        <div className='section centered'>
                            <Radial click={dir => this.mapMove(selection, dir)} />
                        </div>
                        {altitudeAndAura}
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
                            if (this.state.selectedCombatantIDs.includes(pc.id)) {
                                note = (
                                    <Note>
                                        click on the map to place this person
                                    </Note>
                                );
                            }
                            return (
                                <div key={pc.id} className='group-panel clickable'>
                                    <div onClick={() => this.setSelectedCombatantIDs([pc.id])}>{pc.displayName}</div>
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

                let playerMapSection = null;
                if (this.state.playerViewOpen) {
                    playerMapSection = (
                        <NumberSpin
                            source={this.state}
                            name={'playerMapSize'}
                            display={() => 'zoom'}
                            nudgeValue={delta => this.nudgePlayerMapSize(delta * 3)}
                        />
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
                            <button onClick={() => this.props.startCombat(this.state.partyID, this.state.map, this.state.fog)}>start encounter</button>
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
                            {playerMapSection}
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
