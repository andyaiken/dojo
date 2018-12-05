class MapBuilderCard extends React.Component {
    render() {
        try {
            var action = null;
            if (this.props.maps.length === 0) {
                action = (
                    <div className="section">to start building a map, press the button below</div>
                );
            } else {
                action = (
                    <div className="section">select a map from the list to edit it</div>
                );
            }

            var content = (
                <div>
                    <div className="section">on this page you can set up tactical maps</div>
                    <div className="section">when you have created a map you can use it in encounters</div>
                    <div className="divider"></div>
                    {action}
                </div>
            );

            return (
                <InfoCard getContent={() => content} />
            );
        } catch (e) {
            console.error(e);
        }
    };
}