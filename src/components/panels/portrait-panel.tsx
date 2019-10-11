import React from 'react';

import { Monster } from '../../models/monster-group';
import { PC } from '../../models/party';

import none from '../../resources/images/no-portrait.png';

interface Props {
    source: PC | Monster;
    setValue: (value: string) => void;
}

export default class PortraitPanel extends React.Component<Props> {
    public static defaultProps = {
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
        let clear = null;
        if (this.props.source.portrait) {
            clear = (
                <button onClick={() => this.props.setValue('')}>clear image</button>
            );
        }

        return (
            <div className='portrait editing'>
                <div className='section centered'>
                    <img src={this.props.source.portrait ? this.props.source.portrait : none} alt='portrait' />
                </div>
                <button onClick={() => (document.getElementById('file-upload') as HTMLInputElement).click()}>select image</button>
                <input
                    type='file'
                    id='file-upload'
                    accept='image/*'
                    style={{ display: 'none' }}
                    onChange={e => this.onFileSelected(e)}
                />
                {clear}
            </div>
        );
    }

    private getDisplay() {
        if (!this.props.source.portrait) {
            return null;
        }

        return (
            <div className='portrait'>
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