import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import PrivacyPolicy from './PrivacyPolicy';
import StartAdventure from './StartAdventure';
import ReadStory from './ReadStory';
import StorySelector from './StorySelector';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// Initialize Firebase Analytics säkert
import './firebase-config';

const router = createBrowserRouter([
  {
    path: '/',
    element: <StartAdventure />
  },
  {
    path: '/start',
    element: <StartAdventure />
  },
  {
    path: '/story-selector',
    element: <StorySelector />
  },
  {
    path: '/privacy-policy',
    element: <PrivacyPolicy />
  },
  {
    path: '/read/:id',
    element: <ReadStory />
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
); 