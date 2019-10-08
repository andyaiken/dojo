import React from 'react';

import clear from '../../resources/images/close-black.svg';
import ellipsis from '../../resources/images/ellipsis.svg';

interface Props {
    options: { id: string; text: string; disabled?: boolean }[];
    select: (optionID: string) => void;
    clear: () => void;
    selectedID: string;
    placeholder: string;
    disabled: boolean;
}

interface State {
    open: boolean;
}

export default class Dropdown extends React.Component<Props, State> {
    public static defaultProps = {
        selectedID: null,
        placeholder: 'select...',
        disabled: false,
        clear: null
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            open: false
        };
    }

    private toggleOpen(e: React.MouseEvent) {
        e.stopPropagation();
        this.setState({
            open: !this.state.open
        });
    }

    private select(optionID: string) {
        this.setState({
            open: false
        });
        this.props.select(optionID);
    }

    private clear(e: React.MouseEvent) {
        e.stopPropagation();
        this.props.clear();
    }

    public render() {
        try {
            if (this.props.options.length === 0) {
                return null;
            }

            let style = this.props.disabled ? 'dropdown disabled' : 'dropdown';
            const content = [];

            let option: { id: string; text: string; disabled?: boolean } | undefined = undefined;
            if (this.props.selectedID) {
                option = this.props.options.find(o => o.id === this.props.selectedID);
            }

            content.push(
                <div key='selection' className='dropdown-top' title={option ? option.text : this.props.placeholder}>
                    <div className='item-text'>{option ? option.text : this.props.placeholder}</div>
                    <img
                        className={option && this.props.clear ? 'clear' : 'arrow'}
                        alt={option && this.props.clear ? 'clear' : 'arrow'}
                        src={option && this.props.clear ? clear : ellipsis}
                        onClick={e => option && this.props.clear ? this.clear(e) : null}
                    />
                </div>
            );

            if (this.state.open) {
                style += ' open';

                const items = this.props.options.map(option => {
                    if (option.text === null) {
                        return <div key={option.id} className='divider' />;
                    } else {
                        return (
                            <DropdownOption
                                key={option.id}
                                option={option}
                                selected={option.id === this.props.selectedID}
                                select={optionID => this.select(optionID)}
                            />
                        );
                    }
                });

                content.push(
                    <div key='options' className='dropdown-options'>
                        {items}
                    </div>
                );
            }

            return (
                <div className={style} onClick={e => this.toggleOpen(e)}>
                    {content}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}

interface DropdownOptionProps {
    option: { id: string; text: string; disabled?: boolean };
    selected: boolean;
    select: (optionID: string) => void;
}

class DropdownOption extends React.Component<DropdownOptionProps> {
    private click(e: React.MouseEvent) {
        e.stopPropagation();
        if (!this.props.option.disabled) {
            this.props.select(this.props.option.id);
        }
    }

    public render() {
        try {
            let style = 'dropdown-option';
            if (this.props.selected) {
                style += ' selected';
            }
            if (this.props.option.disabled) {
                style += ' disabled';
            }

            return (
                <div className={style} title={this.props.option.text} onClick={e => this.click(e)}>
                    {this.props.option.text}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return null;
        }
    }
}
