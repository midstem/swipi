import styled from 'styled-components'

export const Form = styled.form`
  margin-top: 40px;

  /* Removes arrows from number input */
  /* Chrome, Safari, Edge, Opera */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  input[type='number'] {
    appearance: none;
    -moz-appearance: textfield;
  }
`

export const Fieldset = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 20px;
  border: 1px solid black;
  border-radius: 20px;
`

export const Legend = styled.legend`
  font-size: 22px;
  text-align: center;
`

export const BooleanValue = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;

  div {
    display: flex;
    gap: 10px;
  }

  p {
    margin: 0;
  }
`

export const Field = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;

  & > div {
    display: flex;
    gap: 5px;
  }
`

export const TextInput = styled.input`
  border: none;
  border-bottom: 1px solid black;
  outline: none;
`
