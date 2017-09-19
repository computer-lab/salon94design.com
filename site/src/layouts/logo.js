import React from 'react'
import styled from 'emotion/react'
import { breakpoint2 } from './emotion-base'

export const LOGO_ASPECT_RATIO = 2048 / 884
export const getLogoHeight = width => width / LOGO_ASPECT_RATIO
export const logoImageUrl = require('../assets/images/logo/logo_2048.jpg')

// dynamic sizing via `width` prop
const Logo = styled.div`
  margin: -72px 0 0 20px;
  background-image: url(${logoImageUrl});
  background-size: 100% 100%;
  width: ${({ width }) => `${width}px`};
  height: ${({ width }) => `${getLogoHeight(width)}px`};

  @media (${breakpoint2}) {
    margin: 0 auto;
    width: 300px;
    height: ${getLogoHeight(300)}px;
  }
`

export default Logo
