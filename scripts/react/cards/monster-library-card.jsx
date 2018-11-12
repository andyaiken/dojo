class MonsterLibraryCard extends React.Component {
    render() {
        try {
            var action = null;
            if (this.props.library.length === 0) {
                action = (
                    <div>
                        <div className="section">
                            <div>since your collection is empty, you might want to start by pressing the button below to add monsters from the <a href="http://dnd.wizards.com/articles/features/systems-reference-document-srd" target="_blank">system reference document</a></div>
                        </div>
                        <div className="section">
                            <button onClick={() => this.props.addOpenGameContent()}>add monsters</button>
                        </div>
                    </div>
                );
            } else {
                action = (
                    <div>
                        <div className="section">select a monster group from the list to see stat blocks for monsters in that group</div>
                        <div className="section">to quickly find a monster, type its name into the filter box</div>
                    </div>
                );
            }

            var content = (
                <div>
                    <div className="section">you can maintain your menagerie of monsters here</div>
                    <div className="divider"></div>
                    {action}
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