import React from 'react';

import { DMModule } from '../../models/dm-module';

export default class ActionsModule implements DMModule {
    public id: string = 'actions';
    public name: string = 'actions';
    public desc: string = 'xxx';

    public getContent(): JSX.Element {
        return (
            <div>
                ACTIONS
            </div>
        );
    }
}
