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

class Spin extends React.Component {
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
        this.props.nudgeValue(delta * this.state.factor);
    }

    touchEnd(e, delta) {
        e.preventDefault();
        e.stopPropagation();
        this.props.nudgeValue(delta * this.state.factor);
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

            var minus = [];
            var plus = [];

            if (this.props.factors) {
                this.props.factors.forEach(factor => {
                    minus.push(
                        <div key={"minus" + factor} className="spin-button factor" onTouchEnd={e => this.touchEnd(e, -1)} onClick={e => this.click(e, -1 * factor)}>
                            {"-" + factor}
                        </div>
                    );
        
                    plus.push(
                        <div key={"plus" + factor} className="spin-button factor" onTouchEnd={e => this.touchEnd(e, +1)} onClick={e => this.click(e, +1 * factor)}>
                            {"+" + factor}
                        </div>
                    );        
                });

                minus.reverse();
            } else {
                minus.push(
                    <div key="minus1" className="spin-button" onTouchEnd={e => this.touchEnd(e, -1)} onClick={e => this.click(e, -1)}>
                        <img className="image" src="resources/images/minus.svg" />
                    </div>
                );
    
                plus.push(
                    <div key="plus1" className="spin-button" onTouchEnd={e => this.touchEnd(e, +1)} onClick={e => this.click(e, +1)}>
                        <img className="image" src="resources/images/plus.svg" />
                    </div>
                );
            }

            var infoWidth = 80 * (this.props.factors? this.props.factors.length : 1);

            return (
                <div className={this.props.disabled ? "spin disabled" : "spin"}>
                    <div className="minus">
                        {minus}
                    </div>
                    <div className="info" style={{ width: "calc(100% - " + infoWidth + "px)" }}>
                        <div className="info-label">{this.props.label}</div>
                        <div className={style}>{value}</div>
                    </div>
                    <div className="plus">
                        {plus}
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}