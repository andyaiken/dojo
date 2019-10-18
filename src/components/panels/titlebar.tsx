import React from 'react';

import { Icon } from 'antd';

interface Props {
    blur: boolean;
    openMenu: () => void;
    openDrawer: (type: string) => void;
}

export default class Titlebar extends React.Component<Props> {
    public render() {
        try {
            return (
                <div className={this.props.blur ? 'titlebar blur' : 'titlebar'}>
                    <Icon type='menu' className='menu-icon' onClick={() => this.props.openMenu()} title='menu' />
                    <div className='app-title'>dojo</div>
                    <div className='drawer-icons'>
                        <Icon type='search' className='title-bar-icon' onClick={() => this.props.openDrawer('search')} title='search' />
                        <Icon type='setting' className='title-bar-icon' onClick={() => this.props.openDrawer('tools')} title='dm tools' />
                        <Icon type='info-circle' className='title-bar-icon' onClick={() => this.props.openDrawer('about')} title='about' />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
