import React from 'react';

import Utils from '../../utils/utils';

import { Combat, Combatant, Notification } from '../../models/combat';
import { Condition, ConditionDurationSaves } from '../../models/condition';
import { Monster } from '../../models/monster-group';
import { PC } from '../../models/party';

import InfoCard from '../cards/info-card';
import CombatManagerCard from '../cards/information/combat-manager-card';
import MonsterCard from '../cards/monster-card';
import PCCard from '../cards/pc-card';
import Spin from '../controls/spin';
import CombatListItem from '../list-items/combat-list-item';
import CardGroup from '../panels/card-group';
import HitPointGauge from '../panels/hit-point-gauge';
import MapPanel from '../panels/map-panel';

interface Props {
    combats: Combat[];
    combat: Combat | null;
    showHelp: boolean;
    createCombat: () => void;
    resumeEncounter: (combat: Combat) => void;
    close: (notification: Notification, removeCondition: boolean) => void;
    mapAdd: (combatant: (Combatant & PC) | (Combatant & Monster), x: number, y: number) => void;
    makeCurrent: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    makeActive: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    makeDefeated: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    removeCombatant: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    addCondition: (combatant: Combatant & Monster) => void;
    editCondition: (combatant: Combatant & Monster, condition: Condition) => void;
    removeCondition: (combatant: Combatant & Monster, conditionID: string) => void;
    mapMove: (combatant: (Combatant & PC) | (Combatant & Monster), dir: string) => void;
    mapRemove: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    endTurn: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
    changeHP: (combatant: Combatant & Monster, hp: number, temp: number) => void;
    changeValue: (source: {}, type: string, value: any) => void;
    nudgeValue: (source: {}, type: string, delta: number) => void;
}

interface State {
    selectedTokenID: string | null;
    addingToMapID: string | null;
}

export default class CombatManagerScreen extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedTokenID: null,  // The ID of the combatant that's selected
            addingToMapID: null     // The ID of the combatant we're adding to the map
        };
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

    private createCard(combatant: (Combatant & PC) | (Combatant & Monster)) {
        let mode = 'combat';
        if (this.props.combat && this.props.combat.map) {
            mode += ' tactical';
            const onMap = this.props.combat.map.items.find(i => i.id === combatant.id);
            mode += onMap ? ' on-map' : ' off-map';
        }

        switch (combatant.type) {
            case 'pc':
                return (
                    <PCCard
                        key='selected'
                        combatant={combatant as Combatant & PC}
                        mode={mode}
                        changeValue={(source, type, value) => this.props.changeValue(source, type, value)}
                        nudgeValue={(source, type, delta) => this.props.nudgeValue(source, type, delta)}
                        makeCurrent={c => this.props.makeCurrent(c as Combatant & PC)}
                        makeActive={c => this.props.makeActive(c as Combatant & PC)}
                        makeDefeated={c => this.props.makeDefeated(c as Combatant & PC)}
                        removeCombatant={c => this.props.removeCombatant(c as Combatant & PC)}
                        mapAdd={c => this.setAddingToMapID(c.id)}
                        mapMove={(c, dir) => this.props.mapMove(c as Combatant & PC, dir)}
                        mapRemove={c => this.props.mapRemove(c as Combatant & PC)}
                        endTurn={c => this.props.endTurn(c as Combatant & PC)}
                    />
                );
            case 'monster':
                return (
                    <MonsterCard
                        key='selected'
                        combatant={combatant as Combatant & Monster}
                        mode={mode}
                        combat={this.props.combat as Combat}
                        changeValue={(c, type, value) => this.props.changeValue(c, type, value)}
                        nudgeValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
                        makeCurrent={c => this.props.makeCurrent(c as Combatant & Monster)}
                        makeActive={c => this.props.makeActive(c as Combatant & Monster)}
                        makeDefeated={c => this.props.makeDefeated(c as Combatant & Monster)}
                        removeCombatant={c => this.props.removeCombatant(c as Combatant & Monster)}
                        addCondition={c => this.props.addCondition(c as Combatant & Monster)}
                        editCondition={(c, condition) => this.props.editCondition(c as Combatant & Monster, condition)}
                        removeCondition={(c, conditionID) => this.props.removeCondition(c as Combatant & Monster, conditionID)}
                        nudgeConditionValue={(c, type, delta) => this.props.nudgeValue(c, type, delta)}
                        mapAdd={c => this.setAddingToMapID(c.id)}
                        mapMove={(c, dir) => this.props.mapMove(c as Combatant & Monster, dir)}
                        mapRemove={c => this.props.mapRemove(c as Combatant & Monster)}
                        endTurn={(c) => this.props.endTurn(c as Combatant & Monster)}
                        changeHP={(c, hp, temp) => this.props.changeHP(c as Combatant & Monster, hp, temp)}
                    />
                );
            default:
                return null;
        }
    }

    private addCombatantToMap(x: number, y: number) {
        if (this.props.combat) {
            const combatant = this.props.combat.combatants.find(c => c.id === this.state.addingToMapID);
            if (combatant) {
                this.props.mapAdd(combatant, x, y);
            }
            this.setAddingToMapID(null);
        }
    }

    public render() {
        try {
            if (this.props.combat) {
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

                if (this.props.showHelp && (pending.length !== 0)) {
                    const pendingHelp = (
                        <div key='pending-help'>
                            <InfoCard
                                getContent={() =>
                                    <div>
                                        <div className='section'>these combatants are not yet part of the encounter</div>
                                        <div className='section'>set initiative on each of them, then add them to the encounter</div>
                                    </div>
                                }
                            />
                        </div>
                    );
                    pending = [pendingHelp].concat(pending);
                }

                if (this.props.showHelp && (current.length === 0)) {
                    const activeHelp = (
                        /* tslint:disable:max-line-length */
                        <div key='active-help'>
                            <InfoCard
                                getContent={() =>
                                    <div>
                                        <div className='section'>these are the combatants taking part in this encounter; you can select them to see their stat blocks (on the right)</div>
                                        <div className='section'>to begin the encounter, select the first combatant and press the <b>start turn</b> button on their stat block</div>
                                    </div>
                                }
                            />
                        </div>
                        /* tslint:enable:max-line-length */
                    );
                    active = [activeHelp].concat(active);
                }

                if (current.length === 0) {
                    current.push(
                        <InfoCard
                            key='current'
                            getContent={() =>
                                <div className='section'>the current initiative holder will be displayed here</div>
                            }
                        />
                    );
                }

                const notifications = this.props.combat.notifications.map(n => (
                    <NotificationPanel
                        key={n.id}
                        notification={n}
                        close={(notification, removeCondition) => this.props.close(notification, removeCondition)}
                    />
                ));

                let mapSection = null;
                if (this.props.combat.map) {
                    mapSection = (
                        <MapPanel
                            map={this.props.combat.map}
                            mode='combat'
                            showOverlay={this.state.addingToMapID !== null}
                            combatants={this.props.combat.combatants}
                            selectedItemID={this.state.selectedTokenID ? this.state.selectedTokenID : undefined}
                            setSelectedItemID={id => {
                                if (id) {
                                    this.setSelectedTokenID(id);
                                }
                            }}
                            gridSquareClicked={(x, y) => this.addCombatantToMap(x, y)}
                        />
                    );
                }

                let selectedCombatant = null;
                if (this.state.selectedTokenID) {
                    const combatant = this.props.combat.combatants.find(c => c.id === this.state.selectedTokenID);
                    if (combatant && !combatant.current) {
                        selectedCombatant = this.createCard(combatant);
                    }
                }
                if (!selectedCombatant) {
                    selectedCombatant = (
                        <InfoCard
                            key='selected'
                            getContent={() =>
                                <div className='section'>select a pc or monster to see its details here</div>
                            }
                        />
                    );
                }

                return (
                    <div className='combat-manager row collapse'>
                        <div className='columns small-4 medium-4 large-4 scrollable'>
                            <CardGroup
                                heading='initiative holder'
                                content={current}
                            />
                        </div>
                        <div className='columns small-4 medium-4 large-4 scrollable'>
                            {notifications}
                            <CardGroup
                                heading='waiting for intiative to be entered'
                                content={pending}
                                hidden={pending.length === 0}
                                showToggle={true}
                            />
                            {mapSection}
                            <CardGroup
                                heading='combatants in the encounter'
                                content={active}
                                hidden={active.length === 0}
                            />
                            <CardGroup
                                heading='defeated'
                                content={defeated}
                                hidden={defeated.length === 0}
                                showToggle={true}
                            />
                        </div>
                        <div className='columns small-4 medium-4 large-4 scrollable'>
                            <CardGroup
                                heading='selected combatant'
                                content={[selectedCombatant]}
                            />
                        </div>
                    </div>
                );
            } else {
                let help = null;
                if (this.props.showHelp) {
                    help = (
                        <CombatManagerCard />
                    );
                }

                const combats: JSX.Element[] = [];
                this.props.combats.forEach(c => {
                    combats.push(
                        <CombatListItem
                            key={c.id}
                            combat={c}
                            selected={false}
                            setSelection={combat => this.props.resumeEncounter(combat)}
                        />
                    );
                });

                return (
                    <div className='combat-manager row collapse'>
                        <div className='columns small-4 medium-4 large-3 scrollable list-column'>
                            {help}
                            <button onClick={() => this.props.createCombat()}>start a new combat</button>
                            {combats}
                        </div>
                        <div className='columns small-8 medium-8 large-9 scrollable' />
                    </div>
                );
            }
        } catch (e) {
            console.error(e);
        }
    }
}

interface NotificationProps {
    notification: Notification;
    close: (notification: Notification, removeCondition: boolean) => void;
}

class NotificationPanel extends React.Component<NotificationProps> {
    private saveSuccess(notification: Notification) {
        // Reduce save by 1
        const condition = this.props.notification.condition as Condition;
        if (condition && condition.duration) {
            if ((condition.duration.type === 'saves') || (condition.duration.type === 'rounds')) {
                condition.duration.count -= 1;
                if (condition.duration.count === 0) {
                    // Remove the condition
                    this.close(notification, true);
                } else {
                    this.close(notification);
                }
            }
        }
    }

    private close(notification: Notification, removeCondition = false) {
        this.props.close(notification, removeCondition);
    }

    public render() {
        const combatant = this.props.notification.combatant as (Combatant & Monster);
        const condition = this.props.notification.condition as Condition;

        const name = combatant.displayName || combatant.name || 'unnamed monster';
        switch (this.props.notification.type) {
            case 'condition-save':
                const duration = condition.duration as ConditionDurationSaves;
                let saveType = duration.saveType.toString();
                if (saveType !== 'death') {
                    saveType = saveType.toUpperCase();
                }
                return (
                    <div key={this.props.notification.id} className='notification'>
                        <div className='text'>
                            {name} must make a {saveType} save against dc {duration.saveDC}
                        </div>
                        <div className='buttons'>
                            <button onClick={() => this.saveSuccess(this.props.notification)}>success</button>
                            <button onClick={() => this.close(this.props.notification)}>ok</button>
                        </div>
                    </div>
                );
            case 'condition-end':
                return (
                    <div key={this.props.notification.id} className='notification'>
                        <div className='text'>
                            {name} is no longer affected by condition {condition.name}
                        </div>
                        <div className='buttons'>
                            <button onClick={() => this.close(this.props.notification)}>ok</button>
                        </div>
                    </div>
                );
            default:
                return null;
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
        let style = 'combatant-row ' + this.props.combatant.type;
        if (this.props.combatant.current || this.props.selected) {
            style += ' highlight';
        }

        return (
            <div className={style} onClick={e => this.onClick(e)}>
                <div className='name'>
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
    }
}

interface PCRowProps {
    combatant: Combatant & PC;
    combat: Combat;
    selected: boolean;
    select: (combatant: Combatant & PC) => void;
}

class PCRow extends React.Component<PCRowProps> {
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
        if (!this.props.combatant.current && !this.props.selected && this.props.select) {
            this.props.select(this.props.combatant);
        }
    }

    public render() {
        let style = 'combatant-row ' + this.props.combatant.type;
        if (this.props.combatant.current || this.props.selected) {
            style += ' highlight';
        }

        const notes = [];
        if (this.props.combat.map) {
            if (!this.props.combatant.pending && !this.props.combat.map.items.find(i => i.id === this.props.combatant.id)) {
                notes.push(
                    <div key='not-on-map' className='note'>not on the map</div>
                );
            }
        }

        return (
            <div className={style} onClick={e => this.onClick(e)}>
                <div className='name'>
                    {this.props.combatant.displayName || this.props.combatant.name || 'combatant'} {this.props.combatant.player ? '| ' + this.props.combatant.player : ''}
                    <span className='info'>{this.getInformationText()}</span>
                </div>
                <div className='content'>
                    <div className='section key-stats'>
                        <div className='key-stat'>
                            <div className='stat-value'>{this.props.combatant.initiative}</div>
                            <div className='stat-label'>init</div>
                        </div>
                        <div className='key-stat'>
                            <div className='stat-value'></div>
                        </div>
                        <div className='key-stat'>
                            <div className='stat-value'></div>
                        </div>
                    </div>
                    {notes}
                </div>
            </div>
        );
    }
}

interface MonsterRowProps {
    combatant: Combatant & Monster;
    combat: Combat;
    selected: boolean;
    select: (combatant: Combatant & Monster) => void;
}

class MonsterRow extends React.Component<MonsterRowProps> {
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
        if (!this.props.combatant.current && !this.props.selected && this.props.select) {
            this.props.select(this.props.combatant);
        }
    }

    public render() {
        let style = 'combatant-row ' + this.props.combatant.type;
        if (this.props.combatant.current || this.props.selected) {
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
                    <div key={c.id} className='condition'>
                        <div className='condition-name'>{name}</div>
                        <ul>
                            {description}
                        </ul>
                    </div>
                );
            });
        }

        const notes = [];
        if (this.props.combat.map) {
            if (!this.props.combatant.pending && !this.props.combat.map.items.find(i => i.id === this.props.combatant.id)) {
                notes.push(
                    <div key='not-on-map' className='note'>not on the map</div>
                );
            }
        }

        return (
            <div className={style} onClick={e => this.onClick(e)}>
                <div className='name'>
                    {this.props.combatant.displayName || this.props.combatant.name || 'combatant'}
                    <span className='info'>{this.getInformationText()}</span>
                </div>
                <div className='content'>
                    <div className='section key-stats'>
                        <div className='key-stat'>
                            <div className='stat-value'>{this.props.combatant.initiative}</div>
                            <div className='stat-label'>init</div>
                        </div>
                        <div className='key-stat'>
                            <div className='stat-value'>{this.props.combatant.ac}</div>
                            <div className='stat-label'>ac</div>
                        </div>
                        <div className='key-stat'>
                            <div className='stat-value'>{hp}</div>
                            <div className='stat-label'>hp</div>
                        </div>
                    </div>
                    {gauge}
                    {conditions}
                    {notes}
                </div>
            </div>
        );
    }
}
