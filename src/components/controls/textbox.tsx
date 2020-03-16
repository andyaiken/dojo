import { Input } from 'antd';
import React from 'react';

interface Props {
    text: string;
    placeholder: string;
    minLines: number;
    maxLines: number;
    disabled: boolean;
    onChange: (value: string) => void;
}

export default class Textbox extends React.Component<Props> {
    public static defaultProps = {
        placeholder: '',
        minLines: 1,
        maxLines: 1,
        disabled: false
    };

    public render() {
        try {
            let style = 'textbox';
            if (this.props.disabled) {
                style += ' disabled';
            }

            if (this.props.maxLines > 1) {
                return (
                    <Input.TextArea
                        className={style}
                        value={this.props.text}
                        placeholder={this.props.placeholder}
                        autoSize={{ minRows: this.props.minLines, maxRows: this.props.maxLines }}
                        onChange={event => this.props.onChange(event.target.value)}
                    />
                );
            }

            return (
                <Input
                    className={style}
                    value={this.props.text}
                    placeholder={this.props.placeholder}
                    allowClear={true}
                    onChange={event => this.props.onChange(event.target.value)}
                />
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
