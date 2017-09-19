import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'

const TemplateWrapper = ({ children, location, history }) =>
  <div>
    <Helmet
      title="Salon94 Design Administration"
      meta={[
        { name: 'description', content: 'Administration of salon94design.com' }
      ]}
    >
      <link rel="stylesheet" href="https://unpkg.com/netlify-cms@~0.4/dist/cms.css" />
    </Helmet>
    {children()}
  </div>

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
