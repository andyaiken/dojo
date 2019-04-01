import React from 'react';
import Showdown from 'showdown';

import { DMModule } from '../../models/dm-module';

const showdown = new Showdown.Converter();

export default class ActionsModule implements DMModule {
    public id: string = 'actions';
    public name: string = 'actions';
    public desc: string = 'list of the available action types and examples';

    private static source: string | null = null;

    public init() {
        const fetchSource = async () => {
            const response = await fetch('/data/actions.md');
            ActionsModule.source = await response.text();
        }
        if (!ActionsModule.source) {
            fetchSource();
        }
    }

    public getContent(): JSX.Element {
        return (
            <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(ActionsModule.source || '') }} />
        );
    }
}
