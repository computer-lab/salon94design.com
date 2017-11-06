import React from 'react'
import Helmet from '../components/helmet'
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
import ImageList from '../components/ImageList'
import HiddenSelector from '../components/HiddenSelector'
import WorkSummary from '../components/WorkSummary'
import Video from '../components/Video'
import {
  imageInfo,
  designerLink,
  projectLink,
  workImageTexts,
  workLink,
  SHOW_SELECTORS
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

  const projectImages = (currentProject.hydratedImages || []).map(image =>
    Object.assign(imageInfo(image), {
      texts: image.caption ? { title: image.caption } : null,
    })
  )

  const workImages = []
  designers.forEach(designer => {
    const works = (designer.works || []).filter(
      work =>
        work.projects &&
        work.projects.map(project => project.slug).includes(currentProjectSlug)
    )

    works.forEach(work => {
      if (work.hydratedImages && work.hydratedImages.length > 0) {
        workImages.push(
          Object.assign(imageInfo(work.hydratedImages[0]), {
            work,
            designer,
            texts: workImageTexts({
              work,
              designer,
              smallText: (
                <Link to={workLink(designer.slug, work.slug)}>
                  {work.title}{' '}
                </Link>
              ),
            }),
          })
        )
      }
    })
  })

  const imageSets = [
    { images: projectImages, title: null },
    { images: workImages, title: 'Included Works' },
  ].filter(item => item.images.length > 0)

  const typeTitle = `${currentProject.type}s`
  const currentTypeProjects = projects.filter(
    p => p.type === currentProject.type
  )

  const projectsByYear = Array.from(
    new Set(currentTypeProjects.map(p => p.groupingYear))
  ) // years
    .sort((a, b) => b - a) // sort reverse-chronologically
    .map(year => ({
      year,
      projects: currentTypeProjects.filter(p => p.groupingYear === year),
    }))

  const selectorSections = projectsByYear.map(({ year, projects }) => ({
    title: year,
    items: projects.map(project => ({
      title: project.title,
      link: projectLink(project),
    })),
  }))

  const currentProjectDesigners = currentProject.designers || []

  const hoverImageRenderer = hoverImage =>
    hoverImage.work && hoverImage.designer ? (
      <WorkSummary work={hoverImage.work} designer={hoverImage.designer} />
    ) : null

  return (
    <PageContainer>
      <Helmet
        title={`${currentProject.title} - Salon 94 Design`}
        description={currentProject.description}
      />
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

        {SHOW_SELECTORS && currentTypeProjects.length > 1 && (
          <HiddenSelector
            title={`All ${typeTitle}`}
            sections={selectorSections}
            currentItemLink={projectLink(currentProject)}
          />
        )}
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
          type
          description
          descriptionHtml
          when
          groupingYear
          hydratedImages {
            file
            width
            height
            resized {
              file
              width
              height
            }
          }
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
            hydratedImages {
              file
              width
              height
              resized {
                file
                width
                height
              }
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
