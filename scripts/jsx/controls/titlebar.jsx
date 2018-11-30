class Titlebar extends React.Component {
    render() {
        try {
            return (
                <div className={this.props.blur ? "titlebar blur" : "titlebar"}>
                    <div className="app-name" onClick={() => this.props.openHome()}>dojo</div>
                    {this.props.actions}
                    <img className="settings-icon" src="resources/images/settings.svg" title="about" onClick={() => this.props.openAbout()} />
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}