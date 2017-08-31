import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { monofont, selectorList } from './emotion-base'

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
`

const DesignerList = styled.ul`
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

class DesignerSelector extends Component {
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
    const { currentDesignerSlug } = this.props
    const { isActive } = this.state

    // TODO: remove temporary designers
    const designers = [].concat(this.props.designers)
    for (let i = 3; i < 15; i++) {
      designers.push({
        slug: `designer-${i}`,
        name: `Designer ${i}`,
      })
    }

    return (
      <Container
        className={cx({ active: isActive })}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
      >
        <DesignerList>
          {designers.map(item =>
            <li
              key={item.slug}
              className={cx({
                active: item.slug === currentDesignerSlug,
              })}
            >
              <Link to={`/designers/${item.slug}`}>
                {item.name}
              </Link>
            </li>
          )}
        </DesignerList>
      </Container>
    )
  }
}

DesignerSelector.propTypes = {
  designers: PropTypes.array.isRequired,
  currentDesignerSlug: PropTypes.string.isRequired,
}

export default DesignerSelector
