import React from 'react';

import arrow from '../../resources/icons/down-arrow-black.svg';
import close from '../../resources/icons/x.svg';

interface Props {
    content: any[];
    heading: string;
    hidden: boolean;
    showToggle: boolean;
    close: () => void;
}

interface State {
    showCards: boolean;
}

export default class CardGroup extends React.Component<Props, State> {
    public static defaultProps = {
        heading: null,
        hidden: false,
        showToggle: false,
        close: null
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            showCards: true
        };
    }

    private toggleCards() {
        this.setState({
            showCards: !this.state.showCards
        });
    }

    public render() {
        try {
            if (this.props.hidden) {
                return null;
            }

            let heading = null;
            if (this.props.heading) {
                let closeBtn = null;
                if (this.props.close) {
                    closeBtn = (
                        <img className='image' src={close} alt='close' onClick={() => this.props.close()} />
                    );
                }

                let toggle = null;
                if (this.props.showToggle) {
                    const style = this.state.showCards ? 'image rotate' : 'image';
                    toggle = (
                        <img className={style} src={arrow} alt='arrow' onClick={() => this.toggleCards()} />
                    );
                }

                heading = (
                    <div className='heading'>
                        <div className='title'>{this.props.heading}</div>
                        {toggle}
                        {closeBtn}
                    </div>
                );
            }

            let cards = [];
            if ((this.props.content.length > 0) && this.state.showCards) {
                cards = this.props.content;
            }

            return (
                <div className='card-group'>
                    {heading}
                    <div className='row small-up-1 medium-up-2 large-up-3 collapse'>
                        {cards}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
