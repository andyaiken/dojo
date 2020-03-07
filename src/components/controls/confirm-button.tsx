import React from 'react';

interface Props {
    text: string;
    callback: () => void;
    disabled: boolean;
}

interface State {
    pressed: boolean;
}

export default class ConfirmButton extends React.Component<Props, State> {
    public static defaultProps = {
        disabled: false
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            pressed: false
        };
    }

    private toggle(e: React.MouseEvent) {
        e.stopPropagation();
        this.setState({
            pressed: !this.state.pressed
        });
    }

    private perform() {
        this.setState({
            pressed: false
        }, () => {
            this.props.callback();
        });
    }

    public render() {
        try {
            let content = null;
            if (this.state.pressed) {
                content = (
                    <div>
                        <div>note: this is irreversible</div>
                        <div className='confirm' onClick={() => this.perform()}>confirm</div>
                    </div>
                );
            }

            return (
                <button className={this.props.disabled ? 'danger disabled' : 'danger'} onClick={e => this.toggle(e)}>
                    <div>{this.props.text}</div>
                    {content}
                </button>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
