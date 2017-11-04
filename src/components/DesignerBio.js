import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { sansfont, childLink, breakpoint1 } from '../layouts/emotion-base'

const Container = styled.section``

const Bio = styled.div`
  composes: ${childLink}, ${sansfont};
  font-size: 20px;
  font-weight: 300;
  line-height: 1.4;
`

const DesignerProjects = ({ bioHtml }) => {
  return (
    <Container>
      <Bio dangerouslySetInnerHTML={{ __html: bioHtml }} />
    </Container>
  )
}

DesignerProjects.propTypes = {
  bioHtml: PropTypes.string.isRequired,
}

export default DesignerProjects
