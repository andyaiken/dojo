import React from 'react';

import * as utils from '../../utils';

import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';

export default class TraitsPanel extends React.Component {
    render() {
        try {
            var traits = [];
            var actions = [];
            var legendaryActions = [];
            var lairActions = [];
            var regionalEffects = [];

            for (var n = 0; n !== this.props.combatant.traits.length; ++n) {
                var action = this.props.combatant.traits[n];
                var item = (
                    <TraitPanel
                        key={action.id}
                        trait={action}
                        edit={this.props.edit}
                        template={this.props.template}
                        changeTrait={(action, type, value) => this.props.changeTrait(action, type, value)}
                        removeTrait={action => this.props.removeTrait(action)}
                        copyTrait={action => this.props.copyTrait(action)}
                    />
                );

                switch (action.type) {
                    case "trait":
                        traits.push(item);
                        break;
                    case "action":
                        actions.push(item);
                        break;
                    case "legendary":
                        legendaryActions.push(item);
                        break;
                    case "lair":
                        lairActions.push(item);
                        break;
                    case "regional":
                        regionalEffects.push(item);
                        break;
                    default:
                        // Do nothing
                        break;
                }
            }

            if (this.props.edit) {
                traits.push(
                    <button key="add" onClick={() => this.props.addTrait("trait")}>add a new trait</button>
                );
                actions.push(
                    <button key="add" onClick={() => this.props.addTrait("action")}>add a new action</button>
                );
                legendaryActions.push(
                    <button key="add" onClick={() => this.props.addTrait("legendary")}>add a new legendary action</button>
                );
                lairActions.push(
                    <button key="add" onClick={() => this.props.addTrait("lair")}>add a new lair action</button>
                );
                regionalEffects.push(
                    <button key="add" onClick={() => this.props.addTrait("regional")}>add a new regional effect</button>
                );

                return (
                    <div className="row collapse">
                        <div className="columns small-4 medium-4 large-4 list-column">
                            <div className="section subheading">traits</div>
                            {traits}
                        </div>
                        <div className="columns small-4 medium-4 large-4 list-column">
                            <div className="section subheading">actions</div>
                            {actions}
                        </div>
                        <div className="columns small-4 medium-4 large-4 list-column">
                            <div className="section subheading">legendary actions</div>
                            {legendaryActions}
                            <div className="section subheading">lair actions</div>
                            {lairActions}
                            <div className="section subheading">regional effects</div>
                            {regionalEffects}
                        </div>
                    </div>
                );    
            }

            return (
                <div>
                    <div style={{ display: traits.length > 0 ? "" : "none" }}>
                        <div className="section subheading">traits</div>
                        {traits}
                    </div>
                    <div style={{ display: actions.length > 0 ? "" : "none" }}>
                        <div className="section subheading">actions</div>
                        {actions}
                    </div>
                    <div style={{ display: legendaryActions.length > 0 ? "" : "none" }}>
                        <div className="section subheading">legendary actions</div>
                        {legendaryActions}
                    </div>
                    <div style={{ display: lairActions.length > 0 ? "" : "none" }}>
                        <div className="section subheading">lair actions</div>
                        {lairActions}
                    </div>
                    <div style={{ display: regionalEffects.length > 0 ? "" : "none" }}>
                        <div className="section subheading">regional effects</div>
                        {regionalEffects}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}

class TraitPanel extends React.Component {
    render() {
        try {
            var heading = this.props.trait.name || "unnamed " + utils.traitType(this.props.trait.type);
            if (this.props.trait.usage) {
                heading += " (" + this.props.trait.usage + ")";
            }

            if (this.props.edit) {
                var details = (
                    <div className="section">
                        <input type="text" placeholder="name" value={this.props.trait.name} onChange={event => this.props.changeTrait(this.props.trait, "name", event.target.value)} />
                        <input type="text" placeholder="usage" value={this.props.trait.usage} onChange={event => this.props.changeTrait(this.props.trait, "usage", event.target.value)} />
                        <textarea placeholder="details" value={this.props.trait.text} onChange={event => this.props.changeTrait(this.props.trait, "text", event.target.value)} />
                        <div className="divider"></div>
                        <ConfirmButton text="delete" callback={() => this.props.removeTrait(this.props.trait)} />
                    </div>
                );
    
                return (
                    <Expander
                        text={this.props.trait.name || "unnamed " + utils.traitType(this.props.trait.type)}
                        content={details}
                    />
                );
            } else if (this.props.template) {
                return (
                    <div key={this.props.trait.id} className="section trait">
                        <b>{heading}</b> {this.props.trait.text}
                        <button onClick={() => this.props.copyTrait(this.props.trait)}>copy</button>
                    </div>
                );
            } else {
                return (
                    <div key={this.props.trait.id} className="section trait">
                        <b>{heading}</b> {this.props.trait.text}
                    </div>
                );
            }
        } catch (e) {
            console.error(e);
        }
    }
}