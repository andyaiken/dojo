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
                    <div className="app-name">dojo</div>
                    {actionSection}
                    <img className="settings-icon" src="content/settings.svg" onClick={() => this.props.setView("about")} />
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}