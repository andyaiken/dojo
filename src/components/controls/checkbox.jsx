import React from 'react';

import checked from "../../resources/images/checked.svg";
import unchecked from "../../resources/images/unchecked.svg";

/*
<Checkbox
    label="LABEL"
    checked={BOOLEAN}
    disabled={BOOLEAN}
    changeValue={value => this.changeValue(SOURCEOBJECT, FIELDNAME, value)}
/>
*/

export default class Checkbox extends React.Component {
    click(e) {
        e.stopPropagation();
        this.props.changeValue(!this.props.checked);
    }

    render() {
        try {
            return (
                <div className={this.props.disabled ? "checkbox disabled" : "checkbox"} onClick={e => this.click(e)}>
                    <img className="image" src={this.props.checked ? checked : unchecked} alt="check" />
                    <div className="checkbox-label">{this.props.label}</div>
                </div>
            );

        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}