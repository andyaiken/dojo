import React from 'react';

import { Col, Row } from 'antd';

import Readaloud from '../panels/readaloud';

// tslint:disable-next-line:no-empty-interface
interface Props {
    //
}

export default class HomeScreen extends React.Component<Props> {
    public render() {
        // try {
            return (
                <Row type='flex' justify='center' align='middle' className='scrollable'>
                    <Col xs={20} sm={18} md={16} lg={12} xl={10}>
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
                                or press the dm tools button at the top right for additional dm tools
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
