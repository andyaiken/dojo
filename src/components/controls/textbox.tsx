import React from 'react';

import { Input } from 'antd';

interface Props {
    text: string;
    placeholder: string;
    lines: number;
    disabled: boolean;
    onChange: (value: string) => void;
}

export default class Textbox extends React.Component<Props> {
    public static defaultProps = {
        placeholder: '',
        lines: 1,
        disabled: false
    };

    private onChange(value: string) {
        // TODO: Debounce this
        this.props.onChange(value);
    }

    public render() {
        try {
            let style = 'textbox';
            if (this.props.disabled) {
                style += ' disabled';
            }

            if (this.props.lines > 1) {
                return (
                    <Input.TextArea
                        className={style}
                        value={this.props.text}
                        placeholder={this.props.placeholder}
                        autoSize={{ minRows: this.props.lines }}
                        onChange={event => this.onChange(event.target.value)}
                    />
                );
            }

            return (
                <Input
                    className={style}
                    value={this.props.text}
                    placeholder={this.props.placeholder}
                    allowClear={true}
                    onChange={event => this.onChange(event.target.value)}
                />
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
