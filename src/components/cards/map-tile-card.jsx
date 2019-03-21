import React from 'react';

import { TERRAIN_TYPES } from '../../models/models';

import Dropdown from '../controls/dropdown';
import Radial from '../controls/radial';

export default class MapTileCard extends React.Component {
    render() {
        try {
            var terrainOptions = TERRAIN_TYPES.map(function (t) {
                return { id: t, text: t };
            });

            return (
                <div className="card map-tile">
                    <div className="heading">
                        <div className="title">map tile</div>
                    </div>
                    <div className="card-content">
                        <div className="subheading">size</div>
                        <div className="section">{this.props.tile.width} sq x {this.props.tile.height} sq</div>
                        <div className="section">{this.props.tile.width * 5} ft x {this.props.tile.height * 5} ft</div>
                        <div className="divider"></div>
                        <div className="subheading">terrain</div>
                        <Dropdown
                            options={terrainOptions}
                            placeholder="select terrain"
                            selectedID={this.props.tile.terrain}
                            select={optionID => this.props.changeValue(this.props.tile, "terrain", optionID)}
                        />
                        <div className="divider"></div>
                        <div className="subheading">move</div>
                        <div className="section centered">
                            <Radial direction="out" click={dir => this.props.moveMapItem(this.props.tile, dir)} />
                        </div>
                        <div className="divider"></div>
                        <div className="subheading">resize</div>
                        <div className="section centered">
                            <Radial direction="both" click={(dir, dir2) => this.props.resizeMapItem(this.props.tile, dir, dir2)} />
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <button onClick={() => this.props.cloneMapItem(this.props.tile)}>clone tile</button>
                            <button onClick={() => this.props.removeMapItem(this.props.tile)}>remove tile</button>
                        </div>
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}