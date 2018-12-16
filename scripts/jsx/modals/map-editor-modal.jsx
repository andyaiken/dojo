class MapEditorModal extends React.Component {
    render() {
        try {
            return (
                <div className="map-editor">
                    <MapPanel
                        map={this.props.map}
                        mode="edit"
                    />
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}