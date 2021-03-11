import ReactDOM from 'react-dom';

import 'react-mde/lib/styles/css/react-mde.css';
import 'react-mde/lib/styles/css/react-mde-editor.css';
import 'react-mde/lib/styles/css/react-mde-toolbar.css';

import './style/app.scss';

import { App } from './components/app';

ReactDOM.render(<App />, document.getElementById('root'));
