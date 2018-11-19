class MonsterLibraryCard extends React.Component {
    render() {
        try {
            return (
                <InfoCard
                    getContent={() => (
                        <div>
                            <div className="section">you can maintain your menagerie of monsters here</div>
                            <div className="divider"></div>
                            <div className="section">select a monster group from the list to see stat blocks for monsters in that group</div>
                            <div className="section">to quickly find a monster, type its name into the filter box</div>
                        </div>
                    )}
                />
            );
        } catch (e) {
            console.error(e);
        }
    };
}