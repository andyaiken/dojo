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
                    <div className="app-name">dm dojo</div>
                    {actionSection}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}