import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/app';
import './styles/theme.css';

// SW registration is handled by <UpdateToast/> via useRegisterSW.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
