import ReactDOM from 'react-dom/client'
import App from './app'
import GlobalStyle from './styles/GlobalStyle'
import { Wrapper } from './styles'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

// const mediaSettings = [
//   { maxWidth: 2200, slidesNumber: 3, spaceBetween: 5 },
//   { maxWidth: 1400, slidesNumber: 2, spaceBetween: 4 },
//   { maxWidth: 900, slidesNumber: 1, spaceBetween: 2 }
// ]

root.render(
  <>
    <GlobalStyle />
    <Wrapper>
      <App />
    </Wrapper>
  </>
)
