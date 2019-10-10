import React from 'react';

import ConfirmButton from '../../controls/confirm-button';

// tslint:disable-next-line:no-empty-interface
interface Props {
    resetAll: () => void;
}

export default class OptionsModule extends React.Component<Props> {
    public render() {
        return (
            <div>
                <div className='section'>this will reset the entire app and cannot be undone</div>
                <div className='section'>use it at your own risk</div>
                <ConfirmButton text='clear all data' callback={() => this.props.resetAll()} />
            </div>
        );
    }
}
