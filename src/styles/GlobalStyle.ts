import * as styled from 'styled-components'

const GlobalStyle = styled.createGlobalStyle`
  #root {
    display: flex;
    justify-content: center;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
      sans-serif;
  }

  label {
    cursor: pointer;
  }
`

export default GlobalStyle
