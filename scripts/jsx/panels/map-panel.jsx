/*
Map item is: {
    type: tile | monster | pc
    x: number,
    y: number,
    width: number,
    height: number,
}
*/

class MapPanel extends React.Component {
    constructor(props) {
        super();
        this.state = {
            map: props.map
        };
    }

    getMapDimensions(border = 1) {
        var dimensions = null;

        this.state.map.items.forEach(i => {
            if (!dimensions) {
                dimensions = {
                    minX: i.x,
                    maxX: i.x,
                    minY: i.y,
                    maxY: i.y
                };
            } else {
                dimensions.minX = Math.min(dimensions.minX, i.x);
                dimensions.maxX = Math.max(dimensions.maxX, i.x + i.width - 1);
                dimensions.minY = Math.min(dimensions.minY, i.y);
                dimensions.maxY = Math.max(dimensions.maxY, i.y + i.height - 1);
            }
        });

        // Apply the border
        dimensions.minX -= border;
        dimensions.maxX += border;
        dimensions.minY -= border;
        dimensions.maxY += border;

        dimensions.width = 1 + dimensions.maxX - dimensions.minX;
        dimensions.height = 1 + dimensions.maxY - dimensions.minY;

        return dimensions;
    }

    getSideLength() {
        switch (this.props.mode) {
            case "thumbnail":
                return 5;
            case "edit":
            case "combat":
                return 25;
        }

        return 0;
    }

    getPosition(x, y, width, height, mapDimensions) {
        var sideLength = this.getSideLength();

        return {
            left: "calc(" + sideLength + "px * " + (x - mapDimensions.minX) + ")",
            top: "calc(" + sideLength + "px * " + (y - mapDimensions.minY) + ")",
            width: "calc(" + sideLength + "px * " + width + ")",
            height: "calc(" + sideLength + "px * " + height + ")"
        };
    }

    render() {
        try {
            // TEMP
            this.state.map.items = [
                {
                    type: "tile",
                    x: 0,
                    y: 0,
                    width: 10,
                    height: 5,
                }, {
                    type: "tile",
                    x: 10,
                    y: 0,
                    width: 2,
                    height: 10,
                }, {
                    type: "monster",
                    x: 2,
                    y: 2,
                    width: 2,
                    height: 2,
                }, {
                    type: "pc",
                    x: 4,
                    y: 2,
                    width: 1,
                    height: 1,
                }
            ];

            var border = 2;
            var mapDimensions = this.getMapDimensions(border);

            // Draw the grid squares
            var grid = [];
            if (this.props.mode === "edit") {
                for (var x = mapDimensions.minX; x !== mapDimensions.maxX + 1; ++x) {
                    for (var y = mapDimensions.minY; y !== mapDimensions.maxY + 1; ++y) {
                        var pos = this.getPosition(x, y, 1, 1, mapDimensions);
                        grid.push(
                            <div className="grid-square" style={pos}></div>
                        );
                    }
                }
            }

            // Draw the map tiles
            var tiles = this.state.map.items
                .filter(i => i.type === "tile")
                .map(i => {
                    var pos = this.getPosition(i.x, i.y, i.width, i.height, mapDimensions);
                    return (
                        <div className="tile" style={pos}></div>
                    );
                });

            // Draw the tokens
            var tokens = [];
            if (this.props.mode !== "edit") {
                tokens = this.state.map.items
                .filter(i => (i.type === "monster") || (i.type === "pc"))
                .map(i => {
                    var pos = this.getPosition(i.x, i.y, i.width, i.height, mapDimensions);
                    return (
                        <div className={"token " + i.type} style={pos}></div>
                    );
                });
            }

            // Draw tools
            var tools = null;
            switch (this.props.mode) {
                case "thumbnail":
                    // No tools in thumbnail mode
                    break
                case "edit":
                    // TODO: Draw tools
                    // If no selection: tiles you can drag onto the map
                    // If selection: allow editing the selection
                    tools = (
                        <div className="tools">
                            <div className="heading">tools</div>
                        </div>
                    )
                    break
                case "combat":
                    // TODO: Draw tools
                    // If no selection: combatants that aren't on the map
                    // If selection: allow editing the selection
                    tools = (
                        <div className="tools">
                            <div className="heading">tools</div>
                        </div>
                    )
                    break
            }

            return (
                <div className={"map-panel " + this.props.mode}>
                    {tools}
                    <div className="grid" style={{ height: (this.getSideLength() * mapDimensions.height) + "px" }}>
                        {grid}
                        {tiles}
                        {tokens}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}