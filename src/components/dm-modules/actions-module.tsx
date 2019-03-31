import React from 'react';

import { DMModule } from '../../models/dm-module';

export default class ActionsModule implements DMModule {
    public id: string = 'actions';
    public name: string = 'actions';
    public desc: string = 'NOT YET IMPLEMENTED';

    public init() {
        //
    }

    public getContent(): JSX.Element {
        return (
            <div>
                ACTIONS
            </div>
        );
    }
}
