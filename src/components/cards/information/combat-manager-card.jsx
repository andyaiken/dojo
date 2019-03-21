import React from 'react';

import InfoCard from '../info-card';

export default class CombatManagerCard extends React.Component {
    render() {
        return (
            <InfoCard
                getContent={() => (
                    <div>
                        <div className="section">here you can run a combat encounter by specifying a party and an encounter</div>
                        <div className="divider"></div>
                        <div className="section">below you will see a list of encounters that you have paused</div>
                        <div className="section">you can resume a paused combat by selecting it</div>
                    </div>
                )}
            />
        );
    };
}