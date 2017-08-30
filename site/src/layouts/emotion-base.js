import { css } from 'emotion'

export const baseUl = css`
  margin: 0;
  padding: 0;
  list-style: none;
`

export const monofont = css`
  font-family: Inconsolata, Menlo, monospace;
`

export const sansfont = css`
  font-family: Work Sans, Helvetica, Arial, sans-serif;
`

export const childLink = css`
  & a {
    color: inherit;
    text-decoration: inherit;

    &:hover,
    &:focus {
      border-bottom: 2px solid #000;
    }
  }
`
