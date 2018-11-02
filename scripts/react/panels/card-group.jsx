class CardGroup extends React.Component {
    constructor() {
        super();

        this.state = {
            showCards: true
        }
    }

    toggleCards() {
        this.setState({
            showCards: !this.state.showCards
        });
    }

    render() {
        try {
            if (this.props.hidden) {
                return null;
            }

            var heading = null;
            if (this.props.heading) {
                var close = null;
                if (this.props.showClose) {
                    close = (
                        <img className="image" src="content/close-black.svg" onClick={() => this.props.close()} />
                    );
                }

                var toggle = null;
                if (this.props.showToggle) {
                    var style = this.state.showCards ? "image rotate" : "image";
                    toggle = (
                        <img className={style} src="content/down-arrow-black.svg" onClick={() => this.toggleCards()} />
                    );
                }

                heading = (
                    <div className="heading">
                        <div className="title">{this.props.heading}</div>
                        {toggle}
                        {close}
                    </div>
                );
            }

            var cards = [];
            if (this.props.content && this.state.showCards) {
                cards = this.props.content;
            }

            return (
                <div className="card-group">
                    {heading}
                    <div className="row small-up-2 medium-up-2 large-up-4 collapse">
                        {cards}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}