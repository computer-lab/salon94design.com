import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import styled from 'emotion/react'

import './index.css'
import Menu from './Menu'

const ContentContainer = styled.div`
  margin: 100px auto 1.45rem auto;
  maxWidth: 960px;
  padding: 0 1.0875rem 1.45rem;
  paddingTop: 0;
`

const TemplateWrapper = ({ children, location }) =>
  <div>
    <Helmet
      title="Gatsby Default Starter"
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    />
    <Menu location={location} />
    <ContentContainer>
      {children()}
    </ContentContainer>
  </div>

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
