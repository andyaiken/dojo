import React from 'react';
import * as utils from '../../utils';
import Expander from '../controls/expander';
import Dropdown from '../controls/dropdown';
import ConfirmButton from '../controls/confirm-button';
import Radial from '../controls/radial';
import Spin from '../controls/spin';
import InfoCard from '../cards/info-card';
import AbilityScorePanel from '../panels/ability-score-panel';
import TraitsPanel from '../panels/traits-panel';
import ConditionsPanel from '../panels/conditions-panel';

import arrow from "../../resources/images/down-arrow.svg";

export default class MonsterCard extends React.Component {
    constructor(props) {
        super();
        this.state = {
            cloneName: props.combatant.name + " copy",
            showHP: false,
            showDetails: false,
            damage: 0
        };
    }

    setCloneName(cloneName) {
        this.setState({
            cloneName: cloneName
        });
    }

    toggleHP() {
        this.setState({
            showHP: !this.state.showHP
        })
    }

    toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        })
    }

    setDamage(damage) {
        this.setState({
            damage: damage
        });
    }

    nudgeDamage(delta) {
        var damage = this.state.damage + delta;
        damage = Math.max(damage, 0);

        this.setState({
            damage: damage
        });
    }

    heal() {
        var hp = this.props.combatant.hp + this.state.damage;
        hp = Math.min(hp, this.props.combatant.hpMax);

        this.setState({
            damage: 0
        }, () => {
            this.props.changeHP(this.props.combatant, hp, this.props.combatant.hpTemp);
        });
    }

    damage() {
        var hp = this.props.combatant.hp;
        var temp = this.props.combatant.hpTemp;

        var damage = this.state.damage;

        // Take damage off temp HP first
        var val = Math.min(damage, temp);
        damage -= val;
        temp -= val;

        // Take the rest off HP
        hp -= damage;
        hp = Math.max(hp, 0);

        this.setState({
            damage: 0
        }, () => {
            this.props.changeHP(this.props.combatant, hp, temp);
        });
    }

    description() {
        var sizeAndType = (this.props.combatant.size + " " + this.props.combatant.category).toLowerCase();
        if (this.props.combatant.tag) {
            sizeAndType += " (" + this.props.combatant.tag.toLowerCase() + ")";
        }
        sizeAndType += ", ";

        var align = "";
        if (this.props.combatant.alignment) {
            align = this.props.combatant.alignment.toLowerCase() + ", ";
        }

        var cr = "cr " + utils.challenge(this.props.combatant.challenge);

        return sizeAndType + align + cr;
    }

    monsterIsInWave(wave) {
        return wave.slots.some(s => {
            var group = null;
            this.props.library.forEach(g => {
                if (g.monsters.indexOf(this.props.combatant) !== -1) {
                    group = g;
                }
            });
        
            return (s.monsterGroupName === group.name) && (s.monsterName === this.props.combatant.name)
        })
    }

    render() {
        try {
            var options = [];
            if (this.props.mode.indexOf("no-buttons") === -1) {
                if (this.props.mode.indexOf("view") !== -1) {
                    if (this.props.mode.indexOf("editable") !== -1) {
                        options.push(
                            <button key="edit" onClick={() => this.props.editMonster(this.props.combatant)}>edit monster</button>
                        );

                        options.push(
                            <Expander
                                key="clone"
                                text="clone monster"
                                content={
                                    <div>
                                        <input type="text" placeholder="monster name" value={this.state.cloneName} onChange={event => this.setCloneName(event.target.value)} />
                                        <button onClick={() => this.props.cloneMonster(this.props.combatant, this.state.cloneName)}>create copy</button>
                                    </div>
                                }
                            />
                        );

                        var groupOptions = [];
                        this.props.library.forEach(group => {
                            if (group.monsters.indexOf(this.props.combatant) === -1) {
                                groupOptions.push({
                                    id: group.id,
                                    text: group.name
                                });
                            }
                        });
                        options.push(
                            <Dropdown
                                key="move"
                                options={groupOptions}
                                placeholder="move to group..."
                                select={optionID => this.props.moveToGroup(this.props.combatant, optionID)}
                            />
                        );

                        options.push(<ConfirmButton key="remove" text="delete monster" callback={() => this.props.removeCombatant(this.props.combatant)} />);
                    }
                    if (this.props.mode.indexOf("encounter") !== -1) {
                        if (this.props.slot) {
                            // This card is in an encounter or a wave
                            options.push(<button key="remove" onClick={() => this.props.removeEncounterSlot(this.props.slot)}>remove from encounter</button>);
                        } else {
                            var canAdd = false;
                            // This card is in the library list
                            if (!this.monsterIsInWave(this.props.encounter)) {
                                options.push(<button key="add encounter" onClick={() => this.props.addEncounterSlot(this.props.combatant, null)}>add to encounter</button>);
                                canAdd = true;
                            }
                            this.props.encounter.waves.forEach(wave => {
                                if (!this.monsterIsInWave(wave)) {
                                    options.push(<button key={"add " + wave.id} onClick={() => this.props.addEncounterSlot(this.props.combatant, wave.id)}>add to {wave.name}</button>);
                                    canAdd = true;
                                }
                            });
                            // If we can't add it anywhere, don't show it
                            if (!canAdd) {
                                return (
                                    <InfoCard
                                        getHeading={() => {
                                            return (
                                                <div className="heading">
                                                    <div className="title">{this.props.combatant.name}</div>
                                                </div>
                                            );
                                        }}
                                        getContent={() => {
                                            return (
                                                <div className="section centered">
                                                    <i>this monster is already part of this encounter</i>
                                                </div>
                                            );
                                        }}
                                    />
                                );
                            }
                        }
                    }
                }
                if (this.props.mode.indexOf("combat") !== -1) {
                    if (this.props.mode.indexOf("tactical") !== -1) {
                        if (this.props.mode.indexOf("on-map") !== -1) {
                            options.push(
                                <div key="mapMove" className="section centered">
                                    <Radial
                                        direction="eight"
                                        click={dir => this.props.mapMove(this.props.combatant, dir)}
                                    />
                                </div>
                            );
                            options.push(
                                <Spin
                                    key="altitude"
                                    source={this.props.combatant}
                                    name="altitude"
                                    label="altitude"
                                    display={value => value + " ft."}
                                    nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "altitude", delta * 5)}
                                />
                            );
                            options.push(<button key="mapRemove" onClick={() => this.props.mapRemove(this.props.combatant)}>remove from map</button>);
                        }
                        if (this.props.mode.indexOf("off-map") !== -1) {
                            options.push(<button key="mapAdd" onClick={() => this.props.mapAdd(this.props.combatant)}>add to map</button>);
                        }
                        options.push(<div key="tactical-div" className="divider"></div>);
                    }
                    if (this.props.combatant.pending && !this.props.combatant.active && !this.props.combatant.defeated) {
                        options.push(<ConfirmButton key="remove" text="remove from encounter" callback={() => this.props.removeCombatant(this.props.combatant)} />);
                    }
                    if (!this.props.combatant.pending && this.props.combatant.active && !this.props.combatant.defeated) {
                        if (this.props.combatant.current) {
                            options.push(<button key="endTurn" onClick={() => this.props.endTurn(this.props.combatant)}>end turn</button>);
                            options.push(<button key="makeDefeated" onClick={() => this.props.makeDefeated(this.props.combatant)}>mark as defeated and end turn</button>);
                        } else {
                            options.push(<button key="makeCurrent" onClick={() => this.props.makeCurrent(this.props.combatant)}>start turn</button>);
                            options.push(<button key="makeDefeated" onClick={() => this.props.makeDefeated(this.props.combatant)}>mark as defeated</button>);
                            options.push(<ConfirmButton key="remove" text="remove from encounter" callback={() => this.props.removeCombatant(this.props.combatant)} />);
                        }
                    }
                    if (!this.props.combatant.pending && !this.props.combatant.active && this.props.combatant.defeated) {
                        options.push(<button key="makeActive" onClick={() => this.props.makeActive(this.props.combatant)}>mark as active</button>);
                        options.push(<ConfirmButton key="remove" text="remove from encounter" callback={() => this.props.removeCombatant(this.props.combatant)} />);
                    }
                    options.push(
                        <Expander
                            key="rename"
                            text="change name"
                            content={(
                                <div>
                                    <input type="text" value={this.props.combatant.displayName} onChange={event => this.props.changeValue(this.props.combatant, "displayName", event.target.value)} />
                                </div>
                            )}
                        />
                    );
                }
                if (this.props.mode.indexOf("template") !== -1) {
                    // None
                }
            }

            var stats = null;
            if (this.props.mode.indexOf("view") !== -1) {
                var slotSection = null;
                if (this.props.slot) {
                    slotSection = (
                        <div>
                            <div className="divider"></div>
                            <Spin
                                source={this.props.slot}
                                name="count"
                                label="count"
                                nudgeValue={delta => this.props.nudgeValue(this.props.slot, "count", delta)}
                            />
                        </div>
                    );
                }

                var details = null;
                if (this.state.showDetails) {
                    details = (
                        <div>
                            <div className="divider"></div>
                            <div className="section">
                                <b>ac</b> {this.props.combatant.ac}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.hpMax !== "" ? "" : "none" }}>
                                <b>hp</b> {this.props.combatant.hitDice !== "" ? this.props.combatant.hpMax + " (" + this.props.combatant.hitDice + "d" + utils.hitDieType(this.props.combatant.size) + ")" : this.props.combatant.hpMax}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.speed !== "" ? "" : "none" }}>
                                <b>speed</b> {this.props.combatant.speed}
                            </div>
                            <div className="section">
                                <AbilityScorePanel combatant={this.props.combatant} />
                            </div>
                            <div className="section" style={{ display: this.props.combatant.savingThrows !== "" ? "" : "none" }}>
                                <b>saving throws</b> {this.props.combatant.savingThrows}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.skills !== "" ? "" : "none" }}>
                                <b>skills</b> {this.props.combatant.skills}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.damage.resist !== "" ? "" : "none" }}>
                                <b>damage resistances</b> {this.props.combatant.damage.resist}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.damage.vulnerable !== "" ? "" : "none" }}>
                                <b>damage vulnerabilities</b> {this.props.combatant.damage.vulnerable}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.damage.immune !== "" ? "" : "none" }}>
                                <b>damage immunities</b> {this.props.combatant.damage.immune}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.conditionImmunities !== "" ? "" : "none" }}>
                                <b>condition immunities</b> {this.props.combatant.conditionImmunities}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.senses !== "" ? "" : "none" }}>
                                <b>senses</b> {this.props.combatant.senses}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.languages !== "" ? "" : "none" }}>
                                <b>languages</b> {this.props.combatant.languages}
                            </div>
                            <div className="section" style={{ display: this.props.combatant.equipment !== "" ? "" : "none" }}>
                                <b>equipment</b> {this.props.combatant.equipment}
                            </div>
                            <div className="divider"></div>
                            <TraitsPanel combatant={this.props.combatant} />
                        </div>
                    );
                }

                stats = (
                    <div className="stats">
                        <div className="section centered">
                            <i>{this.description()}</i>
                        </div>
                        {slotSection}
                        {details}
                    </div>
                );
            }
            if (this.props.mode.indexOf("combat") !== -1) {
                stats = (
                    <div className="stats">
                        <div className="section centered">
                            <i>{this.description()}</i>
                        </div>
                        <div className="divider"></div>
                        <Spin
                            source={this.props.combatant}
                            name="hp"
                            label="hit points"
                            factors={[1, 10]}
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "hp", delta)}
                        />
                        <Spin
                            source={this.props.combatant}
                            name="hpTemp"
                            label="temp hp"
                            factors={[1, 10]}
                            nudgeValue={delta => this.props.nudgeValue(this.props.combatant, "hpTemp", delta)}
                        />
                        <div className="divider"></div>
                        <Spin
                            source={this.state}
                            name="damage"
                            factors={[1, 10]}
                            nudgeValue={delta => this.nudgeDamage(delta)}
                        />
                        <div className={this.state.damage > 0 ? "" : "disabled"}>
                            <button className="damage-btn" onClick={() => this.heal()}>heal</button>
                            <button className="damage-btn" onClick={() => this.setDamage(0)}>reset</button>
                            <button className="damage-btn" onClick={() => this.damage()}>damage</button>
                        </div>
                        <div className="section" style={{ display: this.props.combatant.damage.resist !== "" ? "" : "none" }}>
                            <b>damage resistances</b> {this.props.combatant.damage.resist}
                        </div>
                        <div className="section" style={{ display: this.props.combatant.damage.vulnerable !== "" ? "" : "none" }}>
                            <b>damage vulnerabilities</b> {this.props.combatant.damage.vulnerable}
                        </div>
                        <div className="section" style={{ display: this.props.combatant.damage.immune !== "" ? "" : "none" }}>
                            <b>damage immunities</b> {this.props.combatant.damage.immune}
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <AbilityScorePanel combatant={this.props.combatant} />
                        </div>
                        <div className="section" style={{ display: this.props.combatant.ac !== "" ? "" : "none" }}>
                            <b>ac</b> {this.props.combatant.ac}
                        </div>
                        <div className="section" style={{ display: this.props.combatant.savingThrows !== "" ? "" : "none" }}>
                            <b>saving throws</b> {this.props.combatant.savingThrows}
                        </div>
                        <div className="section" style={{ display: this.props.combatant.skills !== "" ? "" : "none" }}>
                            <b>skills</b> {this.props.combatant.skills}
                        </div>
                        <div className="section" style={{ display: this.props.combatant.speed !== "" ? "" : "none" }}>
                            <b>speed</b> {this.props.combatant.speed}
                        </div>
                        <div className="section" style={{ display: this.props.combatant.senses !== "" ? "" : "none" }}>
                            <b>senses</b> {this.props.combatant.senses}
                        </div>
                        <div className="section" style={{ display: this.props.combatant.languages !== "" ? "" : "none" }}>
                            <b>languages</b> {this.props.combatant.languages}
                        </div>
                        <div className="section" style={{ display: this.props.combatant.equipment !== "" ? "" : "none" }}>
                            <b>equipment</b> {this.props.combatant.equipment}
                        </div>
                        <div className="divider"></div>
                        <TraitsPanel combatant={this.props.combatant} />
                        <div className="divider"></div>
                        <div className="section subheading">
                            conditions
                        </div>
                        <div className="section" style={{ display: this.props.combatant.conditionImmunities !== "" ? "" : "none" }}>
                            <b>condition immunities</b> {this.props.combatant.conditionImmunities}
                        </div>
                        <ConditionsPanel
                            combatant={this.props.combatant}
                            combat={this.props.combat}
                            addCondition={() => this.props.addCondition(this.props.combatant)}
                            editCondition={condition => this.props.editCondition(this.props.combatant, condition)}
                            removeCondition={conditionID => this.props.removeCondition(this.props.combatant, conditionID)}
                            nudgeConditionValue={(condition, type, delta) => this.props.nudgeConditionValue(condition, type, delta)}
                            changeConditionValue={(condition, type, value) => this.props.changeConditionValue(condition, type, value)}
                        />
                    </div>
                );
            }
            if (this.props.mode.indexOf("template") !== -1) {
                if (this.props.mode.indexOf("overview") !== -1) {
                    stats = (
                        <div>
                            <div className="section centered">
                                <i>{this.description()}</i>
                            </div>
                            <div className="divider"></div>
                            <div className="section">
                                <b>speed</b> {this.props.combatant.speed || "-"}
                            </div>
                            <div className="section">
                                <b>senses</b> {this.props.combatant.senses || "-"}
                            </div>
                            <div className="section">
                                <b>languages</b> {this.props.combatant.languages || "-"}
                            </div>
                            <div className="section">
                                <b>equipment</b> {this.props.combatant.equipment || "-"}
                            </div>
                        </div>
                    );
                }
                if (this.props.mode.indexOf("abilities") !== -1) {
                    stats = (
                        <div>
                            <div className="section">
                                <AbilityScorePanel combatant={this.props.combatant} />
                            </div>
                            <div className="section">
                                <b>saving throws</b> {this.props.combatant.savingThrows || "-"}
                            </div>
                            <div className="section">
                                <b>skills</b> {this.props.combatant.skills || "-"}
                            </div>
                        </div>
                    );
                }
                if (this.props.mode.indexOf("combat") !== -1) {
                    stats = (
                        <div>
                            <div className="section">
                                <b>ac</b> {this.props.combatant.ac}
                            </div>
                            <div className="section">
                                <b>hp</b> {this.props.combatant.hitDice !== "" ? this.props.combatant.hpMax + " (" + this.props.combatant.hitDice + "d" + utils.hitDieType(this.props.combatant.size) + ")" : this.props.combatant.hpMax}
                            </div>
                            <div className="section">
                                <b>damage immunity</b> {this.props.combatant.damage.immune || "-"}
                            </div>
                            <div className="section">
                                <b>damage resistance</b> {this.props.combatant.damage.resist || "-"}
                            </div>
                            <div className="section">
                                <b>damage vulnerability</b> {this.props.combatant.damage.vulnerable || "-"}
                            </div>
                            <div className="section">
                                <b>condition immunities</b> {this.props.combatant.conditionImmunities || "-"}
                            </div>
                        </div>
                    );
                }
                if (this.props.mode.indexOf("actions") !== -1) {
                    stats = (
                        <TraitsPanel
                            combatant={this.props.combatant}
                            template={true}
                            copyTrait={trait => this.props.copyTrait(trait)}
                        />
                    );
                }
            }

            var toggle = null;
            if (this.props.mode.indexOf("combat") !== -1) {
                // Don't show toggle button for combatant
            } else if (this.props.mode.indexOf("template") !== -1) {
                // Don't show toggle button for template
            } else {
                var imageStyle = this.state.showDetails ? "image rotate" : "image";
                toggle = <img className={imageStyle} src={arrow} alt="arrow" onClick={() => this.toggleDetails()} />
            }

            return (
                <div className="card monster">
                    <div className="heading">
                        <div className="title">{this.props.combatant.displayName || this.props.combatant.name || "unnamed monster"}</div>
                        {toggle}
                    </div>
                    <div className="card-content">
                        {stats}
                        <div style={{ display: options.length > 0 ? "" : "none" }}>
                            <div className="divider"></div>
                            <div className="section">{options}</div>
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}