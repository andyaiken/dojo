import React from 'react';

import ellipsis from '../../resources/icons/ellipsis.svg';

interface Props {
    loaded: boolean;
}

export default class LoadingWrapper extends React.Component<Props> {
    public render() {
        try {
            if (this.props.loaded) {
                return this.props.children;
            }

            return (
                <div className='loading-wrapper'>
                    <img className='rotate-forever' src={ellipsis} alt='loading' />
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}
