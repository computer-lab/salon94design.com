import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { createPanes, PageContainer } from '../layouts/containers'
import {
  sansfont,
  monofont,
  childLink,
  Header1,
  breakpoint1,
} from '../layouts/emotion-base'
import ImageList from '../layouts/ImageList'
import HiddenSelector from '../layouts/HiddenSelector'
import WorkSummary from '../layouts/WorkSummary'
import Video from '../layouts/Video'
import {
  workImagePath,
  designerLink,
  projectLink,
  workImageTexts,
  workLink,
} from '../util'

const { LeftPane, RightPane } = createPanes()

const ProjectHeader = styled.div`
  composes: ${sansfont};
  margin-bottom: 40px;
`

const ProjectDesigner = styled.span`
  composes: ${childLink};

  &:not(:first-child)::before {
    content: ' / ';
  }

  &:last-child::after {
    content: ' ';
  }
`

const ProjectWhen = styled.div`
  composes: ${monofont};
  margin-top: 8px;
  font-size: 24px;
`

const ProjectDescription = styled.div`
  max-width: 320px;
  font-size: 20px;
  font-weight: 300;
  line-height: 1.4;

  @media (${breakpoint1}) {
    max-width: 480px;
  }
`

const ProjectTemplate = ({ data, pathContext }) => {
  const { allProjectsYaml, allDesignersYaml } = data
  const { slug: currentProjectSlug } = pathContext

  const projects = allProjectsYaml.edges.map(edge => edge.node)
  const currentProject = projects.find(p => p.slug === currentProjectSlug)

  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const getDesigner = slug => designers.find(d => d.slug === slug)

  const images = []
  designers.forEach(designer => {
    const works = (designer.works || []).filter(
      work =>
        work.projects &&
        work.projects.map(project => project.slug).includes(currentProjectSlug)
    )

    works.forEach(work => {
      if (work.images && work.images.length > 0) {
        images.push({
          work,
          designer,
          src: workImagePath(work.images[0].file),
          texts: workImageTexts({
            work,
            designer,
            smallText: (
              <Link to={workLink(designer.slug, work.slug)}>{work.title} </Link>
            ),
          }),
        })
      }
    })
  })

  const imageSets = [{ images }]

  const projectsByYear = Array.from(new Set(projects.map(p => p.when))) // years
    .sort((a, b) => b - a) // sort reverse-chronologically
    .map(year => ({ year, projects: projects.filter(p => p.when === year) }))

  const selectorSections = projectsByYear.map(({ year, projects }) => ({
    title: year,
    items: projects.map(project => ({
      title: project.title,
      link: projectLink(project.slug),
    })),
  }))

  const currentProjectDesigners = currentProject.designers || []

  const hoverImageRenderer = hoverImage => (
    <WorkSummary work={hoverImage.work} designer={hoverImage.designer} />
  )

  return (
    <PageContainer>
      <Helmet title={`Salon 94 Design - Projects - ${currentProject.title}`} />
      <LeftPane>
        {currentProject.video && <Video video={currentProject.video} />}
        <ImageList
          imageSets={imageSets}
          hoverImageRenderer={hoverImageRenderer}
        />
      </LeftPane>
      <RightPane className="selectable">
        <ProjectHeader>
          <Header1>
            {currentProject.title}
            <div className="subheader">
              {currentProjectDesigners.map(designer => (
                <ProjectDesigner key={designer.slug}>
                  <Link to={designerLink(designer.slug)}>
                    {getDesigner(designer.slug).name}
                  </Link>
                </ProjectDesigner>
              ))}
              <ProjectWhen>{currentProject.when}</ProjectWhen>
            </div>
          </Header1>
          <ProjectDescription
            dangerouslySetInnerHTML={{ __html: currentProject.descriptionHtml }}
          />
        </ProjectHeader>
        <HiddenSelector
          title="All Projects"
          sections={selectorSections}
          currentItemLink={projectLink(currentProjectSlug)}
        />
      </RightPane>
    </PageContainer>
  )
}

export default ProjectTemplate

export const pageQuery = graphql`
  query ProjectsTemplateQuery {
    allProjectsYaml {
      edges {
        node {
          slug
          title
          descriptionHtml
          when
          video {
            vimeoId
            caption
          }
          designers {
            slug
          }
        }
      }
    }
    allDesignersYaml {
      edges {
        node {
          slug
          name
          works {
            slug
            title
            when
            projects {
              slug
            }
            tags
            images {
              file
            }
            caption
            price
            medium
            dimensions
          }
        }
      }
    }
  }
`
