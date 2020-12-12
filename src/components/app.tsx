import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import { Main } from './landing/main';
import { Player } from './landing/player';

export class App extends React.Component {
	public render() {
		return (
			<HashRouter>
				<Switch>
					<Route
						path='/player/:dmcode'
						render={({ match }) => <Player dmcode={match.params['dmcode']} />}
					/>
					<Route
						path='/player'
						render={() => <Player dmcode='' />}
					/>
					<Route
						render={() => <Main/>}
					/>
				</Switch>
			</HashRouter>
		);
	}
}
