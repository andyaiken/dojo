class MapListItem extends React.Component {
    render() {
        try {
            return (
                <div className={this.props.selected ? "list-item selected" : "list-item"} onClick={() => this.props.setSelection(this.props.map)}>
                    <div className="heading">{this.props.map.name || "unnamed map"}</div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}