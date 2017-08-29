import styled from 'emotion/react'

export const ContentContainer = styled.div`
  margin: 0 auto;
  padding: 108px 24px 100px 24px;
  box-sizing: border-box;
`

export const PageContainer = styled.div`display: flex;`

export const createPanes = (rightPaneWidth = '360px') => {
  const LeftPane = styled.div`
    width: calc(100% - ${rightPaneWidth});
    height: 100%;
  `

  const RightPane = styled.div`
    width: ${rightPaneWidth};
    position: fixed;
    right: 24px;
  `

  return { LeftPane, RightPane }
}

export const FlexBetweenContainer = styled.div`
  display: flex;
  justify-content: space-between;
`
