import React from 'react';

import { Input } from 'antd';

import { Party, PC } from '../../models/party';

import PCCard from '../cards/pc-card';
import ConfirmButton from '../controls/confirm-button';
import CardGroup from '../panels/card-group';
import Note from '../panels/note';

interface Props {
    party: Party;
    removeParty: () => void;
    addPC: () => void;
    editPC: (pc: PC) => void;
    removePC: (pc: PC) => void;
    sortPCs: () => void;
    changeValue: (source: any, field: string, value: any) => void;
    nudgeValue: (source: any, field: string, value: number) => void;
}

export default class PartyScreen extends React.Component<Props> {
    public render() {
        try {
            const activePCs = this.props.party.pcs.filter(pc => pc.active);
            const activeCards: JSX.Element[] = [];
            activePCs.forEach(activePC => {
                activeCards.push(
                    <div className='column' key={activePC.id}>
                        <PCCard
                            pc={activePC}
                            mode={'edit'}
                            changeValue={(pc, type, value) => this.props.changeValue(pc, type, value)}
                            editPC={pc => this.props.editPC(pc)}
                            removePC={pc => this.props.removePC(pc)}
                        />
                    </div>
                );
            });

            const inactivePCs = this.props.party.pcs.filter(pc => !pc.active);
            const inactiveCards: JSX.Element[] = [];
            inactivePCs.forEach(inactivePC => {
                inactiveCards.push(
                    <div className='column' key={inactivePC.id}>
                        <PCCard
                            pc={inactivePC}
                            mode={'edit'}
                            changeValue={(pc, type, value) => this.props.changeValue(pc, type, value)}
                            editPC={pc => this.props.editPC(pc)}
                            removePC={pc => this.props.removePC(pc)}
                        />
                    </div>
                );
            });

            if (activePCs.length === 0) {
                activeCards.push(
                    <div className='column' key='empty'>
                        <Note><div className='section'>there are no pcs in this party</div></Note>
                    </div>
                );
            }

            return (
                <div className='screen row collapse'>
                    <div className='columns small-4 medium-4 large-3 scrollable sidebar'>
                        <PartyInfo
                            party={this.props.party}
                            addPC={() => this.props.addPC()}
                            sortPCs={() => this.props.sortPCs()}
                            changeValue={(type, value) => this.props.changeValue(this.props.party, type, value)}
                            removeParty={() => this.props.removeParty()}
                        />
                    </div>
                    <div className='columns small-8 medium-8 large-9 scrollable'>
                        <CardGroup
                            content={activeCards}
                            heading={this.props.party.name || 'unnamed party'}
                        />
                        <CardGroup
                            content={inactiveCards}
                            heading='inactive pcs'
                            hidden={inactiveCards.length === 0}
                        />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}

interface PartyInfoProps {
    party: Party;
    changeValue: (field: string, value: string) => void;
    addPC: () => void;
    sortPCs: () => void;
    removeParty: () => void;
}

class PartyInfo extends React.Component<PartyInfoProps> {
    private getSummary() {
        const activePCs = this.props.party.pcs.filter(pc => pc.active);
        if (activePCs.length === 0) {
            return null;
        }

        let languages = '';
        let insightSummary = '-';
        let investigationSummary = '-';
        let perceptionSummary = '-';

        languages = activePCs
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

        return (
            <div className='group-panel'>
                <div className='section' style={{ display: languages !== '' ? 'block' : 'none' }}>
                    <div className='subheading'>party languages</div>
                </div>
                <div className='section'>
                    {languages}
                </div>
                <div className='section'>
                    <div className='subheading'>party passive skills</div>
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
            </div>
        );
    }

    public render() {
        try {
            return (
                <div>
                    <div className='section'>
                        <div className='subheading'>party name</div>
                        <Input
                            placeholder='party name'
                            value={this.props.party.name}
                            allowClear={true}
                            onChange={event => this.props.changeValue('name', event.target.value)}
                        />
                    </div>
                    <div className='divider' />
                    {this.getSummary()}
                    <div className='divider' />
                    <div className='section'>
                        <button onClick={() => this.props.addPC()}>add a new pc</button>
                        <button onClick={() => this.props.sortPCs()}>sort pcs</button>
                        <ConfirmButton text='delete party' callback={() => this.props.removeParty()} />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
