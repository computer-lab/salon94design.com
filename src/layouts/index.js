import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'

import './index.css'
import Menu from './Menu'
import Breadcrumbs from './Breadcrumbs'
import HomepageSplash from './HomepageSplash'
import { ContentContainer } from './containers'

const TemplateWrapper = ({ children, location, history }) => (
  <div>
    <Helmet
      title="Salon 94 Design"
      meta={[
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' },
      ]}
    />
    <Menu location={location} />
    <Breadcrumbs location={location} />
    <HomepageSplash location={location} />

    <ContentContainer>{children()}</ContentContainer>
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
