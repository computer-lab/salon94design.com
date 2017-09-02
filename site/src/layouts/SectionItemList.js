import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import { sansfont, baseUl } from './emotion-base'

const Container = styled.div`padding: 24px 24px 64px 24px;`

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
`

const ItemTitle = styled.div`
  margin-top: 4px;
  font-size: 16px;
  white-space: pre-line;
`

function SectionItemList({ title, items }) {
  return (
    <Container>
      <Title>
        {title}
      </Title>
      <List>
        {items.map(({ image, alt = '', title, link }, i) =>
          <ListItem key={i}>
            <Link to={link}>
              <img src={image} alt={alt} />
              <ItemTitle>
                {title}
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
