/*
<Spin
    source={SOURCEOBJECT}
    name="FIELDNAME"
    label="LABEL"
    factors={[1, 10, 100]}
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

            return (
                <div className="spin">
                    <div className="spin-button" onClick={e => this.click(e, -1)}>
                        <img className="image" src="resources/icons/minus.svg" />
                    </div>
                    <div className="info">
                        <div className="info-label">{this.props.label}</div>
                        <div className={style}>{value}</div>
                    </div>
                    <div className="spin-button" onClick={e => this.click(e, +1)}>
                        <img className="image" src="resources/icons/plus.svg" />
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