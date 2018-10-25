class ConditionPanel extends React.Component {
    constructor() {
        super();
        this.state = {
            showDetails: false
        };
    }

    toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        })
    }

    render() {
        try {
            var details = [];
            if (this.state.showDetails) {
                if (this.props.condition.name === "exhausted") {
                    details.push(
                        <div key="spin" className="section spin">
                            <div className="spin-button wide toggle" onClick={() => this.props.nudgeConditionValue(this.props.condition, "level", -1)}>
                                <img className="image" src="content/minus.svg" />
                            </div>
                            <div className="spin-value">
                                <div className="spin-label">level</div>
                                <div className="spin-label">{this.props.condition.level}</div>
                            </div>
                            <div className="spin-button wide toggle" onClick={() => this.props.nudgeConditionValue(this.props.condition, "level", +1)}>
                                <img className="image" src="content/plus.svg" />
                            </div>
                        </div>
                    );
                    details.push(<div key="div1" className="divider"></div>);
                }
                var text = conditionText(this.props.condition);
                for (var n = 0; n != text.length; ++n) {
                    details.push(<div key={n} className="condition-text">{text[n]}</div>);
                }
                details.push(<div key="div2" className="divider"></div>);
                details.push(
                    <div key="remove" className="section">
                        <ConfirmButton key="remove" text="remove condition" callback={() => this.props.removeCondition(this.props.condition)} />
                    </div>
                );
            }

            var content = null;
            if (details.length !== 0) {
                content = (
                    <div className="mini-card-content">
                        {details}
                    </div>
                );
            }

            var name = this.props.condition.name;
            if (this.props.condition.name === "exhausted") {
                name += " (" + this.props.condition.level + ")";
            }
            var imageStyle = this.state.showDetails ? "image rotate" : "image";

            return (
                <div className="mini-card">
                    <div className="heading" onClick={() => this.toggleDetails()}>
                        <div className="title">{name}</div>
                        <img className={imageStyle} src="content/down-arrow.svg" />
                    </div>
                    {content}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}