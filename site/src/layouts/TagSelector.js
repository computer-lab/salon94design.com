import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { monofont, selectorList } from './emotion-base'
import { pieceTagLink, capitalize } from '../util'

const Container = styled.div`
  padding: 24px 20px;
  border: 2px solid #000;
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
`

const TagSelector = ({ tags, currentTag }) => {
  return (
    <Container>
      <TagList>
        {tags.map(tag =>
          <li
            key={tag}
            className={cx({
              active: tag === currentTag,
            })}
          >
            <Link to={pieceTagLink(tag)}>
              {capitalize(tag)}
            </Link>
          </li>
        )}
      </TagList>
    </Container>
  )
}

TagSelector.propTypes = {
  tags: PropTypes.array.isRequired,
  currentTag: PropTypes.string.isRequired,
}

export default TagSelector
