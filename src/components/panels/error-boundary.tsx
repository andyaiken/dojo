import React, { ErrorInfo } from 'react';

interface Props {
}

interface State {
	hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
	}

	protected static getDerivedStateFromError(error: any) {
		return {
			hasError: true
		};
	}

	public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error(error.name);
		console.error(error.message);
		console.error(error.stack);
		console.error(errorInfo.componentStack);
	}

	public render() {
		if (this.state.hasError) {
			return (
				<div className='render-error' />
			);
		}

		return this.props.children;
	}
}
