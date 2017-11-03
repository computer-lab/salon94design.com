import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import {
  monofont,
  monoFontFamily,
  sansfont,
  sansFontFamily,
  childLink,
  breakpoint1,
  breakpoint2,
  breakpoint3,
} from './emotion-base'
import { designerLink, workTagLink, projectLink, capitalize } from '../util'

const Container = styled.div`
  composes: ${sansfont};
  font-weight: 300;
  max-width: 400px;

  &.detailed {
    margin-bottom: 20px;
    max-width: none;

    @media (${breakpoint1}) {
      display: flex;
    }

    @media (${breakpoint3}) {
      display: block;
    }
  }
`

const PrimaryInfo = styled.div`
  @media (${breakpoint1}) {
    margin-right: 80px;
  }

  @media (${breakpoint2}) {
    margin-right: 40px;
  }
`

const Details = styled.div`
  @media (${breakpoint1}) {
    margin-top: 4px;
  }

  @media (${breakpoint3}) {
    margin-top: 0;
  }
`

const Title = styled.div`
  margin-bottom: 10px;
  font-size: 28px;

  @media (${breakpoint1}) {
    margin-bottom: 8px;
  }
`

const When = styled.div`
  margin-bottom: 24px;
  font-size: 22px;

  @media (${breakpoint1}) {
    margin-bottom: 16px;
  }
`

const SummaryItem = styled.div`
  composes: ${childLink};
  margin: 0 0 8px 0;
  line-height: 1.25;
  font-size: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  &.designer {
    font-size: 26px;
    font-weight: 500;
    margin: 0 0 16px 0;

    @media (${breakpoint1}) {
      margin-bottom: 12px;
    }
  }

  &.tag {
    font-family: ${monoFontFamily};
    font-weight: 500;

    & a {
      border-bottom: 2px solid #000;
    }
  }

  @media (${breakpoint1}) {
    font-size: 22px;
  }
`

const WorkSummary = ({ designer, work, detailed, projects }) => (
  <Container className={cx({ detailed })}>
    <PrimaryInfo>
      {designer && (
        <SummaryItem className="designer">
          <Link to={designerLink(designer.slug)}>{designer.name}</Link>
        </SummaryItem>
      )}
      <Title>{work.title}</Title>
      <When>{work.when}</When>
    </PrimaryInfo>
    <Details>
      <SummaryItem>{work.medium}</SummaryItem>
      <SummaryItem>{work.dimensions}</SummaryItem>
      <SummaryItem>{work.price}</SummaryItem>
      <SummaryItem>{work.caption}</SummaryItem>
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
          .filter(project => project !== null)}
      {detailed && (
        <div>
          {work.tags &&
            work.tags.map(tag => (
              <SummaryItem key={tag} className="tag">
                <Link to={workTagLink(tag)}>{capitalize(tag)}</Link>
              </SummaryItem>
            ))}
        </div>
      )}
    </Details>
  </Container>
)

WorkSummary.propTypes = {
  work: PropTypes.object.isRequired,
  designer: PropTypes.object,
  projects: PropTypes.array,
  detailed: PropTypes.bool,
}

export default WorkSummary
