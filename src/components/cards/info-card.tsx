import React from 'react';

interface Props {
    heading: string | JSX.Element | JSX.Element[] | null;
    content: string | JSX.Element | JSX.Element[] | null;
}

export default class InfoCard extends React.Component<Props> {
    public static defaultProps = {
        heading: null,
        content: null
    };

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
            return <div className='render-error'/>;
        }
    }
}
