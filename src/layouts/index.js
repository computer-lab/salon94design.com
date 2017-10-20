import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'

import './index.css'
import Helmet from '../components/helmet'
import Menu from './Menu'
import Breadcrumbs from './Breadcrumbs'
import HomepageSplash from './HomepageSplash'
import { ContentContainer } from './containers'

const description =
  'The design wing of Salon 94 represents designers working across categories like furniture, lighting, textiles, and ceramics.'
const keywords = 'Salon 94, Salon 94 Design, Designers, NYC, furniture'

const TemplateWrapper = ({ children, location, history }) => (
  <div>
    <Helmet
      title="Salon 94 Design"
      description={description}
      location={location}
      meta={[
        { name: 'description', content: description },
        { name: 'keywords', content: keywords },
        { name: 'author', content: 'Computer Lab' },
        { name: 'og:type', content: 'company' },
        { name: 'og:site_name', content: 'Salon 94 Design' },
        { name: 'fb:app_id', content: '289369261162766' },
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
