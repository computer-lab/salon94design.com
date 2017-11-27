import React from 'react'
import Helmet from 'react-helmet'
import { ROOT_URL } from '../util'

const icons = {
  favicon: require('../assets/icons/favicon.png'),
  appleTouch: {
    regular: require('../assets/icons/apple-touch-icon.png'),
    w57: require('../assets/icons/apple-touch-icon-57x57.png'),
    w72: require('../assets/icons/apple-touch-icon-72x72.png'),
    w114: require('../assets/icons/apple-touch-icon-114x114.png'),
    w144: require('../assets/icons/apple-touch-icon-144x144.png'),
  },
}

const Salon94Helmet = ({
  title,
  description,
  location,
  meta = [],
  link = [],
}) => {
  const props = { meta, link }

  if (title && title.length > 0) {
    props.meta.push({ name: 'og:title', content: title })
    props.title = title
  }

  if (description && description.length > 0) {
    props.meta.push({ name: 'og:description', content: description })
    props.description = description
  }

  if (location) {
    props.meta.push({
      name: 'og:url',
      content: `${ROOT_URL}${location.pathname}`,
    })
  }

  props.link = (props.link || []).concat([
    { rel: 'shortcut icon', href: icons.favicon },
    { rel: 'apple-touch-icon', href: icons.appleTouch.regular },
    { rel: 'apple-touch-icon', sizes: '57x57', href: icons.appleTouch.w57 },
    { rel: 'apple-touch-icon', sizes: '72x72', href: icons.appleTouch.w72 },
    { rel: 'apple-touch-icon', sizes: '114x114', href: icons.appleTouch.w114 },
    { rel: 'apple-touch-icon', sizes: '144x144', href: icons.appleTouch.w144 },
  ])

  return <Helmet {...props} />
}

export default Salon94Helmet
