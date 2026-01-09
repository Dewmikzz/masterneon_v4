import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
<<<<<<< HEAD
import './fonts.css'
import initEagerAboveFold from './utils/eagerAboveFold'

// Ensure visible assets load eagerly to avoid placeholder + deferred load-event intervention
initEagerAboveFold()
=======
>>>>>>> 4e2716b47bba5627e9fad37c38b846ac6511e62a

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
