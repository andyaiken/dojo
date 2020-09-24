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

export class GridPanel extends React.Component<Props, State> {
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
				let toggleIcon = null;
				if (this.props.showToggle) {
					toggleIcon = (
						<DownCircleOutlined
							className={this.state.showContent ? 'rotate' : ''}
							onClick={() => this.toggleContentVisible()}
						/>
					);
				}

				heading = (
					<div className='heading fixed-top'>
						<div className='title'>{this.props.heading}</div>
						{toggleIcon}
					</div>
				);
			}

			let content = null;
			if (this.state.showContent) {
				let span = 6;
				switch (this.props.columns) {
					case 1:
						// We specifically want one column
						span = 24;
						break;
					case 2:
						// We specifically want two columns
						span = 12;
						break;
					case 3:
						// We specifically want three columns
						span = 8;
						break;
				}

				content = (
					<Row align='top' gutter={10}>
						{items.map(item => (
							<Col key={items.indexOf(item)} span={span}>
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
