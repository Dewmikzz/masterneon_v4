import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import './fonts.css'
import initEagerAboveFold from './utils/eagerAboveFold'

// Ensure visible assets load eagerly to avoid placeholder + deferred load-event intervention
initEagerAboveFold()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
