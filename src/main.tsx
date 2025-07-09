import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Importamos los providers globales necesarios para toda la aplicación
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

// Creamos una única instancia del cliente de TanStack Query
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        {/* App es ahora el único hijo directo. No hay ThemeProvider aquí. */}
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
