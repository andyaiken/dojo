import React from 'react';
import cog from '../../resources/images/settings.svg';

export default class Titlebar extends React.Component {
    render() {
        try {
            return (
                <div className={this.props.blur ? "titlebar blur" : "titlebar"}>
                    <div className="app-name" onClick={() => this.props.openHome()}>dojo</div>
                    {this.props.actions}
                    <img className="settings-icon" src={cog} title="about" alt="about" onClick={() => this.props.openAbout()} />
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}