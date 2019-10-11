import React from 'react';

interface Props {
    content: string | JSX.Element | JSX.Element[];
}

export default class Readaloud extends React.Component<Props> {
    public render() {
        try {
            return (
                <div className='readaloud'>
                    {this.props.content}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
