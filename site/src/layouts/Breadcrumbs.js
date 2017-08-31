import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'emotion/react'
import cx from 'classnames'

import { baseUl, monofont } from './emotion-base'

const Container = styled.div`
  position: fixed;
  top: 2px;
  right: 2px;
`

const BreadcrumbList = styled.ul`
  composes: ${baseUl}, ${monofont};
  display: flex;
  font-size: 9px;
`

const Breadcrumb = styled.li`
  margin: 0 5px;
  line-height: 1;
  cursor: pointer;
  user-select: none;
  color: #888;

  &:hover,
  &:focus {
    color: #000;
  }

  &.active {
    cursor: auto;
    background: #ff0;
    color: #000;
  }

  &:not(:last-child)::after {
    margin-left: 10px;
    content: "->";
    font-weight: bold;
    color: #000;
  }
`

class Breadcrumbs extends Component {
  constructor (props) {
    super(props)

    this.state = {
      breadcrumbs: [],
      listening: true
    }
  }

  pushLocation (location) {
    const { breadcrumbs } = this.state
    this.setState({
      breadcrumbs: breadcrumbs.concat([location])
    })
  }

  popLocation () {
    const { breadcrumbs } = this.state
    this.setState({
      breadcrumbs: breadcrumbs.length > 0 ? breadcrumbs.slice(0, breadcrumbs.length - 1) : []
    })
  }

  onBreadCrumbClick(index) {
    // when item is clicked, go backwards to that point in browser history
    const { history } = this.props
    const { breadcrumbs } = this.state
    if (index === breadcrumbs.length - 1) {
      return
    }

    this.setState({
      listening: false,
      breadcrumbs: breadcrumbs.slice(0, index + 1)
    }, () => {
      history.go(index + 1 - breadcrumbs.length)
      setTimeout(() => {
        this.setState({ listening: true })
      }, 10)
    })

  }

  componentDidMount() {
    const { history } = this.props

    // push initial path to breadcrumbs
    this.pushLocation(history.location)

    // listen for history changes to maintain breadcrumbs
    history.listen((location, action) => {
      const { breadcrumbs, listening } = this.state
      if (!listening) {
        return
      }

      switch (action) {
        case 'PUSH':
          this.pushLocation(location);
          break;
        case 'POP':
          if (breadcrumbs.findIndex(l => l.key === location.key) === breadcrumbs.length - 2) {
            // backwards pop
            this.popLocation();
          } else {
            // browser forward button pop
            this.pushLocation(location);
          }
          break;
        default:
          break;
      }
    })
  }

  render() {
    const { breadcrumbs } = this.state

    const maxDisplay = 5
    const displayBreadcrumbs = breadcrumbs.length <= maxDisplay ? breadcrumbs : breadcrumbs.slice(breadcrumbs.length - maxDisplay)

    return (
      <Container>
        <BreadcrumbList>
          {displayBreadcrumbs.map((location, index) =>
            <Breadcrumb
              key={index}
              onClick={() => this.onBreadCrumbClick(index)}
              className={cx({ active: index === displayBreadcrumbs.length - 1})}
            >
              {location.pathname}
            </Breadcrumb>
          )}
        </BreadcrumbList>
      </Container>
    )
  }
}

Breadcrumbs.propTypes = {
  history: PropTypes.object
}

export default Breadcrumbs
