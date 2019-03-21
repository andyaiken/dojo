import React from 'react';

import ConfirmButton from '../controls/confirm-button';
import InfoCard from '../cards/info-card';

export default class MapFolioCard extends React.Component {
    render() {
        try {
            var heading = null;
            var content = null;

            if (this.props.selection) {
                heading = (
                    <div className="heading">
                        <div className="title">map folio</div>
                    </div>
                );

                content = (
                    <div>
                        <div className="section">
                            <input type="text" placeholder="folio name" value={this.props.selection.name} onChange={event => this.props.changeValue(this.props.selection, "name", event.target.value)} />
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <button onClick={() => this.props.addMap()}>add a new map</button>
                            <ConfirmButton text="delete folio" callback={() => this.props.removeMapFolio()} />
                        </div>
                    </div>
                )
            }

            return (
                <InfoCard getHeading={() => heading} getContent={() => content} />
            );
        } catch (e) {
            console.error(e);
        }
    };
}