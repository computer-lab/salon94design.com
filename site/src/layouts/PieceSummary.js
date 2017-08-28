import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { monofont, sansfont } from './emotion-base'

const Container = styled.div`
  composes: ${sansfont};
  margin-top: 60px;
`

const Title = styled.div`
  margin-bottom: 18px;
  font-size: 32px;
`

const SummaryItem = styled.div`
  margin: 8px 0;
  line-height: 1.25;
  font-size: 24px;
`

const PieceSummary = ({ designer, piece }) =>
  <Container>
    <Title>
      {piece.title}
    </Title>
    <SummaryItem>
      {designer.name}
    </SummaryItem>
    <SummaryItem>
      {piece.price}
    </SummaryItem>
    {piece.caption &&
      <SummaryItem>
        {piece.caption}
      </SummaryItem>}
  </Container>

PieceSummary.propTypes = {
  piece: PropTypes.object.isRequired,
  designer: PropTypes.object.isRequired,
}

export default PieceSummary
