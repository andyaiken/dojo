import React from 'react';
import ReactMarkdown from 'react-markdown';

import { RenderError } from '../error';

interface Props {
	content: string;
}

export class MarkdownModal extends React.Component<Props> {
	public render() {
		try {
			const content = <ReactMarkdown source={this.props.content} />;

			return (
				<div className='scrollable padded'>
					{content}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MarkdownModal' error={e} />;
		}
	}
}
