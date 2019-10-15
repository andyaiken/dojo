import React from 'react';

import Factory from '../../utils/factory';
import Mercator from '../../utils/mercator';
import Utils from '../../utils/utils';

import { Map, MapItem, TERRAIN_TYPES } from '../../models/map-folio';

import ConfirmButton from '../controls/confirm-button';
import Dropdown from '../controls/dropdown';
import Radial from '../controls/radial';
import Selector from '../controls/selector';
import Spin from '../controls/spin';
import MapPanel from '../panels/map-panel';
import Note from '../panels/note';

interface Props {
    map: Map;
}

interface State {
    map: Map;
    selectedTileID: string | null;
    addingTile: boolean;
    mapSize: number;
}

export default class MapEditorModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            map: props.map,
            selectedTileID: null,
            addingTile: false,
            mapSize: 30
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
            mapSize: this.state.mapSize + value
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

    private changeValue(source: any, field: string, value: any) {
        source[field] = value;

        this.setState({
            map: this.state.map
        });
    }

    public render() {
        try {
            let tools = null;
            if (this.state.selectedTileID) {
                const item = this.state.map.items.find(i => i.id === this.state.selectedTileID);
                if (item) {
                    const terrainOptions = TERRAIN_TYPES.map(t => {
                        return { id: t, text: t };
                    });

                    const styleOptions = ['square', 'rounded', 'circle'].map(t => {
                        return { id: t, text: t };
                    });

                    let customSection = null;
                    if (item.terrain === 'custom') {
                        customSection = (
                            <div>
                                <div className='subheading'>custom image</div>
                                <button onClick={() => (document.getElementById('file-upload') as HTMLElement).click()}>select image</button>
                                <input
                                    type='file'
                                    id='file-upload'
                                    accept='image/*'
                                    style={{ display: 'none' }}
                                    onChange={e => {
                                        if (e.target.files) {
                                            const reader = new FileReader();
                                            reader.onload = readerEvent => {
                                                if (readerEvent.target) {
                                                    const content = readerEvent.target.result as string;
                                                    this.changeValue(item, 'customBackground', content);
                                                }
                                            };
                                            reader.readAsDataURL(e.target.files[0]);
                                        }
                                    }}
                                />
                                <button onClick={() => this.changeValue(item, 'customBackground', '')}>clear image</button>
                            </div>
                        );
                    }

                    tools = (
                        <div className='tools sidebar'>
                            <div className='subheading'>size</div>
                            <div className='section'>{item.width} sq x {item.height} sq</div>
                            <div className='section'>{item.width * 5} ft x {item.height * 5} ft</div>
                            <div className='divider' />
                            <div className='subheading'>terrain</div>
                            <Dropdown
                                options={terrainOptions}
                                placeholder='select terrain'
                                selectedID={item.terrain ? item.terrain : undefined}
                                select={optionID => this.changeValue(item, 'terrain', optionID)}
                            />
                            {customSection}
                            <div className='divider' />
                            <div className='subheading'>style</div>
                            <Selector
                                options={styleOptions}
                                selectedID={item.style}
                                select={optionID => this.changeValue(item, 'style', optionID)}
                            />
                            <div className='divider' />
                            <div className='subheading'>move</div>
                            <div className='section centered'>
                                <Radial direction='out' click={dir => this.moveMapItem(item, dir)} />
                            </div>
                            <div className='divider' />
                            <div className='subheading'>resize</div>
                            <div className='section centered'>
                                <Radial direction='both' click={(dir, dir2) => this.resizeMapItem(item, dir, dir2 as 'in' | 'out')} />
                            </div>
                            <div className='divider' />
                            <div className='section'>
                                <button onClick={() => this.cloneMapItem(item)}>clone tile</button>
                                <button onClick={() => this.removeMapItem(item)}>remove tile</button>
                            </div>
                        </div>
                    );
                }
            } else {
                tools = (
                    <div className='tools sidebar'>
                        <div className='subheading'>map name</div>
                        <input
                            type='text'
                            placeholder='map name'
                            value={this.state.map.name}
                            onChange={event => this.changeValue(this.state.map, 'name', event.target.value)}
                        />
                        <div className='divider' />
                        <Note>
                            <p>to add a new tile to the map, click on the button below</p>
                            <p>to edit an existing tile, click on it to select it</p>
                        </Note>
                        <div className='divider' />
                        <Spin
                            source={this.state}
                            name={'mapSize'}
                            display={value => 'zoom'}
                            nudgeValue={delta => this.nudgeMapSize(delta * 5)}
                        />
                        <button onClick={() => this.toggleAddingTile()}>
                            {this.state.addingTile ? 'click somewhere on the map to add your new tile, or click here to cancel' : 'add a new tile'}
                        </button>
                        <button onClick={() => this.rotateMap()}>rotate the map</button>
                        <ConfirmButton text='clear all tiles' callback={() => this.clearMap()} />
                    </div>
                );
            }

            return (
                <div className='map-editor'>
                    {tools}
                    <MapPanel
                        map={this.state.map}
                        mode='edit'
                        size={this.state.mapSize}
                        selectedItemID={this.state.selectedTileID ? this.state.selectedTileID : undefined}
                        showOverlay={this.state.addingTile}
                        setSelectedItemID={id => this.setSelectedTileID(id)}
                        gridSquareClicked={(x, y) => this.addMapTile(x, y)}
                    />
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
