import React from 'react';

export default class EncounterListItem extends React.Component {
    render() {
        try {
            var encounterName = this.props.encounter.name;
            if (!encounterName) {
                encounterName = "unnamed encounter";
            }

            var slots = [];
            this.props.encounter.slots.forEach(slot => {
                var text = slot.monsterName || "unnamed monster";
                if (slot.count > 1) {
                    text += " x" + slot.count;
                }
                slots.push(<div key={slot.id} className="text">{text}</div>);
            });
            if (slots.length === 0) {
                slots.push(<div key="empty" className="text">no monsters</div>);
            }
            this.props.encounter.waves.forEach(wave => {
                slots.push(<div key={"name " + wave.id} className="text subheading">{wave.name || "unnamed wave"}</div>);
                wave.slots.forEach(slot => {
                    var text = slot.monsterName || "unnamed monster";
                    if (slot.count > 1) {
                        text += " x" + slot.count;
                    }
                    slots.push(<div key={slot.id} className="text">{text}</div>);
                });
                if (slots.length === 0) {
                    slots.push(<div key={"empty " + wave.id} className="text">no monsters</div>);
                }
            });

            return (
                <div className={this.props.selected ? "list-item selected" : "list-item"} onClick={() => this.props.setSelection(this.props.encounter)}>
                    <div className="heading">{encounterName}</div>
                    {slots}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}