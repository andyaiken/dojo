class MapFolioListItem extends React.Component {
    render() {
        try {
            var maps = [];
            for (var n = 0; n !== this.props.mapFolio.maps.length; ++n) {
                var map = this.props.mapFolio.maps[n];
                var name = map.name || "unnamed map";
                maps.push(<div key={map.id} className="text">{name}</div>);
            }
            if (maps.length === 0) {
                maps.push(<div key="empty" className="text">no maps</div>);
            }

            return (
                <div className={this.props.selected ? "list-item selected" : "list-item"} onClick={() => this.props.setSelection(this.props.mapFolio)}>
                    <div className="heading">{this.props.mapFolio.name || "unnamed folio"}</div>
                    {maps}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}