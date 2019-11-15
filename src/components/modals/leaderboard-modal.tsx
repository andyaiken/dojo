import React from 'react';

import Utils from '../../utils/utils';

import { Combat } from '../../models/combat';

import ChartPanel from '../panels/chart-panel';

interface Props {
    combat: Combat;
}

export default class LeaderboardModal extends React.Component<Props> {
    private getKillsChart() {
        let data: {text: string, value: number}[] = [];

        this.props.combat.report
            .filter(entry => entry.type === 'kill')
            .forEach(entry => {
                const combatant = this.props.combat.combatants.find(c => c.id === entry.combatantID);
                if (combatant && (combatant.type === 'pc')) {
                    let datum = data.find(d => d.text === combatant.displayName);
                    if (datum === undefined) {
                        datum = {
                            text: combatant.displayName,
                            value: 0
                        };
                        data.push(datum);
                    }
                    datum.value += 1;
                }
            });

        data = Utils.sort(data, [{field: 'value', dir: 'desc'}]);

        return (
            <div>
                <div className='subheading'>kills</div>
                {data.length === 0 ? <div className='section'>no data to display</div> : null}
                <ChartPanel data={data} />
            </div>
        );
    }

    private getDamageChart() {
        let data: {text: string, value: number}[] = [];

        this.props.combat.report
            .filter(entry => entry.type === 'damage')
            .forEach(entry => {
                const combatant = this.props.combat.combatants.find(c => c.id === entry.combatantID);
                if (combatant && (combatant.type === 'pc')) {
                    let datum = data.find(d => d.text === combatant.displayName);
                    if (datum === undefined) {
                        datum = {
                            text: combatant.displayName,
                            value: 0
                        };
                        data.push(datum);
                    }
                    datum.value += entry.value;
                }
            });

        data = Utils.sort(data, [{field: 'value', dir: 'desc'}]);

        return (
            <div>
                <div className='subheading'>damage dealt</div>
                {data.length === 0 ? <div className='section'>no data to display</div> : null}
                <ChartPanel data={data} />
            </div>
        );
    }

    private getMobilityChart() {
        let data: {text: string, value: number}[] = [];

        this.props.combat.report
            .filter(entry => entry.type === 'movement')
            .forEach(entry => {
                const combatant = this.props.combat.combatants.find(c => c.id === entry.combatantID);
                if (combatant && (combatant.type === 'pc')) {
                    let datum = data.find(d => d.text === combatant.displayName);
                    if (datum === undefined) {
                        datum = {
                            text: combatant.displayName,
                            value: 0
                        };
                        data.push(datum);
                    }
                    datum.value += 1;
                }
            });

        data = Utils.sort(data, [{field: 'value', dir: 'desc'}]);

        return (
            <div>
                <div className='subheading'>mobility</div>
                {data.length === 0 ? <div className='section'>no data to display</div> : null}
                <ChartPanel data={data} />
            </div>
        );
    }

    private getConditionsAddedChart() {
        let data: {text: string, value: number}[] = [];

        this.props.combat.report
            .filter(entry => entry.type === 'condition-add')
            .forEach(entry => {
                const combatant = this.props.combat.combatants.find(c => c.id === entry.combatantID);
                if (combatant && (combatant.type === 'pc')) {
                    let datum = data.find(d => d.text === combatant.displayName);
                    if (datum === undefined) {
                        datum = {
                            text: combatant.displayName,
                            value: 0
                        };
                        data.push(datum);
                    }
                    datum.value += 1;
                }
            });

        data = Utils.sort(data, [{field: 'value', dir: 'desc'}]);

        return (
            <div>
                <div className='subheading'>conditions added</div>
                {data.length === 0 ? <div className='section'>no data to display</div> : null}
                <ChartPanel data={data} />
            </div>
        );
    }

    private getConditionsRemovedChart() {
        let data: {text: string, value: number}[] = [];

        this.props.combat.report
            .filter(entry => entry.type === 'condition-remove')
            .forEach(entry => {
                const combatant = this.props.combat.combatants.find(c => c.id === entry.combatantID);
                if (combatant && (combatant.type === 'pc')) {
                    let datum = data.find(d => d.text === combatant.displayName);
                    if (datum === undefined) {
                        datum = {
                            text: combatant.displayName,
                            value: 0
                        };
                        data.push(datum);
                    }
                    datum.value += 1;
                }
            });

        data = Utils.sort(data, [{field: 'value', dir: 'desc'}]);

        return (
            <div>
                <div className='subheading'>conditions removed</div>
                {data.length === 0 ? <div className='section'>no data to display</div> : null}
                <ChartPanel data={data} />
            </div>
        );
    }

    private getTurnLengthChart() {
        let data: {text: string, value: number}[] = [];

        let start: number | null = null;
        let pauses: { start: number | null, end: number | null }[] = [];

        this.props.combat.report
            .forEach(entry => {
                switch (entry.type) {
                    case 'turn-start':
                        start = entry.timestamp;
                        break;
                    case 'turn-end':
                        if (start !== null) {
                            const combatant = this.props.combat.combatants.find(c => c.id === entry.combatantID);
                            if (combatant && (combatant.type === 'pc')) {
                                let datum = data.find(d => d.text === combatant.displayName);
                                if (datum === undefined) {
                                    datum = {
                                        text: combatant.displayName,
                                        value: 0
                                    };
                                    data.push(datum);
                                }
                                let length = entry.timestamp - start;
                                pauses.forEach(p => {
                                    if (p.start && p.end) {
                                        const pauseLength = p.end - p.start;
                                        length -= pauseLength;
                                    }
                                });
                                datum.value += length;
                            }
                            start = null;
                            pauses = [];
                        }
                        break;
                    case 'combat-pause':
                        pauses.push({
                            start: entry.timestamp,
                            end: null
                        });
                        break;
                    case 'combat-resume':
                        if (pauses.length > 0) {
                            const last = pauses[pauses.length - 1];
                            last.end = entry.timestamp;
                        }
                        break;
                }
            });

        data = Utils.sort(data, [{field: 'value', dir: 'asc'}]);

        return (
            <div>
                <div className='subheading'>turn length</div>
                {data.length === 0 ? <div className='section'>no data to display</div> : null}
                <ChartPanel
                    data={data}
                    display={value => {
                        const d = new Date(value);
                        return d.getMinutes() + 'm ' + d.getSeconds() + 's';
                    }}
                />
            </div>
        );
    }

    public render() {
        try {
            return (
                <div className='scrollable' style={{ padding: '10px' }}>
                    {this.getKillsChart()}
                    {this.getDamageChart()}
                    {this.getMobilityChart()}
                    {this.getConditionsAddedChart()}
                    {this.getConditionsRemovedChart()}
                    {this.getTurnLengthChart()}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
