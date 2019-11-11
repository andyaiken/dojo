import React from 'react';

import { Col, Drawer, Input, Row } from 'antd';

import Factory from '../../utils/factory';
import Mercator from '../../utils/mercator';
import Utils from '../../utils/utils';

import { Map, MapItem, MapNote, TERRAIN_TYPES } from '../../models/map';

import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import NumberSpin from '../controls/number-spin';
import Radial from '../controls/radial';
import Selector from '../controls/selector';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';
import ImageSelectionModal from './image-selection-modal';

interface Props {
    map: Map;
}

interface State {
    map: Map;
    selectedTileID: string | null;
    addingTile: boolean;
    mapSize: number;
    showImageSelection: boolean;
}

export default class MapEditorModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            map: props.map,
            selectedTileID: null,
            addingTile: false,
            mapSize: 30,
            showImageSelection: false
        };
    }

    private setSelectedTileID(id: string | null) {
        this.setState({
            selectedTileID: id
        });
    }

    private toggleAddingTile() {
        this.setState({
            addingTile: !this.state.addingTile
        });
    }

    private nudgeMapSize(value: number) {
        this.setState({
            mapSize: Math.max(this.state.mapSize + value, 5)
        });
    }

    private toggleImageSelection() {
        this.setState({
            showImageSelection: !this.state.showImageSelection
        });
    }

    private addMapTile(x: number, y: number) {
        const tile = Factory.createMapItem();
        tile.x = x;
        tile.y = y;
        tile.style = 'square';
        tile.terrain = 'flagstone';
        this.state.map.items.push(tile);

        this.setState({
            map: this.state.map,
            selectedTileID: tile.id,
            addingTile: false
        });
    }

    private moveMapItem(item: MapItem, dir: string) {
        switch (dir) {
            case 'N':
                item.y -= 1;
                break;
            case 'E':
                item.x += 1;
                break;
            case 'S':
                item.y += 1;
                break;
            case 'W':
                item.x -= 1;
                break;
            default:
                // Do nothing
                break;
        }

        this.setState({
            map: this.state.map
        });
    }

    private bigMapItem(item: MapItem, dir: string) {
        switch (dir) {
            case 'N':
                item.y -= 1;
                item.height += 1;
                break;
            case 'E':
                item.width += 1;
                break;
            case 'S':
                item.height += 1;
                break;
            case 'W':
                item.x -= 1;
                item.width += 1;
                break;
            default:
                // Do nothing
                break;
        }

        this.setState({
            map: this.state.map
        });
    }

    private smallMapItem(item: MapItem, dir: string) {
        switch (dir) {
            case 'N':
                if (item.height > 1) {
                    item.y += 1;
                    item.height -= 1;
                }
                break;
            case 'E':
                if (item.width > 1) {
                    item.width -= 1;
                }
                break;
            case 'S':
                if (item.height > 1) {
                    item.height -= 1;
                }
                break;
            case 'W':
                if (item.width > 1) {
                    item.x += 1;
                    item.width -= 1;
                }
                break;
            default:
                // Do nothing
                break;
        }

        this.setState({
            map: this.state.map
        });
    }

    private resizeMapItem(item: MapItem, dir: string, dir2: 'in' | 'out') {
        switch (dir2) {
            case 'in':
                this.smallMapItem(item, dir);
                break;
            case 'out':
                this.bigMapItem(item, dir);
                break;
            default:
                // Do nothing
                break;
        }
    }

    private sendToBack(item: MapItem) {
        const index = this.state.map.items.indexOf(item);
        this.state.map.items.splice(index, 1);
        this.state.map.items.unshift(item);

        this.setState({
            map: this.state.map
        });
    }

    private bringToFront(item: MapItem) {
        const index = this.state.map.items.indexOf(item);
        this.state.map.items.splice(index, 1);
        this.state.map.items.push(item);

        this.setState({
            map: this.state.map
        });
    }

    private cloneMapItem(item: MapItem) {
        const copy = JSON.parse(JSON.stringify(item));
        copy.id = Utils.guid();
        copy.x += 1;
        copy.y += 1;
        this.state.map.items.push(copy);

        this.setState({
            map: this.state.map,
            selectedTileID: copy.id
        });
    }

    private removeMapItem(item: MapItem) {
        const index = this.state.map.items.indexOf(item);
        this.state.map.items.splice(index, 1);

        this.setState({
            map: this.state.map,
            selectedTileID: null
        });
    }

    private setCustomImage(id: string) {
        const item = this.state.map.items.find(i => i.id === this.state.selectedTileID);
        if (item) {
            this.changeValue(item, 'customBackground', id);
        }
    }

    private rotateMap() {
        Mercator.rotateMap(this.state.map);

        this.setState({
            map: this.state.map
        });
    }

    private clearMap() {
        // eslint-disable-next-line
        this.state.map.items = [];

        this.setState({
            map: this.state.map,
            selectedTileID: null
        });
    }

    private generate(type: string) {
        Mercator.generate(type, this.state.map);
        this.setState({
            map: this.state.map
        });
    }

    private addNote(tileID: string) {
        const note = Factory.createMapNote();
        note.targetID = tileID;
        this.state.map.notes.push(note);

        this.setState({
            map: this.state.map
        });
    }

    private removeNote(tileID: string) {
        const index = this.state.map.notes.findIndex(n => n.targetID === tileID);
        this.state.map.notes.splice(index, 1);

        this.setState({
            map: this.state.map
        });
    }

    private changeValue(source: any, field: string, value: any) {
        source[field] = value;

        this.setState({
            map: this.state.map,
            showImageSelection: false
        });
    }

    public render() {
        try {
            let tools = null;
            if (this.state.selectedTileID) {
                const item = this.state.map.items.find(i => i.id === this.state.selectedTileID);
                if (item) {
                    const note = Mercator.getNote(this.state.map, item);
                    tools = (
                        <MapTileCard
                            tile={item}
                            note={note}
                            toggleImageSelection={() => this.toggleImageSelection()}
                            changeValue={(source, field, value) => this.changeValue(source, field, value)}
                            move={(tile, dir) => this.moveMapItem(tile, dir)}
                            resize={(tile, dir, dir2) => this.resizeMapItem(tile, dir, dir2)}
                            clone={tile => this.cloneMapItem(tile)}
                            remove={tile => this.removeMapItem(tile)}
                            sendToBack={tile => this.sendToBack(tile)}
                            bringToFront={tile => this.bringToFront(tile)}
                            addNote={tileID => this.addNote(tileID)}
                            removeNote={tileID => this.removeNote(tileID)}
                        />
                    );
                }
            } else {
                tools = (
                    <div>
                        <div className='subheading'>map name</div>
                        <Input
                            placeholder='map name'
                            value={this.state.map.name}
                            allowClear={true}
                            onChange={event => this.changeValue(this.state.map, 'name', event.target.value)}
                        />
                        <div className='divider' />
                        <Note>
                            <p>to add a new tile to the map, click on the button below</p>
                            <p>to edit an existing tile, click on it to select it</p>
                        </Note>
                        <div className='divider' />
                        <NumberSpin
                            source={this.state}
                            name={'mapSize'}
                            display={() => 'zoom'}
                            nudgeValue={delta => this.nudgeMapSize(delta * 5)}
                        />
                        <button onClick={() => this.toggleAddingTile()}>
                            {this.state.addingTile ? 'click somewhere on the map to add your new tile, or click here to cancel' : 'add a new tile'}
                        </button>
                        <button onClick={() => this.generate('room')}>generate a room</button>
                        <button onClick={() => this.rotateMap()}>rotate the map</button>
                        <ConfirmButton text='clear all tiles' callback={() => this.clearMap()} />
                    </div>
                );
            }

            return (
                <Row className='full-height'>
                    <Col span={8} className='scrollable'>
                        {tools}
                    </Col>
                    <Col span={16} className='scrollable'>
                        <MapPanel
                            map={this.state.map}
                            mode='edit'
                            size={this.state.mapSize}
                            selectedItemID={this.state.selectedTileID ? this.state.selectedTileID : undefined}
                            showOverlay={this.state.addingTile}
                            setSelectedItemID={id => this.setSelectedTileID(id)}
                            gridSquareClicked={(x, y) => this.addMapTile(x, y)}
                        />
                    </Col>
                    <Drawer visible={this.state.showImageSelection} closable={false} onClose={() => this.toggleImageSelection()}>
                        <ImageSelectionModal select={id => this.setCustomImage(id)} cancel={() => this.toggleImageSelection()} />
                    </Drawer>
                </Row>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface MapTileCardProps {
    tile: MapItem;
    note: MapNote | null;
    toggleImageSelection: () => void;
    changeValue: (source: any, field: string, value: any) => void;
    move: (tile: MapItem, dir: string) => void;
    resize: (tile: MapItem, dir: string, dir2: 'in' | 'out') => void;
    clone: (tile: MapItem) => void;
    remove: (tile: MapItem) => void;
    sendToBack: (tile: MapItem) => void;
    bringToFront: (tile: MapItem) => void;
    addNote: (tileID: string) => void;
    removeNote: (tileID: string) => void;
}

interface MapTileCardState {
    view: string;
}

class MapTileCard extends React.Component<MapTileCardProps, MapTileCardState> {
    constructor(props: MapTileCardProps) {
        super(props);
        this.state = {
            view: 'position'
        };
    }

    private setView(view: string) {
        this.setState({
            view: view
        });
    }

    private getPositionSection() {
        return (
            <div>
                <div className='subheading'>size</div>
                <div className='section'>{this.props.tile.width} sq x {this.props.tile.height} sq</div>
                <div className='section'>{this.props.tile.width * 5} ft x {this.props.tile.height * 5} ft</div>
                <div className='subheading'>move</div>
                <div className='section centered'>
                    <Radial direction='eight' click={dir => this.props.move(this.props.tile, dir)} />
                </div>
                <div className='subheading'>resize</div>
                <div className='section centered'>
                    <Radial direction='both' click={(dir, dir2) => this.props.resize(this.props.tile, dir, dir2 as 'in' | 'out')} />
                </div>
                <div className='divider' />
                <div className='section'>
                    <button onClick={() => this.props.sendToBack(this.props.tile)}>send to back</button>
                    <button onClick={() => this.props.bringToFront(this.props.tile)}>bring to front</button>
                </div>
            </div>
        );
    }

    private getStyleSection() {
        const terrainOptions = TERRAIN_TYPES.map(t => {
            return { id: t, text: t };
        });

        let customSection = null;
        if (this.props.tile.terrain === 'custom') {
            customSection = (
                <div>
                    <div className='subheading'>custom image</div>
                    <button onClick={() => this.props.toggleImageSelection()}>select image</button>
                    <button onClick={() => this.props.changeValue(this.props.tile, 'customBackground', '')}>clear image</button>
                </div>
            );
        }

        const styleOptions = ['square', 'rounded', 'circle'].map(t => {
            return { id: t, text: t };
        });

        return (
            <div>
                <div className='subheading'>terrain</div>
                <Dropdown
                    options={terrainOptions}
                    placeholder='select terrain'
                    selectedID={this.props.tile.terrain ? this.props.tile.terrain : undefined}
                    select={optionID => this.props.changeValue(this.props.tile, 'terrain', optionID)}
                />
                {customSection}
                <div className='subheading'>shape</div>
                <Selector
                    options={styleOptions}
                    selectedID={this.props.tile.style}
                    select={optionID => this.props.changeValue(this.props.tile, 'style', optionID)}
                />
            </div>
        );
    }

    private getNotesSection() {
        if (this.props.note) {
            return (
                <div>
                    <Input.TextArea
                        placeholder='details'
                        autoSize={{ minRows: 5 }}
                        value={this.props.note.text}
                        onChange={event => this.props.changeValue(this.props.note, 'text', event.target.value)}
                    />
                    <button onClick={() => this.props.removeNote(this.props.tile.id)}>remove note from this tile</button>
                </div>
            );
        } else {
            return (
                <div>
                    <button onClick={() => this.props.addNote(this.props.tile.id)}>add a note to this tile</button>
                </div>
            );
        }
    }

    public render() {
        try {
            const options = ['position', 'style', 'notes'].map(option => {
                return { id: option, text: option };
            });

            let content = null;
            switch (this.state.view) {
                case 'position':
                    content = this.getPositionSection();
                    break;
                case 'style':
                    content = this.getStyleSection();
                    break;
                case 'notes':
                    content = this.getNotesSection();
                    break;
            }

            return (
                <div className='card map'>
                    <div className='heading'>
                        <div className='title'>map tile</div>
                    </div>
                    <div className='card-content'>
                        <Selector
                            options={options}
                            selectedID={this.state.view}
                            select={optionID => this.setView(optionID)}
                        />
                        <div className='divider' />
                        {content}
                        <div className='divider' />
                        <div className='section'>
                            <button onClick={() => this.props.clone(this.props.tile)}>clone tile</button>
                            <button onClick={() => this.props.remove(this.props.tile)}>remove tile</button>
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
