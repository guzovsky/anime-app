import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimeProvider } from './contexts/AnimeContext.jsx';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(

  <AnimeProvider>
    <StrictMode>
      <Router>
        <App />
      </Router>
    </StrictMode>
  </AnimeProvider>
);
