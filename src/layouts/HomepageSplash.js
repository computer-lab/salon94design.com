import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'emotion/react'
import cx from 'classnames'
import { breakpoint3 } from './emotion-base'
import { LOGO_ASPECT_RATIO, getLogoHeight, logoImageUrl } from './logo'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: none;
  opacity: 0;

  &.active {
    display: block;
    transition: opacity 0.3s;
  }

  &.visible {
    opacity: 1;
  }
`

const Content = styled.div`
  padding: 24px;
  text-align: center;
  cursor: pointer;
`

const SplashImage = styled.img`
  margin: 0;
  max-height: 75vh;
`

const Logo = styled.div`
  margin: 24px auto 36px auto;
  background-image: url(${logoImageUrl});
  background-size: 100% 100%;
  width: 280px;
  height: ${getLogoHeight(280)}px;

  @media (${breakpoint3}) {
    margin-top: 16px;
    width: 160px;
    height: ${getLogoHeight(160)}px;
  }
`

class HomepageSplash extends Component {
  constructor(props) {
    super(props)

    // this state song and dance ensures that the splash is always viewed
    // when the homepage is visited, but only once
    const homepage = props.location.pathname === '/'
    this.state = {
      hasVisitedHomepage: homepage,
      visible: homepage,
      active: homepage,
    }
  }

  componentDidMount() {
    this.updateBodyStyle()
  }

  componentDidUpdate() {
    const { hasVisitedHomepage } = this.state

    if (!hasVisitedHomepage) {
      const homepage = this.props.location.pathname === '/'
      if (homepage) {
        this.setState({
          hasVisitedHomepage: true,
          visible: true,
          active: true,
        })
      }
    }

    this.updateBodyStyle()
  }

  updateBodyStyle() {
    document.body.style.overflow = this.state.visible ? 'hidden' : ''
  }

  render() {
    const onContentClick = () => {
      if (this.state.visible) {
        this.setState({ visible: false })
        setTimeout(() => {
          this.setState({ active: false })
        }, 400)
      }
    }

    const containerClass = cx({
      visible: this.state.visible,
      active: this.state.active,
    })

    return (
      <Container className={containerClass}>
        <Content onClick={onContentClick}>
          <Logo />
          <SplashImage src={this.props.image} />
        </Content>
      </Container>
    )
  }
}

HomepageSplash.propTypes = {
  location: PropTypes.object.isRequired,
}

export default HomepageSplash
