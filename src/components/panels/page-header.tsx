import React from 'react';

import { Icon } from 'antd';

interface Props {
    view: string;
    openDrawer: (type: string) => void;
}

export default class PageHeader extends React.Component<Props> {
    public render() {
        //try {
            return (
                <div className='page-header'>
                    <div className='app-title app-name'>dojo</div>
                    <div className='drawer-icons'>
                        <Icon type='search' className='title-bar-icon' onClick={() => this.props.openDrawer('search')} title='search' />
                        <Icon type='tool' className='title-bar-icon' onClick={() => this.props.openDrawer('tools')} title='dm tools' />
                        <Icon type='book' className='title-bar-icon' onClick={() => this.props.openDrawer('reference')} title='reference' />
                        <Icon type='info-circle' className='title-bar-icon' onClick={() => this.props.openDrawer('about')} title='about' />
                    </div>
                </div>
            );
        //} catch (e) {
        //    console.error(e);
        //    return <div className='render-error'/>;
        //}
    }
}
