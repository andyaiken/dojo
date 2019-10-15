import React from 'react';

import cog from '../../resources/icons/down-arrow-black.svg';

interface Props {
    breadcrumbs: {id: string, text: string}[];
    actions: JSX.Element | null;
    blur: boolean;
    breadcrumbClicked: (id: string) => void;
    openDrawer: () => void;
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
                    <img className='drawer-icon' src={cog} title='tools' alt='tools' onClick={() => this.props.openDrawer()} />
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
