import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { monofont, selectorList, breakpoint3 } from './emotion-base'

const Container = styled.div`
  position: fixed;
  top: 120px;
  right: 0;
  padding: 16px 8px;
  border: 2px solid #000;
  width: 128px;
  background: #fff;

  transform: translateX(100px);
  transition: transform 0.2s ease;

  &.active {
    transform: none;
  }

  @media (${breakpoint3}) {
    display: none;
  }
`

const OptionList = styled.ul`
  composes: ${selectorList}, ${monofont};
  font-size: 14px;

  & li {
    margin: 0;
    padding: 0;
    line-height: 1.25;

    &:not(:last-child) {
      margin-bottom: 12px;
    }
  }
`

class HiddenSelector extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isActive: true,
      lastActivationTime: Date.now(),
    }
  }

  componentDidMount() {
    // hide self after initial peek
    setTimeout(() => {
      this.setState({ isActive: false })
    }, 1200)
  }

  onMouseEnter() {
    this.setState({
      isActive: true,
      lastActivationTime: Date.now(),
    })
  }

  onMouseLeave() {
    // before hiding, allow a buffer for user to re-enter the container
    clearTimeout(this.leaveTimeout)
    this.leaveTimeout = setTimeout(() => {
      if (Date.now() - this.state.lastActivationTime > 300) {
        this.setState({ isActive: false })
      }
    }, 300)
  }

  render() {
    const { items, currentItemLink } = this.props
    const { isActive } = this.state

    return (
      <Container
        className={cx({ active: isActive })}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
      >
        <OptionList>
          {items.map(item =>
            <li
              key={item.link}
              className={cx({
                active: item.link === currentItemLink,
              })}
            >
              <Link to={item.link}>
                {item.title}
              </Link>
            </li>
          )}
        </OptionList>
      </Container>
    )
  }
}

HiddenSelector.propTypes = {
  items: PropTypes.array.isRequired,
  currentItemLink: PropTypes.string.isRequired,
}

export default HiddenSelector
