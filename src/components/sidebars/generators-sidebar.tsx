import React from 'react';

import Selector from '../controls/selector';
import NPCGenerator from './generators/npc-generator';
import PlaceNameGenerator from './generators/place-name-generator';
import SimpleGenerator from './generators/simple-generator';

interface Props {
}

interface State {
    view: string;
}

export default class GeneratorsSidebar extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            view: 'name'
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
                    id: 'name',
                    text: 'names'
                },
                {
                    id: 'book',
                    text: 'book titles'
                },
                {
                    id: 'potion',
                    text: 'potions'
                },
                {
                    id: 'treasure',
                    text: 'treasures'
                },
                {
                    id: 'place',
                    text: 'place names'
                },
                {
                    id: 'npc',
                    text: 'npcs'
                }
            ];

            let content = null;
            switch (this.state.view) {
                case 'name':
                    content = (
                        <SimpleGenerator key='name' type='name' />
                    );
                    break;
                case 'book':
                    content = (
                        <SimpleGenerator key='book' type='book' />
                    );
                    break;
                case 'potion':
                    content = (
                        <SimpleGenerator key='potion' type='potion' />
                    );
                    break;
                case 'treasure':
                    content = (
                        <SimpleGenerator key='treasure' type='treasure' />
                    );
                    break;
                case 'place':
                    content = (
                        <PlaceNameGenerator />
                    );
                    break;
                case 'npc':
                    content = (
                        <NPCGenerator />
                    );
                    break;
            }

            return (
                <div className='sidebar-container'>
                    <div className='sidebar-header'>
                        <Selector
                            options={options}
                            selectedID={this.state.view}
                            itemsPerRow={3}
                            select={optionID => this.setView(optionID)}
                        />
                    </div>
                    <div className='sidebar-content'>
                        {content}
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
