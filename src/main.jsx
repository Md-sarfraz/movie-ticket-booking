import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { NotificationProvider } from './store/NotificationContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </Provider>
    </BrowserRouter>
  </StrictMode>,
)
