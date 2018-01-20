import React from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { createPanes, PageContainer } from '../layouts/containers'
import { sansfont, Header1, breakpoint1 } from '../layouts/emotion-base'
import ProjectDescription from '../components/ProjectDescription'
import ProjectDesigners from '../components/ProjectDesigners'
import ImageList from '../components/ImageList'
import HiddenSelector from '../components/HiddenSelector'
import WorkSummary from '../components/WorkSummary'
import Video from '../components/Video'
import {
  imageInfo,
  projectLink,
  workImageTexts,
  workLink,
  SHOW_SELECTORS,
} from '../util'

const { LeftPane, RightPane } = createPanes()

const ProjectHeader = styled.div`
  composes: ${sansfont};
  margin-bottom: 40px;
`

const ProjectWhen = styled.div`
  composes: ${sansfont};
  margin-top: 20px;
  font-size: 20px;
  font-weight: 100;
`

const ProjectTemplate = ({ data, pathContext }) => {
  const { project, allProjectsYaml, allDesignersYaml } = data

  const projects = allProjectsYaml.edges.map(edge => edge.node)
  const designers = allDesignersYaml
    ? allDesignersYaml.edges.map(edge => edge.node)
    : []

  const projectImages = (project.hydratedImages || [])
    .filter(i => !!i)
    .map(image =>
      Object.assign(imageInfo(image), {
        texts: image.caption ? { title: image.caption } : null,
      })
    )

  const workImages = []
  designers.forEach(designer => {
    const works = (designer.works || []).filter(
      work =>
        work.projects &&
        work.projects.map(project => project.slug).indexOf(project.slug) !== -1 &&
        work.hydratedImages &&
        work.hydratedImages.length > 0 &&
        work.hydratedImages[0]
    )

    works.forEach(work => {
      workImages.push(
        Object.assign(imageInfo(work.hydratedImages[0]), {
          work,
          designer,
          texts: workImageTexts({
            work,
            designer,
            smallText: (
              <Link to={workLink(designer.slug, work.slug)}>
                {work.title}, {work.when}
              </Link>
            ),
          }),
        })
      )
    })
  })

  const imageSets = [
    { images: projectImages, title: 'Installation View'},
    { images: workImages, title: 'Included Works' },
  ].filter(item => item.images.length > 0)

  const typeTitle = `${project.type}s`
  const currentTypeProjects = projects.filter(p => p.type === project.type)

  const projectsByYear = Array.from(
    new Set(currentTypeProjects.map(p => p.date))
  )
    .sort((a, b) => Date.parse(b) - Date.parse(a)) // sort reverse-chronologically
    .map(date => {
      const dateYear = function(date) {
        return new Date(date).getFullYear()
      }
      const year = dateYear(date)
      return {
        year,
        projects: currentTypeProjects.filter(p => dateYear(p.date) === year),
      }
    })

  const selectorSections = projectsByYear.map(({ year, projects }) => ({
    title: year,
    items: projects.map(project => ({
      title: project.title,
      link: projectLink(project),
    })),
  }))

  const hoverImageRenderer = hoverImage =>
    hoverImage.work && hoverImage.designer ? (
      <WorkSummary work={hoverImage.work} designer={hoverImage.designer} />
    ) : null

  return (
    <PageContainer>
      <Helmet
        title={`${project.title} - Salon 94 Design`}
        description={project.description}
      />
      <LeftPane>
        {project.video && project.video.vimeoId && <Video video={project.video} />}
        <ImageList
          imageSets={imageSets}
          hoverImageRenderer={hoverImageRenderer}
        />
      </LeftPane>
      <RightPane>
        <ProjectHeader>
          <Header1>
            {project.title}
            <div className="subheader">
              <ProjectDesigners project={project} designers={designers} />
              <ProjectWhen>{project.when}</ProjectWhen>
            </div>
          </Header1>
          <ProjectDescription project={project} />
        </ProjectHeader>

        {SHOW_SELECTORS &&
          currentTypeProjects.length > 1 && (
            <HiddenSelector
              title={`All ${typeTitle}`}
              sections={selectorSections}
              currentItemLink={projectLink(project)}
            />
          )}
      </RightPane>
    </PageContainer>
  )
}

export default ProjectTemplate

export const pageQuery = graphql`
  query ProjectsTemplateQuery($slug: String!, $designersRegex: String!) {
    project: projectsYaml(slug: { eq: $slug }) {
      ...fullProjectFields
    }
    allProjectsYaml(sort: { order: ASC, fields: [title] }) {
      ...linkProjectEdges
    }
    allDesignersYaml(filter: { slug: { regex: $designersRegex } }) {
      edges {
        node {
          slug
          title
          ...fullWorkFields
        }
      }
    }
  }
`
