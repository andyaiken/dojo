import React from 'react';

interface Props {
    options: { id: string; text: string; disabled?: boolean }[];
    selectedID: string | null;
    select: (optionID: string) => void;
    disabled: boolean;
}

export default class Tabs extends React.Component<Props> {
    public static defaultProps = {
        disabled: false,
    };

    public render() {
        try {
            const tabs = this.props.options.map(option => {
                return (
                    <Tab
                        key={option.id}
                        option={option}
                        selected={option.id === this.props.selectedID}
                        count={this.props.options.length}
                        select={(optionID: string) => this.props.select(optionID)}
                    />
                );
            });

            return (
                <div className={(this.props.disabled) ? 'tabs disabled' : 'tabs'}>
                    {tabs}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}

interface TabInterface {
    option: { id: string; text: string; disabled?: boolean };
    selected: boolean;
    count: number;
    select: (optionID: string) => void;
}

class Tab extends React.Component<TabInterface> {
    private click(e: React.MouseEvent) {
        e.stopPropagation();
        if (!this.props.option.disabled) {
            this.props.select(this.props.option.id);
        }
    }

    public render() {
        try {
            const width = 'calc(((100% - 1px) / ' + this.props.count + ') - 2px )';

            let style = 'tab';
            if (this.props.selected) {
                style += ' selected';
            }
            if (this.props.option.disabled) {
                style += ' disabled';
            }

            return (
                <div key={this.props.option.id} className={style} style={{ width: width }} title={this.props.option.text} onClick={e => this.click(e)}>
                    {this.props.option.text}
                </div>
            );
        } catch (ex) {
            console.error(ex);
            return <div className='render-error'/>;
        }
    }
}
