import ReactDOM from 'react-dom/client'
import App from './app'
import GlobalStyle from './styles/GlobalStyle'
import { Wrapper } from './styles'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(
  <>
    <GlobalStyle />
    <Wrapper>
      <App />
    </Wrapper>
  </>
)
