import React from 'react';

import arrow from '../../resources/icons/down-arrow-black.svg';

interface Props {
    content: (JSX.Element | null)[];
    heading: string;
    showToggle: boolean;
}

interface State {
    showCards: boolean;
}

export default class GridPanel extends React.Component<Props, State> {
    public static defaultProps = {
        heading: null,
        showToggle: false
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
            if (this.props.content.filter(item => !!item).length === 0) {
                return null;
            }

            let heading = null;
            if (this.props.heading) {
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
                    </div>
                );
            }

            return (
                <div className='card-group'>
                    {heading}
                    <div className='row small-up-1 medium-up-2 large-up-3 collapse'>
                        {(this.props.content.length > 0) && this.state.showCards ? this.props.content : null}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
