import { CloseCircleOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import Showdown from 'showdown';

import Factory from '../../utils/factory';
import Mercator from '../../utils/mercator';
import Napoleon from '../../utils/napoleon';
import Utils from '../../utils/utils';

import { Combat, Combatant, Notification } from '../../models/combat';
import { Condition, ConditionDurationSaves } from '../../models/condition';
import { Encounter } from '../../models/encounter';
import { MapItem } from '../../models/map';
import { Monster, Trait } from '../../models/monster-group';
import { Companion, Party, PC } from '../../models/party';

import MapItemCard from '../cards/map-item-card';
import MonsterCard from '../cards/monster-card';
import PCCard from '../cards/pc-card';
import Checkbox from '../controls/checkbox';
import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';
import NumberSpin from '../controls/number-spin';
import Radial from '../controls/radial';
import Selector from '../controls/selector';
import CombatControlsPanel from '../panels/combat-controls-panel';
import GridPanel from '../panels/grid-panel';
import InitiativeEntry from '../panels/initiative-entry';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';
import Popout from '../panels/popout';
import TraitsPanel from '../panels/traits-panel';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
    combat: Combat;
    parties: Party[];
    encounters: Encounter[];
    pauseCombat: () => void;
    endCombat: () => void;
    closeNotification: (notification: Notification, removeCondition: boolean) => void;
    mapAdd: (combatant: Combatant, x: number, y: number) => void;
    makeCurrent: (combatant: Combatant) => void;
    makeActive: (combatants: Combatant[]) => void;
    makeDefeated: (combatants: Combatant[]) => void;
    useTrait: (combatant: Combatant & Monster, trait: Trait) => void;
    rechargeTrait: (combatant: Combatant & Monster, trait: Trait) => void;
    removeCombatants: (combatants: Combatant[]) => void;
    addCombatants: () => void;
    addCompanion: (companion: Companion | null) => void;
    addPC: (partyID: string, pcID: string) => void;
    addWave: () => void;
    addCondition: (combatants: Combatant[]) => void;
    editCondition: (combatant: Combatant, condition: Condition) => void;
    removeCondition: (combatant: Combatant, condition: Condition) => void;
    mapMove: (ids: string[], dir: string) => void;
    mapResize: (id: string, dir: string, dir2: 'out' | 'in') => void;
    mapRemove: (ids: string[]) => void;
    mapAddNote: (id: string) => void;
    mapRemoveNote: (id: string) => void;
    endTurn: (combatant: Combatant) => void;
    changeHP: (values: {id: string, hp: number, temp: number, damage: number}[]) => void;
    changeValue: (source: {}, type: string, value: any) => void;
    nudgeValue: (source: {}, type: string, delta: number) => void;
    toggleTag: (combatants: Combatant[], tag: string) => void;
    toggleCondition: (combatants: Combatant[], condition: string) => void;
    toggleHidden: (combatants: Combatant[]) => void;
    scatterCombatants: (type: 'pc' | 'monster') => void;
    rotateMap: () => void;
    addOverlay: (overlay: MapItem) => void;
    showLeaderboard: () => void;
}

interface State {
    rightPanel: string;
    showDefeatedCombatants: boolean;
    selectedItemIDs: string[];
    addingToMapID: string | null;
    addingOverlay: boolean;
    mapSize: number;
    playerView: {
        open: boolean;
        showControls: boolean;
        mapSize: number;
    };
}

export default class CombatScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            rightPanel: 'selection',
            showDefeatedCombatants: false,
            selectedItemIDs: [],            // The IDs of the combatants or map items that are selected
            addingToMapID: null,            // The ID of the combatant we're adding to the map
            addingOverlay: false,           // True if we're adding a custom overlay to the map
            mapSize: 30,
            playerView: {
                open: false,
                showControls: false,
                mapSize: 30
            }
        };
    }

    public componentDidMount() {
        window.addEventListener('beforeunload', () => {
            this.setPlayerViewOpen(false);
        });
    }

    private setRightPanel(panel: string) {
        this.setState({
            rightPanel: panel
        });
    }

    private toggleShowDefeatedCombatants() {
        this.setState({
            showDefeatedCombatants: !this.state.showDefeatedCombatants
        });
    }

    private setSelectedItemIDs(ids: string[]) {
        // Switch to selection view if we're selecting an item
        const rightPanel = ids.length > 0 ? 'selection' : this.state.rightPanel;
        this.setState({
            selectedItemIDs: ids,
            rightPanel: rightPanel
        });
    }

    private toggleItemSelection(id: string | null, ctrl: boolean) {
        if (id && ctrl) {
            const ids = this.state.selectedItemIDs;
            if (ids.includes(id)) {
                const index = ids.indexOf(id);
                ids.splice(index, 1);
            } else {
                ids.push(id);
            }
            this.setSelectedItemIDs(ids);
        } else {
            this.setSelectedItemIDs(id ? [id] : []);
        }
    }

    private setAddingToMapID(id: string | null) {
        this.setState({
            addingToMapID: id,
            addingOverlay: false
        });
    }

    private toggleAddingOverlay() {
        this.setState({
            addingOverlay: !this.state.addingOverlay,
            addingToMapID: null
        });
    }

    private nudgeMapSize(value: number) {
        this.setState({
            mapSize: Math.max(this.state.mapSize + value, 3)
        });
    }

    private setPlayerViewOpen(show: boolean) {
        const pv = this.state.playerView;
        pv.open = show;
        this.setState({
            playerView: pv
        });
    }

    private setPlayerViewShowControls(show: boolean) {
        const pv = this.state.playerView;
        pv.showControls = show;
        this.setState({
            playerView: pv
        });
    }

    private nudgePlayerViewMapSize(value: number) {
        const pv = this.state.playerView;
        pv.mapSize = Math.max(pv.mapSize + value, 3);
        this.setState({
            playerView: pv
        });
    }

    private nextTurn() {
        const current = this.props.combat.combatants.find(c => c.current);
        if (current) {
            this.props.endTurn(current);
        } else {
            const first = this.props.combat.combatants
                .filter(c => {
                    if (c.type === 'placeholder') {
                        return Napoleon.combatHasLairActions(this.props.combat);
                    }

                    return true;
                })
                .find(c => c.active);
            if (first) {
                this.props.makeCurrent(first);
            }
        }
    }

    private defeatCombatants(combatants: Combatant[]) {
        // Deselect any of these combatants who are currently selected...
        const ids = combatants.map(c => c.id);
        this.setState({
            selectedItemIDs: this.state.selectedItemIDs.filter(id => !ids.includes(id))
        }, () => {
            // ... then mark them as defeated
            this.props.makeDefeated(combatants);
        });
    }

    private removeCombatants(combatants: Combatant[]) {
        // Deselect any of these combatants who are currently selected...
        const ids = combatants.map(c => c.id);
        this.setState({
            selectedItemIDs: this.state.selectedItemIDs.filter(id => !ids.includes(id))
        }, () => {
            // ... then remove them
            this.props.removeCombatants(combatants);
        });
    }

    private gridSquareClicked(x: number, y: number) {
        if (this.state.addingToMapID) {
            const combatant = this.props.combat.combatants.find(c => c.id === this.state.addingToMapID);
            if (combatant) {
                this.props.mapAdd(combatant, x, y);
            }

            this.setAddingToMapID(null);
        }

        if (this.state.addingOverlay) {
            const overlay = Factory.createMapItem();
            overlay.type = 'overlay';
            overlay.x = x;
            overlay.y = y;
            overlay.width = 1;
            overlay.height = 1;
            overlay.color = '#005080';
            overlay.opacity = 127;
            overlay.style = 'square';

            this.props.addOverlay(overlay);
            this.setState({
                rightPanel: 'selection',
                addingOverlay: false,
                addingToMapID: null,
                selectedItemIDs: [overlay.id]
            });
        }
    }

    //#region Rendering helper methods

    private getPlayerView(combat: Combat) {
        if (!this.state.playerView.open) {
            return null;
        }

        const initList = combat.combatants
            .filter(c => (c.type === 'pc') || c.showOnMap)
            .filter(c => !c.pending && c.active && !c.defeated)
            .filter(c => {
                if (c.type === 'placeholder') {
                    return Napoleon.combatHasLairActions(this.props.combat);
                }

                return true;
            })
            .map(c => this.createCombatantRow(c, true));

        if (combat.map) {
            let controls = null;
            if (combat.map && this.state.playerView.showControls) {
                let selection = combat.combatants
                    .filter(c => combat.map !== null ? combat.map.items.find(item => item.id === c.id) : false)
                    .filter(c => c.showOnMap)
                    .filter(c => this.state.selectedItemIDs.includes(c.id));
                if (selection.length === 0) {
                    selection = combat.combatants
                        .filter(c => combat.map !== null ? combat.map.items.find(item => item.id === c.id) : false)
                        .filter(c => c.showOnMap)
                        .filter(c => c.current);
                }

                if (selection.length === 1) {
                    const token = selection[0] as ((Combatant & PC) | (Combatant & Monster));
                    controls = (
                        <div>
                            <div className='heading lowercase'>{token.displayName}</div>
                            <div className='section centered'>
                                <Radial
                                    direction='eight'
                                    click={dir => this.props.mapMove([token.id], dir)}
                                />
                            </div>
                            <div className='divider' />
                            <NumberSpin
                                key='altitude'
                                source={token}
                                name='altitude'
                                label='altitude'
                                display={value => value + ' ft.'}
                                nudgeValue={delta => this.props.nudgeValue(token, 'altitude', delta * 5)}
                            />
                            <Row gutter={10}>
                                <Col span={8}>
                                    <Checkbox
                                        label='conc.'
                                        display='button'
                                        checked={token.tags.includes('conc')}
                                        changeValue={value => this.props.toggleTag([token], 'conc')}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Checkbox
                                        label='bane'
                                        display='button'
                                        checked={token.tags.includes('bane')}
                                        changeValue={value => this.props.toggleTag([token], 'bane')}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Checkbox
                                        label='bless'
                                        display='button'
                                        checked={token.tags.includes('bless')}
                                        changeValue={value => this.props.toggleTag([token], 'bless')}
                                    />
                                </Col>
                            </Row>
                            <Row gutter={10}>
                                <Col span={8}>
                                    <Checkbox
                                        label='prone'
                                        display='button'
                                        checked={token.conditions.some(c => c.name === 'prone')}
                                        changeValue={value => this.props.toggleCondition([token], 'prone')}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Checkbox
                                        label='uncon.'
                                        display='button'
                                        checked={token.conditions.some(c => c.name === 'unconscious')}
                                        changeValue={value => this.props.toggleCondition([token], 'unconscious')}
                                    />
                                </Col>
                                <Col span={8}>
                                    <Checkbox
                                        label='hidden'
                                        display='button'
                                        checked={!token.showOnMap}
                                        changeValue={value => this.props.changeValue([token], 'showOnMap', !value)}
                                    />
                                </Col>
                            </Row>
                        </div>
                    );
                }

                if (selection.length > 1) {
                    controls = (
                        <Note>
                            <div className='section'>multiple items selected</div>
                        </Note>
                    );
                }
            }

            return (
                <Popout title='Encounter' closeWindow={() => this.setPlayerViewOpen(false)}>
                    <Row>
                        <Col xs={24} sm={24} md={12} lg={16} xl={18} className='scrollable both-ways'>
                            <MapPanel
                                key='map'
                                map={combat.map}
                                mode='combat-player'
                                size={this.state.playerView.mapSize}
                                combatants={combat.combatants}
                                selectedItemIDs={this.state.selectedItemIDs}
                                itemSelected={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
                            />
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={8} xl={6} className='scrollable'>
                            {controls}
                            <div className='heading fixed-top'>initiative order</div>
                            {initList}
                        </Col>
                    </Row>
                </Popout>
            );
        } else {
            return (
                <Popout title='Encounter' closeWindow={() => this.setPlayerViewOpen(false)}>
                    <div className='scrollable'>
                        <div className='heading'>initiative order</div>
                        {initList}
                    </div>
                </Popout>
            );
        }
    }

    private getTools() {
        let wavesAvailable = false;
        wavesAvailable = !!this.props.combat.encounter && (this.props.combat.encounter.waves.length > 0);

        const parties: Party[] = [];
        this.props.combat.combatants.filter(c => c.type === 'pc').forEach(pc => {
            const party = this.props.parties.find(p => p.pcs.find(item => item.id === pc.id));
            if (party && !parties.includes(party)) {
                parties.push(party);
            }
        });
        const pcOptions: JSX.Element[] = [];
        parties.forEach(party => {
            party.pcs.forEach(pc => {
                if (!this.props.combat.combatants.find(c => c.id === pc.id)) {
                    pcOptions.push(
                        <button key={pc.id} onClick={() => this.props.addPC(party.id, pc.id)}>{pc.name} ({party.name})</button>
                    );
                }
            });
        });

        return (
            <div>
                <div className='subheading'>encounter</div>
                <button onClick={() => this.props.pauseCombat()}>pause combat</button>
                <ConfirmButton text='end combat' callback={() => this.props.endCombat()} />
                <button onClick={() => this.props.showLeaderboard()}>leaderboard</button>
                <div className='subheading'>combatants</div>
                <Checkbox
                    label='show defeated combatants'
                    checked={this.state.showDefeatedCombatants}
                    changeValue={() => this.toggleShowDefeatedCombatants()}
                />
                <button onClick={() => this.props.addCombatants()}>add combatants</button>
                {pcOptions.length > 0 ? <Expander text='add pcs'>{pcOptions}</Expander> : null}
                <button onClick={() => this.props.addWave()} style={{ display: wavesAvailable ? 'block' : 'none' }}>add wave</button>
                <button onClick={() => this.props.addCompanion(null)}>add a companion</button>
                <div style={{ display: this.props.combat.map ? 'block' : 'none' }}>
                    <div className='subheading'>map</div>
                    <button onClick={() => this.props.scatterCombatants('monster')}>scatter monsters</button>
                    <button onClick={() => this.props.scatterCombatants('pc')}>scatter pcs</button>
                    <Checkbox
                        label={this.state.addingOverlay ? 'click on the map to add the item, or click here to cancel' : 'add token / overlay'}
                        display='button'
                        checked={this.state.addingOverlay}
                        changeValue={() => this.toggleAddingOverlay()}
                    />
                    <NumberSpin
                        source={this.state}
                        name={'mapSize'}
                        display={() => 'zoom'}
                        nudgeValue={delta => this.nudgeMapSize(delta * 3)}
                    />
                </div>
                <div className='subheading'>player view</div>
                <Checkbox
                    label='show player view'
                    checked={this.state.playerView.open}
                    changeValue={value => this.setPlayerViewOpen(value)}
                />
                <div style={{ display: this.props.combat.map ? 'block' : 'none' }}>
                    <Checkbox
                        label='show map controls'
                        checked={this.state.playerView.showControls}
                        changeValue={value => this.setPlayerViewShowControls(value)}
                    />
                </div>
                <div style={{ display: (this.props.combat.map && this.state.playerView.open) ? 'block' : 'none' }}>
                    <NumberSpin
                        source={this.state.playerView}
                        name={'mapSize'}
                        display={() => 'zoom'}
                        nudgeValue={delta => this.nudgePlayerViewMapSize(delta * 3)}
                    />
                </div>
            </div>
        );
    }

    private getSelectedCombatant() {
        // Find which combatants we've selected, ignoring the current initiative holder
        const combatants = this.state.selectedItemIDs
            .map(id => this.props.combat.combatants.find(c => c.id === id))
            .filter(c => !!c && !c.current) as Combatant[];
        Utils.sort(combatants, [{ field: 'displayName', dir: 'asc' }]);

        // Have we selected any placeholders?
        // If we have, just show the info for the first one
        const selectedPlaceholders = combatants.filter(c => c.type === 'placeholder');
        if (selectedPlaceholders.length > 0) {
            return (
                <div>
                    {this.createCard(selectedPlaceholders[0])}
                </div>
            );
        }

        // Have we selected a single combatant?
        if (combatants.length === 1) {
            return (
                <div>
                    {this.createControls(combatants)}
                    {this.createCard(combatants[0])}
                </div>
            );
        }

        // Have we selected multiple combatants?
        if (combatants.length > 1) {
            return (
                <div>
                    {this.createControls(combatants)}
                    <Note>
                        <div className='section'>multiple combatants are selected:</div>
                        {combatants.map(c => (
                            <div key={c.id} className='multiple-combatant-row'>
                                {c.displayName}
                                <CloseCircleOutlined
                                    style={{ float: 'right', padding: '2px 0', fontSize: '14px' }}
                                    onClick={() => this.toggleItemSelection(c.id, true)}
                                />
                            </div>
                        ))}
                    </Note>
                </div>
            );
        }

        // Have we selected a map item?
        if (this.props.combat.map) {
            const mapItem = this.props.combat.map.items.find(i => i.id === this.state.selectedItemIDs[0]);
            if (mapItem) {
                return (
                    <MapItemCard
                        item={mapItem}
                        note={Mercator.getNote(this.props.combat.map, mapItem)}
                        move={(item, dir) => this.props.mapMove([item.id], dir)}
                        resize={(item, dir, dir2) => this.props.mapResize(item.id, dir, dir2)}
                        remove={item => this.props.mapRemove([item.id])}
                        addNote={itemID => this.props.mapAddNote(itemID)}
                        removeNote={itemID => this.props.mapRemoveNote(itemID)}
                        changeValue={(source, field, value) => this.props.changeValue(source, field, value)}
                        nudgeValue={(source, field, delta) => this.props.nudgeValue(source, field, delta)}
                    />
                );
            }
        }

        return (
            <Note key='selected'>
                <div className='section'>
                    select a pc or monster from the <b>initiative order</b> list to see its details here
                </div>
            </Note>
        );
    }

    private createCombatantRow(combatant: Combatant, playerView: boolean) {
        let selected = this.state.selectedItemIDs.includes(combatant.id);
        // If we're in player view, and there's no map, don't show selection
        if (playerView && !this.props.combat.map) {
            selected = false;
        }

        return (
            <InitiativeEntry
                key={combatant.id}
                combatant={combatant as Combatant}
                combat={this.props.combat}
                selected={selected}
                minimal={playerView}
                select={(c, ctrl) => this.toggleItemSelection(c.id, ctrl)}
                addToMap={c => this.setAddingToMapID(this.state.addingToMapID ? null : c.id)}
                nudgeValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
                makeActive={c => this.props.makeActive([c])}
            />
        );
    }

    private createControls(selectedCombatants: Combatant[]) {
        if (selectedCombatants.some(c => c.type === 'placeholder')) {
            return null;
        }

        return (
            <CombatControlsPanel
                combatants={selectedCombatants}
                combat={this.props.combat}
                makeCurrent={combatant => this.props.makeCurrent(combatant)}
                makeActive={combatants => this.props.makeActive(combatants)}
                makeDefeated={combatants => this.defeatCombatants(combatants)}
                removeCombatants={combatants => this.removeCombatants(combatants)}
                changeHP={values => this.props.changeHP(values)}
                addCondition={combatants => this.props.addCondition(combatants)}
                editCondition={(combatant, condition) => this.props.editCondition(combatant, condition)}
                removeCondition={(combatant, condition) => this.props.removeCondition(combatant, condition)}
                nudgeConditionValue={(combatant, type, delta) => this.props.nudgeValue(combatant, type, delta)}
                mapAdd={combatant => this.setAddingToMapID(this.state.addingToMapID ? null : combatant.id)}
                mapMove={(combatants, dir) => this.props.mapMove(combatants.map(c => c.id), dir)}
                mapRemove={combatants => this.props.mapRemove(combatants.map(c => c.id))}
                toggleTag={(combatants, tag) => this.props.toggleTag(combatants, tag)}
                toggleCondition={(combatants, condition) => this.props.toggleCondition(combatants, condition)}
                toggleHidden={combatants => this.props.toggleHidden(combatants)}
                addCompanion={companion => this.props.addCompanion(companion)}
                changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
                nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
            />
        );
    }

    private createCard(combatant: Combatant) {
        switch (combatant.type) {
            case 'pc':
                return (
                    <PCCard
                        pc={combatant as Combatant & PC}
                        mode={'combat'}
                        changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
                        nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
                    />
                );
            case 'monster':
                return (
                    <MonsterCard
                        monster={combatant as Combatant & Monster}
                        mode={'combat'}
                        useTrait={trait => this.props.useTrait(combatant as Combatant & Monster, trait)}
                        rechargeTrait={trait => this.props.rechargeTrait(combatant as Combatant & Monster, trait)}
                    />
                );
            case 'companion':
                return null;
            case 'placeholder':
                const lair: JSX.Element[] = [];
                this.props.combat.combatants.forEach(c => {
                    const monster = c as (Combatant & Monster);
                    if (monster && monster.traits && monster.traits.some(t => t.type === 'lair')) {
                        lair.push(
                            <div className='card monster' key={'lair ' + monster.id}>
                                <div className='heading'>
                                    <div className='title'>{monster.name}</div>
                                </div>
                                <div className='card-content'>
                                    <TraitsPanel
                                        combatant={monster}
                                        mode='lair'
                                        useTrait={trait => this.props.useTrait(monster, trait)}
                                        rechargeTrait={trait => this.props.rechargeTrait(monster, trait)}
                                    />
                                </div>
                            </div>
                        );
                    }
                });
                return lair;
        }

        return null;
    }

    //#endregion

    public render() {
        try {
            let current: JSX.Element | null = null;
            const pending: JSX.Element[] = [];
            const active: Combatant[] = [];

            this.props.combat.combatants.forEach(combatant => {
                if (combatant.pending) {
                    pending.push(
                        <InitiativeEntry
                            key={combatant.id}
                            combatant={combatant}
                            combat={this.props.combat}
                            selected={this.state.selectedItemIDs.includes(combatant.id)}
                            minimal={false}
                            select={(c, ctrl) => this.toggleItemSelection(c.id, ctrl)}
                            addToMap={c => this.setAddingToMapID(this.state.addingToMapID ? null : c.id)}
                            nudgeValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
                            makeActive={c => this.props.makeActive([c])}
                        />
                    );
                } else {
                    if (combatant.current) {
                        current = (
                            <div>
                                {this.createControls([combatant])}
                                {this.createCard(combatant)}
                            </div>
                        );
                    }
                    if (combatant.active || (combatant.defeated && this.state.showDefeatedCombatants)) {
                        active.push(combatant);
                    }
                }
            });

            if (pending.length !== 0) {
                pending.unshift(
                    <Note key='pending-help'>
                        <div className='section'>these combatants are not yet part of the encounter</div>
                        <div className='section'>set initiative on each of them, then add them to the encounter</div>
                    </Note>
                );
            }

            const initList = active
                .filter(c => {
                    if (c.type === 'placeholder') {
                        return Napoleon.combatHasLairActions(this.props.combat);
                    }

                    return true;
                })
                .map(c => this.createCombatantRow(c, false));

            if (!current) {
                initList.unshift(
                    /* tslint:disable:max-line-length */
                    <Note key='init-help'>
                        <div className='section'>these are the combatants taking part in this encounter; you can select them to see their stat blocks (on the right)</div>
                        <div className='section'>they are listed in initiative order (with the highest initiative score at the top of the list, and the lowest at the bottom)</div>
                        <div className='section'>when you're ready to begin the encounter, press the <b>start combat</b> button at the top left</div>
                    </Note>
                    /* tslint:enable:max-line-length */
                );

                current = (
                    <Note>
                        <div className='section'>the current initiative holder will be displayed here</div>
                    </Note>
                );
            }

            let notificationSection = null;
            if (this.props.combat.notifications.length > 0) {
                notificationSection = (
                    <div className='notifications'>
                        {this.props.combat.notifications.map(n => (
                            <NotificationPanel
                                key={n.id}
                                notification={n}
                                close={(notification, removeCondition) => this.props.closeNotification(notification, removeCondition)}
                            />
                        ))}
                    </div>
                );
            }

            let mapSection = null;
            if (this.props.combat.map) {
                mapSection = (
                    <MapPanel
                        key='map'
                        map={this.props.combat.map}
                        mode='combat'
                        size={this.state.mapSize}
                        showOverlay={(this.state.addingToMapID !== null) || this.state.addingOverlay}
                        combatants={this.props.combat.combatants}
                        selectedItemIDs={this.state.selectedItemIDs}
                        itemSelected={(id, ctrl) => this.toggleItemSelection(id, ctrl)}
                        gridSquareEntered={(x, y) => null}
                        gridSquareClicked={(x, y) => this.gridSquareClicked(x, y)}
                    />
                );
            }

            const legendary: JSX.Element[] = [];
            this.props.combat.combatants
                .filter(c => !c.pending && c.active && !c.defeated)
                .forEach(c => {
                    const monster = c as (Combatant & Monster);
                    if (monster && monster.traits && monster.traits.some(t => t.type === 'legendary') && !monster.current) {
                        legendary.push(
                            <div className='card monster' key={'leg ' + monster.id}>
                                <div className='heading'>
                                    <div className='title'>{monster.name}</div>
                                </div>
                                <div className='card-content'>
                                    <TraitsPanel
                                        combatant={monster}
                                        mode='legendary'
                                        useTrait={trait => this.props.useTrait(monster, trait)}
                                        rechargeTrait={trait => this.props.rechargeTrait(monster, trait)}
                                    />
                                </div>
                            </div>
                        );
                    }
                });

            const rightPanelOptions = ['selection', 'tools'].map(option => {
                return { id: option, text: option };
            });

            let rightHeading = null;
            let rightContent = null;
            switch (this.state.rightPanel) {
                case 'selection':
                    rightHeading = 'selected combatant';
                    rightContent = this.getSelectedCombatant();
                    break;
                case 'tools':
                    rightHeading = 'tools';
                    rightContent = this.getTools();
                    break;
            }

            return (
                <div className='full-height'>
                    <Row className='combat-top-row'>
                        <Col span={8} style={{ padding: '0 10px' }}>
                            <button onClick={() => this.nextTurn()}>
                                {this.props.combat.combatants.find(c => c.current) ? 'next turn' : 'start combat'}
                            </button>
                        </Col>
                        <Col span={4}>
                            <div className='statistic'>
                                round {this.props.combat.round}
                            </div>
                        </Col>
                        <Col span={4}>
                            <div className='statistic'>
                                {Napoleon.getCombatXP(this.props.combat)} xp
                            </div>
                        </Col>
                        <Col span={8} style={{ padding: '0 10px' }}>
                            <Selector
                                options={rightPanelOptions}
                                selectedID={this.state.rightPanel}
                                select={option => this.setRightPanel(option)}
                            />
                        </Col>
                    </Row>
                    <Row className='combat-main'>
                        <Col span={8} className='scrollable'>
                            <div className='heading fixed-top'>initiative holder</div>
                            {current}
                        </Col>
                        <Col span={8} className='scrollable'>
                            {notificationSection}
                            <GridPanel
                                heading='waiting for intiative'
                                content={pending}
                                columns={1}
                                showToggle={true}
                            />
                            <GridPanel
                                heading={'legendary actions'}
                                content={legendary}
                                columns={1}
                                showToggle={true}
                            />
                            <GridPanel
                                heading='encounter map'
                                content={[mapSection]}
                                columns={1}
                                showToggle={true}
                            />
                            <GridPanel
                                heading='initiative order'
                                content={initList}
                                columns={1}
                                showToggle={true}
                            />
                        </Col>
                        <Col span={8} className='scrollable'>
                            <div className='heading fixed-top'>{rightHeading}</div>
                            {rightContent}
                        </Col>
                    </Row>
                    {this.getPlayerView(this.props.combat)}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface NotificationProps {
    notification: Notification;
    close: (notification: Notification, removeCondition: boolean) => void;
}

class NotificationPanel extends React.Component<NotificationProps> {
    private success() {
        switch (this.props.notification.type) {
            case 'condition-save':
            case 'condition-end':
                const condition = this.props.notification.data as Condition;
                if (condition.duration) {
                    // Reduce save by 1
                    if ((condition.duration.type === 'saves') || (condition.duration.type === 'rounds')) {
                        condition.duration.count -= 1;
                        if (condition.duration.count === 0) {
                            // Remove the condition
                            this.close(true);
                        } else {
                            this.close();
                        }
                    }
                }
                break;
            case 'trait-recharge':
                // Mark trait as recharged
                const trait = this.props.notification.data as Trait;
                trait.uses = 0;
                this.close();
                break;
        }
    }

    private close(removeCondition = false) {
        this.props.close(this.props.notification, removeCondition);
    }

    public render() {
        try {
            const combatant = this.props.notification.combatant as (Combatant & Monster);
            const condition = this.props.notification.data as Condition;
            const trait = this.props.notification.data as Trait;

            const name = combatant.displayName || combatant.name || 'unnamed monster';
            switch (this.props.notification.type) {
                case 'condition-save':
                    const duration = condition.duration as ConditionDurationSaves;
                    let saveType = duration.saveType.toString();
                    if (saveType !== 'death') {
                        saveType = saveType.toUpperCase();
                    }
                    return (
                        <div key={this.props.notification.id} className='descriptive'>
                            <div className='text'>
                                {name} must make a {saveType} save against dc {duration.saveDC}
                            </div>
                            <Row gutter={10}>
                                <Col span={12}>
                                    <button key='success' onClick={() => this.success()}>success</button>
                                </Col>
                                <Col span={12}>
                                    <button key='close' onClick={() => this.close()}>close</button>
                                </Col>
                            </Row>
                        </div>
                    );
                case 'condition-end':
                    return (
                        <div key={this.props.notification.id} className='descriptive'>
                            <div className='text'>
                                {name} is no longer affected by condition {condition.name}
                            </div>
                            <button onClick={() => this.close()}>close</button>
                        </div>
                    );
                case 'trait-recharge':
                    return (
                        <div key={this.props.notification.id} className='descriptive'>
                            <div className='text'>
                                {name} can attempt to recharge {trait.name} ({trait.usage})
                            </div>
                            <Row gutter={10}>
                                <Col span={12}>
                                    <button key='recharge' onClick={() => this.success()}>recharge</button>
                                </Col>
                                <Col span={12}>
                                    <button key='close' onClick={() => this.close()}>close</button>
                                </Col>
                            </Row>
                        </div>
                    );
                default:
                    return null;
            }
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
