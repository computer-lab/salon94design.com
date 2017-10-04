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
} from './emotion-base'
import { projectLink } from '../util'

const Container = styled.section`margin-top: 20px;`

const Press = ({ press }) => {
  return (
    <Container>
      <Header2>Press</Header2>
      <SimpleLinkList>
        {press.map(item => (
          <SimpleLinkListItem key={item.link}>
            <a href={item.link} target="_blank">
              {item.title}
            </a>
          </SimpleLinkListItem>
        ))}
      </SimpleLinkList>
    </Container>
  )
}

Press.propTypes = {
  press: PropTypes.array.isRequired,
}

export default Press
