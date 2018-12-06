/*
Tile is: {
    type: tile | token
    x: number,
    y: number,
    width: number,
    height: number,
}
*/

class MapPanel extends React.Component {
    getMapDimensions() {
        var dimensions = {
            minX: 0,
            maxX: 0,
            minY: 0,
            maxY: 0,
            width: () => 1 + maxX - minX,
            height: () => 1 + maxY - minY
        };

        this.props.map.items.forEach(i => {
            dimensions.minX = Math.min(dimensions.minX, i.x);
            dimensions.maxX = Math.max(dimensions.maxX, i.x);
            dimensions.minY = Math.min(dimensions.minY, i.y);
            dimensions.maxY = Math.max(dimensions.maxY, i.y);
        });

        return dimensions;
    }

    getLocation(x, y, width, height, mapDimensions) {
        // TODO: Translate tile location to canvas location
        return {
            left: 0,
            top: 0,
            width: "5px",
            height: "5px"
        };
    }

    render() {
        try {
            // TODO: Find the dimensions of the map
            var mapDimensions = this.getMapDimensions();

            // TODO: Build the grid squares
            var grid = [];
            for (var x = mapDimensions.minX; x !== mapDimensions.maxX + 1; ++x) {
                for (var y = mapDimensions.minY; y !== mapDimensions.maxY + 1; ++y) {
                    var loc = this.getLocation(x, y, 1, 1);
                    grid.push(
                        <div className="grid-square" style={loc}>{x}, {y}</div>
                    );
                }
            }

            var tiles = this.props.map.items
                .filter(i => i.type === "tile")
                .map(i => {
                    // TODO: Draw tile
                    var loc = this.getLocation(i.x, i.y, i.width, i.height);
                    return (
                        <div className="tile">{i.type}</div>
                    );
                });

            var tokens = this.props.map.items
                .filter(i => i.type === "token")
                .map(i => {
                    // TODO: Draw token
                    var loc = this.getLocation(i.x, i.y, i.width, i.height);
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
                    <div className="grid">
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