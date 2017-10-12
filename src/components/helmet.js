import React from 'react'
import Helmet from 'react-helmet'
import { ROOT_URL } from '../util'

const Salon94Helmet = ({ title, description, location, meta = [] }) => {
  const extendedMeta = meta
  if (title && title.length > 0) {
    extendedMeta.push({ name: 'og:title', content: title })
  }
  if (description && description.length > 0) {
    extendedMeta.push({ name: 'og:description', content: description })
  }
  if (location) {
    extendedMeta.push({
      name: 'og:url',
      content: `${ROOT_URL}${location.pathname}`,
    })
  }

  return <Helmet title={title} description={description} meta={extendedMeta} />
}

export default Salon94Helmet
