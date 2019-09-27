import React from 'react';
import ReactDOM from 'react-dom';

export interface Props {
    title: string;
    closeWindow: () => void;
}

export default class WindowPortal extends React.Component<Props> {
    constructor(props: Props) {
        super(props);
        this.containerElement = null;
        this.externalWindow = null;
    }

    private containerElement: HTMLElement | null;
    private externalWindow: Window | null;

    public componentDidMount() {
        this.externalWindow = window.open('', '', 'width=600, height=400, left=200, top=200');
        if (this.externalWindow) {
            this.containerElement = this.externalWindow.document.createElement('div');
            this.externalWindow.document.body.appendChild(this.containerElement);

            this.externalWindow.document.title = this.props.title;

            const stylesheets = Array.from(document.styleSheets);
            stylesheets.forEach(stylesheet => {
                const newStyleElement = document.createElement('style');

                const css = stylesheet as CSSStyleSheet;
                Array.from(css.rules).forEach(rule => {
                    newStyleElement.appendChild(document.createTextNode(rule.cssText));
                });

                if (this.externalWindow) {
                    this.externalWindow.document.head.appendChild(newStyleElement);
                }
            });

            this.externalWindow.addEventListener('beforeunload', () => {
                this.props.closeWindow();
            });
        }
    }

    public componentWillUnmount() {
        if (this.externalWindow) {
            this.externalWindow.close();
        }
    }

    public render() {
        if (!this.containerElement) {
            return null;
        }

        return ReactDOM.createPortal(this.props.children, this.containerElement);
    }
}
