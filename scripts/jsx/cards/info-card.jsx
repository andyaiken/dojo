class InfoCard extends React.Component {
    render() {
        try {
            var style = "card";
            if (this.props.welcome) {
                style += " welcome";
            }

            var heading = null;
            if (this.props.getHeading) {
                heading = this.props.getHeading();
            }

            var content = null;
            if (this.props.getContent) {
                var content = this.props.getContent();
            }
            if (!content) {
                return null;
            }

            return (
                <div className={style}>
                    {heading}
                    <div className="card-content">
                        {content}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}