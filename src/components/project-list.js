import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'

import SectionItemList from '../components/SectionItemList'
import { chooseProjectImage, projectLink, getProjectDateText } from '../util'
import { CenterContainer } from '../layouts/emotion-base'

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
    let subtitle = null
    if (type === 'Exhibition') {
      const dateText = getProjectDateText(project)
      subtitle = (
        <div>
          { project.designers.length <= 3 && <div>{project.designers.map(d => d.title).join(', ')}</div> }
          { dateText && <div>{ dateText }</div> }
        </div>
      )
    }

    return {
      title: project.title,
      subtitle,
      // description: project.descriptionHtml,
      link: projectLink(project),
    }
  })

  return (
    <CenterContainer>
      <SectionItemList centered items={listItems} disableColumns={true} />
    </CenterContainer>
  )
}

ProjectList.propTypes = {
  allProjectsYaml: PropTypes.object,
  allDesignersYaml: PropTypes.object,
  type: PropTypes.string,
}

export default ProjectList
