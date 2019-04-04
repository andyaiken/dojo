import React from 'react';

interface Props {
    controls: JSX.Element[];
    disabled: boolean;
}

export default class ControlRow extends React.Component<Props> {
    public static defaultProps = {
        disabled: false
    };

    public render() {
        try {
            let style = 'control-row';
            if (this.props.disabled) {
                style += ' disabled';
            }
            switch (this.props.controls.length) {
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

            return (
                <div className={style}>
                    {this.props.controls}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}
