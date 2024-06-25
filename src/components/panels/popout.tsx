import React from 'react';
import ReactDOM from 'react-dom';

import { RenderError } from '../error';

interface Props {
	title: string;
	children: JSX.Element | JSX.Element[] | string;
	onCloseWindow: () => void;
}

interface State {
	externalWindow: Window | null;
	containerElement: HTMLElement | null;
}

export class Popout extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			externalWindow: null,
			containerElement: null
		};
	}

	public componentDidMount() {
		const externalWindow = window.open('', '', 'width=800, height=500, left=200, top=200');

		let containerElement = null;
		if (externalWindow) {
			containerElement = externalWindow.document.createElement('div');
			containerElement.className = 'dojo popout';
			externalWindow.document.body.appendChild(containerElement);

			const stylesheets = Array.from(document.styleSheets);
			stylesheets.forEach(stylesheet => {
				const css = stylesheet as CSSStyleSheet;

				if (stylesheet.href) {
					const newStyleElement = document.createElement('link');
					newStyleElement.rel = 'stylesheet';
					newStyleElement.href = stylesheet.href;
					externalWindow.document.head.appendChild(newStyleElement);
				} else if (css && css.cssRules && css.cssRules.length > 0) {
					const newStyleElement = document.createElement('style');
					Array.from(css.cssRules).forEach(rule => {
						newStyleElement.appendChild(document.createTextNode(rule.cssText));
					});
					externalWindow.document.head.appendChild(newStyleElement);
				}
			});

			externalWindow.document.title = this.props.title;
			externalWindow.addEventListener('beforeunload', () => {
				this.props.onCloseWindow();
			});
		}

		this.setState({
			externalWindow: externalWindow,
			containerElement: containerElement
		});
	}

	public componentWillUnmount() {
		if (this.state.externalWindow) {
			this.state.externalWindow.close();
		}
	}

	public render() {
		try {
			if (!this.state.containerElement) {
				return null;
			}

			return ReactDOM.createPortal(this.props.children, this.state.containerElement);
		} catch (e) {
			console.error(e);
			return <RenderError context='Popout' error={e} />;
		}
	}
}
