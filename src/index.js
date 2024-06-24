import ReactDOM from 'react-dom';

import 'react-mde/lib/styles/css/react-mde.css';
import 'react-mde/lib/styles/css/react-mde-editor.css';
import 'react-mde/lib/styles/css/react-mde-toolbar.css';

import './style/app.scss';

import { Main } from './components/main';

ReactDOM.render(<Main />, document.getElementById('root'));
