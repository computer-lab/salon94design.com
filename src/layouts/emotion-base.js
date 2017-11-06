import { css } from 'emotion'
import styled from 'emotion/react'

export const breakpoint1 = `max-width: 1108px`
export const breakpoint2 = `max-width: 796px`
export const breakpoint3 = `max-width: 448px`
export const isMobileWidth = () =>
  typeof window === 'undefined' ? false : window.innerWidth <= 448

export const monoFontFamily = `Inconsolata, Menlo, monospace`
export const sansFontFamily = `Gill Sans, Work Sans, Helvetica, Arial, sans-serif`

export const baseUl = css`
  margin: 0;
  padding: 0;
  list-style: none;
`

export const monofont = css`
  font-family: ${monoFontFamily};
`

export const sansfont = css`
  font-family: ${sansFontFamily};
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
      background: linear-gradient(to right, #ff0, #ff6);
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

export const Header1 = styled.h1`
  composes: ${sansfont};
  margin: 0 0 28px 0;
  font-weight: 600;
  font-size: 48px;

  & .subheader {
    margin-top: 6px;
    font-weight: 400;
    font-size: 32px;
  }

  @media (${breakpoint1}) {
    font-size: 44px;
  }

  @media (${breakpoint2}) {
    font-size: 36px;
  }

  @media (${breakpoint3}) {
    font-size: 28px;
  }
`

export const Header2 = styled.h2`
  composes: ${sansfont};
  margin: 0 0 16px 0;
  padding: 0;
  font-weight: 500;
  font-size: 24px;
`

export const SimpleLinkList = styled.ul`
  composes: ${baseUl}, ${sansfont};
  font-size: 20px;
  font-weight: 300;
  display: flex;
  flex-wrap: wrap;
`

export const SimpleLinkListItem = styled.li`
  composes: ${childLink};
  margin: 0 24px 12px 0;
  padding: 0;

  &:last-child {
    margin-bottom: 0;
  }
`
