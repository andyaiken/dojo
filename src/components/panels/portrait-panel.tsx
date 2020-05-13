import { CloseCircleOutlined } from '@ant-design/icons';
import React from 'react';

import { Monster } from '../../models/monster-group';
import { PC } from '../../models/party';

import noPortrait from '../../resources/images/no-portrait.png';

interface Props {
    source: PC | Monster;
    inline: boolean;
    edit: () => void;
    clear: () => void;
}

export default class PortraitPanel extends React.Component<Props> {
    public static defaultProps = {
        inline: false,
        edit: null,
        clear: null
    };

    private getEditor() {
        let clearBtn = null;
        if (this.props.source.portrait) {
            clearBtn = (
                <CloseCircleOutlined onClick={() => this.props.clear()} />
            );
        }

        let src = noPortrait;
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

        return (
            <div className={style}>
                <img src={image.data} alt='portrait' />
            </div>
        );
    }

    public render() {
        try {
            return (this.props.edit !== null) ? this.getEditor() : this.getDisplay();
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
