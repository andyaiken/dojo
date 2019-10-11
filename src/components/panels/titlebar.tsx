import React from 'react';

import cog from '../../resources/icons/settings.svg';

interface Props {
    actions: JSX.Element | null;
    blur: boolean;
    openHome: () => void;
    openTools: () => void;
}

export default class Titlebar extends React.Component<Props> {
    public render() {
        try {
            return (
                <div className={this.props.blur ? 'titlebar blur' : 'titlebar'}>
                    <div className='app-name' onClick={() => this.props.openHome()}>dojo</div>
                    {this.props.actions}
                    <img className='tools-icon' src={cog} title='tools' alt='tools' onClick={() => this.props.openTools()} />
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
