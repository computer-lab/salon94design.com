import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { sansfont, childLink, Header2, breakpoint1 } from './emotion-base'

const Container = styled.section``

const Bio = styled.div`
  composes: ${childLink}, ${sansfont};
  font-size: 20px;
  font-weight: 300;
  line-height: 1.4;
`

const DesignerProjects = ({ bio }) => {
  return (
    <Container>
      <Header2>About</Header2>
      <Bio dangerouslySetInnerHTML={{ __html: bio }} />
    </Container>
  )
}

DesignerProjects.propTypes = {
  bio: PropTypes.string.isRequired,
}

export default DesignerProjects
