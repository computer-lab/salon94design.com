import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { breakpoint1, breakpoint3 } from './emotion-base'

const HoverInfo = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 6px;
  background: #fff;
  border: 2px solid #000;
  z-index: 20;

  &.hidden {
    display: none;
  }

  @media (${breakpoint1}) {
    right: 0;
    bottom: auto;
    top: 120px;
  }

  @media (${breakpoint3}) {
    display: none;
  }
`

export default HoverInfo
