import { Col, Row } from 'antd';
import React from 'react';

import Readaloud from '../panels/readaloud';

interface Props {
}

export default class HomeScreen extends React.Component<Props> {
    public render() {
        // try {
            return (
                <Row align='middle' justify='center' className='scrollable'>
                    <Col span={16}>
                        <Readaloud>
                            <div className='heading'>welcome to <span className='app-name'>dojo</span></div>
                            <div className='divider' />
                            <div className='section'>
                                <span className='app-name'>dojo</span> is an app for dms of dungeons and dragons fifth edition
                            </div>
                            <div className='section'>
                                with this app you can:
                            </div>
                            <ul>
                                <li>build unique, challenging monsters</li>
                                <li>create encounters of just the right difficulty for your players</li>
                                <li>design intricate tactical maps - or have the app generate them for you</li>
                                <li>run combat without the book-keeping</li>
                            </ul>
                            <div className='divider' />
                            <div className='section'>
                                use the buttons at the bottom of the screen to explore the app's main features,
                                or press the buttons at the top right for additional tools
                                like a die roller and some useful random generators
                            </div>
                        </Readaloud>
                    </Col>
                </Row>
            );
        // } catch (ex) {
        //     console.error(ex);
        //     return <div className='render-error'/>;
        // }
    }
}
