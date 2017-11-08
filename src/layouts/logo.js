import React from 'react'
import styled from 'emotion/react'
import { breakpoint2 } from './emotion-base'

export const LOGO_ASPECT_RATIO = 2048 / 884
export const getLogoHeight = width => width / LOGO_ASPECT_RATIO

// dynamic sizing via `width` prop
const Logo = styled.div`
  margin: 0 auto 60px auto;
  background-image: ${({ imageUrl }) => `url(${imageUrl})`};
  background-size: 100% 100%;
  width: ${({ width }) => `${width}px`};
  height: ${({ width }) => `${getLogoHeight(width)}px`};

  @media (${breakpoint2}) {
    margin: 0 auto 20px auto;
    width: 300px;
    height: ${getLogoHeight(300)}px;
  }
`

export default Logo
