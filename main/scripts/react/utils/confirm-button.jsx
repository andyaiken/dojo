class ConfirmButton extends React.Component {
    constructor() {
        super();
        this.state = {
            pressed: false
        };
    }

    toggle() {
        this.setState({
            pressed: !this.state.pressed
        });
    }

    perform() {
        this.toggle();
        this.props.callback();
    }

    render() {
        try {
            var content = null;
            if (this.state.pressed) {
                content = (
                    <div>
                        {this.props.text} - are you sure?
                        <div className="group">
                            <div className="destructive" onClick={() => this.perform()}>yes</div>
                            <div className="non-destructive" onClick={() => this.toggle()}>no</div>
                        </div>
                    </div>
                );
            } else {
                content = (
                    <div className="confirm">
                        <div className="title">{this.props.text}</div>
                        <img className="image" src="content/warning.svg" />
                    </div>
                );
            }

            return (
                <button onClick={() => this.toggle()}>
                    {content}
                </button>
            );
        } catch (e) {
            console.error(e);
        }
    }
}