import { css } from 'emotion'
import styled from 'emotion/react'

export const breakpoint1 = `max-width: 1108px`
export const breakpoint2 = `max-width: 796px`
export const breakpoint3 = `max-width: 448px`

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

export const selectorList = css`
  composes: ${baseUl};

  & li {
    &.active a {
      background: #ff0;
      text-decoration: underline;
    }

    & a {
      color: inherit;
      text-decoration: inherit;

      &:hover,
      &:focus {
        text-decoration: underline;
      }
    }
  }
`

export const Header2 = styled.h2`
  composes: ${sansfont};
  margin: 0 0 16px 0;
  padding: 0;
  font-weight: 500;
  font-size: 24px;
`
