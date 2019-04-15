import React from 'react';

interface Props {
    content: string | JSX.Element | JSX.Element[];
    white: boolean;
}

export default class Note extends React.Component<Props> {
    public static defaultProps = {
        white: false
    };

    public render() {
        try {
            let style = 'descriptive';
            if (this.props.white) {
                style += ' white';
            }

            return (
                <div className={style}>
                    {this.props.content}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
