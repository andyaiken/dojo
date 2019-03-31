import React from 'react';

import { DMModule } from '../../models/dm-module';

export default class ConditionsModule implements DMModule {
    public id: string = 'conditions';
    public name: string = 'conditions';
    public desc: string = 'NOT YET IMPLEMENTED';

    public init() {
        //
    }

    public getContent(): JSX.Element {
        return (
            <div>
                CONDITIONS
            </div>
        );
    }
}
