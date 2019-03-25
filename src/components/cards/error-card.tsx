import React from 'react';

interface Props {
    title: string;
    getContent: () => (string | JSX.Element);
}

export default class ErrorCard extends React.Component<Props> {
    public static defaultProps = {
        title: null
    };

    public render() {
        try {
            let heading = null;
            if (this.props.title) {
                heading = <div className='heading'><div className='title'>{this.props.title}</div></div>;
            }

            const content = this.props.getContent();

            return (
                <div className='card error'>
                    {heading}
                    <div className='card-content'>
                        {content}
                    </div>
                </div>
            );
        } catch (ex) {
            console.error(ex);
        }
    }
}
