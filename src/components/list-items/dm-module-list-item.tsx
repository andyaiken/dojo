import React from 'react';

import { DMModule } from '../../models/dm-module';

interface Props {
    module: DMModule;
    selected: boolean;
    setSelection: (module: DMModule) => void;
}

export default class DMModuleListItem extends React.Component<Props> {
    public render() {
        try {
            return (
                <div className={this.props.selected ? 'list-item selected' : 'list-item'} onClick={() => this.props.setSelection(this.props.module)}>
                    <div className='heading'>{this.props.module.name || 'unnamed module'}</div>
                    <div className='text'>{this.props.module.desc || 'no information'}</div>
                </div>
            );
        } catch (e) {
            console.error(e);
        }
    }
}
