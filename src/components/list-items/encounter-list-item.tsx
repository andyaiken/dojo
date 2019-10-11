import React from 'react';

import { Encounter } from '../../models/encounter';

interface Props {
    encounter: Encounter;
    setSelection: (encounter: Encounter) => void;
}

export default class EncounterListItem extends React.Component<Props> {
    public render() {
        try {
            const slots = [];

            this.props.encounter.slots.forEach(slot => {
                let text = slot.monsterName || 'unnamed monster';
                if (slot.count > 1) {
                    text += ' x' + slot.count;
                }
                slots.push(<div key={slot.id} className='section'>{text}</div>);
            });

            if (slots.length === 0) {
                slots.push(<div key='empty' className='section'>no monsters</div>);
            }

            this.props.encounter.waves.forEach(wave => {
                slots.push(<div key={'name ' + wave.id} className='section subheading'>{wave.name || 'unnamed wave'}</div>);
                wave.slots.forEach(slot => {
                    let text = slot.monsterName || 'unnamed monster';
                    if (slot.count > 1) {
                        text += ' x' + slot.count;
                    }
                    slots.push(<div key={slot.id} className='section'>{text}</div>);
                });
                if (slots.length === 0) {
                    slots.push(<div key={'empty ' + wave.id} className='section'>no monsters</div>);
                }
            });

            return (
                <div className='list-item' onClick={() => this.props.setSelection(this.props.encounter)}>
                    <div className='heading'>{this.props.encounter.name || 'unnamed encounter'}</div>
                    {slots}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
