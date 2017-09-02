import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'

import { baseUl, monofont } from './emotion-base'
import { capitalize } from '../util'

const Container = styled.div`
  position: fixed;
  top: 2px;
  right: 2px;
`

const BreadcrumbList = styled.ul`
  composes: ${baseUl}, ${monofont};
  display: flex;
  font-size: 9px;
`

const Breadcrumb = styled.li`
  margin: 0 5px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  color: #888;

  & a {
    color: inherit;
    text-decoration: inherit;

    &:hover,
    &:focus {
      text-decoration: underline;
    }
  }

  &:hover,
  &:focus {
    color: #000;
  }

  &.active {
    cursor: auto;
    background: #ff0;
    color: #000;
  }

  &:not(:last-child)::after {
    margin-left: 10px;
    content: "->";
    font-weight: bold;
    color: #000;
  }
`

function Breadcrumbs({ location }) {
  const pathSections = location.pathname.split('/').filter(s => s.length > 0)

  const home = { name: 'Home', path: '/' }
  const breadcrumbs = [home].concat(
    pathSections.map(section => ({
      name: capitalize(section.replace(/-/g, ' ')),
      path: location.pathname.substring(
        0,
        location.pathname.indexOf(section) + section.length
      ),
    }))
  )

  return (
    <Container>
      <BreadcrumbList>
        {breadcrumbs.map(({ name, path }, index) =>
          <Breadcrumb
            key={index}
            className={cx({
              active: index === breadcrumbs.length - 1,
            })}
          >
            <Link to={path}>
              {name}
            </Link>
          </Breadcrumb>
        )}
      </BreadcrumbList>
    </Container>
  )
}

Breadcrumbs.propTypes = {
  location: PropTypes.object,
}

export default Breadcrumbs
