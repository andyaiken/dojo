import React from 'react';

interface Props {
    content: string | JSX.Element | JSX.Element[];
}

export default class Note extends React.Component<Props> {
    public render() {
        try {
            return (
                <div className='descriptive'>
                    {this.props.content}
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
