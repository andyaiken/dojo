import { createRoot } from 'react-dom/client';

import 'react-mde/lib/styles/css/react-mde.css';
import 'react-mde/lib/styles/css/react-mde-editor.css';
import 'react-mde/lib/styles/css/react-mde-toolbar.css';

import './style/app.scss';

import { Main } from './components/main';

const container = document.getElementById('root');
createRoot(container).render(<Main />);
