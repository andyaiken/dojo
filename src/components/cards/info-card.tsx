import React from 'react';

interface Props {
    heading: string | JSX.Element | JSX.Element[];
    content: string | JSX.Element | JSX.Element[];
}

export default class InfoCard extends React.Component<Props> {
    public render() {
        try {
            return (
                <div className='card'>
                    {this.props.heading}
                    <div className='card-content'>
                        {this.props.content}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
