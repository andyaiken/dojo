import React from 'react';

import { Party } from '../../models/party';

import ConfirmButton from '../controls/confirm-button';
import InfoCard from './info-card';

interface Props {
    selection: Party;
    changeValue: (field: string, value: string) => void;
    addPC: () => void;
    sortPCs: () => void;
    removeParty: () => void;
}

export default class PartyCard extends React.Component<Props> {
    public render() {
        try {
            const activePCs = this.props.selection.pcs.filter(pc => pc.active);

            const languages = activePCs
                .map(pc => pc.languages)
                .join(', ')
                .split(/[ ,;]+/)
                .reduce((array: string[], value) => {
                    if (array.indexOf(value) === -1) {
                        array.push(value);
                    }
                    return array;
                }, [])
                .sort((a, b) => {
                    if (a === 'Common') {
                        return -1;
                    }
                    if (b === 'Common') {
                        return 1;
                    }
                    return a.localeCompare(b);
                })
                .join(', ');

            let insightSummary = '-';
            let investigationSummary = '-';
            let perceptionSummary = '-';

            if (activePCs.length !== 0) {
                const insight: { min: number | null, max: number | null } = { min: null, max: null };
                const invest: { min: number | null, max: number | null } = { min: null, max: null };
                const percep: { min: number | null, max: number | null } = { min: null, max: null };

                activePCs.forEach(pc => {
                    insight.min = insight.min === null ? pc.passiveInsight : Math.min(insight.min, pc.passiveInsight);
                    insight.max = insight.max === null ? pc.passiveInsight : Math.max(insight.max, pc.passiveInsight);
                    invest.min = invest.min === null ? pc.passiveInvestigation : Math.min(invest.min, pc.passiveInvestigation);
                    invest.max = invest.max === null ? pc.passiveInvestigation : Math.max(invest.max, pc.passiveInvestigation);
                    percep.min = percep.min === null ? pc.passivePerception : Math.min(percep.min, pc.passivePerception);
                    percep.max = percep.max === null ? pc.passivePerception : Math.max(percep.max, pc.passivePerception);
                });

                insightSummary = insight.min === insight.max ? (insight.min as number).toString() : insight.min + ' - ' + insight.max;
                investigationSummary = invest.min === invest.max ? (invest.min as number).toString() : invest.min + ' - ' + invest.max;
                perceptionSummary = percep.min === percep.max ? (percep.min as number).toString() : percep.min + ' - ' + percep.max;
            }

            const heading = (
                <div className='heading'>
                    <div className='title'>party</div>
                </div>
            );

            const content = (
                <div>
                    <div className='section'>
                        <input
                            type='text'
                            placeholder='party name'
                            value={this.props.selection.name}
                            onChange={event => this.props.changeValue('name', event.target.value)}
                        />
                    </div>
                    <div className='divider' />
                    <div className='section' style={{ display: languages !== '' ? 'block' : 'none' }}>
                        <div className='subheading'>languages</div>
                    </div>
                    <div className='section'>
                        {languages}
                    </div>
                    <div className='section'>
                        <div className='subheading'>passive skills</div>
                    </div>
                    <div className='table'>
                        <div>
                            <div className='cell three'><b>insight</b></div>
                            <div className='cell three'><b>invest.</b></div>
                            <div className='cell three'><b>percep.</b></div>
                        </div>
                        <div>
                            <div className='cell three'>{insightSummary}</div>
                            <div className='cell three'>{investigationSummary}</div>
                            <div className='cell three'>{perceptionSummary}</div>
                        </div>
                    </div>
                    <div className='divider' />
                    <div className='section'>
                    <button onClick={() => this.props.addPC()}>add a new pc</button>
                        <button onClick={() => this.props.sortPCs()}>sort pcs</button>
                        <ConfirmButton text='delete party' callback={() => this.props.removeParty()} />
                    </div>
                </div>
            );

            return (
                <InfoCard getHeading={() => heading} getContent={() => content} />
            );
        } catch (e) {
            console.error(e);
        }
    }
}
