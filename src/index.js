import React from 'react';
import ReactDOM from 'react-dom';

import './style/app.scss';

import App from './components/app';
import { Comms } from './utils/comms';

Comms.init();
ReactDOM.render(<App />, document.getElementById('root'));
