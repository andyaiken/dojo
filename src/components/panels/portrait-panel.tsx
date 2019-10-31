import React from 'react';

import { Monster } from '../../models/monster-group';
import { PC } from '../../models/party';

import clear from '../../resources/icons/x.svg';
import none from '../../resources/images/no-portrait.png';

interface Props {
    source: PC | Monster;
    inline: boolean;
    grabber: boolean;
    edit: () => void;
    clear: () => void;
}

export default class PortraitPanel extends React.Component<Props> {
    public static defaultProps = {
        inline: false,
        grabber: false,
        edit: null,
        clear: null
    };

    private getEditor() {
        let clearBtn = null;
        if (this.props.source.portrait) {
            clearBtn = (
                <img className='clear' src={clear} onClick={() => this.props.clear()} alt='clear' />
            );
        }

        let src = none;
        const data = localStorage.getItem('image-' + this.props.source.portrait);
        if (data) {
            const image = JSON.parse(data);
            src = image.data;
        }

        return (
            <div className='portrait editing'>
                <div className='section centered'>
                    <img src={src} alt='portrait' onClick={() => this.props.edit()} />
                    {clearBtn}
                </div>
            </div>
        );
    }

    private getDisplay() {
        if (!this.props.source.portrait) {
            return null;
        }

        const data = localStorage.getItem('image-' + this.props.source.portrait);
        if (!data) {
            return null;
        }

        const image = JSON.parse(data);
        if (!image.data) {
            return null;
        }

        let style = 'portrait';
        if (this.props.inline) {
            style += ' inline';
        } else {
            style += ' section centered';
        }
        if (this.props.grabber) {
            style += ' grabber';
        }

        return (
            <div className={style} data-movable-handle={this.props.grabber}>
                <img src={image.data} alt='portrait' />
            </div>
        );
    }

    public render() {
        try {
            return this.props.edit ? this.getEditor() : this.getDisplay();
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
