import React from 'react';

import arrow from '../../resources/icons/down-arrow-black.svg';

interface Props {
    content: (JSX.Element | null)[];
    columns: number;
    heading: string;
    showToggle: boolean;
}

interface State {
    showContent: boolean;
}

export default class GridPanel extends React.Component<Props, State> {
    public static defaultProps = {
        columns: 3,
        heading: null,
        showToggle: false
    };

    constructor(props: Props) {
        super(props);

        this.state = {
            showContent: true
        };
    }

    private toggleContentVisible() {
        this.setState({
            showContent: !this.state.showContent
        });
    }

    public render() {
        try {
            const items = this.props.content.filter(item => !!item);
            if (items.length === 0) {
                return null;
            }

            let heading = null;
            if (this.props.heading) {
                let toggle = null;
                if (this.props.showToggle) {
                    const style = this.state.showContent ? 'image rotate' : 'image';
                    toggle = (
                        <img className={style} src={arrow} alt='arrow' onClick={() => this.toggleContentVisible()} />
                    );
                }

                heading = (
                    <div className='heading fixed-top'>
                        <div className='title'>{this.props.heading}</div>
                        {toggle}
                    </div>
                );
            }

            let content = null;
            if (this.state.showContent) {
                content = (
                    <div className={'grid columns-' + this.props.columns}>
                        {items.map(item => (
                            <div key={items.indexOf(item)}>
                                {item}
                            </div>
                        ))}
                    </div>
                );
            }

            return (
                <div className='grid-panel'>
                    {heading}
                    {content}
                </div>
            );
        } catch (e) {
            console.error(e);
            return <div className='render-error'/>;
        }
    }
}
