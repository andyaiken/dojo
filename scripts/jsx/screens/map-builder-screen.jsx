class MapBuilderScreen extends React.Component {
    render() {
        try {
            var help = null;
            if (this.props.showHelp) {
                help = (
                    <MapBuilderCard maps={this.props.maps} />
                );
            }

            var maps = [];
            for (var n = 0; n !== this.props.maps.length; ++n) {
                var map = this.props.maps[n];
                maps.push(
                    <MapListItem
                        key={map.id}
                        map={map}
                        selected={map === this.props.selection}
                        setSelection={map => this.props.selectMap(map)}
                    />
                );
            };

            var map = null;
            if (this.props.selection) {
                var mapCard = (
                    <div className="column">
                        <MapCard
                            selection={this.props.selection}
                            changeValue={(type, value) => this.props.changeValue(this.props.selection, type, value)}
                            editMap={() => this.props.editMap()}
                            removeMap={() => this.props.removeMap()}
                        />
                    </div>
                );

                map = (
                    <CardGroup
                        content={[mapCard]}
                        heading={this.props.selection.name || "unnamed map"}
                        showClose={this.props.selection !== null}
                        close={() => this.props.selectMap(null)}
                    />
                );
            }

            return (
                <div className="map-builder row collapse">
                    <div className="columns small-6 medium-4 large-3 scrollable list-column">
                        {help}
                        <button onClick={() => this.props.addMap("new map")}>add a new map</button>
                        {maps}
                    </div>
                    <div className="columns small-6 medium-8 large-9 scrollable">
                        {map}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}