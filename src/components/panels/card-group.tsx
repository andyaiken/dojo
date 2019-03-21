import React from 'react';

import arrow from "../../resources/images/down-arrow-black.svg";
import close from "../../resources/images/close-black.svg";

interface Props {
    hidden: boolean;
    heading: string | null;
    content: any[] | null;
    showClose: boolean;
    showToggle: boolean;
    close: () => void;
}

interface State {
    showCards: boolean;
}

export default class CardGroup extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

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
                var closeBtn = null;
                if (this.props.showClose) {
                    closeBtn = (
                        <img className="image" src={close} alt="close" onClick={() => this.props.close()} />
                    );
                }

                var toggle = null;
                if (this.props.showToggle) {
                    var style = this.state.showCards ? "image rotate" : "image";
                    toggle = (
                        <img className={style} src={arrow} alt="arrow" onClick={() => this.toggleCards()} />
                    );
                }

                heading = (
                    <div className="heading">
                        <div className="title">{this.props.heading}</div>
                        {toggle}
                        {closeBtn}
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
                    <div className="row small-up-1 medium-up-2 large-up-4 collapse">
                        {cards}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}