import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import {
  monofont,
  sansfont,
  selectorList,
  breakpoint1,
  breakpoint3,
} from '../layouts/emotion-base'

const Selector = styled.div`
  margin-top: 20px;
  padding: 0;
  background: #fff;
  transition: transform 0.2s ease;

  /* Goes into "hidden peek" mode */
  @media (${breakpoint1}) {
    margin-top: 0;
    padding: 16px 8px;
    position: fixed;
    top: 120px;
    right: 0;
    width: 128px;

    transform: translateX(100px);

    &.active {
      transform: none;
    }
  }

  /* Hides on mobile */
  @media (${breakpoint3}) {
    display: none;
  }
`

const SelectorTitle = styled.div`
  composes: ${sansfont};
  margin: 0 0 10px 0;
  padding: 0;
  font-weight: 400;
  font-size: 20px;
  letter-spacing: 0.5px;

  @media (${breakpoint1}) {
    display: none;
  }
`

const OptionSection = styled.div`
  &:not(:last-child) {
    margin-bottom: 24px;
  }
`

const OptionSectionTitle = styled.h3`
  composes: ${monofont};
  font-weight: bold;
  font-size: 22px;
  padding: 0;
  margin: 0;
`

const OptionList = styled.ul`
  composes: ${selectorList}, ${sansfont};
  font-size: 16px;
  font-weight: 100;

  & li {
    margin: 8px 0 0 0;
    padding: 0 20px 0 0;
    line-height: 1.25;
  }

  @media (${breakpoint1}) {
    font-size: 14px;

    & li {
      padding: 0;
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
    const { title, sections, currentItemLink } = this.props
    const { isActive } = this.state

    return (
      <Selector
        className={cx({ active: isActive })}
        onMouseEnter={this.onMouseEnter.bind(this)}
        onMouseLeave={this.onMouseLeave.bind(this)}
      >
        {title && <SelectorTitle>{title}</SelectorTitle>}
        {sections.map(({ title, items }, i) => (
          <OptionSection key={i}>
            {title && <OptionSectionTitle>{title}</OptionSectionTitle>}
            <OptionList>
              {items.map(item => (
                <li
                  key={item.link}
                  className={cx({
                    active: item.link === currentItemLink,
                  })}
                >
                  <Link to={item.link}>{item.title}</Link>
                </li>
              ))}
            </OptionList>
          </OptionSection>
        ))}
      </Selector>
    )
  }
}

HiddenSelector.propTypes = {
  title: PropTypes.string,
  sections: PropTypes.array.isRequired,
  currentItemLink: PropTypes.string.isRequired,
}

export default HiddenSelector
