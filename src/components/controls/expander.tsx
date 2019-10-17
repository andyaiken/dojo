import React from 'react';

import arrow from '../../resources/icons/down-arrow-black.svg';

interface Props {
    text: string;
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
        };
    }

    private toggle() {
        this.setState({
            expanded: !this.state.expanded
        });
    }

    public render() {
        try {
            let style = this.props.disabled ? 'expander disabled' : 'expander';
            if (this.state.expanded) {
                style += ' expanded';
            }

            return (
                <div className={style}>
                    <div className='expander-header' onClick={() => this.toggle()}>
                        <div className='expander-text'>{this.props.text}</div>
                        <img className='expander-button' src={arrow} alt='arrow' />
                    </div>
                    {this.state.expanded ? <div className='expander-content'>{this.props.children}</div> : null}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
