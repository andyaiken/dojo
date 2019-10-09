import React from 'react';

import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Map, MapItem } from '../../models/map-folio';
import { Monster } from '../../models/monster-group';
import { PC } from '../../models/party';

import Spin from '../controls/spin';
import HitPointGauge from './hit-point-gauge';

interface Props {
    map: Map;
    mode: 'edit' | 'thumbnail' | 'combat' | 'combat-player';
    combatants: ((Combatant & PC) | (Combatant & Monster))[];
    showOverlay: boolean;
    selectedItemID: string;
    setSelectedItemID: (itemID: string | null) => void;
    gridSquareClicked: (x: number, y: number) => void;
}

interface State {
    zoom: number;
}

interface MapDimensions {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
}

interface MapItemStyle {
    left: string;
    top: string;
    width: string;
    height: string;
    borderRadius: string;
    backgroundSize: string;
    backgroundColor?: string;
}

export default class MapPanel extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            zoom: props.mode !== 'thumbnail' ? 25 : 10
        };
    }

    public static defaultProps = {
        combatants: null,
        showOverlay: false,
        selectedItemID: null,
        setSelectedItemID: null,
        gridSquareClicked: null
    };

    private setZoom(value: number) {
        this.setState({
            zoom: Math.max(5, value)
        });
    }

    private getMapDimensions(border: number): MapDimensions | null {
        let dimensions: MapDimensions | null = null;

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
                    maxY: i.y + i.height - 1
                };
            } else {
                dimensions.minX = Math.min(dimensions.minX, i.x);
                dimensions.maxX = Math.max(dimensions.maxX, i.x + i.width - 1);
                dimensions.minY = Math.min(dimensions.minY, i.y);
                dimensions.maxY = Math.max(dimensions.maxY, i.y + i.height - 1);
            }
        });

        if (this.props.combatants) {
            this.props.combatants.filter(c => c.aura.radius > 0).forEach(c => {
                const mi = this.props.map.items.find(i => i.id === c.id);
                if (mi) {
                    const sizeInSquares = c.aura.radius / 5;
                    let miniSize = 1;
                    const m = c as Monster;
                    if (m) {
                        miniSize = Utils.miniSize(m.size);
                    }
                    const minX = mi.x - sizeInSquares;
                    const maxX = mi.x + (miniSize - 1) + sizeInSquares;
                    const minY = mi.y - sizeInSquares;
                    const maxY = mi.y + (miniSize - 1) + sizeInSquares;

                    if (dimensions) {
                        dimensions.minX = Math.min(dimensions.minX, minX);
                        dimensions.maxX = Math.max(dimensions.maxX, maxX);
                        dimensions.minY = Math.min(dimensions.minY, minY);
                        dimensions.maxY = Math.max(dimensions.maxY, maxY);
                    }
                }
            });
        }

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

        return dimensions;
    }

    private getStyle(x: number, y: number, width: number, height: number, style: 'square' | 'rounded' | 'circle' | null, dim: MapDimensions): MapItemStyle {
        let offsetX = 0;
        let offsetY = 0;
        if (width < 1) {
            offsetX = (1 - width) / 2;
        }
        if (height < 1) {
            offsetY = (1 - height) / 2;
        }

        let radius = '0';
        switch (style) {
            case 'rounded':
                radius = this.state.zoom + 'px';
                break;
            case 'circle':
                radius = '50%';
                break;
        }

        return {
            left: 'calc(' + this.state.zoom + 'px * ' + (x + offsetX - dim.minX) + ')',
            top: 'calc(' + this.state.zoom + 'px * ' + (y + offsetY - dim.minY) + ')',
            width: 'calc((' + this.state.zoom + 'px * ' + width + ') + 1px)',
            height: 'calc((' + this.state.zoom + 'px * ' + height + ') + 1px)',
            borderRadius: radius,
            backgroundSize: this.state.zoom + 'px'
        };
    }

    public render() {
        try {
            const border = (this.props.mode === 'edit') ? 2 : 0;
            const mapDimensions = this.getMapDimensions(border);
            if (!mapDimensions) {
                return (
                    <div>(blank map)</div>
                );
            }

            // Draw the grid squares
            const grid = [];
            if (this.props.mode === 'edit') {
                for (let y = mapDimensions.minY; y !== mapDimensions.maxY + 1; ++y) {
                    for (let x = mapDimensions.minX; x !== mapDimensions.maxX + 1; ++x) {
                        const gridStyle = this.getStyle(x, y, 1, 1, 'square', mapDimensions);
                        grid.push(
                            <GridSquare
                                key={x + ',' + y}
                                x={x}
                                y={y}
                                style={gridStyle}
                                onClick={() => this.props.setSelectedItemID(null)}
                            />
                        );
                    }
                }
            }

            // Draw the map tiles
            const tiles = this.props.map.items
                .filter(i => i.type === 'tile')
                .map(i => {
                    const tileStyle = this.getStyle(i.x, i.y, i.width, i.height, i.style, mapDimensions);
                    return (
                        <MapTile
                            key={i.id}
                            tile={i}
                            style={tileStyle}
                            selectable={this.props.mode === 'edit'}
                            selected={this.props.selectedItemID === i.id}
                            select={id => this.props.mode === 'edit' ? this.props.setSelectedItemID(id) : null}
                        />
                    );
                });

            // Draw token auras
            let auras: JSX.Element[] = [];
            if ((this.props.mode !== 'edit') && (this.props.mode !== 'thumbnail')) {
                auras = this.props.combatants
                    .filter(c => c.aura.radius > 0)
                    .filter(c => c.showOnMap || (this.props.mode !== 'combat-player'))
                    .map(c => {
                        const mi = this.props.map.items.find(i => i.id === c.id);
                        if (mi) {
                            const sizeInSquares = c.aura.radius / 5;
                            const miniSize = Utils.miniSize(c.displaySize);
                            const dim = (sizeInSquares * 2) + miniSize;
                            const auraStyle = this.getStyle(mi.x - sizeInSquares, mi.y - sizeInSquares, dim, dim, c.aura.style, mapDimensions);
                            auraStyle.backgroundColor = c.aura.color;
                            return (
                                <div
                                    key={c.id + ' aura'}
                                    className={'aura'}
                                    style={auraStyle}
                                />
                            );
                        }
                        return null;
                    })
                    .filter(mt => mt !== null) as JSX.Element[];
            }

            // Draw the tokens
            let tokens: JSX.Element[] = [];
            if (this.props.mode !== 'edit') {
                tokens = this.props.map.items
                    .filter(i => (i.type === 'monster') || (i.type === 'pc'))
                    .map(i => {
                        const combatant = this.props.combatants.find(c => c.id === i.id);
                        if (combatant) {
                            const miniSize = Utils.miniSize(combatant.displaySize);
                            const tokenStyle = this.getStyle(i.x, i.y, miniSize, miniSize, 'circle', mapDimensions);
                            return (
                                <MapToken
                                    key={i.id}
                                    token={i}
                                    combatant={combatant}
                                    style={tokenStyle}
                                    simple={this.props.mode === 'thumbnail'}
                                    showGauge={this.props.mode === 'combat'}
                                    showHidden={this.props.mode === 'combat'}
                                    selectable={(this.props.mode === 'combat') || (this.props.mode === 'combat-player')}
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
            const dragOverlay = [];
            if (this.props.showOverlay) {
                for (let yOver = mapDimensions.minY; yOver !== mapDimensions.maxY + 1; ++yOver) {
                    for (let xOver = mapDimensions.minX; xOver !== mapDimensions.maxX + 1; ++xOver) {
                        const overlayStyle = this.getStyle(xOver, yOver, 1, 1, 'square', mapDimensions);
                        dragOverlay.push(
                            <GridSquare
                                key={xOver + ',' + yOver}
                                x={xOver}
                                y={yOver}
                                style={overlayStyle}
                                overlay={true}
                                onClick={(posX, posY) => this.props.gridSquareClicked(posX, posY)}
                            />
                        );
                    }
                }
            }

            let zoom = null;
            if (this.props.mode !== 'thumbnail') {
                zoom = (
                    <div className='zoom'>
                        <Spin
                            source={this.state}
                            name={'zoom'}
                            display={value => ''}
                            nudgeValue={delta => this.setZoom(this.state.zoom + (delta * 5))}
                        />
                    </div>
                );
            }

            const style = 'map-panel ' + this.props.mode;
            const mapHeight = 1 + mapDimensions.maxY - mapDimensions.minY;
            return (
                <div className={style} onClick={() => this.props.setSelectedItemID(null)}>
                    <div className='grid' style={{ height: ((this.state.zoom * mapHeight) + 1) + 'px' }}>
                        {grid}
                        {tiles}
                        {auras}
                        {tokens}
                        {dragOverlay}
                    </div>
                    {zoom}
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
    style: MapItemStyle;
    overlay: boolean;
    onClick: (x: number, y: number) => void;
    onDoubleClick: (x: number, y: number) => void;
}

class GridSquare extends React.Component<GridSquareProps> {
    public static defaultProps = {
        overlay: false,
        onDoubleClick: null
    };

    private click(e: React.MouseEvent) {
        e.stopPropagation();
        if (this.props.onClick) {
            this.props.onClick(this.props.x, this.props.y);
        }
    }

    private doubleClick(e: React.MouseEvent) {
        e.stopPropagation();
        if (this.props.onDoubleClick) {
            this.props.onDoubleClick(this.props.x, this.props.y);
        }
    }

    public render() {
        let style = 'grid-square';
        if (this.props.overlay) {
            style += ' grid-overlay';
        }

        return (
            <div
                className={style}
                style={this.props.style}
                onClick={e => this.click(e)}
                onDoubleClick={e => this.doubleClick(e)}
            />
        );
    }
}

interface MapTileProps {
    tile: MapItem;
    style: MapItemStyle;
    selectable: boolean;
    selected: boolean;
    select: (tileID: string) => void;
}

class MapTile extends React.Component<MapTileProps> {
    private select(e: React.MouseEvent) {
        if (this.props.selectable) {
            e.stopPropagation();
            this.props.select(this.props.tile.id);
        }
    }

    public render() {
        let style = 'tile ' + this.props.tile.terrain;
        if (this.props.selected) {
            style += ' selected';
        }

        let content = null;
        if ((this.props.tile.terrain === 'custom image') && (this.props.tile.customBackground !== null)) {
            content = (
                <img src={this.props.tile.customBackground} alt='map tile' style={{ width: '100%', height: '100%' }} />
            );
        }

        return (
            <div
                className={style}
                style={this.props.style}
                onClick={e => this.select(e)}
            >
                {content}
            </div>
        );
    }
}

interface MapTokenProps {
    token: MapItem;
    combatant: (Combatant & PC) | (Combatant & Monster);
    style: MapItemStyle;
    simple: boolean;
    showGauge: boolean;
    showHidden: boolean;
    selectable: boolean;
    selected: boolean;
    select: (tokenID: string) => void;
}

class MapToken extends React.Component<MapTokenProps> {
    private select(e: React.MouseEvent) {
        if (this.props.selectable) {
            e.stopPropagation();
            this.props.select(this.props.token.id);
        }
    }

    public render() {
        let style = 'token ' + this.props.token.type;
        if (this.props.selected) {
            style += ' selected';
        }
        if (this.props.combatant.current) {
            style += ' current';
        }
        if (!this.props.combatant.showOnMap) {
            if (this.props.showHidden) {
                style += ' hidden';
            } else {
                return null;
            }
        }

        let initials = null;
        let hpGauge = null;
        let altitudeBadge = null;
        let conditionsBadge = null;
        if (!this.props.simple) {
            const name = this.props.combatant.displayName || this.props.combatant.name || 'combatant';
            initials = (
                <div className='initials'>{name.split(' ').map(s => s[0])}</div>
            );

            if (this.props.combatant.type === 'monster' && this.props.showGauge) {
                hpGauge = (
                    <HitPointGauge combatant={this.props.combatant as Combatant & Monster} />
                );
            }

            if (this.props.combatant.altitude > 0) {
                altitudeBadge = (
                    <div className='badge altitude' title='above the map'>&#9206;</div>
                );
            }

            if (this.props.combatant.altitude < 0) {
                altitudeBadge = (
                    <div className='badge altitude' title='below the map'>&#9207;</div>
                );
            }

            if ((this.props.combatant.conditions) && (this.props.combatant.conditions.length > 0)) {
                conditionsBadge = (
                    <div className='badge' title='affected by conditions'>&#9670;</div>
                );
            }
        }

        return (
            <div
                title={this.props.combatant.displayName || this.props.combatant.name}
                className={style}
                style={this.props.style}
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
