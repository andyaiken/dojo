import React from 'react';

interface Props {
    getHeading: () => (string | JSX.Element);
    getContent: () => (string | JSX.Element);
}

export default class InfoCard extends React.Component<Props> {
    public static defaultProps = {
        getHeading: null,
        getContent: null
    };

    public render() {
        try {
            var heading = null;
            if (this.props.getHeading) {
                heading = this.props.getHeading();
            }

            var content = null;
            if (this.props.getContent) {
                content = this.props.getContent();
            }
            if (!content) {
                return null;
            }

            return (
                <div className='card'>
                    {heading}
                    <div className='card-content'>
                        {content}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
