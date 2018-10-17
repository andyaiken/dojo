class HomeScreen extends React.Component {
    render() {
        try {
            return (
                <div className="home scrollable">
                    <InfoCard centered={true} welcome={true} getContent={() =>
                        <div>
                            <div className="section">welcome to <b>dm dojo</b></div>
                            <div className="divider"></div>
                            <div className="section">
                                <div>dm dojo is an encounter manager for dungeons and dragons fifth edition</div>
                            </div>
                            <div className="section">
                                <div>
                                    with dm dojo you can:
                                    <ul>
                                        <li>build unique, challenging monsters</li>
                                        <li>create encounters of just the right difficulty for your players</li>
                                        <li>run combat without the book-keeping</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    } />
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    };
}