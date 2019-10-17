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
            if (this.props.content.filter(item => !!item).length === 0) {
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
                    <div className='heading'>
                        <div className='title'>{this.props.heading}</div>
                        {toggle}
                    </div>
                );
            }

            let content = null;
            if (this.state.showContent) {
                const items = this.props.content.map(item => (
                    <div key={this.props.content.indexOf(item)}>
                        {item}
                    </div>
                ));

                content = (
                    <div className={'grid columns-' + this.props.columns}>
                        {items}
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
