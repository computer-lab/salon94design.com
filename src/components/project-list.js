import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'

import SectionItemList from '../components/SectionItemList'
import { chooseProjectImage, projectLink } from '../util'

function ProjectList({ allProjectsYaml, allDesignersYaml, type }) {
  const designers = allDesignersYaml.edges.map(edge => edge.node)
  const getDesigner = designer => designers.find(d => d.slug === designer.slug)

  const projects = allProjectsYaml.edges
    .map(edge => edge.node)
    .filter(d => d.type === type)
    .map(node => Object.assign({}, node, {
      designers: (node.designers || []).map(getDesigner).filter(d => !!d)
    }))
    .filter(p => p.designers.length > 0)

  const title = `${type}s`

  const listItems = projects.map(project => {
    return {
      title: project.title,
      subtitle: project.designers.map(d => d.name).join(', '),
      image: chooseProjectImage(project, project.designers),
      link: projectLink(project),
    }
  })

  return (
    <div>
      <SectionItemList title={title} items={listItems} />
    </div>
  )
}

ProjectList.propTypes = {
  allProjectsYaml: PropTypes.object,
  allDesignersYaml: PropTypes.object,
  type: PropTypes.string,
}

export default ProjectList
