import React from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'

import { baseUl, monofont } from './emotion-base'

const Wrapper = styled.div`
  position: fixed;
  top: 40px;
  right: 40px;
`

const Nav = styled.ul`
  composes: ${baseUl} ${monofont};
  display: flex;
  font-size: 28px;
  color: #000;
`

const NavItem = styled.li`
  margin: 0;
  padding: 0;
  cursor: pointer;

  &:hover,
  &:focus,
  &.active {
    border-bottom: 2px solid #000;
  }

  &:not(:first-child) {
    margin-left: 25px;
  }

  & a {
    color: inherit;
    text-decoration: inherit;
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
