import React from 'react';

import warning from "../../resources/images/warning.svg";

interface Props {
    text: string;
    details: string;
    disabled: boolean;
    callback: () => void;
}

interface State {
    pressed: boolean;
}

export default class ConfirmButton extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
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
                        <div className="title">{this.props.text} - are you sure?</div>
                        <img className="image" src={warning} alt="warning" />
                        {this.props.details ? <div className="details">{this.props.details}</div> : null}
                        <div className="confirmation">
                            <div className="destructive" onClick={() => this.perform()}>yes</div>
                            <div className="non-destructive" onClick={() => this.toggle()}>no</div>
                        </div>
                    </div>
                );
            } else {
                content = (
                    <div>
                        <div className="title">{this.props.text}</div>
                        <img className="image" src={warning} alt="warning" />
                    </div>
                );
            }

            return (
                <button className={this.props.disabled ? "disabled" : ""} onClick={() => this.toggle()}>
                    {content}
                </button>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}