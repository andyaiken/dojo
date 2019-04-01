import React from 'react';
import Showdown from 'showdown';

import { DMModule } from '../../models/dm-module';

const showdown = new Showdown.Converter();

export default class SkillsModule implements DMModule {
    public id: string = 'skills';
    public name: string = 'skills';
    public desc: string = 'listing of all the skills in the game';

    private static source: string | null = null;

    public init() {
        const fetchSource = async () => {
            const response = await fetch('/data/skills.md');
            SkillsModule.source = await response.text();
        };
        if (!SkillsModule.source) {
            fetchSource();
        }
    }

    public getContent(): JSX.Element {
        return (
            <div dangerouslySetInnerHTML={{ __html: showdown.makeHtml(SkillsModule.source || '') }} />
        );
    }
}
