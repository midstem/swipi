import { StrictMode, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import Swipi, { SwipiRef, SwipiState } from '../index'

const slideColors = ['#f94144', '#f3722c', '#f9c74f', '#90be6d', '#577590']

const slideStyle = (color: string) => ({
  height: '250px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '48px',
  color: '#fff',
  backgroundColor: color
})

const Playground = () => {
  const swipiRef = useRef<SwipiRef>(null)
  const [state, setState] = useState<SwipiState>()

  return (
    <div
      style={{ maxWidth: 640, margin: '40px auto', fontFamily: 'sans-serif' }}
    >
      <h1>Swipi playground</h1>

      <Swipi
        ref={swipiRef}
        loop
        showDots
        slidesNumber={1}
        spaceBetweenSlides={15}
        onSelect={setState}
      >
        {slideColors.map((color, index) => (
          <div key={color} style={slideStyle(color)}>
            {index + 1}
          </div>
        ))}
      </Swipi>

      <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
        <button onClick={() => swipiRef.current?.scrollPrev()}>Prev</button>
        <button onClick={() => swipiRef.current?.scrollNext()}>Next</button>
        <button onClick={() => swipiRef.current?.scrollTo(0)}>First</button>
        <button
          onClick={() => swipiRef.current?.scrollTo(slideColors.length - 1)}
        >
          Last
        </button>
      </div>

      <pre style={{ marginTop: 20, background: '#f4f4f4', padding: 12 }}>
        {JSON.stringify(state, null, 2)}
      </pre>
    </div>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Playground />
  </StrictMode>
)
