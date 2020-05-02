import React from 'react';
import { DebounceInput } from 'react-debounce-input';

interface Props {
    text: string;
    placeholder: string;
    multiLine: boolean;
    minLength: number;
    disabled: boolean;
    onChange: (value: string) => void;
}

export default class Textbox extends React.Component<Props> {
    public static defaultProps = {
        placeholder: '',
        multiLine: false,
        minLength: 0,
        disabled: false
    };

    public render() {
        try {
            let style = '';
            if (this.props.disabled) {
                style = 'disabled';
            }

            if (this.props.multiLine) {
                return (
                    <DebounceInput
                        element={'textarea'}
                        minLength={this.props.minLength}
                        debounceTimeout={500}
                        className={style}
                        value={this.props.text}
                        placeholder={this.props.placeholder}
                        rows={10}
                        onChange={event => this.props.onChange(event.target.value)}
                    />
                );
            }

            return (
                <DebounceInput
                    minLength={this.props.minLength}
                    debounceTimeout={500}
                    className={style}
                    value={this.props.text}
                    placeholder={this.props.placeholder}
                    onChange={event => this.props.onChange(event.target.value)}
                />
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
