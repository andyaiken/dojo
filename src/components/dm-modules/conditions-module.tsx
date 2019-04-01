import React from 'react';
import Showdown from 'showdown';

import { DMModule } from '../../models/dm-module';

const showdown = new Showdown.Converter();
showdown.setOption('tables', true);

export default class ConditionsModule implements DMModule {
    public id: string = 'conditions';
    public name: string = 'conditions';
    public desc: string = 'information about conditions and their effects';

    private static source: string | null = null;

    public init() {
        const fetchSource = async () => {
            const response = await fetch('/data/conditions.md');
            ConditionsModule.source = await response.text();
        }
        if (!ConditionsModule.source) {
            fetchSource();
        }
    }

    public getContent(): JSX.Element {
        return (
            <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(ConditionsModule.source || '') }} />
        );
    }
}
