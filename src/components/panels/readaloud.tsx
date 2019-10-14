import React from 'react';

export default class Readaloud extends React.Component {
    public render() {
        try {
            return (
                <div className='readaloud'>
                    {this.props.children}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
