import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

/**
 * Entry point — mounts the React tree into index.html's #root div.
 *
 * StrictMode runs extra checks in development (double-invoking effects, etc.).
 * Helpful while re-learning React; remove in production if it confuses debugging.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
