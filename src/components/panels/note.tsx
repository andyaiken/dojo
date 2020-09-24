import React from 'react';

interface Props {
	white: boolean;
}

export class Note extends React.Component<Props> {
	public static defaultProps = {
		white: false
	};

	public render() {
		try {
			let style = 'note';
			if (this.props.white) {
				style += ' white';
			}

			return (
				<div className={style}>
					{this.props.children}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <div className='render-error'/>;
		}
	}
}
