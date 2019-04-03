import React from 'react';

import checked from '../../resources/images/checked.svg';
import unchecked from '../../resources/images/unchecked.svg';

interface Props {
    label: string;
    checked: boolean;
    changeValue: (value: boolean) => void;
    disabled: boolean;
}

export default class Checkbox extends React.Component<Props> {
    public static defaultProps = {
        disabled: false
    };

    private click(e: React.MouseEvent) {
        e.stopPropagation();
        this.props.changeValue(!this.props.checked);
    }

    public render() {
        try {
            let style = 'checkbox';
            if (this.props.checked) {
                style += ' checked';
            }
            if (this.props.disabled) {
                style += ' disabled';
            }

            return (
                <div className={style} onClick={this.click}>
                    <img className='image' src={this.props.checked ? checked : unchecked} alt='check' />
                    <div className='checkbox-label'>{this.props.label}</div>
                </div>
            );

        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}
