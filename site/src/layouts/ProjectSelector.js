import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { monofont, sansfont, selectorList } from './emotion-base'
import { projectLink } from '../util'

const Container = styled.div`
  padding: 24px 20px;
  border: 2px solid #000;
`

const ProjectSection = styled.section`
  &:not(:last-child) {
    margin-bottom: 36px;
  }
`

const Year = styled.h3`
  composes: ${monofont};
  font-weight: bold;
  font-size: 22px;
  padding: 0;
  margin: 0;
`

const ProjectList = styled.ul`
  composes: ${selectorList}, ${sansfont};
  display: flex;
  flex-wrap: wrap;
  margin-top: 16px;
  margin-bottom: -12px;
  font-size: 16px;

  & li {
    margin: 0 0 12px 0;
    padding: 2px;
    width: 50%;
  }
`

const ProjectSelector = ({ projects, currentProjectSlug }) => {
  const projectsByYear = Array.from(new Set(projects.map(p => p.when))) // years
    .sort((a, b) => b - a) // sort reverse-chronologically
    .map(year => ({ year, projects: projects.filter(p => p.when === year) }))

  return (
    <Container>
      {projectsByYear.map(({ year, projects }) => {
        return (
          <ProjectSection key={year}>
            <Year>
              {year}
            </Year>
            <ProjectList>
              {projects.map(project =>
                <li
                  key={project.slug}
                  className={cx({
                    active: project.slug === currentProjectSlug,
                  })}
                >
                  <Link to={projectLink(project.slug)}>
                    {project.title}
                  </Link>
                </li>
              )}
            </ProjectList>
          </ProjectSection>
        )
      })}
    </Container>
  )
}

ProjectSelector.propTypes = {
  projects: PropTypes.array.isRequired,
  currentProjectSlug: PropTypes.string.isRequired,
}

export default ProjectSelector
