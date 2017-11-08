import React from 'react'
import Link from 'gatsby-link'
import styled from 'emotion/react'

import { childLink } from '../layouts/emotion-base'
import { designerLink } from '../util'

const ProjectDesigner = styled.span`
  composes: ${childLink};

  &:not(:first-child)::before {
    content: ', ';
    padding-right: 5px;
  }

  &:last-child::after {
    content: ' ';
  }
`

export default ({ project, designers }) => {
  const getDesigner = slug => designers.find(d => d.slug === slug)

  const projectDesigners = (project.designers || []).filter(designer =>
    getDesigner(designer.slug)
  )

  return (
    <span>
      {projectDesigners.map(designer => (
        <ProjectDesigner key={designer.slug}>
          <Link to={designerLink(designer.slug)}>
            {getDesigner(designer.slug).title}
          </Link>
        </ProjectDesigner>
      ))}
    </span>
  )
}
