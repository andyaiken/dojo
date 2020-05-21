import React from 'react';

interface Props {
    label: string;
    display: 'switch' | 'button';
    checked: boolean;
    disabled: boolean;
    onChecked: (value: boolean) => void;
}

export default class Checkbox extends React.Component<Props> {
    public static defaultProps = {
        display: 'switch',
        disabled: false
    };

    private click(e: React.MouseEvent) {
        e.stopPropagation();
        this.props.onChecked(!this.props.checked);
    }

    public render() {
        try {
            let style = 'checkbox ' + this.props.display;
            if (this.props.checked) {
                style += ' checked';
            }
            if (this.props.disabled) {
                style += ' disabled';
            }

            let toggle = null;
            if (this.props.display === 'switch') {
                toggle = (
                    <div className='toggle-container'>
                        <div className='toggle'/>
                    </div>
                );
            }

            return (
                <div className={style} onClick={e => this.click(e)}>
                    <div className='checkbox-label'>{this.props.label}</div>
                    {toggle}
                </div>
            );

        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
