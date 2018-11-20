class EncounterCard extends React.Component {
    constructor() {
        super();
        this.state = {
            showDetails: false,
            partyID: null
        };
    }

    toggleDetails() {
        this.setState({
            showDetails: !this.state.showDetails
        })
    }

    selectParty(partyID) {
        this.setState({
            partyID: partyID
        });
    }

    render() {
        try {
            var heading = null;
            var content = null;

            if (this.props.selection) {
                var partyOptions = [];
                if (this.props.parties) {
                    for (var n = 0; n !== this.props.parties.length; ++n) {
                        var party = this.props.parties[n];
                        partyOptions.push({
                            id: party.id,
                            text: party.name
                        });
                    }
                }

                var difficultySection = (
                    <div>
                        <Dropdown
                            options={partyOptions}
                            placeholder="select party..."
                            selectedID={this.state.partyID}
                            select={optionID => this.selectParty(optionID)}
                        />
                        <DifficultyChartPanel
                            partyID={this.state.partyID}
                            encounterID={this.props.selection.id}
                            parties={this.props.parties}
                            encounters={this.props.encounters}
                            getMonster={(monsterName, monsterGroupName) => this.props.getMonster(monsterName, monsterGroupName)}
                        />
                    </div>
                );

                var imageStyle = this.state.showDetails ? "image rotate" : "image";

                heading = (
                    <div className="heading">
                        <div className="title">encounter</div>
                        <img className={imageStyle} src="resources/images/down-arrow.svg" onClick={() => this.toggleDetails()} />
                    </div>
                );

                content = (
                    <div>
                        <div className="section">
                            <input type="text" placeholder="encounter name" value={this.props.selection.name} onChange={event => this.props.changeValue("name", event.target.value)} />
                        </div>
                        <div style={{ display: this.state.showDetails ? "" : "none" }}>
                            <div className="divider"></div>
                            {difficultySection}
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <button onClick={() => this.props.addWave()}>add a new wave</button>
                            <ConfirmButton text="delete encounter" callback={() => this.props.removeEncounter()} />
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