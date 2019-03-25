import React from 'react';

import Utils from '../../utils/utils';

import { Encounter, EncounterSlot } from '../../models/encounter';
import { Monster } from '../../models/monster-group';
import { Party } from '../../models/party';

interface Props {
    encounter: Encounter;
    party: Party | null;
    getMonster: (monsterName: string, groupName: string) => Monster | null;
}

export default class DifficultyChartPanel extends React.Component<Props> {
    public render() {
        let monsterCount = 0;
        let monsterXp = 0;
        let slots: EncounterSlot[] = [];
        slots = slots.concat(this.props.encounter.slots);
        this.props.encounter.waves.forEach(wave => {
            slots = slots.concat(wave.slots);
        });
        slots.forEach(slot => {
            monsterCount += slot.count;
            const monster = this.props.getMonster(slot.monsterName, slot.monsterGroupName);
            if (monster) {
                monsterXp += Utils.experience(monster.challenge) * slot.count;
            }
        });

        const adjustedXp = monsterXp * Utils.experienceFactor(monsterCount);

        let xpThresholds;
        let diffSection;
        if (this.props.party) {
            let xpEasy = 0;
            let xpMedium = 0;
            let xpHard = 0;
            let xpDeadly = 0;

            const pcs = this.props.party.pcs.filter(pc => pc.active);
            pcs.forEach(pc => {
                xpEasy += Utils.pcExperience(pc.level, 'easy');
                xpMedium += Utils.pcExperience(pc.level, 'medium');
                xpHard += Utils.pcExperience(pc.level, 'hard');
                xpDeadly += Utils.pcExperience(pc.level, 'deadly');
            });

            let difficulty = null;
            let adjustedDifficulty = null;
            if (adjustedXp > 0) {
                difficulty = 'trivial';
                if (adjustedXp >= xpEasy) {
                    difficulty = 'easy';
                }
                if (adjustedXp >= xpMedium) {
                    difficulty = 'medium';
                }
                if (adjustedXp >= xpHard) {
                    difficulty = 'hard';
                }
                if (adjustedXp >= xpDeadly) {
                    difficulty = 'deadly';
                }
                adjustedDifficulty = difficulty;

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
                        <div className='cell four'><b>easy</b></div>
                        <div className='cell four'><b>medium</b></div>
                        <div className='cell four'><b>hard</b></div>
                        <div className='cell four'><b>deadly</b></div>
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
                const max = Math.max(adjustedXp, (xpDeadly * 1.2));
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
                            <div className='encounter' style={{ left: (getLeft(adjustedXp) - 0.5) + '%' }} />
                        </div>
                    </div>
                    <div className='subheading'>difficulty</div>
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
        }

        return (
            <div>
                <div className='subheading'>xp value</div>
                <div className='section'>
                    xp for this encounter
                    <div className='right'>{monsterXp} xp</div>
                </div>
                <div className='section' style={{ display: (adjustedXp === monsterXp) ? 'none' : ''}}>
                    effective xp for {monsterCount} monster(s)
                    <div className='right'>{adjustedXp} xp</div>
                </div>
                {xpThresholds}
                {diffSection}
            </div>
        );
    }
}
