import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import {
  sansfont,
  baseUl,
  breakpoint1,
  breakpoint2,
  breakpoint3,
} from '../layouts/emotion-base'

const customBreakpoint1 = `max-width: 848px`
const customBreakpoint3 = `max-width: 600px`

const Container = styled.div`
  padding: 0;
`

const Section = styled.div`
  :first-child {
    margin: auto;

    @media (${breakpoint3}) {
      margin-top: 20px;
    }
  }

  &:not(:first-child) {
    margin-top: 60px;

    @media (${breakpoint3}) {
      margin-top: 40px;
    }
  }
`

const SectionTitle = styled.h1`
  composes: ${sansfont};
  margin: 0 72px 28px 0;
  padding: 0;
  font-weight: 600;
  font-size: 36px;

  @media (${breakpoint2}) {
    font-size: 28px;
    margin: 0 0 28px 0;
  }

  @media (${breakpoint3}) {
    font-size: 46px;
  }
`

const List = styled.ul`
  composes: ${baseUl}, ${sansfont};
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  justify-content: flex-start;
  -webkit-justify-content: flex-start;
  align-items: flex-start;
  -webkit-align-items: flex-start;
  box-sizing: border-box;
  max-width: calc(100vw - 48px);
  position: relative;

  @media (${breakpoint3}) {
    position: static;
  }
`

const ListItem = styled.li`
  margin: 0 0 44px 0;
  width: 33%;
  box-sizing: border-box;

  & .content {
    margin: 0 22px;

    &:hover,
    &:focus {
      & .title {
        text-decoration: underline;
      }
    }

    & a {
      color: inherit;
      text-decoration: none;

      &:hover,
      &:focus {
        font-weight: 500;
      }
    }
  }

  @media (${customBreakpoint1}) {
    width: 50%;
  }

  @media (${customBreakpoint3}) {
    margin-bottom: 32px;
    width: 100%;

    & .content {
      margin: 0;
    }
  }

  &.no-columns {
    text-align: center;
    width: 100%;
    margin-bottom: 32px;
  }
`

const ItemTitle = styled.div`
  margin-top: 4px;
  font-size: 24px;

  @media (${customBreakpoint3}) {
    line-height: 36px;
  }
`

const ItemSubtitle = styled.div`
  margin: 4px 0;
  font-size: 16px;
  line-height: 1.2;
`

const ItemDescription = styled.div`
  margin-top: 6px;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.28;
  max-width: 350px;

  @media (max-width: ${customBreakpoint1}) {
    max-width: 400px;
  }

  @media (${customBreakpoint3}) {
    max-width: none;
    margin-top: 0;
    font-size: 16px;
  }
`

const MaxSubtitleLength = 140
const clipDescription = text => {
  const cleanText = text.replace(/<[^>]+>/g, '') // strip html tags

  if (cleanText.length <= MaxSubtitleLength) {
    return cleanText
  }

  const firstClippedSpaceIdx = cleanText.indexOf(' ', MaxSubtitleLength)
  const substrIdx = firstClippedSpaceIdx >= 0 ? firstClippedSpaceIdx : MaxSubtitleLength
  return `${cleanText.substr(0, substrIdx)}...`
}

const SectionItemList = ({ sections, items, disableColumns = false, centered = false }) => {
  if (!sections) {
    sections = [{ title: null, items }]
  }

  const noColumnsClass = cx({ 'no-columns': disableColumns })

  return (
    <Container style={ centered ? {margin: 'auto'} : null}>
      {sections.map(({ title, items }, i) => (
        <Section key={i}>
          {title && <SectionTitle>{title}</SectionTitle>}
          <List className={noColumnsClass}>
            {items.map(({ title, subtitle, description, link }, i) => (
              <ListItem key={i} className={noColumnsClass}>
                <div className="content">
                  <Link to={link}>
                    <ItemTitle>
                      <span className="title">{title}</span>
                      {subtitle && <ItemSubtitle>{subtitle}</ItemSubtitle>}
                      {description && <ItemDescription>{clipDescription(description)}</ItemDescription>}
                    </ItemTitle>
                  </Link>
                </div>
              </ListItem>
            ))}
          </List>
        </Section>
      ))}
    </Container>
  )
}

SectionItemList.propTypes = {
  items: PropTypes.array,
  sections: PropTypes.array,
  disableColumns: PropTypes.bool,
  centered: PropTypes.bool
}

export default SectionItemList
