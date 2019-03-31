import React from 'react';

import InfoCard from '../info-card';

export default class DMScreenCard extends React.Component {
    private getContent() {
        return (
            <div>
                <div className='section'>this is the dm screen</div>
                <div className='section'>it contains a collection of modules which might be useful when you're running the game</div>
                <div className='divider' />
                <div className='section'>click on a module below to open it</div>
            </div>
        );
    }

    public render() {
        return (
            <InfoCard getContent={this.getContent}/>
        );
    }
}
