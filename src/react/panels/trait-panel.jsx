import React from 'react';
import * as utils from '../../utils';
import ConfirmButton from '../controls/confirm-button';
import Expander from '../controls/expander';

export default class TraitPanel extends React.Component {
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