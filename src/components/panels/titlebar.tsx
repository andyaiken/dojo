import React from 'react';

import { Icon } from 'antd';

interface Props {
    breadcrumbs: {id: string, text: string}[];
    actions: JSX.Element | null;
    blur: boolean;
    breadcrumbClicked: (id: string) => void;
    openDrawer: (type: string) => void;
}

export default class Titlebar extends React.Component<Props> {
    public render() {
        try {
            const breadcrumbs = this.props.breadcrumbs.map(bc => {
                if (bc === this.props.breadcrumbs[this.props.breadcrumbs.length - 1]) {
                    return <div key={bc.id} className='breadcrumb non-clickable'>{bc.text}</div>;
                } else {
                    return <div key={bc.id} className='breadcrumb' onClick={() => this.props.breadcrumbClicked(bc.id)}>{bc.text}</div>;
                }
            });
            return (
                <div className={this.props.blur ? 'titlebar blur' : 'titlebar'}>
                    {breadcrumbs}
                    {this.props.actions}
                    <div className='drawer-icons'>
                        <Icon type='search' className='drawer-icon' onClick={() => this.props.openDrawer('search')} title='search' />
                        <Icon type='setting' className='drawer-icon' onClick={() => this.props.openDrawer('tools')} title='dm tools' />
                        <Icon type='info-circle' className='drawer-icon' onClick={() => this.props.openDrawer('about')} title='about' />
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
