import React from 'react';

import InfoCard from '../info-card';

export default class EncounterBuilderCard extends React.Component {
    render() {
        try {
            var action = null;
            if (this.props.encounters.length === 0) {
                action = (
                    <div className="section">to start building an encounter, press the button below</div>
                );
            } else {
                action = (
                    <div className="section">select an encounter from the list to add monsters to it</div>
                );
            }

            return (
                <InfoCard
                    getContent={() => (
                        <div>
                            <div className="section">on this page you can set up encounters</div>
                            <div className="section">when you have created an encounter you can add monsters to it, then gauge its difficulty for a party of pcs</div>
                            <div className="divider"></div>
                            {action}
                        </div>
                    )}
                />
            );
        } catch (e) {
            console.error(e);
        }
    };
}