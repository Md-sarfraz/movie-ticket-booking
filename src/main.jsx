import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { ToastContainer } from 'react-toast'

createRoot(document.getElementById('root')).render(
  <StrictMode> 
    <BrowserRouter>
    <App />
    </BrowserRouter>
  </StrictMode>,
)
