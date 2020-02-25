import React from 'react';

import { Col, Icon, Row, Slider } from 'antd';
import { List } from 'react-movable';
import Showdown from 'showdown';

import Factory from '../../utils/factory';
import Mercator from '../../utils/mercator';
import Napoleon from '../../utils/napoleon';
import Utils from '../../utils/utils';

import { Combat, Combatant, Notification } from '../../models/combat';
import { Condition, ConditionDurationSaves } from '../../models/condition';
import { Encounter } from '../../models/encounter';
import { MapItem, MapNote } from '../../models/map';
import { Monster, Trait } from '../../models/monster-group';
import { Companion, Party, PC } from '../../models/party';

import MonsterCard from '../cards/monster-card';
import PCCard from '../cards/pc-card';
import Checkbox from '../controls/checkbox';
import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';
import NumberSpin from '../controls/number-spin';
import Radial from '../controls/radial';
import Selector from '../controls/selector';
import Textbox from '../controls/textbox';
import ConditionsPanel from '../panels/conditions-panel';
import GridPanel from '../panels/grid-panel';
import HitPointGauge from '../panels/hit-point-gauge';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';
import Popout from '../panels/popout';
import PortraitPanel from '../panels/portrait-panel';
import TraitsPanel from '../panels/traits-panel';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
    combat: Combat;
    parties: Party[];
    encounters: Encounter[];
    maximized: boolean;
    maximize: () => void;
    pauseCombat: () => void;
    endCombat: () => void;
    closeNotification: (notification: Notification, removeCondition: boolean) => void;
    mapAdd: (combatant: Combatant, x: number, y: number) => void;
    makeCurrent: (combatant: Combatant) => void;
    makeActive: (combatants: Combatant[]) => void;
    makeDefeated: (combatants: Combatant[]) => void;
    moveCombatant: (oldIndex: number, newIndex: number) => void;
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
            const first = this.props.combat.combatants.find(c => c.active);
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

        const init = combat.combatants
            .filter(c => (c.type === 'pc') || c.showOnMap)
            .filter(combatant => !combatant.pending && combatant.active && !combatant.defeated);

        const initList = (
            <List
                values={init}
                lockVertically={true}
                onChange={({ oldIndex, newIndex }) => this.props.moveCombatant(oldIndex, newIndex)}
                renderList={({ children, props }) => <div {...props}>{children}</div>}
                renderItem={({ value, props, isDragged }) => (
                    <div {...props} className={isDragged ? 'dragged' : ''}>
                        {this.createCombatantRow(value, true)}
                    </div>
                )}
            />
        );
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
                                <Icon
                                    type='close-circle'
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

    private createPendingRow(combatant: Combatant) {
        return (
            <PendingCombatantRow
                key={combatant.id}
                combatant={combatant}
                select={(c, ctrl) => this.toggleItemSelection(c.id, ctrl)}
                selected={this.state.selectedItemIDs.includes(combatant.id)}
                nudgeValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
                makeActive={c => this.props.makeActive([c])}
            />
        );
    }

    private createCombatantRow(combatant: Combatant, playerView: boolean) {
        let selected = this.state.selectedItemIDs.includes(combatant.id);
        // If we're in player view, and there's no map, don't show selection
        if (playerView && !this.props.combat.map) {
            selected = false;
        }

        switch (combatant.type) {
            case 'pc':
                return (
                    <PCRow
                        key={combatant.id}
                        combatant={combatant as Combatant & PC}
                        combat={this.props.combat as Combat}
                        selected={selected}
                        minimal={playerView}
                        select={(c, ctrl) => this.toggleItemSelection(c.id, ctrl)}
                        addToMap={c => this.setAddingToMapID(this.state.addingToMapID ? null : c.id)}
                    />
                );
            case 'monster':
                return (
                    <MonsterRow
                        key={combatant.id}
                        combatant={combatant as Combatant & Monster}
                        combat={this.props.combat as Combat}
                        selected={selected}
                        minimal={playerView}
                        select={(c, ctrl) => this.toggleItemSelection(c.id, ctrl)}
                        addToMap={c => this.setAddingToMapID(this.state.addingToMapID ? null : c.id)}
                    />
                );
            case 'companion':
                return (
                    <CompanionRow
                        key={combatant.id}
                        combatant={combatant as Combatant & PC}
                        combat={this.props.combat as Combat}
                        selected={selected}
                        minimal={playerView}
                        select={(c, ctrl) => this.toggleItemSelection(c.id, ctrl)}
                        addToMap={c => this.setAddingToMapID(this.state.addingToMapID ? null : c.id)}
                    />
                );
        }

        return null;
    }

    private createControls(selectdCombatants: Combatant[]) {
        return (
            <CombatControlsPanel
                combatants={selectdCombatants}
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
                        changeValue={(c, type, value) => this.props.changeValue(c, type, value)}
                        nudgeValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
                    />
                );
            case 'companion':
                return null;
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
                    pending.push(this.createPendingRow(combatant));
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

            let initHelp = null;
            if (!current) {
                initHelp = (
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

            const initList = (
                <List
                    key='init-list'
                    values={active}
                    lockVertically={true}
                    onChange={({ oldIndex, newIndex }) => this.props.moveCombatant(oldIndex, newIndex)}
                    renderList={({ children, props }) => <div {...props}>{children}</div>}
                    renderItem={({ value, props, isDragged }) => (
                        <div {...props} className={isDragged ? 'dragged' : ''}>
                            {this.createCombatantRow(value, false)}
                        </div>
                    )}
                />
            );

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

            const special: JSX.Element[] = [];
            this.props.combat.combatants.forEach(c => {
                const monster = c as (Combatant & Monster);
                const legendary = monster && monster.traits && monster.traits.some(t => t.type === 'legendary') && !monster.current;
                const lair = monster && monster.traits && monster.traits.some(t => t.type === 'lair');
                if (legendary || lair) {
                    special.push(
                        <div className='card monster' key={monster.id}>
                            <div className='heading'><div className='title'>{monster.name}</div></div>
                            <div className='card-content'>
                                <TraitsPanel
                                    combatant={monster}
                                    mode='combat-special'
                                    changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
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
                        <Col span={3}>
                            <div className='statistic'>
                                round {this.props.combat.round}
                            </div>
                        </Col>
                        <Col span={2} className='section centered'>
                            <Icon
                                type={this.props.maximized ? 'fullscreen-exit' : 'fullscreen'}
                                className='maximize-button'
                                onClick={() => this.props.maximize()}
                            />
                        </Col>
                        <Col span={3}>
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
                                heading={'don\'t forget'}
                                content={special}
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
                                content={[initHelp, initList]}
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

//#region Helper classes

//#region Notification

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

//#endregion

//#region PendingCombatant

interface PendingCombatantRowProps {
    combatant: Combatant;
    selected: boolean;
    select: (combatant: Combatant, ctrl: boolean) => void;
    nudgeValue: (combatant: Combatant, field: string, delta: number) => void;
    makeActive: (combatant: Combatant) => void;
}

class PendingCombatantRow extends React.Component<PendingCombatantRowProps> {
    private getInformationText() {
        if (this.props.selected) {
            return 'selected';
        }

        return null;
    }

    private onClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (this.props.select) {
            this.props.select(this.props.combatant, e.ctrlKey);
        }
    }

    public render() {
        try {
            let style = 'combatant-row ' + this.props.combatant.type;
            if (this.props.combatant.current || this.props.selected) {
                style += ' highlight';
            }

            const c = this.props.combatant as (Combatant & PC) | (Combatant & Monster);

            return (
                <div className={style} onClick={e => this.onClick(e)}>
                    <div className='header'>
                        <PortraitPanel source={c} inline={true} />
                        <div className='name'>
                            {c.displayName || c.name || 'combatant'}
                        </div>
                        <span className='info'>{this.getInformationText()}</span>
                    </div>
                    <div className='content'>
                        <NumberSpin
                            source={this.props.combatant}
                            name='initiative'
                            label='initiative'
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, 'initiative', delta)}
                        />
                        <button onClick={e => { e.stopPropagation(); this.props.makeActive(this.props.combatant); }}>add to encounter</button>
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

//#endregion

//#region PCRow

interface PCRowProps {
    combatant: Combatant & PC;
    minimal: boolean;
    combat: Combat;
    selected: boolean;
    select: (combatant: Combatant & PC, ctrl: boolean) => void;
    addToMap: (combatant: Combatant & PC) => void;
}

class PCRow extends React.Component<PCRowProps> {
    public static defaultProps = {
        minimal: false
    };

    private getInformationText() {
        if (this.props.combatant.current) {
            return 'current turn';
        }

        if (this.props.selected) {
            return 'selected';
        }

        return null;
    }

    private onClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (this.props.select) {
            this.props.select(this.props.combatant, e.ctrlKey);
        }
    }

    public render() {
        try {
            let style = 'combatant-row ' + this.props.combatant.type;
            if (this.props.combatant.current) {
                style += ' current';
            }
            if (this.props.selected) {
                style += ' highlight';
            }
            if (this.props.combatant.defeated) {
                style += ' defeated';
            }

            let grabber = <Icon type='menu' className='grabber small' data-movable-handle={true} />;
            if (this.props.combatant.portrait) {
                grabber = <PortraitPanel source={this.props.combatant} inline={true} grabber={true} />;
            }

            let desc = null;
            if (!this.props.minimal) {
                const race = this.props.combatant.race || 'unknown race';
                const cls = this.props.combatant.classes || 'unknown class';
                desc = (
                    <div className='section lowercase'>
                        {race + ' ' + cls + ', level ' + this.props.combatant.level}
                    </div>
                );
            }

            const notes = [];
            if (this.props.combat.map) {
                if (!this.props.combatant.pending && !this.props.combat.map.items.find(i => i.id === this.props.combatant.id)) {
                    notes.push(
                        <Note key='not-on-map' white={true}>
                            <span>not on the map</span>
                            <Icon
                                type='environment'
                                className='icon-button'
                                onClick={() => this.props.addToMap(this.props.combatant)}
                            />
                        </Note>
                    );
                }
                if (!this.props.combatant.showOnMap) {
                    notes.push(
                        <Note key='hidden' white={true}>hidden</Note>
                    );
                }
            }
            this.props.combatant.tags.forEach(tag => {
                notes.push(
                    <Note key={tag} white={true}>
                        <div className='condition'>
                            <div className='condition-name'>{Utils.getTagTitle(tag)}</div>
                            {Utils.getTagDescription(tag)}
                        </div>
                    </Note>
                );
            });
            if (this.props.combatant.conditions) {
                this.props.combatant.conditions.forEach(c => {
                    let name = c.name;
                    if (c.name === 'exhaustion') {
                        name += ' (' + c.level + ')';
                    }
                    if (c.duration) {
                        name += ' ' + Utils.conditionDurationText(c, this.props.combat);
                    }
                    const description = [];
                    const text = Utils.conditionText(c);
                    for (let n = 0; n !== text.length; ++n) {
                        description.push(<div key={n} className='condition-text'>{text[n]}</div>);
                    }
                    notes.push(
                        <Note key={c.id} white={true}>
                            <div className='condition'>
                                <div className='condition-name'>{name}</div>
                                {description}
                            </div>
                        </Note>
                    );
                });
            }
            if (this.props.combatant.note) {
                notes.push(
                    <Note key='text' white={true}>
                        <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.props.combatant.note) }} />
                    </Note>
                );
            }

            return (
                <div className={style} onClick={e => this.onClick(e)}>
                    <div className='header'>
                        {grabber}
                        <div className='name'>
                            {this.props.combatant.displayName || this.props.combatant.name || 'combatant'}
                            {this.props.combatant.player ? ' / ' + this.props.combatant.player : ''}
                        </div>
                        <span className='info'>{this.getInformationText()}</span>
                    </div>
                    <div className='content'>
                        {desc}
                        {notes}
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

//#endregion

//#region MonsterRow

interface MonsterRowProps {
    combatant: Combatant & Monster;
    minimal: boolean;
    combat: Combat;
    selected: boolean;
    select: (combatant: Combatant & Monster, ctrl: boolean) => void;
    addToMap: (combatant: Combatant & Monster) => void;
}

class MonsterRow extends React.Component<MonsterRowProps> {
    public static defaultProps = {
        minimal: false
    };

    private getInformationText() {
        if (this.props.combatant.current) {
            return 'current turn';
        }

        if (this.props.selected) {
            return 'selected';
        }

        return null;
    }

    private onClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (this.props.select) {
            this.props.select(this.props.combatant, e.ctrlKey);
        }
    }

    public render() {
        try {
            let style = 'combatant-row ' + this.props.combatant.type;
            if (this.props.combatant.current) {
                style += ' current';
            }
            if (this.props.selected) {
                style += ' highlight';
            }
            if (this.props.combatant.defeated) {
                style += ' defeated';
            }

            let grabber = <Icon type='menu' className='grabber small' data-movable-handle={true} />;
            if (this.props.combatant.portrait) {
                grabber = <PortraitPanel source={this.props.combatant} inline={true} grabber={true} />;
            }

            let hp = (this.props.combatant.hp ? this.props.combatant.hp : 0).toString();
            if ((this.props.combatant.hpTemp ?? 0) > 0) {
                hp += '+' + this.props.combatant.hpTemp;
            }

            let gauge = null;
            if (!this.props.combatant.pending) {
                gauge = (
                    <HitPointGauge combatant={this.props.combatant} />
                );
            }

            const notes = [];
            if (this.props.combat.map) {
                if (!this.props.combatant.pending && !this.props.combat.map.items.find(i => i.id === this.props.combatant.id)) {
                    notes.push(
                        <Note key='not-on-map' white={true}>
                            <span>not on the map</span>
                            <Icon
                                type='environment'
                                className='icon-button'
                                onClick={() => this.props.addToMap(this.props.combatant)}
                            />
                        </Note>
                    );
                }
                if (!this.props.combatant.showOnMap) {
                    notes.push(
                        <Note key='hidden' white={true}>hidden</Note>
                    );
                }
            }
            this.props.combatant.tags.forEach(tag => {
                notes.push(
                    <Note key={tag} white={true}>
                        <div className='condition'>
                            <div className='condition-name'>{Utils.getTagTitle(tag)}</div>
                            {Utils.getTagDescription(tag)}
                        </div>
                    </Note>
                );
            });
            if (this.props.combatant.conditions) {
                this.props.combatant.conditions.forEach(c => {
                    let name = c.name;
                    if (c.name === 'exhaustion') {
                        name += ' (' + c.level + ')';
                    }
                    if (c.duration) {
                        name += ' ' + Utils.conditionDurationText(c, this.props.combat);
                    }
                    const description = [];
                    const text = Utils.conditionText(c);
                    for (let n = 0; n !== text.length; ++n) {
                        description.push(<div key={n} className='condition-text'>{text[n]}</div>);
                    }
                    notes.push(
                        <Note key={c.id} white={true}>
                            <div className='condition'>
                                <div className='condition-name'>{name}</div>
                                {description}
                            </div>
                        </Note>
                    );
                });
            }
            if (this.props.combatant.note) {
                notes.push(
                    <Note key='text' white={true}>
                        <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.props.combatant.note) }} />
                    </Note>
                );
            }

            let dmInfo = null;
            if (!this.props.minimal) {
                dmInfo = (
                    <div>
                        <div className='section key-stats'>
                            <div className='key-stat'>
                                <div className='stat-label'>ac</div>
                                <div className='stat-value'>{this.props.combatant.ac}</div>
                            </div>
                            <div className='key-stat'>
                                <div className='stat-value'>{hp}</div>
                                <div className='stat-label'>hp</div>
                            </div>
                        </div>
                        {gauge}
                    </div>
                );
            }

            return (
                <div className={style} onClick={e => this.onClick(e)}>
                    <div className='header'>
                        {grabber}
                        <div className='name'>
                            {this.props.combatant.displayName || this.props.combatant.name || 'combatant'}
                        </div>
                        <span className='info'>{this.getInformationText()}</span>
                    </div>
                    <div className='content'>
                        {dmInfo}
                        {notes}
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

//#endregion

//#region CompanionRow

interface CompanionRowProps {
    combatant: Combatant;
    minimal: boolean;
    combat: Combat;
    selected: boolean;
    select: (combatant: Combatant, ctrl: boolean) => void;
    addToMap: (combatant: Combatant) => void;
}

class CompanionRow extends React.Component<CompanionRowProps> {
    public static defaultProps = {
        minimal: false
    };

    private getInformationText() {
        if (this.props.combatant.current) {
            return 'current turn';
        }

        if (this.props.selected) {
            return 'selected';
        }

        return null;
    }

    private onClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (this.props.select) {
            this.props.select(this.props.combatant, e.ctrlKey);
        }
    }

    public render() {
        try {
            let style = 'combatant-row ' + this.props.combatant.type;
            if (this.props.combatant.current) {
                style += ' current';
            }
            if (this.props.selected) {
                style += ' highlight';
            }
            if (this.props.combatant.defeated) {
                style += ' defeated';
            }

            const notes = [];
            if (this.props.combat.map) {
                if (!this.props.combatant.pending && !this.props.combat.map.items.find(i => i.id === this.props.combatant.id)) {
                    notes.push(
                        <Note key='not-on-map' white={true}>
                            <span>not on the map</span>
                            <Icon
                                type='environment'
                                className='icon-button'
                                onClick={() => this.props.addToMap(this.props.combatant)}
                            />
                        </Note>
                    );
                }
                if (!this.props.combatant.showOnMap) {
                    notes.push(
                        <Note key='hidden' white={true}>hidden</Note>
                    );
                }
            }
            this.props.combatant.tags.forEach(tag => {
                notes.push(
                    <Note key={tag} white={true}>
                        <div className='condition'>
                            <div className='condition-name'>{Utils.getTagTitle(tag)}</div>
                            {Utils.getTagDescription(tag)}
                        </div>
                    </Note>
                );
            });
            if (this.props.combatant.conditions) {
                this.props.combatant.conditions.forEach(c => {
                    let name = c.name;
                    if (c.name === 'exhaustion') {
                        name += ' (' + c.level + ')';
                    }
                    if (c.duration) {
                        name += ' ' + Utils.conditionDurationText(c, this.props.combat);
                    }
                    const description = [];
                    const text = Utils.conditionText(c);
                    for (let n = 0; n !== text.length; ++n) {
                        description.push(<div key={n} className='condition-text'>{text[n]}</div>);
                    }
                    notes.push(
                        <Note key={c.id} white={true}>
                            <div className='condition'>
                                <div className='condition-name'>{name}</div>
                                {description}
                            </div>
                        </Note>
                    );
                });
            }
            if (this.props.combatant.note) {
                notes.push(
                    <Note key='text' white={true}>
                        <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.props.combatant.note) }} />
                    </Note>
                );
            }

            return (
                <div className={style} onClick={e => this.onClick(e)}>
                    <div className='header'>
                        <Icon type='menu' className='grabber small' data-movable-handle={true} />
                        <div className='name'>
                            {this.props.combatant.displayName || 'combatant'}
                        </div>
                        <span className='info'>{this.getInformationText()}</span>
                    </div>
                    <div className='content'>
                        {notes}
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

//#endregion

//#region MapItemCard

interface MapItemCardProps {
    item: MapItem;
    note: MapNote | null;
    move: (item: MapItem, dir: string) => void;
    resize: (item: MapItem, dir: string, dir2: 'in' | 'out') => void;
    remove: (item: MapItem) => void;
    addNote: (itemID: string) => void;
    removeNote: (itemID: string) => void;
    changeValue: (source: any, field: string, value: any) => void;
    nudgeValue: (source: any, field: string, delta: number) => void;
}

interface MapItemCardState {
    view: string;
}

class MapItemCard extends React.Component<MapItemCardProps, MapItemCardState> {
    constructor(props: MapItemCardProps) {
        super(props);
        this.state = {
            view: 'position'
        };
    }

    private setView(view: string) {
        this.setState({
            view: view
        });
    }

    private getPositionSection() {
        return (
            <div>
                <div className='subheading'>move</div>
                <div className='section centered'>
                    <Radial direction='eight' click={dir => this.props.move(this.props.item, dir)} />
                </div>
                <div style={{ display: this.props.item.type === 'overlay' ? 'block' : 'none' }}>
                    <div className='subheading'>resize</div>
                    <div className='section centered'>
                        <Radial direction='both' click={(dir, dir2) => this.props.resize(this.props.item, dir, dir2 as 'in' | 'out')} />
                    </div>
                </div>
            </div>
        );
    }

    private getStyleSection() {
        const typeOptions = ['overlay', 'token'].map(t => {
            return { id: t, text: t };
        });

        const styleOptions = ['square', 'rounded', 'circle'].map(t => {
            return { id: t, text: t };
        });

        return (
            <div>
                <div className='subheading'>type</div>
                <Selector
                    options={typeOptions}
                    selectedID={this.props.item.type}
                    select={optionID => this.props.changeValue(this.props.item, 'type', optionID)}
                />
                <div style={{ display: this.props.item.type === 'overlay' ? 'block' : 'none' }}>
                    <div className='subheading'>shape</div>
                    <Selector
                        options={styleOptions}
                        selectedID={this.props.item.style}
                        select={optionID => this.props.changeValue(this.props.item, 'style', optionID)}
                    />
                    <div className='subheading'>color</div>
                    <input
                        type='color'
                        value={this.props.item.color}
                        onChange={event => this.props.changeValue(this.props.item, 'color', event.target.value)}
                    />
                    <div className='subheading'>opacity</div>
                    <Slider
                        min={0}
                        max={255}
                        value={this.props.item.opacity}
                        tooltipVisible={false}
                        onChange={value => this.props.changeValue(this.props.item, 'opacity', value)}
                    />
                </div>
                <div style={{ display: this.props.item.type === 'token' ? 'block' : 'none' }}>
                    <div className='subheading'>size</div>
                    <NumberSpin
                        source={this.props.item}
                        name='size'
                        nudgeValue={delta => this.props.nudgeValue(this.props.item, 'size', delta)}
                    />
                </div>
            </div>
        );
    }

    private getNotesSection() {
        if (this.props.note) {
            return (
                <div>
                    <Textbox
                        text={this.props.note.text}
                        placeholder='details'
                        minLines={5}
                        maxLines={10}
                        onChange={value => this.props.changeValue(this.props.note, 'text', value)}
                    />
                    <button onClick={() => this.props.removeNote(this.props.item.id)}>remove note</button>
                </div>
            );
        } else {
            return (
                <div>
                    <button onClick={() => this.props.addNote(this.props.item.id)}>add a note</button>
                </div>
            );
        }
    }

    public render() {
        try {
            const options = ['position', 'style', 'notes'].map(option => {
                return { id: option, text: option };
            });

            let content = null;
            switch (this.state.view) {
                case 'position':
                    content = this.getPositionSection();
                    break;
                case 'style':
                    content = this.getStyleSection();
                    break;
                case 'notes':
                    content = this.getNotesSection();
                    break;
            }

            return (
                <div className='card map' key='selected'>
                    <div className='heading'>
                        <div className='title'>map item</div>
                    </div>
                    <div className='card-content'>
                        <Selector
                            options={options}
                            selectedID={this.state.view}
                            select={optionID => this.setView(optionID)}
                        />
                        <div className='divider' />
                        {content}
                        <div className='divider' />
                        <div className='section'>
                            <button onClick={() => this.props.remove(this.props.item)}>remove from the map</button>
                        </div>
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

//#endregion

//#region CombatControlsPanel

interface CombatControlsPanelProps {
    combatants: Combatant[];
    combat: Combat;
    makeCurrent: (combatant: Combatant) => void;
    makeActive: (combatants: Combatant[]) => void;
    makeDefeated: (combatants: Combatant[]) => void;
    mapAdd: (combatant: Combatant) => void;
    mapMove: (combatants: Combatant[], dir: string) => void;
    mapRemove: (combatants: Combatant[]) => void;
    removeCombatants: (combatants: Combatant[]) => void;
    changeHP: (values: {id: string, hp: number, temp: number, damage: number}[]) => void;
    addCondition: (combatants: Combatant[]) => void;
    editCondition: (combatant: Combatant, condition: Condition) => void;
    removeCondition: (combatant: Combatant, condition: Condition) => void;
    nudgeConditionValue: (condition: Condition, field: string, delta: number) => void;
    toggleTag: (combatants: Combatant[], tag: string) => void;
    toggleCondition: (combatants: Combatant[], condition: string) => void;
    addCompanion: (companion: Companion) => void;
    changeValue: (monster: any, field: string, value: any) => void;
    nudgeValue: (source: any, field: string, delta: number) => void;
}

interface CombatControlsPanelState {
    view: string;
    damageOrHealing: number;
    damageMultipliers: { [id: string]: number };
}

class CombatControlsPanel extends React.Component<CombatControlsPanelProps, CombatControlsPanelState> {
    constructor(props: CombatControlsPanelProps) {
        super(props);

        this.state = {
            view: 'main',
            damageOrHealing: 0,
            damageMultipliers: {}
        };
    }

    private setDamage(value: number) {
        this.setState({
            damageOrHealing: value
        });
    }

    private nudgeDamage(delta: number) {
        this.setState({
            damageOrHealing: Math.max(this.state.damageOrHealing + delta, 0)
        });
    }

    private setView(view: string) {
        this.setState({
            view: view
        });
    }

    private setDamageMultiplier(id: string, multiplier: number) {
        const multipliers = this.state.damageMultipliers;
        multipliers[id] = multiplier;
        this.setState({
            damageMultipliers: multipliers
        });
    }

    private heal() {
        const value = this.state.damageOrHealing;

        this.setState({
            damageOrHealing: 0
        }, () => {
            const values: { id: string, hp: number, temp: number; damage: number }[] = [];
            this.props.combatants.forEach(combatant => {
                const monster = combatant as Combatant & Monster;

                let hp = (monster.hp ?? 0) + value;
                hp = Math.min(hp, monster.hpMax);

                values.push({
                    id: monster.id,
                    hp: hp,
                    temp: monster.hpTemp ?? 0,
                    damage: 0
                });
            });

            this.props.changeHP(values);
        });
    }

    private damage() {
        const value = this.state.damageOrHealing;

        this.setState({
            damageOrHealing: 0
        }, () => {
            const values: { id: string, hp: number, temp: number; damage: number }[] = [];
            this.props.combatants.forEach(combatant => {
                const multiplier = this.state.damageMultipliers[combatant.id] ?? 1;

                let hp = combatant.hp ?? 0;
                let temp = combatant.hpTemp ?? 0;

                const totalDamage = Math.floor(value * multiplier);
                let damage = totalDamage;

                // Take damage off temp HP first
                const val = Math.min(damage, temp);
                damage -= val;
                temp -= val;

                // Take the rest off HP
                hp -= damage;
                hp = Math.max(hp, 0);

                values.push({
                    id: combatant.id,
                    hp: hp,
                    temp: temp,
                    damage: totalDamage
                });
            });

            this.props.changeHP(values);
        });
    }

    private getMainSection() {
        if (this.props.combatants.every(c => c.pending)) {
            return (
                <div className='section'>pending initiative entry</div>
            );
        }

        if (this.props.combatants.every(c => c.active)) {
            const actions = [];
            if (this.props.combatants.every(c => c.current)) {
                actions.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(this.props.combatants)}>mark as defeated and end turn</button>);
            } else {
                if (this.props.combatants.length === 1) {
                    actions.push(<button key='makeCurrent' onClick={() => this.props.makeCurrent(this.props.combatants[0])}>start turn</button>);
                }
                actions.push(<button key='makeDefeated' onClick={() => this.props.makeDefeated(this.props.combatants)}>mark as defeated</button>);
            }

            let notes = null;
            if (this.props.combatants.length === 1) {
                const combatant = this.props.combatants[0];
                notes = (
                    <Textbox
                        text={combatant.note}
                        placeholder='notes'
                        minLines={3}
                        maxLines={10}
                        onChange={value => this.props.changeValue(combatant, 'note', value)}
                    />
                );
            }

            return (
                <div>
                    {actions}
                    <Row gutter={10}>
                        <Col span={8}>
                            <Checkbox
                                label='conc.'
                                display='button'
                                checked={this.props.combatants.every(c => c.tags.includes('conc'))}
                                changeValue={value => this.props.toggleTag(this.props.combatants, 'conc')}
                            />
                        </Col>
                        <Col span={8}>
                            <Checkbox
                                label='bane'
                                display='button'
                                checked={this.props.combatants.every(c => c.tags.includes('bane'))}
                                changeValue={value => this.props.toggleTag(this.props.combatants, 'bane')}
                            />
                        </Col>
                        <Col span={8}>
                            <Checkbox
                                label='bless'
                                display='button'
                                checked={this.props.combatants.every(c => c.tags.includes('bless'))}
                                changeValue={value => this.props.toggleTag(this.props.combatants, 'bless')}
                            />
                        </Col>
                    </Row>
                    <Row gutter={10}>
                        <Col span={8}>
                            <Checkbox
                                label='prone'
                                display='button'
                                checked={this.props.combatants.every(c => c.conditions.some(condition => condition.name === 'prone'))}
                                changeValue={value => this.props.toggleCondition(this.props.combatants, 'prone')}
                            />
                        </Col>
                        <Col span={8}>
                            <Checkbox
                                label='uncon.'
                                display='button'
                                checked={this.props.combatants.every(c => c.conditions.some(condition => condition.name === 'unconscious'))}
                                changeValue={value => this.props.toggleCondition(this.props.combatants, 'unconscious')}
                            />
                        </Col>
                        <Col span={8}>
                            <Checkbox
                                label='hidden'
                                display='button'
                                checked={!this.props.combatants.every(c => c.showOnMap)}
                                disabled={!this.props.combat.map}
                                changeValue={value => this.props.changeValue(this.props.combatants, 'showOnMap', !value)}
                            />
                        </Col>
                    </Row>
                    {notes}
                </div>
            );
        }

        if (this.props.combatants.every(c => c.defeated)) {
            return (
                <button onClick={() => this.props.makeActive(this.props.combatants)}>mark as active</button>
            );
        }

        return (
            <Note>
                <div className='section'>multiple combatants are selected</div>
            </Note>
        );
    }

    private getHPSection() {
        if (!this.props.combatants.every(c => c.type === 'monster')) {
            return null;
        }

        let current = null;
        if (this.props.combatants.length === 1) {
            const monster = this.props.combatants[0] as Combatant & Monster;
            current = (
                <div>
                    <NumberSpin
                        source={monster}
                        name='hp'
                        label='hit points'
                        factors={[1, 10]}
                        nudgeValue={delta => this.props.nudgeValue(monster, 'hp', delta)}
                    />
                    <NumberSpin
                        source={monster}
                        name='hpTemp'
                        label='temp hp'
                        factors={[1, 10]}
                        nudgeValue={delta => this.props.nudgeValue(monster, 'hpTemp', delta)}
                    />
                    <div className='divider' />
                </div>
            );
        }

        const modifiers = this.props.combatants.map(c => {
            const monster = c as Combatant & Monster;
            let r = null;
            let v = null;
            let i = null;
            if (monster.damage.resist) {
                r = (
                    <div className='section'>
                        <b>damage resistances</b> {monster.damage.resist} {this.props.combatants.length > 1 ? <i> - {c.displayName}</i> : null}
                    </div>
                );
            }
            if (monster.damage.vulnerable) {
                v = (
                    <div className='section'>
                        <b>damage vulnerabilities</b> {monster.damage.vulnerable} {this.props.combatants.length > 1 ? <i> - {c.displayName}</i> : null}
                    </div>
                );
            }
            if (monster.damage.immune) {
                i = (
                    <div className='section'>
                        <b>damage immunities</b> {monster.damage.immune} {this.props.combatants.length > 1 ? <i> - {c.displayName}</i> : null}
                    </div>
                );
            }
            if (r || v || i) {
                return (
                    <div key={c.id}>
                        {r}
                        {v}
                        {i}
                    </div>
                );
            }
            return null;
        });

        const degreeOptions = [
            { id: 'half', text: 'half' },
            { id: 'normal', text: 'normal' },
            { id: 'double', text: 'double' }
        ];
        const degrees = this.props.combatants.map(c => {
            let selected = 'normal';
            const multiplier = this.state.damageMultipliers[c.id] ?? 1;
            if (multiplier < 1) {
                selected = 'half';
            }
            if (multiplier > 1) {
                selected = 'double';
            }
            const selector = (
                <Selector
                    options={degreeOptions}
                    selectedID={selected}
                    disabled={this.state.damageOrHealing === 0}
                    select={id => {
                        let value = 1;
                        if (id === 'half') {
                            value = 0.5;
                        }
                        if (id === 'double') {
                            value = 2;
                        }
                        this.setDamageMultiplier(c.id, value);
                    }}
                />
            );
            if (this.props.combatants.length === 1) {
                return (
                    <div key={c.id}>
                        {selector}
                    </div>
                );
            }
            return (
                <Row key={c.id} type='flex' align='middle'>
                    <Col span={8}>
                        <div>{c.displayName}</div>
                    </Col>
                    <Col span={16}>
                        {selector}
                    </Col>
                </Row>
            );
        });

        let defeatedBtn = null;
        const atZero = this.props.combatants.filter(c => (c.hp != null) && (c.hp <= 0));
        if (atZero.length > 0) {
            const txt = (atZero.length === 1) && (atZero[0].current) ? 'mark as defeated and end turn' : 'mark as defeated';
            let names = null;
            if (this.props.combatants.length > 1) {
                names = (
                    <ul>
                        {atZero.map(c => <li key={c.id}>{c.displayName}</li>)}
                    </ul>
                );
            }
            defeatedBtn = (
                <button onClick={() => this.props.makeDefeated(atZero)}>
                    {txt}
                    {names}
                </button>
            );
        }

        return (
            <div>
                {current}
                {modifiers}
                <NumberSpin
                    source={this.state}
                    name='damageOrHealing'
                    factors={[1, 10]}
                    nudgeValue={delta => this.nudgeDamage(delta)}
                />
                <Row gutter={10}>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <button className={this.state.damageOrHealing === 0 ? 'disabled' : ''} onClick={() => this.heal()}>heal</button>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <button className={this.state.damageOrHealing === 0 ? 'disabled' : ''} onClick={() => this.setDamage(0)}>reset</button>
                    </Col>
                    <Col xs={24} sm={24} md={8} lg={8} xl={8}>
                        <button className={this.state.damageOrHealing === 0 ? 'disabled' : ''} onClick={() => this.damage()}>damage</button>
                    </Col>
                </Row>
                {degrees}
                {defeatedBtn}
            </div>
        );
    }

    private getConditionSection() {
        const conditionImmunities = this.props.combatants.map(c => {
            if (c.type !== 'monster') {
                return null;
            }

            const monster = c as Combatant & Monster;
            if (!monster.conditionImmunities) {
                return null;
            }

            return (
                <div key={c.id} className='section'>
                    <b>condition immunities</b> {monster.conditionImmunities} {this.props.combatants.length > 1 ? <i> - {c.displayName}</i> : null}
                </div>
            );
        });

        const conditions = (
            <ConditionsPanel
                combatants={this.props.combatants}
                combat={this.props.combat}
                addCondition={() => this.props.addCondition(this.props.combatants)}
                editCondition={(combatant, condition) => this.props.editCondition(combatant, condition)}
                removeCondition={(combatant, condition) => this.props.removeCondition(combatant, condition)}
                nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
            />
        );

        return (
            <div>
                {conditionImmunities}
                {conditions}
            </div>
        );
    }

    private getMapSection() {
        if (!this.props.combat.map) {
            return null;
        }

        const allOnMap = this.props.combatants.every(c => {
            return this.props.combat.map && this.props.combat.map.items.find(i => i.id === c.id);
        });
        if (allOnMap) {
            let altitude = null;
            let aura = null;
            if (this.props.combatants.length === 1) {
                const combatant = this.props.combatants[0];
                altitude = (
                    <NumberSpin
                        source={combatant}
                        name='altitude'
                        label='altitude'
                        display={value => value + ' ft.'}
                        nudgeValue={delta => this.props.nudgeValue(combatant, 'altitude', delta * 5)}
                    />
                );
                let auraDetails = null;
                if (combatant.aura.radius > 0) {
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
                                selectedID={combatant.aura.style}
                                select={optionID => this.props.changeValue(combatant.aura, 'style', optionID)}
                            />
                            <input
                                type='color'
                                value={combatant.aura.color}
                                onChange={event => this.props.changeValue(combatant.aura, 'color', event.target.value)}
                            />
                        </div>
                    );
                }
                aura = (
                    <Expander text='aura'>
                        <NumberSpin
                            source={combatant.aura}
                            name='radius'
                            label='size'
                            display={value => value + ' ft.'}
                            nudgeValue={delta => this.props.nudgeValue(combatant.aura, 'radius', delta * 5)}
                        />
                        {auraDetails}
                    </Expander>
                );
            }

            return (
                <div>
                    <div className='section centered'>
                        <Radial
                            direction='eight'
                            click={dir => this.props.mapMove(this.props.combatants, dir)}
                        />
                    </div>
                    <div className='divider' />
                    {altitude}
                    {aura}
                    <button onClick={() => this.props.mapRemove(this.props.combatants)}>remove from map</button>
                </div>
            );
        }

        if (this.props.combatants.length === 1) {
            return (
                <button key='mapAdd' onClick={() => this.props.mapAdd(this.props.combatants[0])}>add to map</button>
            );
        }

        return null;
    }

    private getAdvancedSection() {
        let remove = null;
        if (this.props.combatants.every(c => !c.current)) {
            remove = (
                <ConfirmButton text='remove from encounter' callback={() => this.props.removeCombatants(this.props.combatants)} />
            );
        }

        let changeName = null;
        let changeSize = null;
        let changeInit = null;
        if (this.props.combatants.length === 1) {
            const combatant = this.props.combatants[0];
            changeName = (
                <Expander text='change name'>
                    <Textbox
                        text={combatant.displayName}
                        onChange={value => this.props.changeValue(combatant, 'displayName', value)}
                    />
                </Expander>
            );

            changeSize = (
                <Expander text='change size'>
                    <NumberSpin
                        source={combatant}
                        name='displaySize'
                        label='size'
                        nudgeValue={delta => this.props.nudgeValue(combatant, 'displaySize', delta)}
                    />
                </Expander>
            );

            if (!combatant.pending) {
                changeInit = (
                    <Expander text='change initiative score'>
                        <p>adjusting initiative will re-sort the initiative order</p>
                        <p>if you have manually changed the initiative order, your changes will be lost</p>
                        <NumberSpin
                            source={combatant}
                            name='initiative'
                            label='initiative'
                            nudgeValue={delta => this.props.nudgeValue(combatant, 'initiative', delta)}
                        />
                    </Expander>
                );
            }
        }

        const companions: JSX.Element[] = [];
        this.props.combatants
            .filter(c => c.type === 'pc')
            .forEach(pc => {
                (pc as Combatant & PC).companions
                    .filter(comp => !this.props.combat.combatants.find(c => c.id === comp.id))
                    .forEach(comp => {
                        companions.push(
                            <button key={comp.id} onClick={() => this.props.addCompanion(comp)}>add {comp.name}</button>
                        );
                    });
                });

        return (
            <div>
                {remove}
                {changeName}
                {changeSize}
                {changeInit}
                {companions}
            </div>
        );
    }

    public render() {
        try {
            const views = ['main', 'hp', 'cond', 'map', 'adv'].map(m => {
                return {
                    id: m,
                    text: m
                };
            });
            if (!this.props.combat.map) {
                // No combat map, so remove the map option
                views.splice(3, 1);
            }
            if (!this.props.combatants.every(c => c.type === 'monster')) {
                // Not everything is a monster, so can't change hit points
                views.splice(1, 1);
            }

            let currentView = this.state.view;
            if (!views.find(v => v.id === currentView)) {
                currentView = 'main';
            }

            let content = null;
            switch (currentView) {
                case 'main':
                    content = this.getMainSection();
                    break;
                case 'hp':
                    content = this.getHPSection();
                    break;
                case 'cond':
                    content = this.getConditionSection();
                    break;
                case 'map':
                    content = this.getMapSection();
                    break;
                case 'adv':
                    content = this.getAdvancedSection();
                    break;
            }

            const name = this.props.combatants.length === 1 ? this.props.combatants[0].displayName : 'multiple combatants';

            return (
                <div className='group-panel combat-controls'>
                    <div className='subheading'>{name}</div>
                    <Selector
                        options={views}
                        selectedID={currentView}
                        select={option => this.setView(option)}
                    />
                    <div className='divider' />
                    {content}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

//#endregion

//#endregion
