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
  Header3,
  SimpleLinkList,
  SimpleLinkListItem,
  SimpleLinkListSection,
} from '../layouts/emotion-base'
import { projectLink } from '../util'

const Container = styled.section`
  margin-top: 20px;
`

const DesignerProjects = ({ projects }) => {
  if (!projects || projects.length === 0) {
    return null
  }

  // XXX: Projects with missing or invalid dates will not be displayed
  projects = projects.filter((p) => p.date && !isNaN((new Date(p.date)).getTime()))

  // Sort by reverse-date
  projects.sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime())

  // Group by year
  const projectsByYear = projects.reduce((acc, project) => {
    const year = (new Date(project.date)).getFullYear()
    if (!acc[year]) {
      acc[year] = [project]
    }
    else {
      acc[year].push(project)
    }
    return acc
  }, {})

  const descendingYears = Object.keys(projectsByYear).sort().reverse()

  return (
    <Container>
      <Header2>Exhibitions</Header2>
      {descendingYears.map(year => (
        <SimpleLinkListSection>
          <Header3>{year}</Header3>
          <SimpleLinkList>
            {projectsByYear[year].map(item => (
              <SimpleLinkListItem key={item.slug}>
                <Link to={projectLink(item)}>{item.title}</Link>
              </SimpleLinkListItem>
            ))}
          </SimpleLinkList>
        </SimpleLinkListSection>
      ))}
    </Container>
  )
}

DesignerProjects.propTypes = {
  projects: PropTypes.array.isRequired,
}

export default DesignerProjects
