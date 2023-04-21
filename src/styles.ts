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
export const FormsWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 30px;
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  gap: 25px;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`

export const FormName = styled.h2`
  margin: 0;
  text-align: center;
`

export const BooleanProperty = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;

  div {
    display: flex;
    gap: 15px;
  }

  p {
    margin: 0;
  }
`

export const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 5px;
`

export const Property = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`

export const NumberInput = styled.input.attrs(() => ({ type: 'number' }))`
  width: 65px;
  padding: 5px 10px;
  background-color: rgb(247, 247, 247);
  text-align: center;
  border: none;
  border: 1px solid rgb(234, 234, 234);
  border-radius: 8px;
  -moz-appearance: textfield;
  appearance: none;
  outline: none;

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    margin: 0;
    -webkit-appearance: none;
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
