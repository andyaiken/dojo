import React from 'react';

import pkg from '../../../../package.json';

// tslint:disable-next-line:no-empty-interface
interface Props {
    //
}

export default class AboutModule extends React.Component<Props> {
    public render() {
        /* tslint:disable:max-line-length */
        return (
            <div>
                <div className='section'>designed by <a href='mailto:andy.aiken@live.co.uk'>andy aiken</a></div>
                <div className='section'>version <b>{pkg.version}</b></div>
                <div className='section'>if you would like to raise a bug or request a new feature, you can do so <a href='https://github.com/andyaiken/dojo' target='_blank' rel='noopener noreferrer'>here</a></div>
            </div>
        );
        /* tslint:enable:max-line-length */
    }
}
