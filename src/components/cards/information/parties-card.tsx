import React from 'react';

import { Party } from '../../../models/party';

import InfoCard from '../info-card';

interface Props {
    parties: Party[];
}

export default class PartiesCard extends React.Component<Props> {
    private getContent() {
        let action: JSX.Element | null = null;
        if (this.props.parties.length === 0) {
            action = (
                <div className='section'>to start adding a party, press the button below</div>
            );
        } else {
            action = (
                <div className='section'>select a party from the list to see pc details</div>
            );
        }

        return (
            <div>
                <div className='section'>this page is where you can tell dojo all about your pcs</div>
                <div className='section'>you can add a party for each of your gaming groups</div>
                <div className='divider'/>
                {action}
            </div>
        );
    }

    public render() {
        try {
            return (
                <InfoCard getContent={this.getContent} />
            );
        } catch (ex) {
            console.error(ex);
        }
    }
}
