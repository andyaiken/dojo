import React from 'react';

import { MonsterGroup } from '../../models/monster-group';

interface Props {
    library: MonsterGroup[];
    addOpenGameContent: () => void;
}

export default class HomeScreen extends React.Component<Props> {
    render() {
        try {
            var monsters = null;
            if (this.props.library.length === 0) {
                monsters = (
                    <div>
                        <div className="divider"></div>
                        <div className="text">
                            <div>since your collection of monsters is empty, you might want to start by pressing the button below to add monsters from the <a href="http://dnd.wizards.com/articles/features/systems-reference-document-srd" target="_blank" rel="noopener noreferrer">system reference document</a></div>
                        </div>
                        <div className="text">
                            <button onClick={() => this.props.addOpenGameContent()}>add monsters</button>
                        </div>
                    </div>
                );
            }

            return (
                <div className="home scrollable">
                <div className="vertical-center-outer">
                    <div className="vertical-center-middle">
                        <div className="vertical-center-inner">
                            <div className="welcome-panel">
                                <div className="heading">welcome to <b>dojo</b></div>
                                <div className="text">
                                    <div><b>dojo</b> is an app for dms of dungeons and dragons fifth edition</div>
                                </div>
                                <div className="text">
                                    <div>
                                        with <b>dojo</b> you can:
                                        <ul>
                                            <li>build unique, challenging monsters</li>
                                            <li>create encounters of just the right difficulty for your players</li>
                                            <li>design intricate tactical maps</li>
                                            <li>run combat without the book-keeping</li>
                                        </ul>
                                    </div>
                                </div>
                                {monsters}
                                <div className="divider"></div>
                                <div className="text">
                                    <div>use the buttons at the bottom of the screen to access the app's features</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}