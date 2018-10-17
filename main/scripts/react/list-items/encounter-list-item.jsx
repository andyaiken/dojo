class EncounterListItem extends React.Component {
    render() {
        try {
            var encounterName = this.props.encounter.name;
            if (!encounterName) {
                encounterName = "unnamed encounter";
            }

            var slots = [];
            for (var n = 0; n !== this.props.encounter.slots.length; ++n) {
                var slot = this.props.encounter.slots[n];
                var text = slot.monsterName;
                if (!text) {
                    text = "unnamed monster";
                }
                if (slot.count > 1) {
                    text += " x" + slot.count;
                }
                slots.push(<div key={slot.id} className="text">{text}</div>);
            }
            if (slots.length === 0) {
                slots.push(<div key="empty" className="text">no monsters</div>);
            }

            var style = this.props.selected ? "list-item selected" : "list-item";

            return (
                <div className="group">
                    <div className={style} onClick={() => this.props.setSelection(this.props.encounter)}>
                        <div className="heading">{encounterName}</div>
                        {slots}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}