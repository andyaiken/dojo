import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Main from './landing/main';
import Player from './landing/player';

export default class App extends React.Component {
	public render() {
		return (
			<BrowserRouter>
				<Switch>
					<Route path='/player'>
						<Player />
					</Route>
					<Route path='*'>
						<Main />
					</Route>
				</Switch>
			</BrowserRouter>
		);
	}
}
