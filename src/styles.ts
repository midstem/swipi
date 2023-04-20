import styled from 'styled-components'

export const Wrapper = styled.div`
  width: min(90vw, 1000px);
  margin-top: 20px;

  svg {
    height: 30px;
    width: 30px;
    fill: black;
  }
`

export const Dot = styled.div`
  height: 20px;
  width: 20px;
  background-color: rgb(140, 140, 140);
  border-radius: 50%;
  cursor: pointer;
`

export const ActiveDot = styled.div`
  height: 13px;
  width: 13px;
  background-color: rgba(255, 145, 1, 1);
  border-radius: 50%;
  cursor: pointer;
`
