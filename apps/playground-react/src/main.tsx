import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { startEmbedBridge } from '@swipi/playground-core'
import Playground from '.'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Playground />
  </StrictMode>
)

startEmbedBridge()
