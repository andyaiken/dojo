import { BookOutlined, InfoCircleOutlined, SearchOutlined, ToolOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
    view: string;
    openDrawer: (type: string) => void;
}

export default class PageHeader extends React.Component<Props> {
    public render() {
        // try {
            return (
                <div className='page-header'>
                    <div className='app-title app-name'>dojo</div>
                    <div className='drawer-icons'>
                        <SearchOutlined className='title-bar-icon' onClick={() => this.props.openDrawer('search')} title='search' />
                        <ToolOutlined className='title-bar-icon' onClick={() => this.props.openDrawer('tools')} title='dm tools' />
                        <BookOutlined className='title-bar-icon' onClick={() => this.props.openDrawer('reference')} title='reference' />
                        <InfoCircleOutlined className='title-bar-icon' onClick={() => this.props.openDrawer('about')} title='about' />
                    </div>
                </div>
            );
        // } catch (e) {
        //     console.error(e);
        //     return <div className='render-error'/>;
        // }
    }
}
