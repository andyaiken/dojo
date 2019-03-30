import React from 'react';

import InfoCard from '../info-card';

export default class DMScreenCard extends React.Component {
    private getContent() {
        return (
            <div>
                <div className='section'>DM SCREEN</div>
                <div className='divider' />
                <div className='section'>below you will see a list of modules</div>
            </div>
        );
    }

    public render() {
        return (
            <InfoCard getContent={this.getContent}/>
        );
    }
}
