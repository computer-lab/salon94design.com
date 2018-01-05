import React from 'react'
import styled from 'emotion/react'

import { sansfont } from '../layouts/emotion-base'

const Container = styled.div`
  composes: ${sansfont};
  font-size: 16px;
  font-weight: 300;
  line-height: 1.3;

  & p {
    margin-bottom: 20px;
  }
`

export default ({ project }) => (
  <Container dangerouslySetInnerHTML={{ __html: project.descriptionHtml }} />
)
