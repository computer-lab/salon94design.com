import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { sansfont, selectorList, breakpoint1 } from '../layouts/emotion-base'
import { workTagLink, capitalize } from '../util'

const Container = styled.div`
  padding: 0;
  z-index: 1;

  @media (${breakpoint1}) {
    display: none;
  }
`

const CategoryHeader = styled.div`
  composes: ${sansfont};
  font-size: 16px;
  font-weight: 700;
  margin-top: 5px;
`

const TagList = styled.ul`
  composes: ${selectorList}, ${sansfont};
  display: block;
  font-size: 16px;
  font-weight: 100;

  & li {
    margin: 0;
    padding: 2px;
  }
`

const TagSelector = ({ classifiedTags, currentCategory, currentTag }) => (
  <Container>
    {classifiedTags.map(({ category, tags }) => (
      <div key={category}>
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
      </div>
    ))}
  </Container>
)

TagSelector.propTypes = {
  tags: PropTypes.array.isRequired,
  currentTag: PropTypes.string,
}

export default TagSelector
