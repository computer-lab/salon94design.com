import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
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

const DesignerProjects = ({ projects }) => {
  return (
    <Container>
      <Header2>Projects</Header2>
      <SimpleLinkList>
        {projects.map(item => (
          <SimpleLinkListItem key={item.slug}>
            <Link to={projectLink(item.slug)}>{item.title}</Link>
          </SimpleLinkListItem>
        ))}
      </SimpleLinkList>
    </Container>
  )
}

DesignerProjects.propTypes = {
  projects: PropTypes.array.isRequired,
}

export default DesignerProjects
