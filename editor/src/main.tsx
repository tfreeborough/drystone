import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

import '@xyflow/react/dist/style.css';

import '@shared/styles/reset.scss';
import '@shared/styles/root.scss';

import './index.scss';
import { ModalProvider } from '@shared/components';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ModalProvider>
      <App />
    </ModalProvider>
  </React.StrictMode>,
);
