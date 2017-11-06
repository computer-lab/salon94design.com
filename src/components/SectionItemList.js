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
import { imageLargePath, imageSrcSet } from '../util'

const Container = styled.div`
  padding: 0 24px 0 24px;

  @media (${breakpoint3}) {
    padding: 0;
  }
`

const Section = styled.div`
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
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
  box-sizing: border-box;
  margin-right: -48px;

  @media (${breakpoint3}) {
    margin-right: 0;
  }
`

const ListItem = styled.li`
  margin: 0 44px 64px 0;
  width: 320px;
  height: 268px;

  & a {
    color: inherit;
    text-decoration: none;

    &:hover,
    &:focus {
      font-weight: 500;
    }
  }

  & img {
    background-color: #eee;
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
  }

  @media (${breakpoint1}) {
    width: 240px;
    height: 200px;
    margin: 0 20px 64px 0;
  }

  @media (${breakpoint3}) {
    margin: 0 0 32px 0;
    width: auto;
    height: auto;
    min-width: 50%;

    &.full-width-mobile {
      width: 100%;
    }

    & img {
      display: none;
    }
  }
`

const ItemTitle = styled.div`
  margin-top: 4px;
  font-size: 24px;

  @media (${breakpoint2}) {
    font-size: 22px;
  }

  @media (${breakpoint3}) {
    margin: 0;
    font-size: 32px;
    line-height: 48px;
  }
`

const ItemSubtitle = styled.div`
  margin-top: 2px;
  font-size: 18px;
  font-weight: 300;
  line-height: 1.28;

  @media (${breakpoint3}) {
    font-size: 16px;
  }
`

const SectionItemList = ({ sections, items, fullWidthMobile = true }) => {
  if (!sections) {
    sections = [{ title: null, items }]
  }

  return (
    <Container>
      {sections.map(({ title, items }, i) => (
        <Section key={i}>
          {title && <SectionTitle>{title}</SectionTitle>}
          <List>
            {items.map(({ image, alt = '', title, subtitle, link }, i) => (
              <ListItem
                key={i}
                className={cx({
                  'full-width-mobile': fullWidthMobile,
                })}
              >
                <Link to={link}>
                  <img
                    src={imageLargePath(image)}
                    srcSet={imageSrcSet(image)}
                    sizes={`320px, (${breakpoint1}): 240px`}
                    alt={alt}
                  />
                  <ItemTitle>
                    {title}
                    {subtitle && <ItemSubtitle>{subtitle}</ItemSubtitle>}
                  </ItemTitle>
                </Link>
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
}

export default SectionItemList
