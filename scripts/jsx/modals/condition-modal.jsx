class ConditionModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            condition: props.condition,
        };
    }

    render() {
        try {
            var conditions = CONDITION_TYPES.map(condition => {
                var description = [];
                if (condition === this.state.condition.name) {
                    // TODO: Add spin for exhaustion
                    var text = conditionText(this.state.condition);
                    for (var n = 0; n !== text.length; ++n) {
                        description.push(<div key={n}>{text[n]}</div>);
                    }
                }
                return (
                    <div key={condition}>
                        <div className="section subheading">{condition}</div>
                        {description}
                    </div>
                );
            });

            var selectedDuration = this.state.condition.duration ? this.state.condition.duration.type : "none";
            var durations = ["none", "saves", "combatant", "rounds"].map(duration => {
                var description = [];
                if (duration === selectedDuration) {
                    // TODO
                }
                return (
                    <div key={duration}>
                        <div className="section subheading">{conditionDurationText(this.state.condition)}</div>
                        {description}
                    </div>
                );
            });

            return (
                <div>
                    <div className="row">
                        <div className="columns small-6 medium-6 large-6 list-column">
                            <div className="heading">condition</div>
                            {conditions}
                        </div>
                        <div className="columns small-6 medium-6 large-6 list-column">
                            <div className="heading">duration</div>
                            {durations}
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}