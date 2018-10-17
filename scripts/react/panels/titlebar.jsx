class Titlebar extends React.Component {
    render() {
        try {
            var partiesStyle = this.props.view === "parties" ? "navigator-item selected" : "navigator-item";
            var libraryStyle = this.props.view === "library" ? "navigator-item selected" : "navigator-item";
            var encounterStyle = this.props.view === "encounter" ? "navigator-item selected" : "navigator-item";
            var combatStyle = this.props.view === "combat" ? "navigator-item selected" : "navigator-item";
            var aboutStyle = this.props.view === "about" ? "navigator-item selected" : "navigator-item";

            var encountersEnabled = this.props.library.length !== 0;
            var combatEnabled = (this.props.parties.length !== 0) && (this.props.encounters.length !== 0);
            if (!encountersEnabled) {
                encounterStyle += " disabled";
            }
            if (!combatEnabled) {
                combatStyle += " disabled";
            }

            var actionSection = null;
            if (this.props.action) {
                actionSection = (
                    <div className="action">
                        {this.props.action}
                    </div>
                );
            };

            return (
                <div className={this.props.blur ? "titlebar blur" : "titlebar"}>
                    <div className={partiesStyle} onClick={() => this.props.setView("parties")}>player characters</div>
                    <div className={libraryStyle} onClick={() => this.props.setView("library")}>monster library</div>
                    <div className={encounterStyle} onClick={() => encountersEnabled ? this.props.setView("encounter") : null}>encounter builder</div>
                    <div className={combatStyle} onClick={() => combatEnabled ? this.props.setView("combat") : null}>combat manager</div>
                    <div className={aboutStyle} onClick={() => this.props.setView("about")}>about</div>
                    {actionSection}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}