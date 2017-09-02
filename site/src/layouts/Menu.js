import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'

import {
  baseUl,
  monofont,
  childLink,
  breakpoint1,
  breakpoint2,
} from './emotion-base'

const Wrapper = styled.div`
  position: fixed;
  top: 40px;
  right: 40px;
  color: #000;
  background: #fff;

  @media (${breakpoint1}) {
    right: auto;
    left: 50%;
    transform: translateX(-50%);
  }
`

const Nav = styled.ul`
  composes: ${baseUl} ${monofont};
  display: flex;
  font-size: 28px;

  @media (${breakpoint1}) {
    font-size: 22px;
  }

  @media (${breakpoint2}) {
    font-size: 18px;
  }
`

const NavItem = styled.li`
  composes: ${childLink};
  margin: 0;
  padding: 0;
  cursor: pointer;

  &:not(:first-child) {
    margin-left: 25px;
  }

  &.active a {
    border-bottom: 2px solid #000;
  }
`

const Menu = ({ location }) => {
  const navItems = [
    { name: 'Projects', path: '/projects' },
    { name: 'Designers', path: '/designers' },
    { name: 'Pieces', path: '/pieces' },
    { name: 'Info', path: '/info' },
  ].map(item => ({
    ...item,
    className: cx({ active: location.pathname.includes(item.path) }),
  }))

  return (
    <Wrapper>
      <Nav>
        {navItems.map(item =>
          <NavItem key={item.name} className={item.className}>
            <Link to={item.path}>
              {item.name}
            </Link>
          </NavItem>
        )}
      </Nav>
    </Wrapper>
  )
}

Menu.propTypes = {
  location: PropTypes.object,
}

export default Menu
