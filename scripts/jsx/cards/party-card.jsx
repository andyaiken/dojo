class PartyCard extends React.Component {
    render() {
        try {
            var heading = null;
            var content = null;

            if (this.props.selection) {
                var activePCs = this.props.pcs.filter(pc => pc.active);

                var languages = activePCs
                    .map(pc => pc.languages)
                    .join(", ")
                    .split(/[ ,;]+/)
                    .reduce((array, value) => {
                        if (array.indexOf(value) === -1) {
                            array.push(value);
                        }
                        return array;
                    }, [])
                    .sort((a, b) => {
                        if (a === "Common") {
                            return -1;
                        }
                        if (b === "Common") {
                            return 1;
                        }
                        return a.localeCompare(b);
                    })
                    .join(", ");

                var insightSummary = "-";
                var investigationSummary = "-";
                var perceptionSummary = "-";

                if (activePCs.length !== 0) {
                    var insight = { min: null, max: null };
                    var investigation = { min: null, max: null };
                    var perception = { min: null, max: null };

                    activePCs.forEach(pc => {
                        insight.min = insight.min === null ? pc.passiveInsight : Math.min(insight.min, pc.passiveInsight);
                        insight.max = insight.max === null ? pc.passiveInsight : Math.max(insight.max, pc.passiveInsight);
                        investigation.min = investigation.min === null ? pc.passiveInvestigation : Math.min(investigation.min, pc.passiveInvestigation);
                        investigation.max = investigation.max === null ? pc.passiveInvestigation : Math.max(investigation.max, pc.passiveInvestigation);
                        perception.min = perception.min === null ? pc.passivePerception : Math.min(perception.min, pc.passivePerception);
                        perception.max = perception.max === null ? pc.passivePerception : Math.max(perception.max, pc.passivePerception);
                    });

                    insightSummary = insight.min === insight.max ? insight.min : insight.min + " - " + insight.max;
                    investigationSummary = investigation.min === investigation.max ? investigation.min : investigation.min + " - " + investigation.max;
                    perceptionSummary = perception.min === perception.max ? perception.min : perception.min + " - " + perception.max;
                }

                heading = (
                    <div className="heading">
                        <div className="title">party</div>
                    </div>
                );

                content = (
                    <div>
                        <div className="section">
                            <input type="text" placeholder="party name" value={this.props.selection.name} onChange={event => this.props.changeValue("name", event.target.value)} />
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                            <div className="subheading">languages</div>
                        </div>
                        <div className="section">
                            {languages}
                        </div>
                        <div className="section">
                            <div className="subheading">passive skills</div>
                        </div>
                        <div className="table">
                            <div>
                                <div className="cell three"><b>insight</b></div>
                                <div className="cell three"><b>invest.</b></div>
                                <div className="cell three"><b>percep.</b></div>
                            </div>
                            <div>
                                <div className="cell three">{insightSummary}</div>
                                <div className="cell three">{investigationSummary}</div>
                                <div className="cell three">{perceptionSummary}</div>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="section">
                        <button onClick={() => this.props.addPC("new pc")}>add a new pc</button>
                            <button onClick={() => this.props.sortPCs()}>sort pcs</button>
                            <ConfirmButton text="delete party" callback={() => this.props.removeParty()} />
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