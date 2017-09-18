import styled from 'emotion/react'

import { breakpoint1, breakpoint2, breakpoint3 } from './emotion-base'

export const ContentContainer = styled.div`
  margin: 0 auto;
  padding: 108px 24px 100px 24px;
  box-sizing: border-box;

  @media (${breakpoint2}) {
    padding: 96px 24px 24px 24px;
  }
`

export const PageContainer = styled.div`
  display: flex;

  @media (${breakpoint1}) {
    flex-wrap: wrap;
  }
`

export const createPanes = (rightPaneWidth = '360px') => {
  const LeftPane = styled.div`
    width: calc(100% - ${rightPaneWidth});
    height: 100%;

    @media (${breakpoint1}) {
      width: 100%;
      height: auto;
    }
  `

  const RightPane = styled.div`
    width: ${rightPaneWidth};
    position: fixed;
    right: 24px;
    max-height: calc(100vh - 124px);
    overflow-y: auto;

    @media (${breakpoint1}) {
      position: static;
      width: 100%;
      right: auto;
      max-height: none;
      order: -1;

      &.selectable {
        margin-right: 24px;
      }
    }

    @media (${breakpoint3}) {
      &.selectable {
        margin-right: 0;
      }
    }
  `

  return { LeftPane, RightPane }
}
