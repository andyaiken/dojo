import React from 'react';

import { MapItem, Map } from '../../models/map-folio';
import { PC } from '../../models/party';
import { Monster } from '../../models/monster-group';
import { Combatant } from '../../models/combat';

import HitPointGauge from './hit-point-gauge';

interface Props {
    map: Map;
    mode: 'edit' | 'thumbnail' | 'combat';
    combatants: ((Combatant & PC) | (Combatant & Monster))[];
    showOverlay: boolean;
    selectedItemID: string;
    setSelectedItemID: (itemID: string | null) => void;
    addMapTile: (x: number, y: number) => void;
    gridSquareClicked: (x: number, y: number) => void;
}

interface MapDimensions {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
    width: number;
    height: number;
}

export default class MapPanel extends React.Component<Props> {
    public static defaultProps = {
        combatants: null,
        showOverlay: false,
        selectedItemID: null,
        setSelectedItemID: null,
        addMapTile: null,
        gridSquareClicked: null
    };

    getMapDimensions(border: number): MapDimensions | null {
        var dimensions: MapDimensions | null = null;

        this.props.map.items.filter(i => {
            if (this.props.mode === 'edit') {
                return i.type === 'tile';
            }
            return true;
        }).forEach(i => {
            if (!dimensions) {
                dimensions = {
                    minX: i.x,
                    maxX: i.x + i.width - 1,
                    minY: i.y,
                    maxY: i.y + i.height - 1,
                    width: 0,
                    height: 0
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
                maxY: 0,
                width: 0,
                height: 0
            };
        }

        // Apply the border
        dimensions.minX -= border;
        dimensions.maxX += border;
        dimensions.minY -= border;
        dimensions.maxY += border;

        // Set width and height
        dimensions.width = 1 + dimensions.maxX - dimensions.minX;
        dimensions.height = 1 + dimensions.maxY - dimensions.minY;

        return dimensions;
    }

    getSideLength(): number {
        switch (this.props.mode) {
            case 'thumbnail':
                return 5;
            case 'edit':
            case 'combat':
                return 25;
            default:
                return 5;
        }
    }

    getPosition(x: number, y: number, width: number, height: number, mapDimensions: MapDimensions): { left: string; top: string; width: string; height: string } {
        var sideLength = this.getSideLength();

        return {
            left: 'calc(' + sideLength + 'px * ' + (x - mapDimensions.minX) + ')',
            top: 'calc(' + sideLength + 'px * ' + (y - mapDimensions.minY) + ')',
            width: 'calc((' + sideLength + 'px * ' + width + ') + 1px)',
            height: 'calc((' + sideLength + 'px * ' + height + ') + 1px)'
        };
    }

    public render() {
        try {
            var border = (this.props.mode === 'edit') ? 2 : 0;
            var mapDimensions = this.getMapDimensions(border);
            if (!mapDimensions) {
                return (
                    <div>(blank map)</div>
                );
            }

            // Draw the grid squares
            var grid = [];
            if (this.props.mode === 'edit') {
                for (var y = mapDimensions.minY; y !== mapDimensions.maxY + 1; ++y) {
                    for (var x = mapDimensions.minX; x !== mapDimensions.maxX + 1; ++x) {
                        var pos = this.getPosition(x, y, 1, 1, mapDimensions);
                        grid.push(
                            <GridSquare
                                key={x + ',' + y}
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
                .filter(i => i.type === 'tile')
                .map(i => {
                    var pos = this.getPosition(i.x, i.y, i.width, i.height, mapDimensions as MapDimensions);
                    return (
                        <MapTile
                            key={i.id}
                            tile={i}
                            position={pos}
                            selectable={this.props.mode === 'edit'}
                            selected={this.props.selectedItemID === i.id}
                            thumbnail={this.props.mode === 'thumbnail'}
                            select={id => this.props.mode === 'edit' ? this.props.setSelectedItemID(id) : null}
                        />
                    );
                });

            // Draw the tokens
            var tokens: JSX.Element[] = [];
            if (this.props.mode !== 'edit') {
                tokens = this.props.map.items
                    .filter(i => (i.type === 'monster') || (i.type === 'pc'))
                    .map(i => {
                        var pos = this.getPosition(i.x, i.y, i.width, i.height, mapDimensions as MapDimensions);
                        var combatant = this.props.combatants.find(c => c.id === i.id);
                        if (combatant) {
                            return (
                                <MapToken
                                    key={i.id}
                                    token={i}
                                    combatant={combatant}
                                    position={pos}
                                    simple={this.props.mode === 'thumbnail'}
                                    selectable={this.props.mode === 'combat'}
                                    selected={this.props.selectedItemID ===  i.id}
                                    select={id => this.props.setSelectedItemID(id)}
                                />
                            );
                        }

                        return null;
                    })
                    .filter(mt => mt !== null) as JSX.Element[];
            }

            // Draw the drag overlay
            var dragOverlay = [];
            if (this.props.showOverlay) {
                for (var yOver = mapDimensions.minY; yOver !== mapDimensions.maxY + 1; ++yOver) {
                    for (var xOver = mapDimensions.minX; xOver !== mapDimensions.maxX + 1; ++xOver) {
                        var posOver = this.getPosition(xOver, yOver, 1, 1, mapDimensions);
                        dragOverlay.push(
                            <GridSquare
                                key={xOver + ',' + yOver}
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

            var style = 'map-panel ' + this.props.mode;
            return (
                <div className={style} onClick={() => this.props.setSelectedItemID(null)}>
                    <div className='grid' style={{ height: ((this.getSideLength() * mapDimensions.height) + 1) + 'px' }}>
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

interface GridSquareProps {
    x: number;
    y: number;
    position: { left: string; top: string; width: string; height: string };
    overlay: boolean;
    onClick: (x: number, y: number) => void;
    onDoubleClick: (x: number, y: number) => void;
}

class GridSquare extends React.Component<GridSquareProps> {
    public static defaultProps = {
        overlay: false,
        onDoubleClick: null
    };

    click(e: React.MouseEvent) {
        e.stopPropagation();
        if (this.props.onClick) {
            this.props.onClick(this.props.x, this.props.y);
        }
    }

    doubleClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (this.props.onDoubleClick) {
            this.props.onDoubleClick(this.props.x, this.props.y);
        }
    }

    public render() {
        var style = 'grid-square';
        if (this.props.overlay) {
            style += ' grid-overlay';
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

interface MapTileProps {
    tile: MapItem;
    position: { left: string; top: string; width: string; height: string };
    thumbnail: boolean;
    selectable: boolean;
    selected: boolean;
    select: (tileID: string) => void;
}

class MapTile extends React.Component<MapTileProps> {
    select(e: React.MouseEvent) {
        if (this.props.selectable) {
            e.stopPropagation();
            this.props.select(this.props.tile.id);
        }
    }

    public render() {
        var style = 'tile ' + this.props.tile.terrain;
        if (this.props.selected) {
            style += ' selected';
        }
        if (this.props.thumbnail) {
            style += ' thumbnail';
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

interface MapTokenProps {
    token: MapItem;
    combatant: (Combatant & PC) | (Combatant & Monster);
    position: { left: string; top: string; width: string; height: string };
    simple: boolean;
    selectable: boolean;
    selected: boolean;
    select: (tokenID: string) => void;
}

class MapToken extends React.Component<MapTokenProps> {
    select(e: React.MouseEvent) {
        if (this.props.selectable) {
            e.stopPropagation();
            this.props.select(this.props.token.id);
        }
    }

    public render() {
        var style = 'token ' + this.props.token.type;
        if (this.props.selected) {
            style += ' selected';
        }
        if (this.props.combatant.current) {
            style += ' current';
        }

        var initials = null;
        var hpGauge = null;
        var altitudeBadge = null;
        var conditionsBadge = null;
        if (!this.props.simple) {
            var name = this.props.combatant.displayName || this.props.combatant.name;
            initials = (
                <div className='initials'>{name.split(' ').map(s => s[0])}</div>
            );

            if (this.props.combatant.type === 'monster') {
                hpGauge = (
                    <HitPointGauge combatant={this.props.combatant as Combatant & Monster} />
                );
            }

            if (this.props.combatant.altitude > 0) {
                altitudeBadge = (
                    <div className='badge altitude'>&#9206;</div>
                );
            }

            if (this.props.combatant.altitude < 0) {
                altitudeBadge = (
                    <div className='badge altitude'>&#9207;</div>
                );
            }

            if ((this.props.combatant.conditions) && (this.props.combatant.conditions.length > 0)) {
                conditionsBadge = (
                    <div className='badge'>&#9670;</div>
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
