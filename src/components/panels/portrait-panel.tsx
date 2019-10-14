import React from 'react';

import { Monster } from '../../models/monster-group';
import { PC } from '../../models/party';

import clear from '../../resources/icons/x.svg';
import none from '../../resources/images/no-portrait.png';

interface Props {
    source: PC | Monster;
    inline: boolean;
    setValue: (value: string) => void;
}

export default class PortraitPanel extends React.Component<Props> {
    public static defaultProps = {
        inline: false,
        setValue: null
    };

    private onFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            const reader = new FileReader();
            reader.onload = progress => {
                if (progress.target) {
                    const content = progress.target.result as string;
                    this.props.setValue(content);
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    }

    private getEditor() {
        let clearBtn = null;
        if (this.props.source.portrait) {
            clearBtn = (
                <img className='clear' src={clear} onClick={() => this.props.setValue('')} alt='clear' />
            );
        }

        return (
            <div className='portrait editing'>
                <div className='section centered'>
                    <img
                        src={this.props.source.portrait ? this.props.source.portrait : none}
                        onClick={() => (document.getElementById('file-upload') as HTMLInputElement).click()}
                        alt='portrait'
                    />
                    {clearBtn}
                </div>
                <input
                    type='file'
                    id='file-upload'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={e => this.onFileSelected(e)}
                />
            </div>
        );
    }

    private getDisplay() {
        if (!this.props.source.portrait) {
            return null;
        }

        if (this.props.inline) {
            return (
                <div className='portrait inline'>
                    <img src={this.props.source.portrait} alt='portrait' />
                </div>
            );
        }

        return (
            <div className={this.props.inline ? 'portrait inline' : 'portrait'}>
                <div className='section centered'>
                    <img src={this.props.source.portrait} alt='portrait' />
                </div>
            </div>
        );
    }

    public render() {
        try {
            return this.props.setValue ? this.getEditor() : this.getDisplay();
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
