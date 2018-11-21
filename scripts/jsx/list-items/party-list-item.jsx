class PartyListItem extends React.Component {
    render() {
        try {
            var partyName = this.props.party.name;
            if (!partyName) {
                partyName = "unnamed party";
            }

            var pcs = [];
            for (var n = 0; n !== this.props.party.pcs.length; ++n) {
                var pc = this.props.party.pcs[n];
                var name = pc.name;
                if (pc.player) {
                    name += " (" + pc.player + ")";
                }
                if (!name) {
                    name = "unnamed pc";
                }
                pcs.push(<div key={pc.id} className="text">{name}</div>);
            }
            if (pcs.length === 0) {
                pcs.push(<div key="empty" className="text">no pcs</div>);
            }

            return (
                <div className={this.props.selected ? "list-item selected" : "list-item"} onClick={() => this.props.setSelection(this.props.party)}>
                    <div className="heading">{partyName}</div>
                    {pcs}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}