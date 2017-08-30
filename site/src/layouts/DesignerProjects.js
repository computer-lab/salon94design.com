import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { sansfont, baseUl, childLink, Header2 } from './emotion-base'
import { projectLink } from '../util'

const Container = styled.div``

const ProjectList = styled.ul`
  composes: ${baseUl}, ${sansfont};
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
`

const ProjectListItem = styled.li`
  composes: ${childLink};
  margin: 0 24px 12px 0;
  padding: 0;
`

const DesignerProjects = ({ projects }) => {
  return (
    <Container>
      <Header2>Projects</Header2>
      <ProjectList>
        {projects.map(item =>
          <ProjectListItem key={item.slug}>
            <Link to={projectLink(item.slug)}>
              {item.title}
            </Link>
          </ProjectListItem>
        )}
      </ProjectList>
    </Container>
  )
}

DesignerProjects.propTypes = {
  projects: PropTypes.array.isRequired,
}

export default DesignerProjects
