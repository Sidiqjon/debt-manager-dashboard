import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast';
import { CookiesProvider } from 'react-cookie'

createRoot(document.getElementById('root')!).render(
  <CookiesProvider>
    <BrowserRouter>
      <QueryClientProvider client={ new QueryClient() }>
        <App />
        <Toaster position="top-right" reverseOrder={false} />
      </QueryClientProvider>
    </BrowserRouter>
  </CookiesProvider>
)
