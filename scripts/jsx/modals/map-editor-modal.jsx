class MapEditorModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            monster: props.monster
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helper methods

    nudgeValue(field, delta) {
        var source = this.state.monster;
        var value = null;
        var tokens = field.split(".");
        tokens.forEach(token => {
            if (token === tokens[tokens.length - 1]) {
                value = source[token];
            } else {
                source = source[token];
            }
        });

        var newValue = value + delta;
        this.changeValue(field, newValue);
    }

    changeValue(field, value, notify = true) {
        var source = this.state.monster;
        var tokens = field.split(".");
        tokens.forEach(token => {
            if (token === tokens[tokens.length - 1]) {
                source[token] = value;

                if (notify) {
                    this.setState({
                        monster: this.state.monster
                    });
                }
            } else {
                source = source[token];
            }
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    render() {
        try {
            return (
                <div className="about">
                    <div className="row">
                        <div className="columns small-12 medium-12 large-12 list-column">
                            <div className="heading">X</div>
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}