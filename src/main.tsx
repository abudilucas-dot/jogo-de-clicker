import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/base.css'

const root = document.getElementById('root')

if (!root) {
  throw new Error('Não foi possível iniciar o Zoo Noturno.')
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
