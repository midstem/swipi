import styled from 'styled-components'

export const ColorPane = styled.input.attrs(() => ({ type: 'color' }))`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  height: 40px;
  width: 40px;
  padding: 0;
  background-color: transparent;
  border: none;
  border-radius: 50%;
  cursor: pointer;

  &::-webkit-color-swatch {
    border: none;
    border-radius: 50%;
    padding: 0;
  }

  &::-webkit-color-swatch-wrapper {
    border: none;
    border-radius: 50%;
    padding: 0;
  }

  &::-moz-color-swatch {
    border: none;
    border-radius: 50%;
  }
`
