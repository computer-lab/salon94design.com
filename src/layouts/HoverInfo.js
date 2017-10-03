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

  @media (${breakpoint1}) {
    right: auto;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
  }

  @media (${breakpoint3}) {
    display: none;
  }
`

export default HoverInfo
