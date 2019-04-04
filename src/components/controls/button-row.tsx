import React from 'react';

interface Props {
    buttons: {
        id: string;
        text: string;
        disabled: boolean;
        callback: () => void;
    }[];
    disabled: boolean;
}

export default class ButtonRow extends React.Component<Props> {
    public static defaultProps = {
        disabled: false
    };

    public render() {
        try {
            let style = 'button-row';
            if (this.props.disabled) {
                style += ' disabled';
            }
            switch (this.props.buttons.length) {
                case 1:
                    style += ' one';
                    break;
                case 2:
                    style += ' two';
                    break;
                case 3:
                    style += ' three';
                    break;
                case 4:
                    style += ' four';
                    break;
                case 5:
                    style += ' five';
                    break;
            }

            const buttons = this.props.buttons.map(button => {
                return (
                    <button key={button.id} className={button.disabled ? 'disabled' : ''} onClick={() => button.callback()}>
                        {button.text}
                    </button>
                );
            });

            return (
                <div className={style}>
                    {buttons}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}
