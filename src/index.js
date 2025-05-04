import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import PrivacyPolicy from './PrivacyPolicy';
import StartAdventure from './StartAdventure';
import { createHashRouter, RouterProvider } from 'react-router-dom';

const router = createHashRouter([
  {
    path: '/',
    element: <App />
  },
  {
    path: '/start',
    element: <StartAdventure />
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
); 