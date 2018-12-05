class MapPanel extends React.Component {
    getMapDimensions() {
        // Calculate map dimensions
        return {
            minX: 0,
            maxX: 0,
            minY: 0,
            maxY: 0,
            width: () => 1 + maxX - minX,
            height: () => 1 + maxY - minY
        };
    }

    getLocation(mapItem) {
        // TODO: Translate tile location to canvas location
        return {
            left: 0,
            right: 1,
            top: 0,
            bottom: 1
        };
    }

    render() {
        try {

            // TODO: Find the dimensions of the map
            var mapDimensions = this.getMapDimensions();

            // TODO: Build the grid squares
            var grid = [];

            var tiles = this.props.map.items
                .filter(i => i.type === "tile")
                .map(i => {
                    // TODO: Draw tile
                    return (
                        <div className="tile">{i.type}</div>
                    );
                });

            var tokens = this.props.map.items
                .filter(i => i.type === "token")
                .map(i => {
                    // TODO: Draw token
                    return (
                        <div className="token">{i.type}</div>
                    );
                });

            var tools = null;
            switch (this.props.mode) {
                case "view":
                    // No tools in view mode
                    break
                case "edit":
                    // TODO: Draw tools
                    // If no selection: tiles you can drag onto the map
                    // If selection: allow editing the selection
                    break
                case "combat":
                    // TODO: Draw tools
                    // If no selection: combatants that aren't on the map
                    // If selection: allow editing the selection
                    break
            }

            return (
                <div className={"map-panel " + this.props.mode}>
                    <div className="tileContainer">
                        {grid}
                        {tiles}
                        {tokens}
                    </div>
                    {tools}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}