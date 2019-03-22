import React from 'react';

import arrow from "../../resources/images/down-arrow-black.svg";

interface Props {
    text: string;
    content: string | JSX.Element;
    disabled: boolean;
}

interface State {
    expanded: boolean;
}

export default class Expander extends React.Component<Props, State> {
    public static defaultProps = {
        disabled: false
    };

    constructor(props: Props) {
        super(props);

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

            return (
                <div className={style}>
                    <div className="expander-header" onClick={() => this.toggle()}>
                        <div className="expander-text">{this.props.text}</div>
                        <img className="expander-button" src={arrow} alt="arrow" />
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