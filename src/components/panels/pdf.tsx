import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

interface Props {
	src: string;
}

interface State {
	pageCount: number;
	page: number;
}

export default class PDF extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			pageCount: 1,
			page: 1
		};
	}

	private setPageCount(count: number) {
		this.setState({
			pageCount: count
		});
	}

	private nudgePage(delta: number) {
		let page = Math.max(1, this.state.page + delta);
		page = Math.min(this.state.pageCount, page);
		this.setState({
			page: page
		});
	}

	public render() {
		let controls = null;
		if (this.state.pageCount > 1) {
			controls = (
				<Row gutter={10}>
					<Col span={6}>
						<div className='section centered'>
							<LeftCircleOutlined style={{ fontSize: '16px' }} onClick={() => this.nudgePage(-1)} />
						</div>
					</Col>
					<Col span={12}>
						<div className='section centered'>
							{this.state.page} / {this.state.pageCount}
						</div>
					</Col>
					<Col span={6}>
						<div className='section centered'>
							<RightCircleOutlined style={{ fontSize: '16px' }} onClick={() => this.nudgePage(+1)} />
						</div>
					</Col>
				</Row>
			);
		}

		return (
			<div>
				<Document className='pdf-document' file={this.props.src} onLoadSuccess={({ numPages }) => this.setPageCount(numPages)}>
					<Page pageNumber={this.state.page} />
				</Document>
				{controls}
			</div>
		);
	}
}
