class MapCard extends React.Component {
    render() {
        try {
            var heading = null;
            var content = null;

            if (this.props.selection) {
                heading = (
                    <div className="heading">
                        <div className="title">map</div>
                    </div>
                );

                content = (
                    <div>
                        <div className="section">
                            <input type="text" placeholder="map name" value={this.props.selection.name} onChange={event => this.props.changeValue("name", event.target.value)} />
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <button onClick={() => this.props.editMap()}>edit map</button>
                            <ConfirmButton text="delete map" callback={() => this.props.removeMap()} />
                        </div>
                    </div>
                )
            }

            return (
                <InfoCard getHeading={() => heading} getContent={() => content} />
            );
        } catch (e) {
            console.error(e);
        }
    };
}