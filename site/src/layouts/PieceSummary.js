import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import {
  monofont,
  monoFontFamily,
  sansfont,
  childLink,
  breakpoint1,
  breakpoint3,
} from './emotion-base'
import { designerLink, pieceTagLink, projectLink, capitalize } from '../util'

const Container = styled.div`
  composes: ${sansfont};

  &.detailed {
    margin-bottom: 20px;
  }
`

const Title = styled.div`
  margin-bottom: 24px;
  font-size: 32px;

  @media (${breakpoint1}) {
    margin-bottom: 18px;
    font-size: 28px;
  }
`

const SummaryItem = styled.div`
  composes: ${childLink};
  margin: 8px 0;
  line-height: 1.25;
  font-size: 24px;

  &:last-child {
    margin-bottom: 0;
  }

  &.designer {
    font-size: 24px;
    font-weight: 500;
    margin: 0 0 20px 0;
  }

  &.tag {
    font-family: ${monoFontFamily};
    font-weight: 700;
  }

  @media (${breakpoint1}) {
    font-size: 18px;

    &.designer {
      font-size: 18px;
    }
  }
`

const PieceSummary = ({ designer, piece, detailed, projects }) =>
  <Container className={cx({ detailed })}>
    {designer &&
      <SummaryItem className="designer">
        <Link to={designerLink(designer.slug)}>
          {designer.name}
        </Link>
      </SummaryItem>}
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
    {projects &&
      piece.projects.map(slug =>
        <SummaryItem key={slug}>
          <Link to={projectLink(slug)}>
            {projects.find(p => p.slug === slug).title}
          </Link>
        </SummaryItem>
      )}
    {detailed &&
      <div>
        <SummaryItem className="tag">
          <Link to={pieceTagLink(piece.when)}>
            {piece.when}
          </Link>
        </SummaryItem>
        {piece.tags.map(tag =>
          <SummaryItem key={tag} className="tag">
            <Link to={pieceTagLink(tag)}>
              {capitalize(tag)}
            </Link>
          </SummaryItem>
        )}
      </div>}
  </Container>

PieceSummary.propTypes = {
  piece: PropTypes.object.isRequired,
  designer: PropTypes.object,
  projects: PropTypes.array,
  detailed: PropTypes.bool,
}

export default PieceSummary
