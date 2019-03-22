import React from 'react';

import * as utils from '../../utils';

import { Combat, Combatant, Monster, PC, Notification, Condition } from '../../models/models';

import PCCard from '../cards/pc-card';
import MonsterCard from '../cards/monster-card';
import InfoCard from '../cards/info-card';
import MapPanel from '../panels/map-panel';
import CardGroup from '../panels/card-group';
import CombatManagerCard from '../cards/information/combat-manager-card';
import CombatListItem from '../list-items/combat-list-item';
import Spin from '../controls/spin';
import HitPointGauge from '../panels/hit-point-gauge';

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

    setSelectedTokenID(id: string | null) {
        this.setState({
            selectedTokenID: id
        });
    }

    setAddingToMapID(id: string | null) {
        this.setState({
            addingToMapID: id
        });
    }

    createCard(combatant: (Combatant & PC) | (Combatant & Monster)) {
        var mode = "combat";
        if (this.props.combat && this.props.combat.map) {
            mode += " tactical";
            var onMap = this.props.combat.map.items.find(i => i.id === combatant.id);
            mode += onMap ? " on-map" : " off-map";
        }

        switch (combatant.type) {
            case "pc":
                return (
                    <PCCard
                        key="selected"
                        combatant={combatant as Combatant & PC}
                        mode={mode}
                        changeValue={(combatant, type, value) => this.props.changeValue(combatant, type, value)}
                        nudgeValue={(combatant, type, delta) => this.props.nudgeValue(combatant, type, delta)}
                        makeCurrent={combatant => this.props.makeCurrent(combatant as Combatant & PC)}
                        makeActive={combatant => this.props.makeActive(combatant as Combatant & PC)}
                        makeDefeated={combatant => this.props.makeDefeated(combatant as Combatant & PC)}
                        removeCombatant={combatant => this.props.removeCombatant(combatant as Combatant & PC)}
                        mapAdd={combatant => this.setAddingToMapID(combatant.id)}
                        mapMove={(combatant, dir) => this.props.mapMove(combatant as Combatant & PC, dir)}
                        mapRemove={combatant => this.props.mapRemove(combatant as Combatant & PC)}
                        endTurn={combatant => this.props.endTurn(combatant as Combatant & PC)}
                    />
                );
            case "monster":
                return (
                    <MonsterCard
                        key="selected"
                        combatant={combatant as Combatant & Monster}
                        mode={mode}
                        combat={this.props.combat as Combat}
                        changeValue={(combatant, type, value) => this.props.changeValue(combatant, type, value)}
                        nudgeValue={(combatant, type, delta) => this.props.nudgeValue(combatant, type, delta)}
                        makeCurrent={combatant => this.props.makeCurrent(combatant as Combatant & Monster)}
                        makeActive={combatant => this.props.makeActive(combatant as Combatant & Monster)}
                        makeDefeated={combatant => this.props.makeDefeated(combatant as Combatant & Monster)}
                        removeCombatant={combatant => this.props.removeCombatant(combatant as Combatant & Monster)}
                        addCondition={(combatant) => this.props.addCondition(combatant as Combatant & Monster)}
                        editCondition={(combatant, condition) => this.props.editCondition(combatant as Combatant & Monster, condition)}
                        removeCondition={(combatant, conditionID) => this.props.removeCondition(combatant as Combatant & Monster, conditionID)}
                        nudgeConditionValue={(condition, type, delta) => this.props.nudgeValue(condition, type, delta)}
                        mapAdd={combatant => this.setAddingToMapID(combatant.id)}
                        mapMove={(combatant, dir) => this.props.mapMove(combatant as Combatant & Monster, dir)}
                        mapRemove={combatant => this.props.mapRemove(combatant as Combatant & Monster)}
                        endTurn={(combatant) => this.props.endTurn(combatant as Combatant & Monster)}
                        changeHP={(combatant, hp, temp) => this.props.changeHP(combatant as Combatant & Monster, hp, temp)}
                    />
                );
            default:
                return null;
        }
    }

    addCombatantToMap(x: number, y: number) {
        if (this.props.combat) {
            var combatant = this.props.combat.combatants.find(c => c.id === this.state.addingToMapID);
            if (combatant) {
                this.props.mapAdd(combatant, x, y);
            }
            this.setAddingToMapID(null);
        }
    }

    render() {
        try {
            var leftPaneContent = null;
            var centrePaneContent = null;
            var rightPaneContent = null;

            if (this.props.combat) {
                var current: JSX.Element[] = [];
                var pending: JSX.Element[] = [];
                var active: JSX.Element[] = [];
                var defeated: JSX.Element[] = [];

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
                                select={combatant => this.setSelectedTokenID(combatant.id)}
                                selected={combatant.id === this.state.selectedTokenID}
                                nudgeValue={(combatant, type, delta) => this.props.nudgeValue(combatant, type, delta)}
                                makeActive={combatant => this.props.makeActive(combatant)}
                            />
                        );
                    }
                    if (!combatant.pending && combatant.active && !combatant.defeated) {
                        active.push(
                            <CombatantRow
                                key={combatant.id}
                                combatant={combatant}
                                combat={this.props.combat as Combat}
                                select={combatant => this.setSelectedTokenID(combatant.id)}
                                selected={combatant.id === this.state.selectedTokenID}
                            />
                        );
                    }
                    if (!combatant.pending && !combatant.active && combatant.defeated) {
                        defeated.push(
                            <CombatantRow
                                key={combatant.id}
                                combatant={combatant}
                                combat={this.props.combat as Combat}
                                select={combatant => this.setSelectedTokenID(combatant.id)}
                                selected={combatant.id === this.state.selectedTokenID}
                            />
                        );
                    }
                });

                if (this.props.showHelp && (pending.length !== 0)) {
                    var pendingHelp = (
                        <div key="pending-help">
                            <InfoCard
                                getContent={() =>
                                    <div>
                                        <div className="section">these combatants are not yet part of the encounter</div>
                                        <div className="section">set initiative on each of them, then add them to the encounter</div>
                                    </div>
                                }
                            />
                        </div>
                    );
                    pending = [pendingHelp].concat(pending);
                }

                if (this.props.showHelp && (current.length === 0)) {
                    var activeHelp = (
                        <div key="active-help">
                            <InfoCard
                                getContent={() =>
                                    <div>
                                        <div className="section">these are the combatants taking part in this encounter; you can select them to see their stat blocks (on the right)</div>
                                        <div className="section">to begin the encounter, select the first combatant and press the <b>start turn</b> button on their stat block</div>
                                    </div>
                                }
                            />
                        </div>
                    );
                    active = [activeHelp].concat(active);
                }

                if (current.length === 0) {
                    current.push(
                        <InfoCard
                            key="current"
                            getContent={() =>
                                <div className="section">the current initiative holder will be displayed here</div>
                            }
                        />
                    );
                }

                var notifications = this.props.combat.notifications.map(n =>
                    <NotificationPanel
                        key={n.id}
                        notification={n}
                        close={(notification, removeCondition) => this.props.close(notification, removeCondition)}
                    />
                );

                var mapSection = null;
                if (this.props.combat.map) {
                    mapSection = (
                        <MapPanel
                            map={this.props.combat.map}
                            mode="combat"
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

                var selectedCombatant = null;
                if (this.state.selectedTokenID) {
                    var combatant = this.props.combat.combatants.find(c => c.id === this.state.selectedTokenID);
                    if (combatant && !combatant.current) {
                        selectedCombatant = this.createCard(combatant);
                    }
                }
                if (!selectedCombatant) {
                    selectedCombatant = (
                        <InfoCard
                            key="selected"
                            getContent={() =>
                                <div className="section">select a pc or monster to see its details here</div>
                            }
                        />
                    );
                }

                leftPaneContent = (
                    <div className="combat-left">
                        <CardGroup
                            heading="initiative holder"
                            content={current}
                        />
                    </div>
                );

                centrePaneContent = (
                    <div className="combat-centre">
                        {notifications}
                        <CardGroup
                            heading="waiting for intiative to be entered"
                            content={pending}
                            hidden={pending.length === 0}
                            showToggle={true}
                        />
                        {mapSection}
                        <CardGroup
                            heading="combatants in the encounter"
                            content={active}
                            hidden={active.length === 0}
                        />
                        <CardGroup
                            heading="defeated"
                            content={defeated}
                            hidden={defeated.length === 0}
                            showToggle={true}
                        />
                    </div>
                );

                rightPaneContent = (
                    <div className="combat-right">
                        <CardGroup
                            heading="selected combatant"
                            content={[selectedCombatant]}
                        />
                    </div>
                );
            } else {
                var help = null;
                if (this.props.showHelp) {
                    help = (
                        <CombatManagerCard />
                    );
                }

                var combats: JSX.Element[] = [];
                this.props.combats.forEach(combat => {
                    combats.push(
                        <CombatListItem
                            key={combat.id}
                            combat={combat}
                            selected={false}
                            setSelection={combat => this.props.resumeEncounter(combat)}
                        />
                    );
                });

                leftPaneContent = (
                    <div className="combat-left">
                        {help}
                        <button onClick={() => this.props.createCombat()}>start a new combat</button>
                        {combats}
                    </div>
                );
            }

            return (
                <div className="combat-manager row collapse">
                    <div className="columns small-4 medium-4 large-3 scrollable list-column">
                        {leftPaneContent}
                    </div>
                    <div className="columns small-4 medium-4 large-6 scrollable list-column">
                        {centrePaneContent}
                    </div>
                    <div className="columns small-4 medium-4 large-3 scrollable list-column">
                        {rightPaneContent}
                    </div>
                </div>
            );
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
    saveSuccess(notification: Notification) {
        // Reduce save by 1
        var condition = this.props.notification.condition as Condition;
        condition.duration.count -= 1;
        if (condition.duration.count === 0) {
            // Remove the condition
            this.close(notification, true);
        } else {
            this.close(notification);
        }
    }

    close(notification: Notification, removeCondition = false) {
        this.props.close(notification, removeCondition);
    }

    render() {
        var combatant = this.props.notification.combatant as (Combatant & Monster);
        var condition = this.props.notification.condition as Condition;

        var name = combatant.displayName || combatant.name || "unnamed monster";
        switch (this.props.notification.type) {
            case "condition-save":
                return (
                    <div key={this.props.notification.id} className="notification">
                        <div className="text">
                            {name} must make a {condition.duration.saveType} save against dc {condition.duration.saveDC}
                        </div>
                        <div className="buttons">
                            <button onClick={() => this.saveSuccess(this.props.notification)}>success</button>
                            <button onClick={() => this.close(this.props.notification)}>ok</button>
                        </div>
                    </div>
                );
            case "condition-end":
                return (
                    <div key={this.props.notification.id} className="notification">
                        <div className="text">
                            {name} is no longer affected by condition {condition.name}
                        </div>
                        <div className="buttons">
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
    getInformationText() {
        if (this.props.selected) {
            return "selected";
        }

        return null;
    }

    onClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (this.props.select) {
            this.props.select(this.props.combatant);
        }
    }

    render() {
        var style = "combatant-row " + this.props.combatant.type;
        if (this.props.combatant.current || this.props.selected) {
            style += " highlight";
        }

        return (
            <div className={style} onClick={e => this.onClick(e)}>
                <div className="name">
                    {this.props.combatant.displayName || this.props.combatant.name || "combatant"}
                    <span className="info">{this.getInformationText()}</span>
                </div>
                <div className="content">
                    <Spin
                        source={this.props.combatant}
                        name="initiative"
                        label="initiative"
                        nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "initiative", delta)}
                    />
                    <button onClick={e => { e.stopPropagation(); this.props.makeActive(this.props.combatant); }}>add to encounter</button>
                </div>
            </div>
        );
    }
}

interface CombatantRowProps {
    combatant: (Combatant & PC) | (Combatant & Monster);
    combat: Combat;
    selected: boolean;
    select: (combatant: (Combatant & PC) | (Combatant & Monster)) => void;
}

class CombatantRow extends React.Component<CombatantRowProps> {
    getInformationText() {
        if (this.props.combatant.current) {
            return "current turn";
        }

        if (this.props.selected) {
            return "selected";
        }

        return null;
    }

    onClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (this.props.select) {
            this.props.select(this.props.combatant);
        }
    }

    getContentPC(pc: Combatant & PC, notes: JSX.Element[]) {
        return (
            <div className="content">
                <div className="section key-stats">
                    <div className="key-stat">
                        <div className="stat-value">{pc.initiative}</div>
                        <div className="stat-label">init</div>
                    </div>
                    <div className="key-stat wide">
                        <div className="stat-value">{pc.player ? pc.player : "-"}</div>
                    </div>
                </div>
                {notes}
            </div>
        );
    }

    getContentMonster(monster: Combatant & Monster, notes: JSX.Element[]) {
        var hp = (monster.hp ? monster.hp : 0).toString();
        if (monster.hpTemp > 0) {
            hp += "+" + monster.hpTemp;
        }
        var gauge = null;
        if (!monster.pending) {
            gauge = (
                <HitPointGauge combatant={monster} />
            );
        }

        var conditions = null;
        if (this.props.combatant.conditions) {
            conditions = this.props.combatant.conditions.map(c => {
                var name = c.name;
                if (c.name === "exhaustion") {
                    name += " (" + c.level + ")";
                }
                if ((c.name === "custom") && (c.text)) {
                    name = c.text;
                }
                if (c.duration) {
                    name += " " + utils.conditionDurationText(c, this.props.combat);
                }
                var description = [];
                var text = utils.conditionText(c);
                for (var n = 0; n !== text.length; ++n) {
                    description.push(<li key={n} className="condition-text">{text[n]}</li>);
                }
                return (
                    <div key={c.id} className="condition">
                        <div className="condition-name">{name}</div>
                        <ul>
                            {description}
                        </ul>
                    </div>
                );
            });
        }

        return (
            <div className="content">
                <div className="section key-stats">
                    <div className="key-stat">
                        <div className="stat-value">{monster.initiative}</div>
                        <div className="stat-label">init</div>
                    </div>
                    <div className="key-stat">
                        <div className="stat-value">{monster.ac}</div>
                        <div className="stat-label">ac</div>
                    </div>
                    <div className="key-stat">
                        <div className="stat-value">{hp}</div>
                        <div className="stat-label">hp</div>
                    </div>
                </div>
                {gauge}
                {conditions}
                {notes}
            </div>
        );
    }

    render() {
        var notes = [];
        if (this.props.combat.map) {
            if (!this.props.combatant.pending && !this.props.combat.map.items.find(i => i.id === this.props.combatant.id)) {
                notes.push(
                    <div key="not-on-map" className="note">not on the map</div>
                );
            }
        }

        var content = null;

        switch (this.props.combatant.type) {
            case "pc":
                content = this.getContentPC(this.props.combatant as Combatant & PC, notes);
                break;
            case "monster":
                content = this.getContentMonster(this.props.combatant as Combatant & Monster, notes);
                break;
            default:
                // Do nothing
                break;
        }

        var style = "combatant-row " + this.props.combatant.type;
        if (this.props.combatant.current || this.props.selected) {
            style += " highlight";
        }

        return (
            <div className={style} onClick={e => this.onClick(e)}>
                <div className="name">
                    {this.props.combatant.displayName || this.props.combatant.name || "combatant"}
                    <span className="info">{this.getInformationText()}</span>
                </div>
                {content}
            </div>
        );
    }
}