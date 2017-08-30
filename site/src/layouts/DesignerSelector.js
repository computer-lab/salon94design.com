import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { monofont, sansfont, baseUl } from './emotion-base'

const Container = styled.div`
  margin-left: 20px;
  margin-right: -12px;
  padding: 8px;
  border: 2px solid #000;
  width: 120px;
  min-width: 120px;
`

const DesignerList = styled.ul`
  composes: ${baseUl}, ${monofont};
  font-size: 14px;
  text-align: right;

  & li {
    margin: 0;
    padding: 0;
    line-height: 1.25;

    &:not(:last-child) {
      margin-bottom: 12px;
    }

    &.active a {
      background: #ff0;
      text-decoration: underline;
    }

    & a {
      color: inherit;
      text-decoration: inherit;

      &:hover,
      &:focus {
        text-decoration: underline;
      }
    }
  }
`

const DesignerSelector = ({ designers, currentDesignerSlug }) => {
  // TODO: remove temporary designers
  for (let i = 3; i < 15; i++) {
    designers.push({
      slug: `designer-${i}`,
      name: `Designer ${i}`
    })
  }

  return (
    <Container>
      <DesignerList>
        {designers.map(item =>
          <li
            key={item.slug}
            className={cx({
              active: item.slug === currentDesignerSlug,
            })}
          >
            <Link to={`/designers/${item.slug}`}>
              {item.name}
            </Link>
          </li>
        )}
      </DesignerList>
    </Container>
  )
}

DesignerSelector.propTypes = {
  designers: PropTypes.array.isRequired,
  currentDesignerSlug: PropTypes.string.isRequired,
}

export default DesignerSelector
