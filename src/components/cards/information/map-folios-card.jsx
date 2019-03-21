import React from 'react';

import InfoCard from '../info-card';

export default class MapFoliosCard extends React.Component {
    render() {
        try {
            var action = null;
            if (this.props.mapFolios.length === 0) {
                action = (
                    <div className="section">to start a new folio, press the button below</div>
                );
            } else {
                action = (
                    <div className="section">select a map folio from the list to see the maps it contains</div>
                );
            }

            var content = (
                <div>
                    <div className="section">on this page you can set up folios containing tactical maps</div>
                    <div className="section">when you have created a map you can use it in encounters</div>
                    <div className="divider"></div>
                    {action}
                </div>
            );

            return (
                <InfoCard getContent={() => content} />
            );
        } catch (e) {
            console.error(e);
        }
    };
}