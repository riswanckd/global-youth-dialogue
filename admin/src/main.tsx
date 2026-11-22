import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';

// Automatically redirect root / to /admin/ if loaded at root
if (typeof window !== 'undefined' && (window.location.pathname === '/' || window.location.pathname === '')) {
  window.location.replace('/admin/');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
