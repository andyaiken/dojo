import React from 'react';

import Napoleon from '../../utils/napoleon';
import Utils from '../../utils/utils';

import { Encounter } from '../../models/encounter';
import { Monster } from '../../models/monster-group';
import { Party } from '../../models/party';

import Dropdown from '../controls/dropdown';

interface Props {
    encounter: Encounter;
    parties: Party[];
    party: Party | null;
    getMonster: (monsterName: string, groupName: string) => Monster | null;
}

interface State {
    selectedPartyID: string | null;
}

export default class DifficultyChartPanel extends React.Component<Props, State> {
    public static defaultProps = {
        party: null
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            selectedPartyID: props.party ? props.party.id : null
        };
    }

    private selectParty(partyID: string | null) {
        this.setState({
            selectedPartyID: partyID
        });
    }

    public render() {
        const monsterCount = Napoleon.getMonsterCount(this.props.encounter);
        const monsterXP = Napoleon.getEncounterXP(this.props.encounter, this.props.getMonster);
        const adjustedXP = Napoleon.getAdjustedEncounterXP(this.props.encounter, this.props.getMonster);

        const basicData = (
            <div>
                <div className='divider' />
                <div className='section'>
                    xp for this encounter
                    <div className='right'>{monsterXP} xp</div>
                </div>
                <div className='section' style={{ display: (adjustedXP === monsterXP) ? 'none' : ''}}>
                    effective xp for {monsterCount} monster(s)
                    <div className='right'>{adjustedXP} xp</div>
                </div>
            </div>
        );

        let xpThresholds;
        let diffSection;
        const party = this.props.parties.find(p => p.id === this.state.selectedPartyID);
        if (party) {
            let xpEasy = 0;
            let xpMedium = 0;
            let xpHard = 0;
            let xpDeadly = 0;

            const pcs = party.pcs.filter(pc => pc.active);
            pcs.forEach(pc => {
                xpEasy += Utils.pcExperience(pc.level, 'easy');
                xpMedium += Utils.pcExperience(pc.level, 'medium');
                xpHard += Utils.pcExperience(pc.level, 'hard');
                xpDeadly += Utils.pcExperience(pc.level, 'deadly');
            });

            let difficulty = 'trivial';
            let adjustedDifficulty = 'trivial';
            if (adjustedXP > 0) {
                if (adjustedXP >= xpEasy) {
                    difficulty = 'easy';
                    adjustedDifficulty = 'easy';
                }
                if (adjustedXP >= xpMedium) {
                    difficulty = 'medium';
                    adjustedDifficulty = 'medium';
                }
                if (adjustedXP >= xpHard) {
                    difficulty = 'hard';
                    adjustedDifficulty = 'hard';
                }
                if (adjustedXP >= xpDeadly) {
                    difficulty = 'deadly';
                    adjustedDifficulty = 'deadly';
                }

                if ((pcs.length < 3) || (pcs.length > 5)) {
                    const small = pcs.length < 3;
                    switch (difficulty) {
                        case 'trivial':
                            adjustedDifficulty = small ? 'easy' : 'trivial';
                            break;
                        case 'easy':
                            adjustedDifficulty = small ? 'medium' : 'trivial';
                            break;
                        case 'medium':
                            adjustedDifficulty = small ? 'hard' : 'easy';
                            break;
                        case 'hard':
                            adjustedDifficulty = small ? 'deadly' : 'medium';
                            break;
                        case 'deadly':
                            adjustedDifficulty = small ? 'deadly' : 'hard';
                            break;
                        default:
                            adjustedDifficulty = '';
                            break;
                    }
                }
            }

            xpThresholds = (
                <div className='table'>
                    <div>
                        <div className='cell four easy'><b>easy</b></div>
                        <div className='cell four medium'><b>medium</b></div>
                        <div className='cell four hard'><b>hard</b></div>
                        <div className='cell four deadly'><b>deadly</b></div>
                    </div>
                    <div>
                        <div className='cell four'>{xpEasy} xp</div>
                        <div className='cell four'>{xpMedium} xp</div>
                        <div className='cell four'>{xpHard} xp</div>
                        <div className='cell four'>{xpDeadly} xp</div>
                    </div>
                </div>
            );

            const getLeft = (xp: number) => {
                const max = Math.max(adjustedXP, (xpDeadly * 1.2));
                return (100 * xp) / max;
            };

            const getRight = (xp: number) => {
                return 100 - getLeft(xp);
            };

            diffSection = (
                <div>
                    <div className='difficulty-gauge'>
                        <div className='bar-container'>
                            <div className='bar trivial' style={{ left: '0', right: getRight(xpEasy) + '%' }} />
                        </div>
                        <div className='bar-container'>
                            <div className='bar easy' style={{ left: getLeft(xpEasy) + '%', right: getRight(xpMedium) + '%' }} />
                        </div>
                        <div className='bar-container'>
                            <div className='bar medium' style={{ left: getLeft(xpMedium) + '%', right: getRight(xpHard) + '%' }} />
                        </div>
                        <div className='bar-container'>
                            <div className='bar hard' style={{ left: getLeft(xpHard) + '%', right: getRight(xpDeadly) + '%' }} />
                        </div>
                        <div className='bar-container'>
                            <div className='bar deadly' style={{ left: getLeft(xpDeadly) + '%', right: '0' }} />
                        </div>
                        <div className='encounter-container'>
                            <div className='encounter' style={{ left: (getLeft(adjustedXP) - 0.5) + '%' }} />
                        </div>
                    </div>
                    {basicData}
                    <div className='section'>
                        difficulty for this party
                        <div className='right'>{difficulty}</div>
                    </div>
                    <div className='section' style={{ display: (adjustedDifficulty === difficulty) ? 'none' : ''}}>
                        effective difficulty for {pcs.length} pc(s)
                        <div className='right'><b>{adjustedDifficulty}</b></div>
                    </div>
                </div>
            );
        } else {
            diffSection = basicData;
        }

        let partySelection = null;
        if (!this.props.party) {
            const partyOptions = [];
            if (this.props.parties) {
                for (let n = 0; n !== this.props.parties.length; ++n) {
                    const p = this.props.parties[n];
                    partyOptions.push({
                        id: p.id,
                        text: p.name
                    });
                }
            }

            partySelection = (
                <Dropdown
                    options={partyOptions}
                    placeholder='select party...'
                    selectedID={this.state.selectedPartyID ? this.state.selectedPartyID : undefined}
                    select={optionID => this.selectParty(optionID)}
                    clear={() => this.selectParty(null)}
                />
            );
        }

        return (
            <div className='group-panel'>
                <div className='subheading'>difficulty</div>
                {partySelection}
                {xpThresholds}
                {diffSection}
            </div>
        );
    }
}
