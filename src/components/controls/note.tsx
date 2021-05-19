import React from 'react';

import { RenderError } from '../error';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
}

export class Note extends React.Component<Props> {
	public render() {
		try {
			if (!this.props.children) {
				return null;
			}

			return (
				<div className='note'>
					<div className='top-left-roundel' />
					<div className='top-right-roundel' />
					<div className='bottom-left-roundel' />
					<div className='bottom-right-roundel' />
					{this.props.children}
				</div>
			);
		} catch (e) {
			console.error(e);
			return <RenderError context='Note' error={e} />;
		}
	}
}
