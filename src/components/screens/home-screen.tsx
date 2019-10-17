import React from 'react';

import { MonsterGroup } from '../../models/monster-group';

import Readaloud from '../panels/readaloud';

interface Props {
    library: MonsterGroup[];
    addOpenGameContent: () => void;
}

export default class HomeScreen extends React.Component<Props> {
    public render() {
        try {
            let monsters = null;
            if (this.props.library.length === 0) {
                monsters = (
                    <div>
                        <div className='divider' />
                        <div className='section'>
                            since your collection of monsters is empty, you might want to start by pressing the button below to add monsters from the&nbsp;
                            <a href='http://dnd.wizards.com/articles/features/systems-reference-document-srd' target='_blank' rel='noopener noreferrer'>
                                system reference document
                            </a>
                        </div>
                        <div className='section'>
                            <button onClick={() => this.props.addOpenGameContent()}>add monsters</button>
                        </div>
                    </div>
                );
            }

            return (
                <div className='scrollable'>
                    <div className='vertical-center-outer'>
                        <div className='vertical-center-middle'>
                            <div className='vertical-center-inner'>
                                <Readaloud>
                                    <div className='heading'>welcome to <b>dojo</b></div>
                                    <div className='divider' />
                                    <div className='section'>
                                        <b>dojo</b> is an app for dms of dungeons and dragons fifth edition
                                    </div>
                                    <div className='section'>
                                        with <b>dojo</b> you can:
                                        <ul>
                                            <li>build unique, challenging monsters</li>
                                            <li>create encounters of just the right difficulty for your players</li>
                                            <li>design intricate tactical maps</li>
                                            <li>run combat without the book-keeping</li>
                                        </ul>
                                    </div>
                                    {monsters}
                                    <div className='divider' />
                                    <div className='section'>
                                        use the buttons at the bottom of the screen to explore the app's main features,
                                        or press the tools button at the top right for additional dm tools
                                    </div>
                                </Readaloud>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
