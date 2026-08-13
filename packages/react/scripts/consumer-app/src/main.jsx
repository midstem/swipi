import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Carousel } from './Carousel'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Carousel />
  </StrictMode>
)
