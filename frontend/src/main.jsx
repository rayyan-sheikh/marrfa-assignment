import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import '@mantine/core/styles.css';
import {MantineProvider } from '@mantine/core';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <MantineProvider>
        <ThemeProvider>
          <App />
        </ThemeProvider>
      </MantineProvider>
    </BrowserRouter>
  </StrictMode>,
)
