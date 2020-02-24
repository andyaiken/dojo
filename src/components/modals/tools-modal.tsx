import React from 'react';

import { MonsterGroup } from '../../models/monster-group';

import Selector from '../controls/selector';
import BookTool from '../tools/book-tool';
import DieRollerTool from '../tools/die-roller-tool';
import LanguageTool from '../tools/language-tool';
import NameTool from '../tools/name-tool';
import NPCTool from '../tools/npc-tool';
import OracleTool from '../tools/oracle-tool';
import PlaceNameTool from '../tools/place-name-tool';
import PotionTool from '../tools/potion-tool';
import TreasureTool from '../tools/treasure-tool';

interface Props {
    library: MonsterGroup[];
}

interface State {
    view: string;
}

export default class ToolsModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            view: 'die'
        };
    }

    private setView(view: string) {
        this.setState({
            view: view
        });
    }

    public render() {
        try {
            const options = [
                {
                    id: 'die',
                    text: 'die roller'
                },
                {
                    id: 'language',
                    text: 'language generator'
                },
                {
                    id: 'name',
                    text: 'name generator'
                },
                {
                    id: 'book',
                    text: 'book title generator'
                },
                {
                    id: 'potion',
                    text: 'potion generator'
                },
                {
                    id: 'treasure',
                    text: 'treasure generator'
                },
                {
                    id: 'place',
                    text: 'place name generator'
                },
                {
                    id: 'npc',
                    text: 'npc generator'
                },
                {
                    id: 'oracle',
                    text: 'oracle'
                }
            ];

            let content = null;
            switch (this.state.view) {
                case 'die':
                    content = (
                        <DieRollerTool />
                    );
                    break;
                case 'language':
                    content = (
                        <LanguageTool />
                    );
                    break;
                case 'name':
                    content = (
                        <NameTool />
                    );
                    break;
                case 'book':
                    content = (
                        <BookTool />
                    );
                    break;
                case 'potion':
                    content = (
                        <PotionTool />
                    );
                    break;
                case 'treasure':
                    content = (
                        <TreasureTool />
                    );
                    break;
                case 'place':
                    content = (
                        <PlaceNameTool />
                    );
                    break;
                case 'npc':
                    content = (
                        <NPCTool />
                    );
                    break;
                case 'oracle':
                    content = (
                        <OracleTool />
                    );
                    break;
            }

            return (
                <div className='tools scrollable' style={{ padding: '10px' }}>
                    <Selector
                        options={options}
                        selectedID={this.state.view}
                        itemsPerRow={3}
                        select={optionID => this.setView(optionID)}
                    />
                    <div className='divider' />
                    {content}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
