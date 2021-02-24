import { DownCircleOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import React from 'react';

import { RenderError } from '../error';

interface Props {
	text: string | JSX.Element;
	disabled: boolean;
}

export class Expander extends React.Component<Props> {
	public static defaultProps = {
		disabled: false
	};

	public render() {
		try {
			let style = 'expander';
			if (this.props.disabled) {
				style += ' disabled';
			}

			return (
				<Collapse
					className={style}
					bordered={false}
					defaultActiveKey={[]}
					expandIcon={p => <DownCircleOutlined rotate={p.isActive ? -180 : 0} />}
					expandIconPosition={'right'}
				>
					<Collapse.Panel key='one' header={<div className='collapse-header-text'>{this.props.text}</div>}>
						{this.props.children}
					</Collapse.Panel>
				</Collapse>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='Expander' error={e} />;
		}
	}
}
