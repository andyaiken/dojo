import React from 'react';

import { DMModule } from '../../models/dm-module';

export default class SkillsModule implements DMModule {
    public id: string = 'skills';
    public name: string = 'skills';
    public desc: string = 'xxx';

    public getContent(): JSX.Element {
        return (
            <div>
                SKILLS
            </div>
        );
    }
}
