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
            var expander = null;
            if (this.props.factors) {
                expander = (
                    <div className="spin-expander" onClick={() => this.toggleExpanded()}>&bull; &bull; &bull;</div>
                );
            }

            var factorSelector = null;
            if (this.props.factors && this.state.expanded) {
                var options = this.props.factors.map(factor => {
                    return {
                        id: factor,
                        text: factor
                    }
                });

                factorSelector = (
                    <div className="factor-selector">
                        <Selector
                            options={options}
                            noBorder={true}
                            selectedID={this.state.factor}
                            select={optionID => this.setState({ factor: optionID })}
                        />
                    </div>
                );
            }

            var style = "info-value";
            var value = this.props.source[this.props.name];
            if (value === 0) {
                style += " dimmed";
            }

            if (this.props.display) {
                value = this.props.display(value);
            }

            return (
                <div className={this.props.disabled ? "spin disabled" : "spin"}>
                    <div className="spin-button" onTouchEnd={e => this.touchEnd(e, -1)} onClick={e => this.click(e, -1)}>
                        <img className="image" src="content/minus.svg" />
                    </div>
                    <div className="info">
                        <div className="info-label">{this.props.label}</div>
                        <div className={style}>{value}</div>
                    </div>
                    <div className="spin-button" onTouchEnd={e => this.touchEnd(e, +1)} onClick={e => this.click(e, +1)}>
                        <img className="image" src="content/plus.svg" />
                    </div>
                    {expander}
                    {factorSelector}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}