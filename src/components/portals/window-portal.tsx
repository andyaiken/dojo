import React from 'react';
import ReactDOM from 'react-dom';

interface Props {
    title: string;
    closeWindow: () => void;
}

interface State {
    externalWindow: Window | null;
    containerElement: HTMLElement | null;
}

export default class WindowPortal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            externalWindow: null,
            containerElement: null
        };
    }

    public componentDidMount() {
        const externalWindow = window.open('', '', 'width=600, height=400, left=200, top=200');

        let containerElement = null;
        if (externalWindow) {
            containerElement = externalWindow.document.createElement('div');
            containerElement.className = 'dojo';
            externalWindow.document.body.appendChild(containerElement);

            const stylesheets = Array.from(document.styleSheets);
            stylesheets.forEach(stylesheet => {
                const newStyleElement = document.createElement('style');

                const css = stylesheet as CSSStyleSheet;
                Array.from(css.rules).forEach(rule => {
                    newStyleElement.appendChild(document.createTextNode(rule.cssText));
                });

                externalWindow.document.head.appendChild(newStyleElement);
            });

            externalWindow.document.title = this.props.title;
            externalWindow.addEventListener('beforeunload', () => {
                this.props.closeWindow();
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
        if (!this.state.containerElement) {
            return null;
        }

        return ReactDOM.createPortal(this.props.children, this.state.containerElement);
    }
}
