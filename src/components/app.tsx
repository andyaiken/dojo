import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';

import Main from './landing/main';
import Player from './landing/player';

export default class App extends React.Component {
	public render() {
		return (
			<HashRouter>
				<Switch>
					<Route path='/player'>
						<Player />
					</Route>
					<Route>
						<Main />
					</Route>
				</Switch>
			</HashRouter>
		);
	}
}
