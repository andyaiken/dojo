/*
Map item is: {
    id: id,
    type: tile | monster | pc,
    x: number,
    y: number,
    width: number,
    height: number
}
*/

class MapPanel extends React.Component {
    constructor(props) {
        super();
        this.state = {
            map: props.map,
            selectedItemID: null
        };
    }

    setSelectedItem(id) {
        this.setState({
            selectedItemID: id
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Map manipulation methods

    getMapItem(id) {
        return this.state.map.items.find(i => i.id === id);
    }

    removeMapItem(item) {
        var index = this.state.map.items.indexOf(item);
        this.state.map.items.splice(index, 1);

        this.setState({
            map: this.state.map,
            selectedItemID: null
        });
    }

    moveMapItem(item, dir) {
        switch (dir) {
            case "N":
                item.y -= 1;
                break;
            case "E":
                item.x += 1;
                break;
            case "S":
                item.y += 1;
                break;
            case "W":
                item.x -= 1;
                break;
        }

        this.setState({
            map: this.state.map
        });
    }

    bigMapItem(item, dir) {
        switch (dir) {
            case "N":
                item.y -= 1;
                item.height += 1;
                break;
            case "E":
                item.width += 1;
                break;
            case "S":
                item.height += 1;
                break;
            case "W":
                item.x -= 1;
                item.width += 1;
                break;
        }

        this.setState({
            map: this.state.map
        });
    }

    smallMapItem(item, dir) {
        switch (dir) {
            case "N":
                if (item.height > 1) {
                    item.y += 1;
                    item.height -= 1;
                }
                break;
            case "E":
                if (item.width > 1) {
                    item.width -= 1;
                }
                break;
            case "S":
                if (item.height > 1) {
                    item.height -= 1;
                }
                break;
            case "W":
                if (item.width > 1) {
                    item.x += 1;
                    item.width -= 1;
                }
                break;
        }

        this.setState({
            map: this.state.map
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Rendering helper methods

    getMapDimensions(border = 1) {
        var dimensions = null;

        this.state.map.items.filter(i => {
            if (this.props.mode === "edit") {
                return i.type === "tile";
            }
            return true;
        }).forEach(i => {
            if (!dimensions) {
                dimensions = {
                    minX: i.x,
                    maxX: i.x + i.width - 1,
                    minY: i.y,
                    maxY: i.y + i.height - 1
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

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Rendering methods

    render() {
        try {
            // TEMP
            if (this.state.map.items.length === 0) {
                this.state.map.items = [
                    {
                        id: "1",
                        type: "tile",
                        x: 0,
                        y: 0,
                        width: 10,
                        height: 5,
                    }, {
                        id: "2",
                        type: "tile",
                        x: 10,
                        y: 0,
                        width: 2,
                        height: 10,
                    }, {
                        id: "3",
                        type: "monster",
                        x: 2,
                        y: 2,
                        width: 2,
                        height: 2,
                    }, {
                        id: "4",
                        type: "pc",
                        x: 4,
                        y: 2,
                        width: 1,
                        height: 1,
                    }
                ];
            }

            var border = 2;
            var mapDimensions = this.getMapDimensions(border);

            // Draw the grid squares
            var grid = [];
            if (this.props.mode === "edit") {
                for (var x = mapDimensions.minX; x !== mapDimensions.maxX + 1; ++x) {
                    for (var y = mapDimensions.minY; y !== mapDimensions.maxY + 1; ++y) {
                        var pos = this.getPosition(x, y, 1, 1, mapDimensions);
                        grid.push(
                            <div
                                className="grid-square"
                                style={pos}
                                onClick={() => this.setSelectedItem(null)}>
                            </div>
                        );
                    }
                }
            }

            // Draw the map tiles
            var tiles = this.state.map.items
                .filter(i => i.type === "tile")
                .map(i => {
                    var pos = this.getPosition(i.x, i.y, i.width, i.height, mapDimensions);
                    var style = this.state.selectedItemID ===  i.id ? "tile selected" : "tile";
                    return (
                        <div
                            className={style}
                            style={pos}
                            onClick={() => this.props.mode === "edit" ? this.setSelectedItem(i.id) : null}>
                        </div>
                    );
                });

            // Draw the tokens
            var tokens = [];
            if (this.props.mode !== "edit") {
                tokens = this.state.map.items
                .filter(i => (i.type === "monster") || (i.type === "pc"))
                .map(i => {
                    var pos = this.getPosition(i.x, i.y, i.width, i.height, mapDimensions);
                    var style = (this.state.selectedItemID ===  i.id ? "token selected" : "token") + " " + i.type;
                    return (
                        <div
                            className={style}
                            style={pos}
                            onClick={() => this.props.mode === "combat" ? this.setSelectedItem(i.id) : null}>
                        </div>
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
                    if (this.state.selectedItemID) {
                        var item = this.getMapItem(this.state.selectedItemID);
                        tools = (
                            <div className="tools">
                                <div className="heading">selected tile</div>
                                <div className="subheading">size</div>
                                <div className="section">{item.width} sq x {item.height} sq</div>
                                <div className="section">{item.width * 5} ft x {item.height * 5} ft</div>
                                <div className="subheading">move</div>
                                <div className="section">
                                    <Radial
                                        click={dir => this.moveMapItem(item, dir)}
                                    />
                                </div>
                                <div className="subheading">resize</div>
                                <div className="section side-by-side">
                                    <Radial
                                        click={dir => this.bigMapItem(item, dir)}
                                    />
                                    <Radial
                                        inverted={true}
                                        click={dir => this.smallMapItem(item, dir)}
                                    />
                                </div>
                                <div className="subheading">rotate</div>
                                <div className="section">anti-clockwise | clockwise</div>
                                <div className="subheading">remove</div>
                                <div className="section">
                                    <button onClick={() => this.removeMapItem(item)}>remove tile</button>
                                </div>
                            </div>
                        );
                    } else {
                        // TODO: Tiles you can drag onto the map
                        tools = (
                            <div className="tools">
                                <div className="heading">tools</div>
                            </div>
                        );
                    }
                    break;
                case "combat":
                    if (this.state.selectedItemID) {
                        // TODO: Allow editing the selection
                        tools = (
                            <div className="tools">
                                <div className="heading">tools</div>
                            </div>
                        );
                    } else {
                        // TODO: Combatants that aren't on the map
                        tools = (
                            <div className="tools">
                                <div className="heading">tools</div>
                            </div>
                        );
                    }
                    break;
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