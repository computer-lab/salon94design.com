import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import './index.css'
import Menu from './Menu'
import Breadcrumbs from './Breadcrumbs'
import { ContentContainer } from './containers'

const TemplateWrapper = ({ children, location, history }) =>
  <div>
    <Helmet
      title="Gatsby Default Starter"
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    />
    <Menu location={location} />
    <Breadcrumbs history={history} />
    <ContentContainer>
      {children()}
    </ContentContainer>
  </div>

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
