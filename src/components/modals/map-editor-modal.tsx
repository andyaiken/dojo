import React from 'react';

import Factory from '../../utils/factory';
import Utils from '../../utils/utils';

import { Map, MapItem } from '../../models/map-folio';

import MapTileCard from '../cards/map-tile-card';
import MapPanel from '../panels/map-panel';

interface Props {
    map: Map;
}

interface State {
    map: Map;
    selectedTileID: string | null;
    addingTile: boolean;
}

export default class MapEditorModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            map: props.map,
            selectedTileID: null,
            addingTile: false
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

    private addMapTile(x: number, y: number) {
        const tile = Factory.createMapItem();
        tile.x = x;
        tile.y = y;
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

    private changeValue(source: any, field: string, value: any) {
        source[field] = value;

        this.setState({
            map: this.state.map
        });
    }

    public render() {
        try {
            const addBtn = (
                <button onClick={() => this.toggleAddingTile()}>
                    {this.state.addingTile ? 'click somewhere on the map to add your new tile, or click here to cancel' : 'add a new tile'}
                </button>
            );
            let tools = null;
            if (this.state.selectedTileID) {
                const item = this.state.map.items.find(i => i.id === this.state.selectedTileID);
                if (item) {
                    tools = (
                        <div className='tools'>
                            <MapTileCard
                                tile={item}
                                moveMapItem={(mapItem, dir) => this.moveMapItem(mapItem, dir)}
                                resizeMapItem={(mapItem, dir, dir2) => this.resizeMapItem(mapItem, dir, dir2 as 'in' | 'out')}
                                cloneMapItem={mapItem => this.cloneMapItem(mapItem)}
                                removeMapItem={mapItem => this.removeMapItem(mapItem)}
                                changeValue={(source, field, value) => this.changeValue(source, field, value)}
                            />
                            {addBtn}
                        </div>
                    );
                }
            } else {
                tools = (
                    <div className='tools'>
                        <p>to add a new tile to the map, click on the button below</p>
                        <p>to edit an existing tile, click on it once to select it</p>
                        <div className='divider' />
                        {addBtn}
                    </div>
                );
            }

            return (
                <div className='map-editor'>
                    {tools}
                    <MapPanel
                        map={this.state.map}
                        mode='edit'
                        selectedItemID={this.state.selectedTileID ? this.state.selectedTileID : undefined}
                        showOverlay={this.state.addingTile}
                        setSelectedItemID={id => this.setSelectedTileID(id)}
                        gridSquareClicked={(x, y) => this.addMapTile(x, y)}
                    />
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}