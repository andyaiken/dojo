class MonsterGroupCard extends React.Component {
    render() {
        try {
            var heading = null;
            var content = null;

            if (this.props.selection) {
                heading = (
                    <div className="heading">
                        monster group
                    </div>
                );

                content = (
                    <div>
                        <div className="section">
                            <input type="text" placeholder="group name" value={this.props.selection.name} disabled={this.props.filter} onChange={event => this.props.changeValue("name", event.target.value)} />
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <button className={this.props.filter ? "disabled" : ""} onClick={() => this.props.addMonster("new monster")}>add a new monster</button>
                            <button className={this.props.filter ? "disabled" : ""} onClick={() => this.props.sortMonsters()}>sort monsters</button>
                            <ConfirmButton text="delete group" callback={() => this.props.removeMonsterGroup()} />
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