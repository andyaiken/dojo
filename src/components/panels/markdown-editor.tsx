import { BoldOutlined, CodeOutlined, ItalicOutlined, LinkOutlined, OrderedListOutlined, ToTopOutlined, UnorderedListOutlined } from '@ant-design/icons';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactMde from 'react-mde';

import { RenderError } from '../error';

interface Props {
	text: string;
	onChange: (text: string) => void;
}

interface State {
	detailsTab: 'write' | 'preview';
}

export class MarkdownEditor extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			detailsTab: 'write'
		};
	}

	private getIcon(icon: string) {
		switch (icon) {
			case 'bold':
				return <BoldOutlined />;
			case 'italic':
				return <ItalicOutlined />;
			case 'link':
				return <LinkOutlined />;
			case 'quote':
				return <ToTopOutlined rotate={90} />;
			case 'code':
				return <CodeOutlined />;
			case 'unordered-list':
				return <UnorderedListOutlined />;
			case 'ordered-list':
				return <OrderedListOutlined />;
		}

		return null;
	}

	public render() {
		try {
			return (
				<ReactMde
					value={this.props.text}
					onChange={text => this.props.onChange(text)}
					selectedTab={this.state.detailsTab}
					onTabChange={tab => this.setState({ detailsTab: tab })}
					toolbarCommands={[['bold', 'italic'], ['link', 'quote', 'code'], ['unordered-list', 'ordered-list']]}
					getIcon={icon => this.getIcon(icon)}
					generateMarkdownPreview={markdown =>
						Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>)
					}
				/>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='MarkdownEditor' error={e} />;
		}
	}
}
