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
    .map(node =>
      Object.assign({}, node, {
        designers: (node.designers || []).map(getDesigner).filter(d => !!d),
      })
    )
    .filter(p => p.designers.length > 0)

  const listItems = projects.map(project => {
    const subtitle = type === 'Art Fair' || project.designers.length > 3
      ? null
      : project.designers.map(d => d.title).join(', ')

    return {
      title: project.title,
      subtitle,
      // description: project.descriptionHtml,
      link: projectLink(project),
    }
  })

  return (
    <div>
      <SectionItemList items={listItems} disableColumns={true} />
    </div>
  )
}

ProjectList.propTypes = {
  allProjectsYaml: PropTypes.object,
  allDesignersYaml: PropTypes.object,
  type: PropTypes.string,
}

export default ProjectList
