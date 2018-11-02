class HomeScreen extends React.Component {
    render() {
        try {
            return (
                <div className="home scrollable">
                    <InfoCard welcome={true} getContent={() =>
                        <div>
                            <div className="section">welcome to <b>dojo</b></div>
                            <div className="divider"></div>
                            <div className="section">
                                <div>dojo is an app for dms of dungeons and dragons fifth edition</div>
                            </div>
                            <div className="section">
                                <div>
                                    with dojo you can:
                                    <ul>
                                        <li>build unique, challenging monsters</li>
                                        <li>create encounters of just the right difficulty for your players</li>
                                        <li>run combat without the book-keeping</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="divider"></div>
                            <div className="section">
                                <div>use the buttons at the bottom of the screen to access the app's features</div>
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