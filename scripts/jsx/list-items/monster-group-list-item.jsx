class MonsterGroupListItem extends React.Component {
    render() {
        try {
            var groupName = this.props.group.name;
            if (!groupName) {
                groupName = "unnamed group";
            }

            var matchGroup = match(this.props.filter, this.props.group.name);

            var monsters = [];
            for (var n = 0; n !== this.props.group.monsters.length; ++n) {
                var monster = this.props.group.monsters[n];
                var matchMonster = match(this.props.filter, monster.name);
                if (matchGroup || matchMonster) {
                    var name = monster.name;
                    if (!name) {
                        name = "unnamed monster";
                    }
                    monsters.push(<div key={monster.id} className="text">{name}</div>);
                }
            }
            if (monsters.length === 0) {
                monsters.push(<div key="empty" className="text">no monsters</div>);
            }

            return (
                <div className={this.props.selected ? "list-item selected" : "list-item"} onClick={() => this.props.setSelection(this.props.group)}>
                    <div className="heading">{groupName}</div>
                    {monsters}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}