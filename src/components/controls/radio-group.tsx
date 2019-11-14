import React from 'react';

interface Props {
    items: { id: string; text: string; details?: JSX.Element | string; disabled?: boolean }[];
    selectedItemID: string | null;
    select: (itemID: string) => void;
}

export default class RadioGroup extends React.Component<Props> {
    public static defaultProps = {
        // No default property values
    };

    public render() {
        try {
            const content = this.props.items.map(item => {
                return (
                    <RadioGroupItem
                        key={item.id}
                        item={item}
                        selected={this.props.selectedItemID === item.id}
                        select={(itemID: string) => this.props.select(itemID)}
                    />
                );
            });

            return (
                <div className='radio-group'>
                    {content}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

interface RadioGroupItemProps {
    item: { id: string; text: string; details?: JSX.Element | string; disabled?: boolean };
    selected: boolean;
    select: (itemID: string) => void;
}

class RadioGroupItem extends React.Component<RadioGroupItemProps> {
    public render() {
        try {
            let style = 'radio-item';
            let details = null;

            if (this.props.selected) {
                style += ' selected';
                if (this.props.item.details) {
                    details = (
                        <div className='radio-item-details'>
                            {this.props.item.details}
                        </div>
                    );
                }
            }

            if (this.props.item.disabled) {
                style += ' disabled';
            }

            return (
                <div className={style} onClick={() => this.props.select(this.props.item.id)}>
                    <div className='radio-item-text'>{this.props.item.text}</div>
                    {details}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
