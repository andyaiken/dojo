import ReactDOM from 'react-dom';

import 'react-mde/lib/styles/css/react-mde.css';
import 'react-mde/lib/styles/css/react-mde-editor.css';
import 'react-mde/lib/styles/css/react-mde-toolbar.css';

import './style/app.scss';

import { App } from './components/app';

// eslint-disable-next-line react/react-in-jsx-scope
ReactDOM.render(<App />, document.getElementById('root'));
