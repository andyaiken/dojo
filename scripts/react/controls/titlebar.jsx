class Titlebar extends React.Component {
    render() {
        try {
            var actionSection = null;
            if (this.props.action) {
                actionSection = (
                    <div className="action">
                        {this.props.action}
                    </div>
                );
            };

            return (
                <div className={this.props.blur ? "titlebar blur" : "titlebar"}>
                    <div className="app-name" onClick={() => this.props.openHome()}>dojo</div>
                    {actionSection}
                    <img className="settings-icon" src="content/settings.svg" title="about" onClick={() => this.props.openAbout()} />
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}