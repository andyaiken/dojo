import React from 'react';

import { MapItem, TERRAIN_TYPES } from '../../models/map-folio';

import Dropdown from '../controls/dropdown';
import Radial from '../controls/radial';
import Selector from '../controls/selector';

interface Props {
    tile: MapItem;
    changeValue: (tile: MapItem, field: string, value: any) => void;
    moveMapItem: (tile: MapItem, dir: string) => void;
    resizeMapItem: (tile: MapItem, dir: string, dir2: 'in' | 'out' | null) => void;
    cloneMapItem: (tile: MapItem) => void;
    removeMapItem: (tile: MapItem) => void;
}

export default class MapTileCard extends React.Component<Props> {
    public render() {
        try {
            const terrainOptions = TERRAIN_TYPES.map(t => {
                return { id: t, text: t };
            });

            const styleOptions = ['square', 'rounded', 'circle'].map(t => {
                return { id: t, text: t };
            });

            let customSection = null;
            if (this.props.tile.terrain === 'custom') {
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
                                            this.props.changeValue(this.props.tile, 'customBackground', content);
                                        }
                                    };
                                    reader.readAsDataURL(e.target.files[0]);
                                }
                            }}
                        />
                        <button onClick={() => this.props.changeValue(this.props.tile, 'customBackground', '')}>clear image</button>
                    </div>
                );
            }

            return (
                <div className='card map'>
                    <div className='heading'>
                        <div className='title'>map tile</div>
                    </div>
                    <div className='card-content'>
                        <div className='subheading'>size</div>
                        <div className='section'>{this.props.tile.width} sq x {this.props.tile.height} sq</div>
                        <div className='section'>{this.props.tile.width * 5} ft x {this.props.tile.height * 5} ft</div>
                        <div className='divider' />
                        <div className='subheading'>terrain</div>
                        <Dropdown
                            options={terrainOptions}
                            placeholder='select terrain'
                            selectedID={this.props.tile.terrain ? this.props.tile.terrain : undefined}
                            select={optionID => this.props.changeValue(this.props.tile, 'terrain', optionID)}
                        />
                        {customSection}
                        <div className='divider' />
                        <div className='subheading'>style</div>
                        <Selector
                            options={styleOptions}
                            selectedID={this.props.tile.style}
                            select={optionID => this.props.changeValue(this.props.tile, 'style', optionID)}
                        />
                        <div className='divider' />
                        <div className='subheading'>move</div>
                        <div className='section centered'>
                            <Radial direction='out' click={dir => this.props.moveMapItem(this.props.tile, dir)} />
                        </div>
                        <div className='divider' />
                        <div className='subheading'>resize</div>
                        <div className='section centered'>
                            <Radial direction='both' click={(dir, dir2) => this.props.resizeMapItem(this.props.tile, dir, dir2)} />
                        </div>
                        <div className='divider' />
                        <div className='section'>
                            <button onClick={() => this.props.cloneMapItem(this.props.tile)}>clone tile</button>
                            <button onClick={() => this.props.removeMapItem(this.props.tile)}>remove tile</button>
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
