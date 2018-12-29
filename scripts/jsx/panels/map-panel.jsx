class MapPanel extends React.Component {

    getMapDimensions(border = 1) {
        var dimensions = null;

        this.props.map.items.filter(i => {
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

    render() {
        try {
            var border = (this.props.mode === "edit") ? 2 : 1;
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
                                onClick={() => this.props.setSelectedItemID(null)}
                                onDoubleClick={(x, y) => this.props.addMapTile(x, y)}
                            />
                        );
                    }
                }
            }

            // Draw the map tiles
            var tiles = this.props.map.items
                .filter(i => i.type === "tile")
                .map(i => {
                    var pos = this.getPosition(i.x, i.y, i.width, i.height, mapDimensions);
                    return (
                        <MapTile
                            key={i.id}
                            tile={i}
                            position={pos}
                            selectable={this.props.mode === "edit"}
                            selected={this.props.selectedItemID === i.id}
                            thumbnail={this.props.mode === "thumbnail"}
                            select={id => this.props.mode === "edit" ? this.props.setSelectedItemID(id) : null}
                        />
                    );
                });

            // Draw the tokens
            var tokens = [];
            if (this.props.mode !== "edit") {
                tokens = this.props.map.items
                    .filter(i => (i.type === "monster") || (i.type === "pc"))
                    .map(i => {
                        var pos = this.getPosition(i.x, i.y, i.width, i.height, mapDimensions);
                        var combatant = this.props.combatants.find(c => c.id === i.id);
                        return (
                            <MapToken
                                key={i.id}
                                token={i}
                                position={pos}
                                combatant={combatant}
                                selectable={this.props.mode === "combat"}
                                simple={this.props.mode === "thumbnail"}
                                selected={this.props.selectedItemID ===  i.id}
                                select={id => this.props.setSelectedItemID(id)}
                                startDrag={id => this.props.setDraggedTokenID(id)}
                                setSelectedItemID={id => this.props.mode === "combat" ? this.props.setSelectedItemID(id) : null}
                                setDraggedTokenID={item => this.props.setDraggedTokenID(item.id)}
                            />
                        );
                    });
            }

            // Draw the drag overlay
            var dragOverlay = [];
            if (this.props.draggedTokenID) {
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
                                dropItem={(x, y) => this.props.dropItem(x, y)}
                            />
                        );
                    }
                }
            }

            var style = "map-panel " + this.props.mode;
            return (
                <div className={style} onClick={() => this.props.setSelectedItemID(null)}>
                    <div className="grid" style={{ height: ((this.getSideLength() * mapDimensions.height) + 1) + "px" }}>
                        {grid}
                        {tiles}
                        {dragOverlay}
                        {tokens}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}

class OffMapPanel extends React.Component {
    dragOver(e) {
        e.preventDefault();
    }

    drop() {
        // We are removing the dragged token from the map
        var onMap = this.props.tokens.find(i => i.id === this.props.draggedTokenID) !== null;
        if (onMap) {
            this.props.draggedOffMap(this.props.draggedTokenID);
        }
    }

    render() {
        var pending = [];
        var active = [];
        var defeated = [];

        this.props.tokens.forEach(c => {
            var shelf = null;
            if (c.pending) {
                shelf = pending;
            }
            if (c.active) {
                shelf = active;
            }
            if (c.defeated) {
                shelf = defeated;
            }

            shelf.push(
                <OffMapCombatant
                    key={c.id}
                    combatant={c}
                    selected={c.id === this.props.selectedItemID}
                    setSelectedItemID={id => this.props.setSelectedItemID(id)}
                    setDraggedTokenID={id => this.props.setDraggedTokenID(id)}
                />
            );
        });

        // TODO: For some reason this code cancels dragging as soon as it starts
        var message = "you can drag these map tokens onto the map";
        /*
        if ((this.props.draggedTokenID) || (this.props.tokens.length === 0)) {
            message = "drag map tokens onto this box to remove them from the map";
        }
        */

        var style = "off-map-tokens";
        if (this.props.draggedTokenID) {
            style += " drop-target";
        }

        return (
            <div
                className={style}
                onDragOver={e => this.dragOver(e)}
                onDrop={() => this.drop()}
            >
                <div className="text">
                    {message}
                </div>
                <div className="shelf" style={{ display: pending.length > 0 ? "block" : "none" }}>
                    <div className="shelf-name">waiting for initiative to be entered</div>
                    {pending}
                </div>
                <div className="shelf" style={{ display: active.length > 0 ? "block" : "none" }}>
                    <div className="shelf-name">active combatants</div>
                    {active}
                </div>
                <div className="shelf" style={{ display: defeated.length > 0 ? "block" : "none" }}>
                    <div className="shelf-name">defeated</div>
                    {defeated}
                </div>
            </div>
        );
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
        return (
            <div className="off-map-token">
                <MapToken
                    token={this.state.token}
                    combatant={this.props.combatant}
                    selectable={true}
                    simple={true}
                    selected={this.state.selectedItemID ===  this.state.token.id}
                    select={id => this.props.setSelectedItemID(id)}
                    startDrag={id => this.props.setDraggedTokenID(id)}
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
    select(e) {
        if (this.props.selectable) {
            e.stopPropagation();
            this.props.select(this.props.tile.id);
        }
    }

    render() {
        var style = "tile " + this.props.tile.terrain;
        if (this.props.selected) {
            style += " selected";
        }
        if (this.props.thumbnail) {
            style += " thumbnail";
        }

        return (
            <div
                className={style}
                style={this.props.position}
                onClick={e => this.select(e)}>
            </div>
        );
    }
}

class MapToken extends React.Component {
    select(e) {
        if (this.props.selectable) {
            e.stopPropagation();
            this.props.select(this.props.token.id);
        }
    }

    startDrag() {
        if (this.props.selectable) {
            this.props.startDrag(this.props.token.id);
        }
    }

    endDrag() {
        this.props.startDrag(null);
    }

    render() {
        var style = "token " + this.props.token.type;
        if (this.props.selected) {
            style += " selected";
        }
        if (this.props.combatant.current) {
            style += " current";
        }

        if (!this.props.position) {
            this.props.position = {
                width: (this.props.token.width * 25) + "px",
                height: (this.props.token.height * 25) + "px"
            }
        }

        var initials = null;
        var hpGauge = null;
        var conditionsBadge = null;
        if (!this.props.simple) {
            initials = (
                <div className="initials">{this.props.combatant.name.split(' ').map(s => s[0])}</div>
            );

            if (this.props.combatant.type === "monster") {
                hpGauge = (
                    <HitPointGauge combatant={this.props.combatant} />
                );
            }

            if ((this.props.combatant.conditions) && (this.props.combatant.conditions.length > 0)) {
                conditionsBadge = (
                    <div className="badge">{this.props.combatant.conditions.length}</div>
                );
            }
        }

        return (
            <div
                title={this.props.combatant.name}
                className={style}
                style={this.props.position}
                onClick={e => this.select(e)}
                draggable="true"
                onDragStart={() => this.startDrag()}
                onDragEnd={() => this.endDrag()}
            >
                {initials}
                {hpGauge}
                {conditionsBadge}
            </div>
        );
    }
}