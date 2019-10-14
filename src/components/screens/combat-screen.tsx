import React from 'react';

import Utils from '../../utils/utils';

import { Combat, COMBAT_TAGS, Combatant, Notification } from '../../models/combat';
import { Condition, ConditionDurationSaves } from '../../models/condition';
import { Encounter } from '../../models/encounter';
import { Monster, Trait } from '../../models/monster-group';
import { PC } from '../../models/party';

import MonsterCard from '../cards/monster-card';
import PCCard from '../cards/pc-card';
import Checkbox from '../controls/checkbox';
import ControlRow from '../controls/control-row';
import Radial from '../controls/radial';
import Spin from '../controls/spin';
import CardGroup from '../panels/card-group';
import HitPointGauge from '../panels/hit-point-gauge';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';
import PortraitPanel from '../panels/portrait-panel';
import TraitsPanel from '../panels/traits-panel';
import Popout from '../portals/popout';

interface Props {
    combat: Combat;
    encounters: Encounter[];
    pauseCombat: () => void;
    closeNotification: (notification: Notification, removeCondition: boolean) => void;
    mapAdd: (combatant: (Combatant & PC) | (Combatant & Monster), x: number, y: number) => void;
    makeCurrent: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    makeActive: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    makeDefeated: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    removeCombatant: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    addCombatants: () => void;
    addWave: () => void;
    addCondition: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    editCondition: (combatant: (Combatant & PC) | (Combatant & Monster), condition: Condition) => void;
    removeCondition: (combatant: (Combatant & PC) | (Combatant & Monster), conditionID: string) => void;
    mapMove: (combatant: (Combatant & PC) | (Combatant & Monster), dir: string) => void;
    mapRemove: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    endTurn: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    changeHP: (combatant: Combatant & Monster, hp: number, temp: number) => void;
    changeValue: (source: {}, type: string, value: any) => void;
    nudgeValue: (source: {}, type: string, delta: number) => void;
    toggleTag: (combatant: Combatant, tag: string) => void;
    scatterCombatants: (type: 'pc' | 'monster') => void;
    rotateMap: () => void;
}

interface State {
    selectedTokenID: string | null;
    addingToMapID: string | null;
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
            selectedTokenID: null,  // The ID of the combatant that's selected
            addingToMapID: null,    // The ID of the combatant we're adding to the map
            mapSize: 30,
            playerView: {
                open: false,
                showControls: true,
                mapSize: 30
            }
        };
    }

    public componentDidMount() {
        window.addEventListener('beforeunload', () => {
            this.setPlayerViewOpen(false);
        });
    }

    private setSelectedTokenID(id: string | null) {
        this.setState({
            selectedTokenID: id
        });
    }

    private setAddingToMapID(id: string | null) {
        this.setState({
            addingToMapID: id
        });
    }

    private nudgeMapSize(value: number) {
        this.setState({
            mapSize: this.state.mapSize + value
        });
    }

    private setPlayerViewOpen(show: boolean) {
        // eslint-disable-next-line
        this.state.playerView.open = show;
        this.setState({
            playerView: this.state.playerView
        });
    }

    private setPlayerViewShowControls(show: boolean) {
        // eslint-disable-next-line
        this.state.playerView.showControls = show;
        this.setState({
            playerView: this.state.playerView
        });
    }

    private nudgePlayerViewMapSize(value: number) {
        // eslint-disable-next-line
        this.state.playerView.mapSize = this.state.playerView.mapSize + value;
        this.setState({
            playerView: this.state.playerView
        });
    }

    private getPlayerView(combat: Combat) {
        if (!this.state.playerView.open) {
            return null;
        }

        const init = combat.combatants
            .filter(c => c.showOnMap)
            .filter(combatant => !combatant.pending && combatant.active && !combatant.defeated)
            .map(combatant => {
                switch (combatant.type) {
                    case 'pc':
                        return (
                            <PCRow
                                key={combatant.id}
                                combatant={combatant as Combatant & PC}
                                minimal={true}
                                combat={this.props.combat as Combat}
                                select={c => this.setSelectedTokenID(c.id)}
                                selected={combatant.id === this.state.selectedTokenID}
                            />
                        );
                    case 'monster':
                        return (
                            <MonsterRow
                                key={combatant.id}
                                combatant={combatant as Combatant & Monster}
                                minimal={true}
                                combat={this.props.combat as Combat}
                                select={c => this.setSelectedTokenID(c.id)}
                                selected={combatant.id === this.state.selectedTokenID}
                            />
                        );
                    default:
                        return null;
                }
            });

        if (combat.map) {
            let controls = null;
            if (combat.map && this.state.playerView.showControls) {
                let selection = combat.combatants
                    .filter(c => combat.map !== null ? combat.map.items.find(item => item.id === c.id) : false)
                    .filter(c => c.showOnMap)
                    .find(c => c.id === this.state.selectedTokenID);
                if (!selection) {
                    selection = combat.combatants
                        .filter(c => combat.map !== null ? combat.map.items.find(item => item.id === c.id) : false)
                        .filter(c => c.showOnMap)
                        .find(c => c.current);
                }

                if (selection) {
                    const token = selection as ((Combatant & PC) | (Combatant & Monster));
                    controls = (
                        <div>
                            <div className='heading lowercase'>{token.displayName}</div>
                            <div className='section centered'>
                                <Radial
                                    direction='eight'
                                    click={dir => this.props.mapMove(token, dir)}
                                />
                            </div>
                            <div className='divider' />
                            <Spin
                                key='altitude'
                                source={token}
                                name='altitude'
                                label='altitude'
                                display={value => value + ' ft.'}
                                nudgeValue={delta => this.props.nudgeValue(token, 'altitude', delta * 5)}
                            />
                            <ControlRow
                                key='tags'
                                controls={COMBAT_TAGS.map(tag =>
                                    <Checkbox
                                        key={tag}
                                        label={tag}
                                        display='button'
                                        checked={token.tags.includes(tag)}
                                        changeValue={value => this.props.toggleTag(token, tag)}
                                    />
                                )}
                            />
                        </div>
                    );
                }
            }

            return (
                <Popout title='Encounter' closeWindow={() => this.setPlayerViewOpen(false)}>
                    <div className='row'>
                        <div className='columns small-12 medium-6 large-8 scrollable scrollable-both'>
                            <MapPanel
                                key='map'
                                map={combat.map}
                                mode='combat-player'
                                size={this.state.playerView.mapSize}
                                combatants={combat.combatants}
                                selectedItemID={this.state.selectedTokenID ? this.state.selectedTokenID : undefined}
                                setSelectedItemID={id => this.setSelectedTokenID(id)}
                            />
                        </div>
                        <div className='columns small-12 medium-6 large-4 scrollable'>
                            {controls}
                            <div className='heading'>initiative order</div>
                            {init}
                        </div>
                    </div>
                </Popout>
            );
        } else {
            return (
                <Popout title='Encounter' closeWindow={() => this.setPlayerViewOpen(false)}>
                    <div className='row'>
                        <div className='columns small-12 medium-12 large-12 scrollable'>
                            <div className='heading'>initiative order</div>
                            {init}
                        </div>
                    </div>
                </Popout>
            );
        }
    }

    private createCard(combatant: (Combatant & PC) | (Combatant & Monster)) {
        let mode = 'combat';
        if (this.props.combat.map) {
            mode += ' tactical';
            const onMap = this.props.combat.map.items.find(i => i.id === combatant.id);
            mode += onMap ? ' on-map' : ' off-map';
        }

        switch (combatant.type) {
            case 'pc':
                return (
                    <PCCard
                        key='selected'
                        pc={combatant as Combatant & PC}
                        mode={mode}
                        combat={this.props.combat as Combat}
                        changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
                        nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
                        makeCurrent={c => this.props.makeCurrent(c as Combatant & PC)}
                        makeActive={c => this.props.makeActive(c as Combatant & PC)}
                        makeDefeated={c => this.defeatCombatant(c as Combatant & PC)}
                        removeCombatant={c => this.props.removeCombatant(c as Combatant & PC)}
                        addCondition={c => this.props.addCondition(c as Combatant & Monster)}
                        editCondition={(c, condition) => this.props.editCondition(c as Combatant & Monster, condition)}
                        removeCondition={(c, conditionID) => this.props.removeCondition(c as Combatant & Monster, conditionID)}
                        nudgeConditionValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
                        mapAdd={c => this.setAddingToMapID(this.state.addingToMapID ? null : c.id)}
                        mapMove={(c, dir) => this.props.mapMove(c as Combatant & PC, dir)}
                        mapRemove={c => this.props.mapRemove(c as Combatant & PC)}
                        endTurn={c => this.props.endTurn(c as Combatant & PC)}
                        toggleTag={(c, tag) => this.props.toggleTag(c, tag)}
                    />
                );
            case 'monster':
                return (
                    <MonsterCard
                        key='selected'
                        monster={combatant as Combatant & Monster}
                        mode={mode}
                        combat={this.props.combat as Combat}
                        changeValue={(c, type, value) => this.props.changeValue(c, type, value)}
                        nudgeValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
                        makeCurrent={c => this.props.makeCurrent(c as Combatant & Monster)}
                        makeActive={c => this.props.makeActive(c as Combatant & Monster)}
                        makeDefeated={c => this.defeatCombatant(c as Combatant & Monster)}
                        removeCombatant={c => this.props.removeCombatant(c as Combatant & Monster)}
                        addCondition={c => this.props.addCondition(c as Combatant & Monster)}
                        editCondition={(c, condition) => this.props.editCondition(c as Combatant & Monster, condition)}
                        removeCondition={(c, conditionID) => this.props.removeCondition(c as Combatant & Monster, conditionID)}
                        nudgeConditionValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
                        mapAdd={c => this.setAddingToMapID(this.state.addingToMapID ? null : c.id)}
                        mapMove={(c, dir) => this.props.mapMove(c as Combatant & Monster, dir)}
                        mapRemove={c => this.props.mapRemove(c as Combatant & Monster)}
                        endTurn={(c) => this.props.endTurn(c as Combatant & Monster)}
                        changeHP={(c, hp, temp) => this.props.changeHP(c as Combatant & Monster, hp, temp)}
                        toggleTag={(c, tag) => this.props.toggleTag(c, tag)}
                    />
                );
            default:
                return null;
        }
    }

    private defeatCombatant(combatant: (Combatant & PC) | (Combatant & Monster)) {
        if (this.state.selectedTokenID === combatant.id) {
            this.setState({
                selectedTokenID: null
            });
        }

        this.props.makeDefeated(combatant);
    }

    private addCombatantToMap(x: number, y: number) {
        const combatant = this.props.combat.combatants.find(c => c.id === this.state.addingToMapID);
        if (combatant) {
            this.props.mapAdd(combatant, x, y);
        }
        this.setAddingToMapID(null);
    }

    public render() {
        try {
            const current: JSX.Element[] = [];
            let pending: JSX.Element[] = [];
            let active: JSX.Element[] = [];
            const defeated: JSX.Element[] = [];

            this.props.combat.combatants.forEach(combatant => {
                if (combatant.current) {
                    current.push(
                        <div key={combatant.id}>
                            {this.createCard(combatant)}
                        </div>
                    );
                }
                if (combatant.pending && !combatant.active && !combatant.defeated) {
                    pending.push(
                        <PendingCombatantRow
                            key={combatant.id}
                            combatant={combatant}
                            select={c => this.setSelectedTokenID(c.id)}
                            selected={combatant.id === this.state.selectedTokenID}
                            nudgeValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
                            makeActive={c => this.props.makeActive(c)}
                        />
                    );
                }
                if (!combatant.pending && combatant.active && !combatant.defeated) {
                    switch (combatant.type) {
                        case 'pc':
                            active.push(
                                <PCRow
                                    key={combatant.id}
                                    combatant={combatant as Combatant & PC}
                                    combat={this.props.combat as Combat}
                                    select={c => this.setSelectedTokenID(c.id)}
                                    selected={combatant.id === this.state.selectedTokenID}
                                />
                            );
                            break;
                        case 'monster':
                            active.push(
                                <MonsterRow
                                    key={combatant.id}
                                    combatant={combatant as Combatant & Monster}
                                    combat={this.props.combat as Combat}
                                    select={c => this.setSelectedTokenID(c.id)}
                                    selected={combatant.id === this.state.selectedTokenID}
                                />
                            );
                            break;
                    }
                }
                if (!combatant.pending && !combatant.active && combatant.defeated) {
                    switch (combatant.type) {
                        case 'pc':
                            defeated.push(
                                <PCRow
                                    key={combatant.id}
                                    combatant={combatant as Combatant & PC}
                                    combat={this.props.combat as Combat}
                                    select={c => this.setSelectedTokenID(c.id)}
                                    selected={combatant.id === this.state.selectedTokenID}
                                />
                            );
                            break;
                        case 'monster':
                            defeated.push(
                                <MonsterRow
                                    key={combatant.id}
                                    combatant={combatant as Combatant & Monster}
                                    combat={this.props.combat as Combat}
                                    select={c => this.setSelectedTokenID(c.id)}
                                    selected={combatant.id === this.state.selectedTokenID}
                                />
                            );
                            break;
                    }
                }
            });

            if (pending.length !== 0) {
                const pendingHelp = (
                    <Note key='pending-help'>
                        <div className='section'>these combatants are not yet part of the encounter</div>
                        <div className='section'>set initiative on each of them, then add them to the encounter</div>
                    </Note>
                );
                pending = [pendingHelp].concat(pending);
            }

            if (current.length === 0) {
                const activeHelp = (
                    /* tslint:disable:max-line-length */
                    <Note key='active-help'>
                        <div className='section'>these are the combatants taking part in this encounter; you can select them to see their stat blocks (on the right)</div>
                        <div className='section'>they are listed in initiative order (with the highest initiative score at the top of the list, and the lowest at the bottom)</div>
                        <div className='section'>when you're ready to begin the encounter, select the first combatant and press the <b>start turn</b> button on their stat block</div>
                    </Note>
                    /* tslint:enable:max-line-length */
                );
                active = [activeHelp].concat(active);
            }

            if (current.length === 0) {
                current.push(
                    <Note key='current'>
                        <div className='section'>the current initiative holder will be displayed here</div>
                    </Note>
                );
            }

            let notificationSection = null;
            if (this.props.combat.notifications.length > 0) {
                const notifications = this.props.combat.notifications.map(n => (
                    <NotificationPanel
                        key={n.id}
                        notification={n}
                        close={(notification, removeCondition) => this.props.closeNotification(notification, removeCondition)}
                    />
                ));
                notificationSection = (
                    <div className='notifications'>
                        {notifications}
                    </div>
                );
            }

            let mapSection = null;
            if (this.props.combat.map) {
                mapSection = (
                    <div key='map'>
                        <MapPanel
                            map={this.props.combat.map}
                            mode='combat'
                            size={this.state.mapSize}
                            showOverlay={this.state.addingToMapID !== null}
                            combatants={this.props.combat.combatants}
                            selectedItemID={this.state.selectedTokenID ? this.state.selectedTokenID : undefined}
                            setSelectedItemID={id => this.setSelectedTokenID(id)}
                            gridSquareClicked={(x, y) => this.addCombatantToMap(x, y)}
                        />
                    </div>
                );
            }

            let wavesAvailable = false;
            const encounterID = this.props.combat.encounterID;
            const encounter = this.props.encounters.find(enc => enc.id === encounterID);
            wavesAvailable = !!encounter && (encounter.waves.length > 0);

            const toolsSection = (
                <CardGroup
                    heading='tools'
                    content={[
                        <div key='tools'>
                            <div>
                                <div className='subheading'>encounter</div>
                                <button onClick={() => this.props.pauseCombat()}>pause this encounter</button>
                                <button onClick={() => this.props.addCombatants()}>add combatants</button>
                                <button onClick={() => this.props.addWave()} style={{ display: wavesAvailable ? 'block' : 'none' }}>add wave</button>
                            </div>
                            <div style={{ display: this.props.combat.map ? 'block' : 'none' }}>
                                <div className='subheading'>map</div>
                                <button onClick={() => this.props.scatterCombatants('monster')}>scatter monsters</button>
                                <button onClick={() => this.props.scatterCombatants('pc')}>scatter pcs</button>
                                <button onClick={() => this.props.rotateMap()}>rotate the map</button>
                                <Spin
                                    source={this.state}
                                    name={'mapSize'}
                                    display={value => 'zoom'}
                                    nudgeValue={delta => this.nudgeMapSize(delta * 5)}
                                />
                            </div>
                            <div>
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
                                    <Spin
                                        source={this.state.playerView}
                                        name={'mapSize'}
                                        display={value => 'zoom'}
                                        nudgeValue={delta => this.nudgePlayerViewMapSize(delta * 5)}
                                    />
                                </div>
                            </div>
                        </div>
                    ]}
                    showToggle={true}
                />
            );

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

            let selectedCombatant = null;
            if (this.state.selectedTokenID) {
                const combatant = this.props.combat.combatants.find(c => c.id === this.state.selectedTokenID);
                if (combatant && !combatant.current) {
                    selectedCombatant = this.createCard(combatant);
                }
            }
            if (!selectedCombatant) {
                selectedCombatant = (
                    <Note key='selected'>
                        <div className='section'>
                            select a pc or monster from the <b>initiative order</b> list to see its details here
                        </div>
                    </Note>
                );
            }

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-4 scrollable'>
                        <CardGroup
                            heading='initiative holder'
                            content={current}
                        />
                    </div>
                    <div className='columns small-4 medium-4 large-4 scrollable'>
                        {notificationSection}
                        <CardGroup
                            heading='waiting for intiative to be entered'
                            content={pending}
                            hidden={pending.length === 0}
                            showToggle={true}
                        />
                        <CardGroup
                            heading='encounter map'
                            content={[mapSection]}
                            hidden={mapSection === null}
                            showToggle={true}
                        />
                        <CardGroup
                            heading='initiative order'
                            content={active}
                            hidden={active.length === 0}
                            showToggle={true}
                        />
                        <CardGroup
                            heading='defeated'
                            content={defeated}
                            hidden={defeated.length === 0}
                            showToggle={true}
                        />
                    </div>
                    <div className='columns small-4 medium-4 large-4 scrollable'>
                        {toolsSection}
                        {this.getPlayerView(this.props.combat)}
                        <CardGroup
                            heading={'don\'t forget'}
                            content={special}
                            hidden={special.length === 0}
                            showToggle={true}
                        />
                        <CardGroup
                            heading='selected combatant'
                            content={[selectedCombatant]}
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
                            <ControlRow
                                controls={[
                                    <button key='success' onClick={() => this.success()}>success</button>,
                                    <button key='close' onClick={() => this.close()}>close</button>
                                ]}
                            />
                        </div>
                    );
                case 'condition-end':
                    return (
                        <div key={this.props.notification.id} className='descriptive'>
                            <div className='text'>
                                {name} is no longer affected by condition {condition.name}
                            </div>
                            <ControlRow
                                controls={[
                                    <button key='close' onClick={() => this.close()}>close</button>
                                ]}
                            />
                        </div>
                    );
                case 'trait-recharge':
                    return (
                        <div key={this.props.notification.id} className='descriptive'>
                            <div className='text'>
                                {name} can attempt to recharge {trait.name} ({trait.usage})
                            </div>
                            <ControlRow
                                controls={[
                                    <button key='recharge' onClick={() => this.success()}>recharge</button>,
                                    <button key='close' onClick={() => this.close()}>close</button>
                                ]}
                            />
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

interface PendingCombatantRowProps {
    combatant: (Combatant & PC) | (Combatant & Monster);
    selected: boolean;
    select: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    nudgeValue: (combatant: (Combatant & PC) | (Combatant & Monster), field: string, delta: number) => void;
    makeActive: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
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
            this.props.select(this.props.combatant);
        }
    }

    public render() {
        try {
            let style = 'combatant-row ' + this.props.combatant.type;
            if (this.props.combatant.current || this.props.selected) {
                style += ' highlight';
            }

            return (
                <div className={style} onClick={e => this.onClick(e)}>
                    <div className='name'>
                        <PortraitPanel source={this.props.combatant} inline={true} />
                        {this.props.combatant.displayName || this.props.combatant.name || 'combatant'}
                        <span className='info'>{this.getInformationText()}</span>
                    </div>
                    <div className='content'>
                        <Spin
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

interface PCRowProps {
    combatant: Combatant & PC;
    minimal: boolean;
    combat: Combat;
    selected: boolean;
    select: (combatant: Combatant & PC) => void;
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
        if (!this.props.selected && this.props.select) {
            this.props.select(this.props.combatant);
        }
    }

    public render() {
        try {
            let style = 'combatant-row ' + this.props.combatant.type;
            if (this.props.selected) {
                style += ' highlight';
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

            let conditions = null;
            if (this.props.combatant.conditions) {
                conditions = this.props.combatant.conditions.map(c => {
                    let name = c.name;
                    if (c.name === 'exhaustion') {
                        name += ' (' + c.level + ')';
                    }
                    if ((c.name === 'custom') && (c.text)) {
                        name = c.text;
                    }
                    if (c.duration) {
                        name += ' ' + Utils.conditionDurationText(c, this.props.combat);
                    }
                    const description = [];
                    const text = Utils.conditionText(c);
                    for (let n = 0; n !== text.length; ++n) {
                        description.push(<li key={n} className='condition-text'>{text[n]}</li>);
                    }
                    return (
                        <Note key={c.id} white={true}>
                            <div className='condition'>
                                <div className='condition-name'>{name}</div>
                                <ul>
                                    {description}
                                </ul>
                            </div>
                        </Note>
                    );
                });
            }

            const notes = [];
            if (this.props.combat.map) {
                if (!this.props.combatant.pending && !this.props.combat.map.items.find(i => i.id === this.props.combatant.id)) {
                    notes.push(
                        <Note key='not-on-map' white={true}>not on the map</Note>
                    );
                }
            }
            this.props.combatant.tags.forEach(tag => {
                notes.push(
                    <Note key={tag} white={true}>{Utils.getTagDescription(tag)}</Note>
                );
            });

            let companions = null;
            if (this.props.combatant.companions.length > 0) {
                companions = (
                    <div className='section'>
                        <b>companions:</b> {this.props.combatant.companions.map(companion => companion.name).join(', ')}
                    </div>
                );
            }

            return (
                <div className={style} onClick={e => this.onClick(e)}>
                    <div className='name'>
                        <PortraitPanel source={this.props.combatant} inline={true} />
                        {this.props.combatant.displayName || this.props.combatant.name || 'combatant'}
                        {this.props.combatant.player ? ' | ' + this.props.combatant.player : ''}
                        <span className='info'>{this.getInformationText()}</span>
                    </div>
                    <div className='content'>
                        {desc}
                        {conditions}
                        {notes}
                        {companions}
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

interface MonsterRowProps {
    combatant: Combatant & Monster;
    minimal: boolean;
    combat: Combat;
    selected: boolean;
    select: (combatant: Combatant & Monster) => void;
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
        if (!this.props.selected && this.props.select) {
            this.props.select(this.props.combatant);
        }
    }

    public render() {
        try {
            let style = 'combatant-row ' + this.props.combatant.type;
            if (this.props.selected) {
                style += ' highlight';
            }

            let hp = (this.props.combatant.hp ? this.props.combatant.hp : 0).toString();
            if (this.props.combatant.hpTemp > 0) {
                hp += '+' + this.props.combatant.hpTemp;
            }

            let gauge = null;
            if (!this.props.combatant.pending) {
                gauge = (
                    <HitPointGauge combatant={this.props.combatant} />
                );
            }

            let conditions = null;
            if (this.props.combatant.conditions) {
                conditions = this.props.combatant.conditions.map(c => {
                    let name = c.name;
                    if (c.name === 'exhaustion') {
                        name += ' (' + c.level + ')';
                    }
                    if ((c.name === 'custom') && (c.text)) {
                        name = c.text;
                    }
                    if (c.duration) {
                        name += ' ' + Utils.conditionDurationText(c, this.props.combat);
                    }
                    const description = [];
                    const text = Utils.conditionText(c);
                    for (let n = 0; n !== text.length; ++n) {
                        description.push(<li key={n} className='condition-text'>{text[n]}</li>);
                    }
                    return (
                        <Note key={c.id} white={true}>
                            <div className='condition'>
                                <div className='condition-name'>{name}</div>
                                <ul>
                                    {description}
                                </ul>
                            </div>
                        </Note>
                    );
                });
            }

            const notes = [];
            if (this.props.combat.map) {
                if (!this.props.combatant.pending && !this.props.combat.map.items.find(i => i.id === this.props.combatant.id)) {
                    notes.push(
                        <Note key='not-on-map' white={true}>not on the map</Note>
                    );
                }
            }
            this.props.combatant.tags.forEach(tag => {
                notes.push(
                    <Note key={tag} white={true}>{Utils.getTagDescription(tag)}</Note>
                );
            });

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
                    <div className='name'>
                        <PortraitPanel source={this.props.combatant} inline={true} />
                        {this.props.combatant.displayName || this.props.combatant.name || 'combatant'}
                        <span className='info'>{this.getInformationText()}</span>
                    </div>
                    <div className='content'>
                        {dmInfo}
                        {conditions}
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
