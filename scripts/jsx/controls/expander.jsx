/*
<Expander
    text="TEXT"
    content={<div>ANY CONTENT</div>}
    disabled={BOOLEAN}
/>
*/

class Expander extends React.Component {
    constructor() {
        super();

        this.state = {
            expanded: false
        }
    }

    toggle() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    render() {
        try {
            var style = this.props.disabled ? "expander disabled" : "expander";
            if (this.state.expanded) {
                style += " expanded";
            }

            var content = null;
            if (this.state.expanded) {
                content = (
                    <div className="expander-content">
                        {this.props.content}
                    </div>
                );
            }

            var text = text;

            return (
                <div className={style}>
                    <div className="expander-header" onClick={() => this.toggle()}>
                        <div className="expander-text">{this.props.text}</div>
                        <img className="expander-button" src="resources/images/down-arrow.svg" />
                    </div>
                    {content}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}