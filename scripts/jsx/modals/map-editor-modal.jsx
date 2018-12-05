class MapEditorModal extends React.Component {
    constructor(props) {
        super();
        this.state = {
            map: props.map
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Helper methods

    nudgeValue(field, delta) {
        var source = this.state.map;
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
        var source = this.state.map;
        var tokens = field.split(".");
        tokens.forEach(token => {
            if (token === tokens[tokens.length - 1]) {
                source[token] = value;

                if (notify) {
                    this.setState({
                        map: this.state.map
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
                <div className="map-editor">
                    <MapPanel
                        map={this.props.map}
                        mode="edit"
                    />
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}