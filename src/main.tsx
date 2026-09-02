import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './app/app';
import { ErrorBoundary } from './app/error-boundary';
import './styles/theme.css';

// SW registration is handled by <UpdateToast/> via useRegisterSW.

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>,
);
