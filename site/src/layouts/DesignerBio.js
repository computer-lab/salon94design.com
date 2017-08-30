import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { sansfont, childLink, Header2 } from './emotion-base'

const Container = styled.section`
  margin-top: 60px;
`

const Bio = styled.div`
  composes: ${childLink}, ${sansfont};
  font-size: 16px;
  line-height: 1.4;
`

const DesignerProjects = ({ bio }) => {
  // TODO: bio should just be full markdown in the CMS?
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
