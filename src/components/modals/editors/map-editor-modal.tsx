import { Col, Drawer, Row } from 'antd';
import React from 'react';

import Factory from '../../../utils/factory';
import Mercator from '../../../utils/mercator';
import Utils from '../../../utils/utils';

import { DOORWAY_TYPES, Map, MapItem, MapNote, STAIRWAY_TYPES, TERRAIN_TYPES } from '../../../models/map';
import { MonsterGroup } from '../../../models/monster-group';
import { Party } from '../../../models/party';

import ConfirmButton from '../../controls/confirm-button';
import Dropdown from '../../controls/dropdown';
import NumberSpin from '../../controls/number-spin';
import Radial from '../../controls/radial';
import RadioGroup from '../../controls/radio-group';
import Selector from '../../controls/selector';
import Textbox from '../../controls/textbox';
import MapPanel from '../../panels/map-panel';
import Note from '../../panels/note';
import ImageSelectionModal from '../image-selection-modal';

interface Props {
    map: Map;
    parties: Party[];
    library: MonsterGroup[];
    maps: Map[];
}

interface State {
    map: Map;
    selectedTileID: string | null;
    addingTile: MapItem | null;
    mapSize: number;
    showImageSelection: boolean;
}

export default class MapEditorModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            map: props.map,
            selectedTileID: null,
            addingTile: null,
            mapSize: 30,
            showImageSelection: false
        };
    }

    private setSelectedTileID(id: string | null) {
        this.setState({
            selectedTileID: id
        });
    }

    private setAddingTile(type: string | null) {
        let tile = null;
        switch (type) {
            case 'room':
                tile = Factory.createMapItem();
                tile.terrain = 'default';
                tile.width = 6;
                tile.height = 6;
                tile.style = 'square';
                break;
            case 'corridor':
                tile = Factory.createMapItem();
                tile.terrain = 'default';
                tile.width = 6;
                tile.height = 2;
                tile.style = 'square';
                break;
            case 'door':
                tile = Factory.createMapItem();
                tile.terrain = 'default';
                tile.width = 2;
                tile.height = 1;
                tile.style = 'square';
                tile.content = {
                    type: 'doorway',
                    style: 'single',
                    orientation: 'horizontal'
                };
                break;
            case 'stairs':
                tile = Factory.createMapItem();
                tile.terrain = 'default';
                tile.width = 4;
                tile.height = 2;
                tile.style = 'square';
                tile.content = {
                    type: 'stairway',
                    style: 'stairs',
                    orientation: 'vertical'
                };
                break;
        }

        if (tile && (this.state.map.items.length === 0)) {
            // Just add the tile
            tile.x = 0;
            tile.y = 0;
            this.state.map.items.push(tile);

            this.setState({
                map: this.state.map,
                selectedTileID: tile.id
            });
        } else {
            this.setState({
                addingTile: tile
            });
        }
    }

    private moveAddedTile(x: number, y: number) {
        const tile = this.state.addingTile;
        if (tile) {
            tile.x = x;
            tile.y = y;
            this.setState({
                addingTile: tile
            });
        }
    }

    private nudgeMapSize(value: number) {
        this.setState({
            mapSize: Math.max(this.state.mapSize + value, 3)
        });
    }

    private toggleImageSelection() {
        this.setState({
            showImageSelection: !this.state.showImageSelection
        });
    }

    private addMapTile(x: number, y: number) {
        if (this.state.addingTile) {
            const tile = this.state.addingTile;

            tile.x = x;
            tile.y = y;
            this.state.map.items.push(tile);

            this.setState({
                map: this.state.map,
                selectedTileID: tile.id,
                addingTile: null
            });
        }
    }

    private moveMapItem(item: MapItem, dir: string) {
        switch (dir) {
            case 'N':
                item.y -= 1;
                break;
            case 'NE':
                item.x += 1;
                item.y -= 1;
                break;
            case 'E':
                item.x += 1;
                break;
            case 'SE':
                item.x += 1;
                item.y += 1;
                break;
            case 'S':
                item.y += 1;
                break;
            case 'SW':
                item.x -= 1;
                item.y += 1;
                break;
            case 'W':
                item.x -= 1;
                break;
            case 'NW':
                item.x -= 1;
                item.y -= 1;
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

    private rotateMapItem(item: MapItem) {
        const tmp = item.width;
        item.width = item.height;
        item.height = tmp;

        const diff = Math.floor((item.width - item.height) / 2);
        item.x -= diff;
        item.y += diff;

        if (item.content) {
            item.content.orientation = item.content.orientation === 'horizontal' ? 'vertical' : 'horizontal';
        }

        this.setState({
            map: this.state.map,
            addingTile: this.state.addingTile
        });
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

    private pickUpMapItem(item: MapItem) {
        const map = this.state.map;
        const index = map.items.indexOf(item);
        map.items.splice(index, 1);

        this.setState({
            map: map,
            selectedTileID: null,
            addingTile: item
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
        const map = this.state.map;
        map.items = [];

        this.setState({
            map: map,
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

    private nudgeValue(source: any, field: string, delta: number) {
        let value: number = source[field];
        value += delta;

        if ((field === 'width') || (field === 'height')) {
            value = Math.max(value, 1);
        }

        this.changeValue(source, field, value);
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
                            nudgeValue={(source, field, delta) => this.nudgeValue(source, field, delta)}
                            move={(tile, dir) => this.moveMapItem(tile, dir)}
                            clone={tile => this.cloneMapItem(tile)}
                            pickUp={tile => this.pickUpMapItem(tile)}
                            remove={tile => this.removeMapItem(tile)}
                            rotate={tile => this.rotateMapItem(tile)}
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
                        <Textbox
                            text={this.state.map.name}
                            placeholder='map name'
                            onChange={value => this.changeValue(this.state.map, 'name', value)}
                        />
                        <div className='divider' />
                        <Note>
                            <p>to add a new tile to the map, click on one of the buttons below</p>
                            <p>to edit an existing tile, click on it to select it</p>
                        </Note>
                        <div className='divider' />
                        {
                            this.state.addingTile
                            ?
                            <div>
                                <button onClick={() => this.setAddingTile(null)}>
                                    click somewhere on the map to lock the tile in place, or click here to remove it from the map
                                </button>
                                <button onClick={() => this.rotateMapItem(this.state.addingTile as MapItem)}>rotate tile</button>
                            </div>
                            :
                            <div>
                                <div className='section subheading'>add a... </div>
                                <Row gutter={10}>
                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                        <button onClick={() => this.setAddingTile('room')}>
                                            room tile
                                        </button>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                        <button onClick={() => this.setAddingTile('corridor')}>
                                            corridor tile
                                        </button>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                        <button onClick={() => this.setAddingTile('door')}>
                                            door tile
                                        </button>
                                    </Col>
                                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                                        <button onClick={() => this.setAddingTile('stairs')}>
                                            stairs tile
                                        </button>
                                    </Col>
                                </Row>
                                <div className='divider' />
                                <NumberSpin
                                    source={this.state}
                                    name={'mapSize'}
                                    onNudgeValue={delta => this.nudgeMapSize(delta * 3)}
                                    onFormatValue={() => 'zoom'}
                                />
                                <button onClick={() => this.generate('room')}>add a random room</button>
                                <button onClick={() => this.rotateMap()}>rotate the map</button>
                                <ConfirmButton text='clear all tiles' onConfirm={() => this.clearMap()} />
                            </div>
                        }
                    </div>
                );
            }

            return (
                <Row className='full-height'>
                    <Col span={6} className='scrollable sidebar sidebar-left'>
                        {tools}
                    </Col>
                    <Col span={18} className='scrollable both-ways'>
                        <MapPanel
                            map={this.state.map}
                            mode='edit'
                            size={this.state.mapSize}
                            paddingSquares={4}
                            selectedItemIDs={this.state.selectedTileID ? [this.state.selectedTileID] : []}
                            showOverlay={!!this.state.addingTile}
                            floatingItem={this.state.addingTile}
                            itemSelected={(id, ctrl) => this.setSelectedTileID(id)}
                            gridSquareEntered={(x, y) => this.moveAddedTile(x, y)}
                            gridSquareClicked={(x, y) => this.addMapTile(x, y)}
                        />
                    </Col>
                    <Drawer visible={this.state.showImageSelection} closable={false} onClose={() => this.toggleImageSelection()}>
                        <ImageSelectionModal
                            parties={this.props.parties}
                            library={this.props.library}
                            maps={this.props.maps}
                            select={id => this.setCustomImage(id)}
                            cancel={() => this.toggleImageSelection()}
                        />
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
    nudgeValue: (source: any, field: string, delta: number) => void;
    move: (tile: MapItem, dir: string) => void;
    clone: (tile: MapItem) => void;
    pickUp: (tile: MapItem) => void;
    remove: (tile: MapItem) => void;
    rotate: (tile: MapItem) => void;
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
                <div className='subheading'>move</div>
                <Radial onClick={dir => this.props.move(this.props.tile, dir)} />
                <div className='subheading'>size</div>
                <div className='section'>{this.props.tile.width * 5} ft x {this.props.tile.height * 5} ft</div>
                <div className='section'>
                    <NumberSpin
                        source={this.props.tile}
                        name='width'
                        label='width'
                        onNudgeValue={delta => this.props.nudgeValue(this.props.tile, 'width', delta)}
                        onFormatValue={value => value + ' sq'}
                    />
                    <NumberSpin
                        source={this.props.tile}
                        name='height'
                        label='height'
                        onNudgeValue={delta => this.props.nudgeValue(this.props.tile, 'height', delta)}
                        onFormatValue={value => value + ' sq'}
                    />
                </div>
                <div className='divider' />
                <button onClick={() => this.props.sendToBack(this.props.tile)}>send to back</button>
                <button onClick={() => this.props.bringToFront(this.props.tile)}>bring to front</button>
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

        // TODO: More content options
        // Doorway: secret door / concealed door
        // Stairs: slope
        // Obstacle: pit / column
        // Furniture: table / chair / bed / brazier / chest / fireplace

        return (
            <div>
                <div className='subheading'>terrain</div>
                <Dropdown
                    options={terrainOptions}
                    placeholder='select terrain'
                    selectedID={this.props.tile.terrain ? this.props.tile.terrain : undefined}
                    onSelect={optionID => this.props.changeValue(this.props.tile, 'terrain', optionID)}
                />
                {customSection}
                <div className='subheading'>shape</div>
                <Selector
                    options={styleOptions}
                    selectedID={this.props.tile.style}
                    onSelect={optionID => this.props.changeValue(this.props.tile, 'style', optionID)}
                />
                <div className='subheading'>content</div>
                <RadioGroup
                    items={[
                        { id: 'none', text: 'none' },
                        { id: 'doorway', text: 'doorway', details: (
                            <div>
                                <div><b>style</b></div>
                                <Selector
                                    options={DOORWAY_TYPES.map(o => ({ id: o, text: o }))}
                                    itemsPerRow={2}
                                    selectedID={this.props.tile.content ? this.props.tile.content.style : null}
                                    onSelect={id => this.props.changeValue(this.props.tile.content, 'style', id)}
                                />
                                <div><b>orientation</b></div>
                                <Selector
                                    options={['horizontal', 'vertical'].map(o => ({ id: o, text: o }))}
                                    selectedID={this.props.tile.content ? this.props.tile.content.orientation : null}
                                    onSelect={id => this.props.changeValue(this.props.tile.content, 'orientation', id)}
                                />
                            </div>
                        ) },
                        { id: 'stairway', text: 'stairway', details: (
                            <div>
                                <div><b>style</b></div>
                                <Selector
                                    options={STAIRWAY_TYPES.map(o => ({ id: o, text: o }))}
                                    selectedID={this.props.tile.content ? this.props.tile.content.style : null}
                                    onSelect={id => this.props.changeValue(this.props.tile.content, 'style', id)}
                                />
                                <div><b>orientation</b></div>
                                <Selector
                                    options={['horizontal', 'vertical'].map(o => ({ id: o, text: o }))}
                                    selectedID={this.props.tile.content ? this.props.tile.content.orientation : null}
                                    onSelect={id => this.props.changeValue(this.props.tile.content, 'orientation', id)}
                                />
                            </div>
                        ) }
                    ]}
                    selectedItemID={this.props.tile.content ? this.props.tile.content.type : 'none'}
                    onSelect={id => {
                        let value = null;
                        if (id !== 'none') {
                            let defaultStyle = '';
                            switch (id) {
                                case 'doorway':
                                    defaultStyle = DOORWAY_TYPES[0];
                                    break;
                                case 'stairway':
                                    defaultStyle = STAIRWAY_TYPES[0];
                                    break;
                            }
                            value = { type: id, orientation: 'horizontal', style: defaultStyle };
                        }
                        this.props.changeValue(this.props.tile, 'content', value);
                    }}
                />
            </div>
        );
    }

    private getNotesSection() {
        if (this.props.note) {
            return (
                <div>
                    <Textbox
                        text={this.props.note.text}
                        placeholder='details'
                        multiLine={true}
                        onChange={value => this.props.changeValue(this.props.note, 'text', value)}
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
                            onSelect={optionID => this.setView(optionID)}
                        />
                        <div className='divider' />
                        {content}
                        <div className='divider' />
                        <div className='section'>
                            <button onClick={() => this.props.rotate(this.props.tile)}>rotate tile</button>
                            <button onClick={() => this.props.clone(this.props.tile)}>clone tile</button>
                            <button onClick={() => this.props.pickUp(this.props.tile)}>pick up tile</button>
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
