import React from 'react';

export default class ErrorCard extends React.Component {
    render() {
        try {
            var heading = null;
            if (this.props.title) {
                heading = <div className="heading"><div className="title">{this.props.title}</div></div>;
            }

            var content = this.props.getContent();

            return (
                <div className="card error">
                    {heading}
                    <div className="card-content">
                        {content}
                    </div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}