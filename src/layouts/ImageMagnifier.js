import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'emotion/react'

const Container = styled.div`
  position: fixed;
  backgroundcolor: #fff;
  box-shadow: 1px 1px 6px rgba(0, 0, 0, 0.5);
`

const ImageMagnifier = props => {
  const {
    smallImageSize,
    largeImageSrc,
    largeImageSize,
    offset,
    position,
    size = 240,
    cursorOffset = { x: 0, y: 0 },
  } = props

  const halfSize = size / 2
  const magX = largeImageSize.width / smallImageSize.width
  const magY = largeImageSize.height / smallImageSize.height
  const bgX = -(offset.x * magX - halfSize)
  const bgY = -(offset.y * magY - halfSize)
  const isVisible =
    offset.y < smallImageSize.height &&
    offset.x < smallImageSize.width &&
    offset.y > 0 &&
    offset.x > 0

  return (
    <Container
      style={{
        display: isVisible ? 'block' : 'none',
        left: position.x,
        top: position.y,
        width: size,
        height: size,
        borderRadius: size,
        marginLeft: -halfSize + cursorOffset.x,
        marginTop: -halfSize + cursorOffset.y,
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${largeImageSrc})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: `${bgX}px ${bgY}px`,
          borderRadius: size,
        }}
      />
    </Container>
  )
}

ImageMagnifier.propTypes = {
  // the size of the non-zoomed-in image
  smallImageSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,

  // the size of the zoomed-in image
  largeImageSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  }).isRequired,

  // src of the zoomed-in image
  largeImageSrc: PropTypes.string,

  // posiiton on screen
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,

  // posiiton relative to image
  offset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }).isRequired,

  // the size of the magnifier window
  size: PropTypes.number,

  // the offset of the zoom bubble from the cursor
  cursorOffset: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
  }),
}

export default ImageMagnifier
