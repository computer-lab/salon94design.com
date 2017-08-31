import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { monofont, sansfont, childLink } from './emotion-base'
import { designerLink, pieceTagLink, projectLink, capitalize } from '../util'

const Container = styled.div`
  composes: ${sansfont};
  margin-top: 60px;
`

const Title = styled.div`
  margin-bottom: 18px;
  font-size: 32px;
`

const SummaryItem = styled.div`
  composes: ${childLink};
  margin: 8px 0;
  line-height: 1.25;
  font-size: 24px;
`

const PieceSummary = ({ designer, piece, detailed, projects }) =>
  <Container>
    <Title>
      {piece.title}
    </Title>
    <SummaryItem>
      {piece.price}
    </SummaryItem>
    {piece.caption &&
      <SummaryItem>
        {piece.caption}
      </SummaryItem>}
    {designer &&
      <SummaryItem>
        <Link to={designerLink(designer.slug)}>
          {designer.name}
        </Link>
      </SummaryItem>
    }
    { projects && piece.projects.map(slug =>
      <SummaryItem key={slug}>
        <Link to={projectLink(slug)}>
          {projects.find(p => p.slug === slug).title}
        </Link>
      </SummaryItem>
    )}
    { detailed &&
      <div>
        <SummaryItem>
          <Link to={pieceTagLink(piece.when)}>
            {piece.when}
          </Link>
        </SummaryItem>
        {piece.tags.map(tag =>
          <SummaryItem key={tag}>
            <Link to={pieceTagLink(tag)}>
              {capitalize(tag)}
            </Link>
          </SummaryItem>
        )}
      </div>
    }
  </Container>

PieceSummary.propTypes = {
  piece: PropTypes.object.isRequired,
  designer: PropTypes.object,
  projects: PropTypes.array,
  detailed: PropTypes.bool
}

export default PieceSummary
