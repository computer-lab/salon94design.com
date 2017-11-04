import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { monofont, selectorList, breakpoint1 } from '../layouts/emotion-base'
import { workTagLink, capitalize } from '../util'

const Container = styled.div`
  width: 370px;
  padding: 24px 20px;
  border: 2px solid #000;
  z-index: 1;

  @media (${breakpoint1}) {
    width: auto;
    margin-bottom: 40px;
  }
`

const TagList = styled.ul`
  composes: ${selectorList}, ${monofont};
  display: flex;
  flex-wrap: wrap;
  font-size: 24px;
  margin-bottom: -24px;

  & li {
    margin: 0 0 24px 0;
    padding: 2px;
    width: 50%;
  }

  @media (${breakpoint1}) {
    & li {
      margin: 0 18px 24px 0;
      width: auto;
    }
  }
`

const TagSelector = ({ tags, currentTag }) => (
  <Container>
    <TagList>
      {tags.map(tag => (
        <li
          key={tag}
          className={cx({
            active: tag === currentTag,
          })}
        >
          <Link to={workTagLink(tag)}>{capitalize(tag)}</Link>
        </li>
      ))}
    </TagList>
  </Container>
)

TagSelector.propTypes = {
  tags: PropTypes.array.isRequired,
  currentTag: PropTypes.string,
}

export default TagSelector
