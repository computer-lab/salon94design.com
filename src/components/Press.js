import React from 'react'
import PropTypes from 'prop-types'
import styled from 'emotion/react'
import cx from 'classnames'
import {
  sansfont,
  baseUl,
  childLink,
  Header2,
  SimpleLinkList,
  SimpleLinkListItem,
} from '../layouts/emotion-base'
import { imageFilepath } from '../util'

const Container = styled.section`
  margin-top: 20px;
`

const Press = ({ press }) => {
  const filteredPress = (press || []).filter(
    p => (p.file && p.file.length > 0) || (p.link && p.link.length > 0)
  )

  if (filteredPress.length === 0) {
    return null
  }

  return (
    <Container>
      <Header2>Press</Header2>
      <SimpleLinkList>
        {press.map(item => {
          // press items either have a pdf file or a string link
          const link = item.file ? imageFilepath(item.file) : item.link
          return (
            <SimpleLinkListItem key={link}>
              <a href={link} target="_blank">
                {item.title}
              </a>
            </SimpleLinkListItem>
          )
        })}
      </SimpleLinkList>
    </Container>
  )
}

Press.propTypes = {
  press: PropTypes.array.isRequired,
}

export default Press
