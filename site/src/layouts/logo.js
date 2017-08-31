import React from 'react'
import styled from 'emotion/react'
import { breakpoint1 } from './emotion-base'

const ASPECT_RATIO = 2048 / 884
const height = width => width / ASPECT_RATIO

// dynamic sizing via `width` prop
const Logo = styled.div`
  margin: -72px 0 0 20px;
  background-image: url(${require('../assets/images/logo/logo_2048.jpg')});
  background-size: 100% 100%;
  width: ${({ width }) => `${width}px`};
  height: ${({ width }) => `${height(width)}px`};

  @media(${breakpoint1}) {
    margin: 0 auto;
    width: 300px;
    height: ${height(300)}px;
  }
`

export default Logo
