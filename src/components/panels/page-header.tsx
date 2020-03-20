import { BookOutlined, InfoCircleOutlined, SearchOutlined, ToolOutlined } from '@ant-design/icons';
import React from 'react';

interface Props {
    sidebar: string | null;
    setSidebar: (type: string | null) => void;
    openDrawer: (type: string) => void;
}

export default class PageHeader extends React.Component<Props> {
    public render() {
        try {
            return (
                <div className='page-header'>
                    <div className='app-title app-name'>dojo</div>
                    <div className='drawer-icons'>
                        <SearchOutlined
                            className={this.props.sidebar === 'search' ? 'title-bar-icon selected' : 'title-bar-icon'}
                            onClick={() => this.props.setSidebar(this.props.sidebar === 'search' ? null : 'search')}
                            title='search'
                        />
                        <ToolOutlined
                            className={this.props.sidebar === 'tools' ? 'title-bar-icon selected' : 'title-bar-icon'}
                            onClick={() => this.props.setSidebar(this.props.sidebar === 'tools' ? null : 'tools')}
                            title='dm tools'
                        />
                        <BookOutlined
                            className={this.props.sidebar === 'reference' ? 'title-bar-icon selected' : 'title-bar-icon'}
                            onClick={() => this.props.setSidebar(this.props.sidebar === 'reference' ? null : 'reference')}
                            title='reference'
                        />
                        <div className='vertical-divider' />
                        <InfoCircleOutlined
                            className='title-bar-icon'
                            onClick={() => this.props.openDrawer('about')}
                            title='about'
                        />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
