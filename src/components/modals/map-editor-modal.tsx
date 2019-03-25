import React from 'react';

import Utils from '../../utils/utils';
import Factory from '../../utils/factory';

import { Map, MapItem } from '../../models/map-folio';

import MapTileCard from '../cards/map-tile-card';
import MapPanel from '../panels/map-panel';

interface Props {
    map: Map;
}

interface State {
    map: Map;
    selectedTileID: string | null;
}

export default class MapEditorModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            map: props.map,
            selectedTileID: null
        };
    }

    setSelectedTileID(id: string | null) {
        this.setState({
            selectedTileID: id
        });
    }

    addMapTile(x: number, y: number) {
        var tile = Factory.createMapItem();
        tile.x = x;
        tile.y = y;
        tile.terrain = 'flagstone';
        this.state.map.items.push(tile);

        this.setState({
            map: this.state.map,
            selectedTileID: tile.id
        });
    }

    moveMapItem(item: MapItem, dir: string) {
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

    bigMapItem(item: MapItem, dir: string) {
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

    smallMapItem(item: MapItem, dir: string) {
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

    resizeMapItem(item: MapItem, dir: string, dir2: 'in' | 'out') {
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

    cloneMapItem(item: MapItem) {
        var copy = JSON.parse(JSON.stringify(item));
        copy.id = Utils.guid();
        copy.x += 1;
        copy.y += 1;
        this.state.map.items.push(copy);

        this.setState({
            map: this.state.map,
            selectedTileID: copy.id
        });
    }

    removeMapItem(item: MapItem) {
        var index = this.state.map.items.indexOf(item);
        this.state.map.items.splice(index, 1);

        this.setState({
            map: this.state.map,
            selectedTileID: null
        });
    }

    changeValue(source: any, field: string, value: any) {
        source[field] = value;
        
        this.setState({
            map: this.state.map
        });
    }

    public render() {
        try {
            var tools = null;
            if (this.state.selectedTileID) {
                var item = this.state.map.items.find(i => i.id === this.state.selectedTileID);
                if (item) {
                    tools = (
                        <div className='tools'>
                            <MapTileCard
                                tile={item}
                                moveMapItem={(item, dir) => this.moveMapItem(item, dir)}
                                resizeMapItem={(item, dir, dir2) => this.resizeMapItem(item, dir, dir2 as 'in' | 'out')}
                                cloneMapItem={item => this.cloneMapItem(item)}
                                removeMapItem={item => this.removeMapItem(item)}
                                changeValue={(source, field, value) => this.changeValue(source, field, value)}
                            />
                        </div>
                    );
                }
            } else {
                tools = (
                    <div className='tools'>
                        <p>to add a new tile to the map, double-click on an empty grid square</p>
                        <p>to edit an existing tile, click on it once to select it</p>
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
                        setSelectedItemID={id => this.setSelectedTileID(id)}
                        addMapTile={(x, y) => this.addMapTile(x, y)}
                    />
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
