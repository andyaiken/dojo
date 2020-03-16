import { DownCircleOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';

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
        columns: 0,
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
                    const style = this.state.showContent ? 'rotate' : '';
                    toggle = (
                        <DownCircleOutlined className={style} onClick={() => this.toggleContentVisible()} />
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
                let span = { xs: 24, sm: 24, md: 12, lg: 8, xl: 6 };
                switch (this.props.columns) {
                    case 1:
                        // We specifically want one column
                        span = { xs: 24, sm: 24, md: 24, lg: 24, xl: 24 };
                        break;
                    case 2:
                        // We specifically want two columns
                        // Small or extra small displays will still use one column
                        span = { xs: 24, sm: 24, md: 12, lg: 12, xl: 12 };
                        break;
                    case 3:
                        // We specifically want three columns
                        // Small or extra small displays will still use one column
                        span = { xs: 24, sm: 24, md: 8, lg: 8, xl: 8 };
                        break;
                }

                content = (
                    <Row align='top'>
                        {items.map(item => (
                            <Col key={items.indexOf(item)} xs={span.xs} sm={span.sm} md={span.md} lg={span.lg} xl={span.xl}>
                                {item}
                            </Col>
                        ))}
                    </Row>
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
