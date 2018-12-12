class MapPanel extends React.Component {
    constructor(props) {
        super();
        this.state = {
            map: props.map,
            selectedItemID: null
        };
    }

    setSelectedItem(id) {
        if (id) {
            var item = this.getMapItem(id);
            var canSelect = false;
            switch (item.type) {
                case "tile":
                    canSelect = (this.props.mode === "edit");
                    break;
                case "monster":
                case "pc":
                    canSelect = (this.props.mode === "combat");
                    break;
            }
            this.setState({
                selectedItemID: canSelect ? id : null
            });
        } else {
            this.setState({
                selectedItemID: null
            });
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Map manipulation methods

    getMapItem(id) {
        return this.state.map.items.find(i => i.id === id);
    }

    addMapItem(x, y) {
        var item = createMapItem();
        item.x = x;
        item.y = y;
        this.state.map.items.push(item);

        this.setState({
            map: this.state.map,
            selectedItemID: item.id
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

    resizeMapItem(item, dir, dir2) {
        switch (dir2) {
            case "in":
                this.smallMapItem(item, dir);
                break;
            case "out":
                this.bigMapItem(item, dir);
                break;
        }
    }

    cloneMapItem(item) {
        var copy = JSON.parse(JSON.stringify(item));
        copy.id = guid();
        copy.x += 1;
        copy.y += 1;
        this.state.map.items.push(copy);

        this.setState({
            map: this.state.map,
            selectedItemID: copy.id
        });
    }

    removeMapItem(item) {
        var index = this.state.map.items.indexOf(item);
        this.state.map.items.splice(index, 1);

        this.setState({
            map: this.state.map,
            selectedItemID: null
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

        if (!dimensions) {
            // The map is blank
            if (this.props.mode === 'thumbnail') {
                return null;
            }

            dimensions = {
                minX: 0,
                maxX: 0,
                minY: 0,
                maxY: 0
            };
        }

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
            width: "calc((" + sideLength + "px * " + width + ") + 1px)",
            height: "calc((" + sideLength + "px * " + height + ") + 1px)"
        };
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Rendering methods

    render() {
        try {
            var border = 2;
            var mapDimensions = this.getMapDimensions(border);
            if (!mapDimensions) {
                return (
                    <div>(blank map)</div>
                );
            }

            // Draw the grid squares
            var grid = [];
            if (this.props.mode === "edit") {
                for (var y = mapDimensions.minY; y !== mapDimensions.maxY + 1; ++y) {
                    for (var x = mapDimensions.minX; x !== mapDimensions.maxX + 1; ++x) {
                        var pos = this.getPosition(x, y, 1, 1, mapDimensions);
                        grid.push(
                            <GridSquare
                                key={x + "," + y}
                                x={x}
                                y={y}
                                position={pos}
                                click={() => this.setSelectedItem(null)}
                                doubleClick={(x, y) => this.addMapItem(x, y)}
                            />
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
                            key={i.id}
                            className={style}
                            style={pos}
                            onClick={() => this.setSelectedItem(i.id)}>
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
                            key={i.id}
                            className={style}
                            style={pos}
                            onClick={() => this.setSelectedItem(i.id)}>
                        </div>
                    );
                });
            }

            // Draw tools
            var leftTools = null;
            var rightTools = null;
            switch (this.props.mode) {
                case "thumbnail":
                    // No tools in thumbnail mode
                    break
                case "edit":
                    if (this.state.selectedItemID) {
                        var item = this.getMapItem(this.state.selectedItemID);
                        leftTools = (
                            <div className="tools">
                                <MapTileCard
                                    tile={item}
                                    moveMapItem={(item, dir) => this.moveMapItem(item, dir)}
                                    resizeMapItem={(item, dir, dir2) => this.resizeMapItem(item, dir, dir2)}
                                    cloneMapItem={item => this.cloneMapItem(item)}
                                    removeMapItem={item => this.removeMapItem(item)}
                                />
                            </div>
                        );
                    } else {
                        // TODO: Tiles you can drag onto the map
                        leftTools = (
                            <div className="tools">
                                <p>to add a new tile to the map, double-click on an empty grid square</p>
                                <p>to edit an existing tile, click on it once to select it</p>
                            </div>
                        );
                    }
                    break;
                case "combat":
                    if (this.state.selectedItemID) {
                        // TODO: Allow editing the selection
                        rightTools = (
                            <div className="tools">
                                <div className="heading">tools</div>
                                <div>token selected</div>
                            </div>
                        );
                    } else {
                        // TODO: Combatants that aren't on the map
                        rightTools = (
                            <div className="tools">
                                <div className="heading">tools</div>
                                <div>no selection</div>
                            </div>
                        );
                    }
                    break;
            }

            return (
                <div className={"map-panel " + this.props.mode}>
                    {leftTools}
                    <div className="grid" style={{ height: ((this.getSideLength() * mapDimensions.height) + 1) + "px" }}>
                        {grid}
                        {tiles}
                        {tokens}
                    </div>
                    {rightTools}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}

class GridSquare extends React.Component {
    render() {
        return (
            <div
                className="grid-square"
                style={this.props.position}
                onClick={() => this.props.click()}
                onDoubleClick={() => this.props.doubleClick(this.props.x, this.props.y)}
            >
            </div>
        );
    };
}