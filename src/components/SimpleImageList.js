import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'emotion/react'

import { baseUl, sansfont, breakpoint3 } from '../layouts/emotion-base'
import FullscreenImageViewer from '../layouts/FullscreenImageViewer'

const List = styled.ul`
  composes: ${baseUl};

  & li {
    display: table;
    margin: 20px auto;

    & img {
      margin: 0;
      width: 100%;
      max-height: 100%;
      cursor: pointer;
    }
  }

  @media (${breakpoint3}) {
    & li {
      & img {
        width: 300px;
      }
    }
  }
`

const ImageCaption = styled.caption`
  composes: ${sansfont};
  text-align: left;
  caption-side: bottom;
  font-size: 16px;
`

class SimpleImageList extends Component {
  constructor(props) {
    super(props)

    this.fullscreenCloseHandler = this.fullscreenCloseHandler.bind(this)
    this.fullscreenChangeHandler = this.fullscreenChangeHandler.bind(this)
    this.state = {
      fullscreenImageIndex: -1,
    }
  }

  fullscreenCloseHandler() {
    this.setState({ fullscreenImageIndex: -1 })
  }

  fullscreenChangeHandler(delta) {
    const { images } = this.props
    const { fullscreenImageIndex } = this.state

    const nextImageIndex = fullscreenImageIndex + delta
    if (nextImageIndex >= images.length || nextImageIndex < 0) {
      return
    }

    this.setState({ fullscreenImageIndex: nextImageIndex })
  }

  render() {
    const { images = [], sizes = `50vw, (${breakpoint3}): 300px` } = this.props

    const { fullscreenImageIndex } = this.state
    const fullscreenImage = images[fullscreenImageIndex]

    return (
      <div>
        <List>
          {images.map(({ src, srcSet, title = null }, idx) => (
            <li
              key={idx}
              onClick={() => this.setState({ fullscreenImageIndex: idx })}
            >
              <img src={src} alt={title} srcSet={srcSet} sizes={sizes} />
              {title &&
                title.length > 0 && <ImageCaption>{title}</ImageCaption>}
            </li>
          ))}
        </List>

        {fullscreenImage && (
          <FullscreenImageViewer
            image={fullscreenImage}
            closeHandler={this.fullscreenCloseHandler}
            changeHandler={this.fullscreenChangeHandler}
            disableMagnifier={true}
          />
        )}
      </div>
    )
  }
}

SimpleImageList.propTypes = {
  images: PropTypes.array,
  sizes: PropTypes.string,
}

export default SimpleImageList
