import React from 'react';

import { Party } from '../../../models/models';

import InfoCard from '../info-card';

interface Props {
    parties: Party[];
}

export default class PartiesCard extends React.Component<Props> {
    render() {
        try {
            var action: JSX.Element | null = null;
            if (this.props.parties.length === 0) {
                action = (
                    <div className="section">to start adding a party, press the button below</div>
                );
            } else {
                action = (
                    <div className="section">select a party from the list to see pc details</div>
                );
            }

            return (
                <InfoCard
                    getContent={() => (
                        <div>
                            <div className="section">
                                <div>this page is where you can tell dojo all about your pcs</div>
                            </div>
                            <div className="section">
                                <div>you can add a party for each of your gaming groups</div>
                            </div>
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