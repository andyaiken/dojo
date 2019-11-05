import React from 'react';

import { Icon, Popover } from 'antd';
import Showdown from 'showdown';

import Mercator from '../../utils/mercator';
import Utils from '../../utils/utils';

import { Combatant } from '../../models/combat';
import { Map, MapItem, MapNote } from '../../models/map-folio';
import { Monster } from '../../models/monster-group';
import { PC } from '../../models/party';

import HitPointGauge from './hit-point-gauge';

import none from '../../resources/images/no-portrait.png';
import Factory from '../../utils/factory';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

interface Props {
    map: Map;
    mode: 'edit' | 'thumbnail' | 'combat' | 'combat-player';
    size: number;
    combatants: Combatant[];
    showOverlay: boolean;
    selectedItemID: string;
    setSelectedItemID: (itemID: string | null) => void;
    gridSquareClicked: (x: number, y: number) => void;
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
    opacity?: string;
}

export default class MapPanel extends React.Component<Props> {
    public static defaultProps = {
        combatants: null,
        showOverlay: false,
        selectedItemID: null,
        setSelectedItemID: null,
        gridSquareClicked: null
    };

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
                    const m = c as Combatant & Monster;
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
                radius = this.props.size + 'px';
                break;
            case 'circle':
                radius = '50%';
                break;
        }

        return {
            left: 'calc(' + this.props.size + 'px * ' + (x + offsetX - dim.minX) + ')',
            top: 'calc(' + this.props.size + 'px * ' + (y + offsetY - dim.minY) + ')',
            width: 'calc((' + this.props.size + 'px * ' + width + ') + 1px)',
            height: 'calc((' + this.props.size + 'px * ' + height + ') + 1px)',
            borderRadius: radius,
            backgroundSize: this.props.size + 'px'
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
                            note={this.props.mode !== 'combat-player' ? Mercator.getNote(this.props.map, i) : null}
                            style={tileStyle}
                            selectable={this.props.mode === 'edit'}
                            selected={this.props.selectedItemID === i.id}
                            select={id => this.props.mode === 'edit' ? this.props.setSelectedItemID(id) : null}
                        />
                    );
                });

            // Draw overlays
            let overlays: JSX.Element[] = [];
            if ((this.props.mode !== 'edit') && (this.props.mode !== 'thumbnail')) {
                overlays = this.props.map.items
                    .filter(i => i.type === 'overlay')
                    .map(i => {
                        const overlayStyle = this.getStyle(i.x, i.y, i.width, i.height, i.style, mapDimensions);
                        overlayStyle.backgroundColor = i.color + i.opacity.toString(16);
                        return (
                            <MapOverlay
                                key={i.id}
                                overlay={i}
                                note={this.props.mode !== 'combat-player' ? Mercator.getNote(this.props.map, i) : null}
                                style={overlayStyle}
                                selected={this.props.selectedItemID === i.id}
                                select={id => this.props.setSelectedItemID(id)}
                            />
                        );
                    });
            }

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
                    .filter(i => (i.type === 'monster') || (i.type === 'pc') || (i.type === 'token'))
                    .map(i => {
                        let miniSize = Utils.miniSize(i.size);
                        let note = Mercator.getNote(this.props.map, i);
                        let isPC = false;
                        const combatant = this.props.combatants.find(c => c.id === i.id);
                        if (combatant) {
                            miniSize = Utils.miniSize(combatant.displaySize);
                            if (!note && combatant.note) {
                                note = Factory.createMapNote();
                                note.targetID = combatant.id;
                                note.text = combatant.note;
                            }
                            isPC = (combatant.type === 'pc');
                        }
                        const tokenStyle = this.getStyle(i.x, i.y, miniSize, miniSize, 'circle', mapDimensions);
                        return (
                            <MapToken
                                key={i.id}
                                token={i}
                                note={this.props.mode !== 'combat-player' ? note : null}
                                combatant={combatant || null}
                                style={tokenStyle}
                                simple={this.props.mode === 'thumbnail'}
                                showGauge={this.props.mode === 'combat'}
                                showHidden={(this.props.mode === 'combat') || isPC}
                                selectable={(this.props.mode === 'combat') || (this.props.mode === 'combat-player')}
                                selected={this.props.selectedItemID ===  i.id}
                                select={id => this.props.setSelectedItemID(id)}
                            />
                        );
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

            const style = 'map-panel ' + this.props.mode;
            const mapHeight = 1 + mapDimensions.maxY - mapDimensions.minY;
            return (
                <div className={style} onClick={() => this.props.setSelectedItemID(null)}>
                    <div className='grid' style={{ height: ((this.props.size * mapHeight) + 1) + 'px' }}>
                        {grid}
                        {tiles}
                        {overlays}
                        {auras}
                        {tokens}
                        {dragOverlay}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
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
        try {
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
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

interface MapTileProps {
    tile: MapItem;
    note: MapNote | null;
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
        try {
            let style = 'tile ' + this.props.tile.terrain;
            if (this.props.selected) {
                style += ' selected';
            }

            let content = null;
            if (this.props.tile.terrain === 'custom') {
                let src = none;
                const data = localStorage.getItem('image-' + this.props.tile.customBackground);
                if (data) {
                    const image = JSON.parse(data);
                    src = image.data;
                }
                content = (
                    <img className='custom-image' alt='map tile' src={src} />
                );
            }

            const tile = (
                <div
                    className={style}
                    style={this.props.style}
                    onClick={e => this.select(e)}
                >
                    {content}
                </div>
            );

            if (this.props.note && this.props.note.text) {
                const note = (
                    <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.props.note.text) }} />
                );

                return (
                    <Popover placement='bottom' title='note' content={note}>
                        {tile}
                    </Popover>
                );
            } else {
                return tile;
            }
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

interface MapOverlayProps {
    overlay: MapItem;
    note: MapNote | null;
    style: MapItemStyle;
    selected: boolean;
    select: (tileID: string) => void;
}

class MapOverlay extends React.Component<MapOverlayProps> {
    private select(e: React.MouseEvent) {
        e.stopPropagation();
        this.props.select(this.props.overlay.id);
    }

    public render() {
        try {
            let style = 'overlay';
            if (this.props.selected) {
                style += ' selected';
            }

            const overlay = (
                <div
                    className={style}
                    style={this.props.style}
                    onClick={e => this.select(e)}
                />
            );

            if (this.props.note && this.props.note.text) {
                const note = (
                    <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.props.note.text) }} />
                );

                return (
                    <Popover placement='bottom' title='note' content={note}>
                        {overlay}
                    </Popover>
                );
            } else {
                return overlay;
            }
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

interface MapTokenProps {
    token: MapItem;
    note: MapNote | null;
    combatant: Combatant | null;
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
        try {
            let name = 'token';
            let style = 'token';

            if (this.props.selected) {
                style += ' selected';
            }

            const c = this.props.combatant as (Combatant & PC) | (Combatant & Monster);
            if (this.props.combatant) {
                name = c.displayName || c.name || 'combatant';
                style += ' ' + this.props.combatant.type;

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
            }

            let content = null;
            let hpGauge = null;
            let altitudeBadge = null;
            let conditionsBadge = null;
            if (this.props.combatant && !this.props.simple) {
                let src = '';
                if (c && c.portrait) {
                    const data = localStorage.getItem('image-' + c.portrait);
                    if (data) {
                        const image = JSON.parse(data);
                        src = image.data;
                    }
                }

                if (src) {
                    content = (
                        <img className='portrait' src={src} alt={name} />
                    );
                } else {
                    content = (
                        <div className='initials'>{name.split(' ').map(s => s[0])}</div>
                    );
                }

                if (this.props.combatant.type === 'monster' && this.props.showGauge) {
                    const monster = this.props.combatant as Combatant & Monster;
                    const current = monster.hp || 0;
                    if (current < monster.hpMax) {
                        hpGauge = (
                            <HitPointGauge combatant={monster} />
                        );
                    }
                }

                if (this.props.combatant.altitude > 0) {
                    altitudeBadge = (
                        <div className='badge'>
                            <Icon type='up-square' theme='twoTone' twoToneColor='#3c78dc' />
                        </div>
                    );
                }

                if (this.props.combatant.altitude < 0) {
                    altitudeBadge = (
                        <div className='badge'>
                            <Icon type='down-square' theme='twoTone' twoToneColor='#3c78dc' />
                        </div>
                    );
                }

                const hasConditions = this.props.combatant.conditions && (this.props.combatant.conditions.length > 0);
                const hasTags = this.props.combatant.tags && (this.props.combatant.tags.length > 0);
                if (hasConditions || hasTags) {
                    conditionsBadge = (
                        <div className='conditions'>
                            <Icon type='star' theme='twoTone' twoToneColor='#3c78dc' />
                        </div>
                    );
                }
            }

            const token = (
                <div
                    className={style}
                    style={this.props.style}
                    onClick={e => this.select(e)}
                >
                    {content}
                    {hpGauge}
                    {altitudeBadge}
                    {conditionsBadge}
                </div>
            );

            if (this.props.note && this.props.note.text) {
                const note = (
                    <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(this.props.note.text) }} />
                );

                return (
                    <Popover placement='bottom' title='note' content={note}>
                        {token}
                    </Popover>
                );
            } else {
                return token;
            }
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
