import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import { sansfont, baseUl, breakpoint3 } from './emotion-base'

const Container = styled.div`
  padding: 0 24px 0 24px;

  @media (${breakpoint3}) {
    padding: 0;
  }
`

const Title = styled.h1`
  composes: ${sansfont};
  position: fixed;
  top: 24px;
  margin: 0;
  padding: 0;
  font-weight: 500;
  font-size: 44px;
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
  margin: 0 48px 64px 0;
  width: 320px;

  & a {
    color: inherit;
    text-decoration: none;

    &:hover,
    &:focus {
      font-weight: 500;
    }
  }

  & img {
    margin: 0;
    padding: 0;
    max-width: 320px;
    max-height: 280px;
  }

  @media (${breakpoint3}) {
    margin: 0 0 32px 0;
    width: 100%;

    & img {
      display: none;
    }
  }
`

const ItemTitle = styled.div`
  margin-top: 4px;
  font-size: 18px;

  @media (${breakpoint3}) {
    margin: 0;
    font-size: 32px;
    line-height: 48px;
  }
`

const ItemSubtitle = styled.div`
  font-size: 16px;
  font-weight: 300;
  line-height: 1.28;

  @media (${breakpoint3}) {
    font-size: 16px;
  }
`

function SectionItemList({ title, items }) {
  return (
    <Container>
      <List>
        {items.map(({ image, alt = '', title, subtitle, link }, i) =>
          <ListItem key={i}>
            <Link to={link}>
              <img src={image} alt={alt} />
              <ItemTitle>
                {title}
                {subtitle &&
                  <ItemSubtitle>
                    {subtitle}
                  </ItemSubtitle>}
              </ItemTitle>
            </Link>
          </ListItem>
        )}
      </List>
    </Container>
  )
}

SectionItemList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
}

export default SectionItemList
