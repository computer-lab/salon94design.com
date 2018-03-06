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
  projects = projects
    .map(p => {
      const start_date = p.start_date ? new Date(p.start_date) : null
      const end_date = p.end_date ? new Date(p.end_date) : null
      return !isNaN(start_date.getTime()) ? { ...p, start_date, end_date } : null
    })
    .filter(p => p != null)

  // Sort by reverse-date
  projects.sort((a, b) => b.start_date.getTime() - a.start_date.getTime())

  // Group by year
  const projectsByYear = projects.reduce((acc, project) => {
    const year = project.start_date.getFullYear()
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
        <SimpleLinkListSection key={year}>
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
