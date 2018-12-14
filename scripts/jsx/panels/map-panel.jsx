class MapPanel extends React.Component {
    constructor(props) {
        super();
        this.state = {
            map: props.map,
            selectedItemID: null,
            drag: null
        };
    }

    setSelectedItem(e, id) {
        e.stopPropagation();

        if (id) {
            var item = this.getMapItem(id);
            var canSelect = false;
            if (item) {
                switch (item.type) {
                    case "tile":
                        canSelect = (this.props.mode === "edit");
                        break;
                    case "monster":
                    case "pc":
                        canSelect = (this.props.mode === "combat");
                        break;
                }
            } else {
                // We selected an off-map token
                canSelect = true;
            }
            if (!canSelect) {
                id = null;
            }
        }

        this.setState({
            selectedItemID: id
        }, () => {
            if (this.props.selectionChanged) {
                this.props.selectionChanged(id);
            }
        });
    }

    setDrag(item) {
        this.setState({
            drag: item
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Map manipulation methods

    getMapItem(id) {
        return this.state.map.items.find(i => i.id === id);
    }

    addMapTile(x, y) {
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

    dropItem(x, y) {
        var item = this.state.drag;
        item.x = x;
        item.y = y;

        this.state.map.items = this.state.map.items.filter(i => i.id !== item.id);
        this.state.map.items.push(item);

        this.setState({
            map: this.state.map,
            selectedItemID: item.id,
            drag: null
        }, () => {
            if (this.props.selectionChanged) {
                this.props.selectionChanged(item.id);
            }
        });
    }

    offMapDragOver(e) {
        var onMap = this.state.map.items.find(i => i.id === this.state.drag.id) !== null;
        if (onMap) {
            e.preventDefault();
        }
    }

    offMapDrop() {
        this.state.map.items = this.state.map.items.filter(i => i.id !== this.state.drag.id);
        this.setState({
            map: this.state.map,
            drag: null
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
            var border = (this.props.mode === "edit") ? 2 : 0;
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
                                onClick={e => this.setSelectedItem(e, null)}
                                onDoubleClick={(x, y) => this.addMapTile(x, y)}
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
                    return (
                        <MapTile
                            key={i.id}
                            tile={i}
                            position={pos}
                            selected={this.state.selectedItemID === i.id}
                            select={(e, id) => this.setSelectedItem(e, id)}
                        />
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
                        <MapToken
                            key={i.id}
                            token={i}
                            position={pos}
                            selected={this.state.selectedItemID ===  i.id}
                            select={(e, id) => this.setSelectedItem(e, id)}
                            dragToken={item => this.setDrag(item)}
                        />
                    );
                });
            }

            // Drag overlay
            var dragOverlay = [];
            if (this.state.drag) {
                for (var y = mapDimensions.minY; y !== mapDimensions.maxY + 1; ++y) {
                    for (var x = mapDimensions.minX; x !== mapDimensions.maxX + 1; ++x) {
                        var pos = this.getPosition(x, y, 1, 1, mapDimensions);
                        dragOverlay.push(
                            <GridSquare
                                key={x + "," + y}
                                x={x}
                                y={y}
                                position={pos}
                                overlay={true}
                                dropItem={(x, y) => this.dropItem(x, y)}
                            />
                        );
                    }
                }
            }

            // Draw tools
            var leftTools = null;
            var lowerTools = null;
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
                        leftTools = (
                            <div className="tools">
                                <p>to add a new tile to the map, double-click on an empty grid square</p>
                                <p>to edit an existing tile, click on it once to select it</p>
                            </div>
                        );
                    }
                    break;
                case "combat":
                    var tokenIDs = this.state.map.items
                        .filter(item => (item.type === "monster") || (item.type === "pc"))
                        .map(item => item.id);
                    var offmap = this.props.combatants
                        .filter(c => !tokenIDs.includes(c.id))
                        .map(c => {
                            return (
                                <OffMapCombatant
                                    key={c.id}
                                    combatant={c}
                                    selected={c.id === this.state.selectedItemID}
                                    click={(e, id) => this.setSelectedItem(e, id)}
                                    dragToken={item => this.setDrag(item)}
                                />
                            );
                        });
                    if (offmap.length === 0) {
                        offmap.push(
                            <div key="empty" className="empty">
                                drag tokens here to remove them from the map
                            </div>
                        );
                    }

                    var style = "off-map-tokens";
                    if (this.state.drag) {
                        style += " drop-target";
                    }
                    lowerTools = (
                        <div
                            className={style}
                            onDragOver={e => this.offMapDragOver(e)}
                            onDrop={() => this.offMapDrop()}
                        >
                            {offmap}
                        </div>
                    );
                    break;
            }

            return (
                <div className={"map-panel " + this.props.mode} onClick={e => this.setSelectedItem(e, null)}>
                    <div>
                        {leftTools}
                        <div className="grid" style={{ height: ((this.getSideLength() * mapDimensions.height) + 1) + "px" }}>
                            {grid}
                            {tiles}
                            {dragOverlay}
                            {tokens}
                        </div>
                    </div>
                    {lowerTools}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}

class OffMapCombatant extends React.Component {
    constructor(props) {
        super();

        var size = miniSize(props.combatant.size);

        var token = createMapItem();
        token.id = props.combatant.id;
        token.type = props.combatant.type;
        token.width = size;
        token.height = size;

        this.state = {
            token: token
        }
    }

    render() {
        var style = "off-map-token";
        if (this.props.selected) {
            style += " selected";
        }

        return (
            <div className={style} title={this.props.combatant.name} onClick={e => this.props.click(e, this.props.combatant.id)}>
                <MapToken
                    token={this.state.token}
                    selected={this.state.selectedItemID ===  this.state.token.id}
                    select={(e, id) => this.props.click(e, id)}
                    dragToken={token => this.props.dragToken(token)}
                />
                <div className="name">{this.props.combatant.name}</div>
            </div>
        );
    }
}

class GridSquare extends React.Component {
    constructor() {
        super();

        this.state = {
            dropTarget: false
        };
    }

    setDropTarget(value) {
        this.setState({
            dropTarget: value
        });
    }

    dragOver(e) {
        e.preventDefault();
        this.setDropTarget(true);
    }

    dragLeave() {
        this.setDropTarget(false);
    }

    render() {
        var style = "grid-square";
        if (this.props.overlay) {
            style += " grid-overlay";
        }
        if (this.state.dropTarget) {
            style += "drop-target";
        }

        return (
            <div
                className={style}
                style={this.props.position}
                onClick={e => this.props.onClick(e)}
                onDoubleClick={() => this.props.onDoubleClick(this.props.x, this.props.y)}
                onDragOver={e => this.dragOver(e)}
                onDragLeave={() => this.dragLeave()}
                onDrop={() => this.props.dropItem(this.props.x, this.props.y)}
            >
            </div>
        );
    }
}

class MapTile extends React.Component {
    render() {
        var style = "tile";
        if (this.props.selected) {
            style += " selected";
        }

        return (
            <div
                className={style}
                style={this.props.position}
                onClick={e => this.props.select(e, this.props.tile.id)}>
            </div>
        );
    }
}

class MapToken extends React.Component {
    startDrag() {
        this.props.dragToken(this.props.token);
    }

    stopDrag() {
        this.props.dragToken(null);
    }

    render() {
        var style = "token " + this.props.token.type;
        if (this.props.selected) {
            style += " selected";
        }

        if (!this.props.position) {
            this.props.position = {
                width: (this.props.token.width * 25) + "px",
                height: (this.props.token.height * 25) + "px"
            }
        }

        return (
            <div
                className={style}
                style={this.props.position}
                onClick={e => this.props.select(e, this.props.token.id)}
                draggable="true"
                onDragStart={() => this.startDrag()}
                onDragEnd={() => this.stopDrag()}
            >
            </div>
        );
    }
}