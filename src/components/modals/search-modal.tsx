import React from 'react';

import { Input } from 'antd';

import Sherlock from '../../utils/sherlock';

import { MonsterGroup } from '../../models/monster-group';
import { Party } from '../../models/party';

import Note from '../panels/note';

interface Props {
    parties: Party[];
    library: MonsterGroup[];
    openParty: (id: string) => void;
    openGroup: (id: string) => void;
}

interface State {
    text: string;
}

export default class SearchModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            text: ''
        };
    }

    private setSearchTerm(text: string) {
        this.setState({
            text: text
        });
    }

    public render() {
        try {
            const results = [];
            if (this.state.text.length > 2) {
                this.props.parties.filter(party => Sherlock.matchParty(this.state.text, party)).forEach(party => {
                    const pcs: JSX.Element[] = [];
                    party.pcs.filter(pc => Sherlock.matchPC(this.state.text, pc)).forEach(pc => {
                        const companions: JSX.Element[] = [];
                        pc.companions.filter(comp => Sherlock.matchCompanion(this.state.text, comp)).forEach(comp => {
                            companions.push(
                                <div key={comp.id} className='group-panel'>
                                    <div className='section'>{comp.name}</div>
                                </div>
                            );
                        });
                        pcs.push(
                            <div key={pc.id} className='group-panel'>
                                <div className='section'>{pc.name}</div>
                                {companions}
                            </div>
                        );
                    });
                    results.push(
                        <div key={party.id} className='group-panel clickable' onClick={() => this.props.openParty(party.id)}>
                            <div className='section'>{party.name}</div>
                            {pcs}
                        </div>
                    );
                });

                this.props.library.filter(group => Sherlock.matchGroup(this.state.text, group)).forEach(group => {
                    const monsters: JSX.Element[] = [];
                    group.monsters.filter(monster => Sherlock.matchMonster(this.state.text, monster)).forEach(monster => {
                        const traits: JSX.Element[] = [];
                        monster.traits.filter(trait => Sherlock.matchTrait(this.state.text, trait)).forEach(trait => {
                            traits.push(
                                <div key={trait.id} className='group-panel'>
                                    <div className='section'>{trait.name}</div>
                                </div>
                            );
                        });
                        monsters.push(
                            <div key={monster.id} className='group-panel'>
                                <div className='section'>{monster.name}</div>
                                {traits}
                            </div>
                        );
                    });
                    results.push(
                        <div key={group.id} className='group-panel clickable' onClick={() => this.props.openGroup(group.id)}>
                            <div className='section'>{group.name}</div>
                            {monsters}
                        </div>
                    );
                });

                if (results.length === 0) {
                    results.push(
                        <Note key='empty'>
                            no results
                        </Note>
                    );
                }
            } else {
                results.push(
                    <Note key='empty'>
                        search
                    </Note>
                );
            }

            return (
                <div className='scrollable'>
                    <div className='heading'>search</div>
                    <Input.Search
                        placeholder='search'
                        onChange={e => this.setSearchTerm(e.target.value)}
                        onSearch={value => this.setSearchTerm(value)}
                    />
                    <div className='divider' />
                    {results}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
