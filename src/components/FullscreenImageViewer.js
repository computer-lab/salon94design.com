import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { css } from 'emotion'
import styled from 'emotion/react'

import ImageMagnifier from './ImageMagnifier'
import { monofont, breakpoint1, breakpoint3 } from '../layouts/emotion-base'

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  z-index: 30;

  @media (${breakpoint3}) {
    display: none;
  }
`

const CloseButton = styled.button`
  composes: ${monofont};
  position: fixed;
  z-index: 10;
  right: 15px;
  bottom: 20px;
  cursor: pointer;
  font-size: 96px;
  height: 72px;
  background: none;
  border: none;
  outline: none;
  user-select: none;

  @media (${breakpoint1}) {
    bottom: 30px;
    right: 0;
  }
`

const ImageWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const smallImageClass = css`
  max-width: 95vw;
  max-height: 95vh;
  margin: 0;
`

class FullscreenImageViewer extends Component {
  constructor(props) {
    super(props)

    this.onKeyDown = this.onKeyDown.bind(this)
    this.onMouseMove = this.onMouseMove.bind(this)
    this.onResize = this.onResize.bind(this)
    this.onSmallImageLoad = this.onSmallImageLoad.bind(this)

    this.state = Object.assign(this.propsToState(props), {
      mouse: { x: 0, y: 0 },
    })
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.propsToState(nextProps))
  }

  propsToState(props) {
    return {
      smallImageLoaded: false,
      zoomOffset: { x: -1, y: -1 },
      smallImageSize: {
        width: props.image.size ? props.image.size.width : 0,
        height: props.image.size ? props.image.size.height : 0,
      },
      largeImageSize: props.image.largeSize || null,
    }
  }

  componentDidMount() {
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    document.body.style.overflow = ''

    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('resize', this.onResize)
  }

  onKeyDown(ev) {
    switch (ev.keyCode) {
      case 27: // escape
        this.props.closeHandler()
        break

      case 37: // left arrow
        this.props.changeHandler(-1)
        break

      case 39: // right arrow
        this.props.changeHandler(1)
        break
    }
  }

  onMouseMove(e) {
    var offset = this.smallImageEl.getBoundingClientRect()

    this.setState({
      mouse: {
        x: e.clientX,
        y: e.clientY,
      },
      zoomOffset: {
        x: e.clientX - offset.left,
        y: e.clientY - offset.top,
      },
    })
  }

  onResize() {
    if (this.state.smallImageLoaded) {
      this.setSmallImageDimensionState()
    }
  }

  onSmallImageLoad() {
    this.setSmallImageDimensionState()

    this.setState({
      smallImageLoaded: true,
    })

    if (!this.state.largeImageSize) {
      this.setState({
        largeImageSize: {
          width: this.smallImageEl.naturalWidth,
          height: this.smallImageEl.naturalHeight,
        },
      })
    }
  }

  setSmallImageDimensionState() {
    this.setState({
      smallImageSize: {
        width: this.smallImageEl.offsetWidth,
        height: this.smallImageEl.offsetHeight,
      },
    })
  }

  render() {
    const { image, closeHandler, disableMagnifier } = this.props
    const { smallImageSize, largeImageSize, mouse, zoomOffset } = this.state

    const showMagnifier =
      !disableMagnifier &&
      largeImageSize &&
      (largeImageSize.width > smallImageSize.width ||
        largeImageSize.height > smallImageSize.height)

    return (
      <Container>
        <ImageWrapper>
          <img
            className={smallImageClass}
            src={image.src}
            alt={image.alt}
            srcSet={image.srcSet}
            sizes={'100vw'}
            onLoad={this.onSmallImageLoad}
            ref={el => {
              this.smallImageEl = el
            }}
          />
        </ImageWrapper>

        {showMagnifier && (
          <ImageMagnifier
            largeImageSrc={image.largeSrc || image.src}
            largeImageSize={largeImageSize}
            smallImageSize={smallImageSize}
            position={mouse}
            offset={zoomOffset}
          />
        )}

        <CloseButton onClick={closeHandler}>x</CloseButton>
      </Container>
    )
  }
}

FullscreenImageViewer.propTypes = {
  image: PropTypes.object.isRequired,
  closeHandler: PropTypes.func.isRequired,
  changeHandler: PropTypes.func.isRequired,
  disableMagnifier: PropTypes.bool,
}

export default FullscreenImageViewer
