import React from 'react'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { sansFontFamily } from '../layouts/emotion-base'

const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
  padding: 12px;
  background-color: #f9f9f9;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

  & h1 {
    font-size: 72px;
    font-family: ${sansFontFamily};
    font-weight: 600;
  }

  & p {
    font-size: 24px;
    font-family: ${sansFontFamily};
  }

  & a {
    color: inherit;
    text-decoration: none;
    border-bottom: 2px solid #000;
  }
`

const NotFoundPage = () => (
  <Container>
    <h1>NOT FOUND</h1>
    <p>This page does not exist :(.</p>
    <p>
      Try visiting the <Link to="/">homepage</Link>.
    </p>
  </Container>
)

export default NotFoundPage
