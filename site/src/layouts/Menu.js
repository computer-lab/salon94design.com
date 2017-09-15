import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'

import { LOGO_ASPECT_RATIO, getLogoHeight, logoImageUrl } from '../layouts/logo'

import {
  baseUl,
  monofont,
  childLink,
  breakpoint2,
  breakpoint3,
} from './emotion-base'

const menuBreakpoint1 = `max-width: 660px`

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 72px;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
`

const Logo = styled.div`
  position: absolute;
  top: 50%;
  left: 28px;
  background-image: url(${logoImageUrl});
  background-size: 100% 100%;
  width: 120px;
  height: ${getLogoHeight(120)}px;
  transform: translateY(-50%);

  @media (${menuBreakpoint1}) {
    width: 80px;
    height: ${getLogoHeight(80)}px;
  }

  @media (${breakpoint3}) {
    left: 5px;
    top: 5px;
    width: 60px;
    height: ${getLogoHeight(60)}px;
    transform: none;
  }
`

const Nav = styled.ul`
  composes: ${baseUl} ${monofont};
  position: absolute;
  right: 40px;
  top: 50%;
  display: flex;
  font-size: 28px;
  color: #000;
  transform: translateY(-50%);

  @media (${menuBreakpoint1}) {
    right: 24px;
    font-size: 18px;
  }

  @media (${breakpoint3}) {
    right: auto;
    left: 50%;
    top: 38px;
    transform: translateX(-50%);
    font-size: 22px;
    font-size: 16px;
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

  const includeLogo = true // location.pathname === '/'

  return (
    <Wrapper>
      {includeLogo && <Logo width={120} />}

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
