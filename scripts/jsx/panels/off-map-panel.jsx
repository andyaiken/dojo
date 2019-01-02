class OffMapPanel extends React.Component {
    dragOver(e) {
        e.preventDefault();
    }

    drop() {
        // We are removing the dragged token from the map
        var onMap = this.props.tokens.find(i => i.id === this.props.draggedTokenID) !== null;
        if (onMap) {
            this.props.draggedOffMap(this.props.draggedTokenID);
        }
    }

    render() {
        var pending = [];
        var active = [];
        var defeated = [];

        this.props.tokens.forEach(c => {
            var shelf = null;
            if (c.pending) {
                shelf = pending;
            }
            if (c.active) {
                shelf = active;
            }
            if (c.defeated) {
                shelf = defeated;
            }

            shelf.push(
                <OffMapCombatant
                    key={c.id}
                    combatant={c}
                    selected={c.id === this.props.selectedItemID}
                    setSelectedItemID={id => this.props.setSelectedItemID(id)}
                    setDraggedTokenID={id => this.props.setDraggedTokenID(id)}
                />
            );
        });

        // TODO: For some reason this code cancels dragging as soon as it starts
        var message = "you can drag these map tokens onto the map";
        /*
        if ((this.props.draggedTokenID) || (this.props.tokens.length === 0)) {
            message = "drag map tokens onto this box to remove them from the map";
        }
        */

        var style = "off-map-tokens";
        if (this.props.draggedTokenID) {
            style += " drop-target";
        }

        return (
            <div
                className={style}
                onDragOver={e => this.dragOver(e)}
                onDrop={() => this.drop()}
            >
                <div className="text">
                    {message}
                </div>
                <div className="shelf" style={{ display: pending.length > 0 ? "block" : "none" }}>
                    <div className="shelf-name">waiting for initiative to be entered</div>
                    {pending}
                </div>
                <div className="shelf" style={{ display: active.length > 0 ? "block" : "none" }}>
                    <div className="shelf-name">active combatants</div>
                    {active}
                </div>
                <div className="shelf" style={{ display: defeated.length > 0 ? "block" : "none" }}>
                    <div className="shelf-name">defeated</div>
                    {defeated}
                </div>
            </div>
        );
    }
}

class OffMapCombatant extends React.Component {
    constructor(props) {
        super();

        var size = miniSize(props.combatant.size);

        var token = createMapItem();
        token.id = props.combatant.id;
        token.type = props.combatant.type;
        token.width = size;
        token.height = size;

        this.state = {
            token: token
        }
    }

    render() {
        return (
            <div className="off-map-token">
                <MapToken
                    token={this.state.token}
                    combatant={this.props.combatant}
                    selectable={true}
                    simple={true}
                    selected={this.state.selectedItemID ===  this.state.token.id}
                    select={id => this.props.setSelectedItemID(id)}
                    startDrag={id => this.props.setDraggedTokenID(id)}
                />
                <div className="name">{this.props.combatant.name}</div>
            </div>
        );
    }
}