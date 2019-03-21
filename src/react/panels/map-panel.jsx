import React from 'react';
import HitPointGauge from '../panels/hit-point-gauge';

export default class MapPanel extends React.Component {

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
            default:
                return 5;
        }
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
                            />
                        );
                    });
            }

            // Draw the drag overlay
            var dragOverlay = [];
            if (this.props.showOverlay) {
                for (var yOver = mapDimensions.minY; yOver !== mapDimensions.maxY + 1; ++yOver) {
                    for (var xOver = mapDimensions.minX; xOver !== mapDimensions.maxX + 1; ++xOver) {
                        var posOver = this.getPosition(xOver, yOver, 1, 1, mapDimensions);
                        dragOverlay.push(
                            <GridSquare
                                key={xOver + "," + yOver}
                                x={xOver}
                                y={yOver}
                                position={posOver}
                                overlay={true}
                                onClick={(x, y) => this.props.gridSquareClicked(x, y)}
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
                        {tokens}
                        {dragOverlay}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}

class GridSquare extends React.Component {
    click(e) {
        e.stopPropagation();
        if (this.props.onClick) {
            this.props.onClick(this.props.x, this.props.y);
        }
    }

    doubleClick(e) {
        e.stopPropagation();
        if (this.props.onDoubleClick) {
            this.props.onDoubleClick(this.props.x, this.props.y);
        }
    }

    render() {
        var style = "grid-square";
        if (this.props.overlay) {
            style += " grid-overlay";
        }

        return (
            <div
                className={style}
                style={this.props.position}
                onClick={e => this.click(e)}
                onDoubleClick={e => this.doubleClick(e)}
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
        var altitudeBadge = null;
        var conditionsBadge = null;
        if (!this.props.simple) {
            var name = this.props.combatant.displayName || this.props.combatant.name;
            initials = (
                <div className="initials">{name.split(' ').map(s => s[0])}</div>
            );

            if (this.props.combatant.type === "monster") {
                hpGauge = (
                    <HitPointGauge combatant={this.props.combatant} />
                );
            }

            if (this.props.combatant.altitude > 0) {
                altitudeBadge = (
                    <div className="badge altitude">&#9206;</div>
                );
            }

            if (this.props.combatant.altitude < 0) {
                altitudeBadge = (
                    <div className="badge altitude">&#9207;</div>
                );
            }

            if ((this.props.combatant.conditions) && (this.props.combatant.conditions.length > 0)) {
                conditionsBadge = (
                    <div className="badge">&#9670;</div>
                );
            }
        }

        return (
            <div
                title={this.props.combatant.displayName || this.props.combatant.name}
                className={style}
                style={this.props.position}
                onClick={e => this.select(e)}
            >
                {initials}
                {hpGauge}
                {altitudeBadge}
                {conditionsBadge}
            </div>
        );
    }
}