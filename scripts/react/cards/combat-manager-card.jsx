class CombatManagerCard extends React.Component {
    render() {
        try {
            var content = (
                <div>
                    <div className="section">here you can run a combat encounter by specifying a party and an encounter</div>
                    <div className="divider"></div>
                    <div className="section">below you will see a list of encounters that you have paused</div>
                    <div className="section">you can resume a paused combat by selecting it</div>
                </div>
            );

            return (
                <InfoCard getContent={() => content} />
            );
        } catch (e) {
            console.error(e);
        }
    };
}