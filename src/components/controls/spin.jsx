import React from 'react';

import plus from "../../resources/images/plus.svg";
import minus from "../../resources/images/minus.svg";

/*
<Spin
    source={SOURCEOBJECT}
    name="FIELDNAME"
    label="LABEL"
    factors={[1, 10, 100]}
    disabled={BOOLEAN}
    display={value => this.displayValue(value)}
    nudgeValue={delta => this.nudgeValue(SOURCEOBJECT, FIELDNAME, delta)}
/>
*/

export default class Spin extends React.Component {
    constructor() {
        super();

        this.state = {
            expanded: false,
            factor: 1
        };
    }

    toggleExpanded() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    click(e, delta) {
        e.stopPropagation();
        this.props.nudgeValue(delta);
    }

    touchEnd(e, delta) {
        e.preventDefault();
        e.stopPropagation();
        this.props.nudgeValue(delta);
    }

    render() {
        try {
            var style = "info-value";
            var value = this.props.source[this.props.name];
            if (value === 0) {
                style += " dimmed";
            }

            if (this.props.display) {
                value = this.props.display(value);
            }

            var minusBtns = [];
            var plusBtns = [];

            if (this.props.factors) {
                this.props.factors.forEach(factor => {
                    minusBtns.push(
                        <div key={"minus" + factor} className="spin-button factor" onTouchEnd={e => this.touchEnd(e, -1 * factor)} onClick={e => this.click(e, -1 * factor)}>
                            {"-" + factor}
                        </div>
                    );
        
                    plusBtns.push(
                        <div key={"plus" + factor} className="spin-button factor" onTouchEnd={e => this.touchEnd(e, +1 * factor)} onClick={e => this.click(e, +1 * factor)}>
                            {"+" + factor}
                        </div>
                    );        
                });

                minusBtns.reverse();
            } else {
                minusBtns.push(
                    <div key="minus1" className="spin-button" onTouchEnd={e => this.touchEnd(e, -1)} onClick={e => this.click(e, -1)}>
                        <img className="image" src={minus} alt="minus" />
                    </div>
                );
    
                plusBtns.push(
                    <div key="plus1" className="spin-button" onTouchEnd={e => this.touchEnd(e, +1)} onClick={e => this.click(e, +1)}>
                        <img className="image" src={plus} alt="plus" />
                    </div>
                );
            }

            var infoWidth = 80 * (this.props.factors? this.props.factors.length : 1);

            return (
                <div className={this.props.disabled ? "spin disabled" : "spin"}>
                    <div className="minus">
                        {minusBtns}
                    </div>
                    <div className="info" style={{ width: "calc(100% - " + infoWidth + "px)" }}>
                        <div className="info-label">{this.props.label}</div>
                        <div className={style}>{value}</div>
                    </div>
                    <div className="plus">
                        {plusBtns}
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}