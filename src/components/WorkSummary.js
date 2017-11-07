import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import {
  monoFontFamily,
  sansfont,
  childLink,
  breakpoint1,
  breakpoint2,
  breakpoint3,
  baseUl,
} from '../layouts/emotion-base'
import { designerLink, workTagLink, projectLink, capitalize } from '../util'

const Container = styled.div`
  composes: ${sansfont};
  font-weight: 300;
  max-width: 400px;

  &.detailed {
    margin-bottom: 20px;
    max-width: none;
  }
`

const DetailSection = styled.ul`
  composes: ${baseUl};
  margin-bottom: 20px;

  @media (${breakpoint1}) {
    margin-bottom: 16px;
  }

  @media (${breakpoint3}) {
    margin-top: 8px;
  }
`

const SummaryItem = styled.li`
  composes: ${childLink};
  margin: 0 0 6px 0;
  line-height: 1.25;
  font-size: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  &.designer {
    font-weight: 500;
  }

  &.project,
  &.tag {
    font-size: 22px;
    font-weight: 500;
  }

  @media (${breakpoint1}) {
    font-size: 22px;
  }
`

const WorkSummary = ({ designer, work, detailed, projects }) => (
  <Container className={cx({ detailed })}>
    <DetailSection>
      {designer && (
        <SummaryItem className="designer">
          <Link to={designerLink(designer.slug)}>{designer.name}</Link>
        </SummaryItem>
      )}

      <SummaryItem>{work.title}, {work.when}</SummaryItem>
      <SummaryItem>{work.caption}</SummaryItem>
      <SummaryItem>{work.medium}</SummaryItem>
      <SummaryItem>{work.dimensions}</SummaryItem>
      <SummaryItem>{work.edition}</SummaryItem>
      <SummaryItem>{work.price}</SummaryItem>
    </DetailSection>

    <DetailSection>
      {projects &&
        work.projects &&
        work.projects
            .map(project => {
              let fullProject = projects.find(p => p.slug === project.slug)
              return fullProject ? (
                <SummaryItem key={project.slug} className="project">
                  <Link to={projectLink(project)}>{fullProject.title}</Link>
                </SummaryItem>
              ) : null
            })
            .filter(project => project !== null)
      }

      {detailed &&
        work.tags &&
        work.tags.map(tag => (
          <SummaryItem key={tag} className="tag">
            <Link to={workTagLink(tag)}>{capitalize(tag)}</Link>
          </SummaryItem>
        ))}
    </DetailSection>
  </Container>
)

WorkSummary.propTypes = {
  work: PropTypes.object.isRequired,
  designer: PropTypes.object,
  projects: PropTypes.array,
  detailed: PropTypes.bool,
}

export default WorkSummary
