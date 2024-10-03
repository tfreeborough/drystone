import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Initializer from './Initializer.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Initializer />
  </StrictMode>,
)
