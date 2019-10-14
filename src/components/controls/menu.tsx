import React from 'react';

import ellipsis from '../../resources/icons/ellipsis.svg';

interface Props {
    text: string;
    content: JSX.Element | JSX.Element[] | string;
    disabled: boolean;
}

interface State {
    open: boolean;
}

export default class Menu extends React.Component<Props, State> {
    public static defaultProps = {
        disabled: false
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            open: false
        };
    }

    private toggleOpen(e: React.MouseEvent) {
        e.stopPropagation();
        this.setState({
            open: !this.state.open
        });
    }

    public render() {
        try {
            let style = this.props.disabled ? 'menu disabled' : 'menu';
            const content = [];

            content.push(
                <div key='selection' className='menu-top'>
                    <div className='menu-text'>{this.props.text}</div>
                    <img className='arrow' src={ellipsis} alt='arrow' />
                </div>
            );

            if (this.state.open) {
                style += ' open';

                content.push(
                    <div key='options' className='menu-content'>
                        {this.props.content}
                    </div>
                );
            }

            return (
                <div className={style} onClick={e => this.toggleOpen(e)}>
                    {content}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
