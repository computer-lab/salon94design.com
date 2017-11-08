import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'

import { LOGO_ASPECT_RATIO, getLogoHeight, logoImageUrl } from '../layouts/logo'
import { baseUl, sansfont, childLink, breakpoint2, breakpoint3 } from '../layouts/emotion-base'

const menuBreakpoint2 = breakpoint2 // `max-width: 740px`
const menuBreakpoint3 = breakpoint3

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 84px;
  background: #fff;

  @media (${menuBreakpoint2}) {
    height: 72px;
  }
`

const Logo = styled.div`
  position: absolute;
  top: 50%;
  left: 28px;
  background-image: url(${logoImageUrl});
  background-size: 100% 100%;
  width: 150px;
  height: ${getLogoHeight(150)}px;
  transform: translateY(-50%);

  @media (${menuBreakpoint2}) {
    left: 12px;
    width: 100px;
    height: ${getLogoHeight(100)}px;
  }

  @media (${menuBreakpoint3}) {
    left: 5px;
    top: 5px;
    width: 72px;
    height: ${getLogoHeight(72)}px;
    transform: none;
  }
`

const Nav = styled.ul`
  composes: ${baseUl} ${sansfont};
  position: absolute;
  right: 40px;
  top: 50%;
  display: flex;
  font-size: 22px;
  font-weight: 300;
  line-height: 1;
  color: #000;
  transform: translateY(-50%);

  @media (${menuBreakpoint2}) {
    right: 24px;
    font-size: 18px;
  }

  @media (${menuBreakpoint3}) {
    right: auto;
    left: 50%;
    top: 48px;
    transform: translateX(-50%);
    font-size: 16px;
  }
`

const NavItem = styled.li`
  composes: ${childLink};
  margin: 0;
  padding: 0;
  cursor: pointer;
  flex-shrink: 0;

  &:not(:first-child) {
    margin-left: 24px;

    @media (${menuBreakpoint2}) {
      margin-left: 15px;
    }

    @media (${menuBreakpoint3}) {
      margin-left: 10px;
    }
  }

  &.active a {
    border-bottom: 2px solid #000;
  }
`

const Menu = ({ location }) => {
  let navItems = [
    { name: 'Designers', path: '/', activePath: '/designers' },
    { name: 'Exhibitions', path: '/exhibitions' },
    { name: 'Works', path: '/works' },
    { name: 'Fairs', path: '/fairs' },
    { name: 'Info', path: '/info' },
  ].map(item => {
    const active =
      location.pathname === item.path ||
      location.pathname.includes(item.activePath || item.path)

    return {
      ...item,
      className: cx({ active }),
    }
  })

  const includeLogo = true

  return (
    <Wrapper>
      {includeLogo && (
        <Link to={'/'}>
          <Logo />
        </Link>
      )}

      <Nav>
        {navItems.map(item => (
          <NavItem key={item.name} className={item.className}>
            <Link to={item.path}>{item.name}</Link>
          </NavItem>
        ))}
      </Nav>
    </Wrapper>
  )
}

Menu.propTypes = {
  location: PropTypes.object,
}

export default Menu
