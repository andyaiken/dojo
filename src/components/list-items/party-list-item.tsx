import React from 'react';

import { Party } from '../../models/party';

interface Props {
    party: Party;
    setSelection: (party: Party) => void;
}

export default class PartyListItem extends React.Component<Props> {
    public render() {
        try {
            const pcs = [];
            for (let n = 0; n !== this.props.party.pcs.length; ++n) {
                const pc = this.props.party.pcs[n];
                let name = pc.name || 'unnamed pc';
                if (pc.player) {
                    name += ' (' + pc.player + ')';
                }
                pcs.push(<div key={pc.id} className='section'>{name}</div>);
            }
            if (pcs.length === 0) {
                pcs.push(<div key='empty' className='section'>no pcs</div>);
            }

            return (
                <div className='list-item' onClick={() => this.props.setSelection(this.props.party)}>
                    <div className='heading'>{this.props.party.name || 'unnamed party'}</div>
                    {pcs}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
