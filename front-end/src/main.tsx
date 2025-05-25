import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import "@picocss/pico/css/pico.min.css";
import { App } from './App.tsx';

// Configuração inicial do CSRF Token
const initializeApp = async () => {
  try {
    // Primeiro obtém o cookie CSRF
    await fetch('http://localhost:8000/sanctum/csrf-cookie', {
      credentials: 'include',
      mode: 'cors'
    });
  } catch (error) {
    console.error('CSRF Token initialization failed:', error);
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
};

initializeApp();