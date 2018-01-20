import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { css } from 'emotion'
import styled from 'emotion/react'
import cx from 'classnames'
import Scroll from 'react-scroll'
import throttle from 'lodash.throttle'

import { ROOT_URL } from '../util'
import {
  monofont,
  sansfont,
  childLink,
  breakpoint1,
  breakpoint2,
  breakpoint3,
  minBreakpoint3,
  isMobileWidth,
  baseUl,
} from '../layouts/emotion-base'
import Helmet from './helmet'
import HoverInfo from './HoverInfo'
import FullscreenImageViewer from './FullscreenImageViewer'

const ImageSet = styled.div`
  &.not-first {
    margin-top: 30px;

    @media (${breakpoint3}) {
      margin-top: 10px;
    }
  }
`

const SetTitle = styled.h3`
  composes: ${sansfont};
  margin: 0 72px 28px 0;
  font-weight: 400;
  font-size: 28px;
  text-align: left;

  @media (${breakpoint1}) {
    text-align: left;
    font-size: 22px;
    margin: 0 0 28px 0;
  }

  @media (${breakpoint3}) {
    margin: 0 0 20px 0;
  }
`

const ImageContainer = styled.div`
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  justify-content: flex-start;
  -webkit-justify-content: flex-start;
  align-items: flex-start;
  -webkit-align-items: flex-start;
  box-sizing: border-box;

  &.center {
    justify-content: center;
    -webkit-justify-content: center;
  }
`

const scrollElementExpanded = css`
  width: 100%;
`

const ImageItem = styled.div`
  margin: 0 20px 20px 0;
  display: inline-block;
  width: 172px;
  text-align: center;

  & img {
    margin: 0;
    padding: 0;
    cursor: pointer;
    user-select: none;
    width: 100%;
    height: 129px;
    min-width: 100%;
    min-height: 100%;
    object-fit: cover;
  }

  &.with-small-text {
    text-align: left;
  }

  @media (${minBreakpoint3}) {
    &.expanded {
      display: table;
      margin: 0 0 20px 0;
      padding-right: 20px;
      max-width: none;
      width: auto;

      & img {
        cursor: default;
        cursor: crosshair;
        cursor: nesw-resize;
        cursor: zoom-in;

        object-fit: fill;
        width: auto;
        min-width: 0;
        max-width: 100%;
        height: auto;
        min-height: 0;
        max-height: calc(100vh - 160px);
      }
    }
  }

  @media (${breakpoint1}) {
    &.expanded {
      margin: 0 0 20px 0;

      & img {
        max-height: none;
      }
    }
  }

  @media (${breakpoint3}) {
    margin: 0 0 20px 0;
    max-width: none;
    width: 100%;

    & img {
      object-fit: fill;
      min-width: none;
      max-height: none;
      width: 100vw;
      height: auto;
      cursor: default;
    }
  }
`

const ImageTextWrapper = styled.div`
  composes: ${sansfont};

  @media (${minBreakpoint3}) {
    &.compact {
      & .expanded-text {
        display: none;
      }
    }

    &.expanded {
      display: table-caption;
      caption-side: bottom;
      padding: 0 20px 0 0;
      & .small {
        display: none;
      }
    }
  }

  @media (${breakpoint3}) {
    & .small {
      display: none;
    }
  }
`

const ImageTextItems = styled.ul`
  composes: ${baseUl};
  text-align: left;
`

const ImageText = styled.li`
  composes: ${childLink};
  text-align: left;
  min-width: 50%;
  font-size: 16px;
  font-weight: 300;
  line-height: 22px;
  margin-bottom: 6px;

  &.small {
    font-size: 12px;
    line-height: 1;
  }

  @media (${breakpoint2}) {
    font-size: 12px;
    line-height: 16px;
    width: auto;
  }

  @media (${breakpoint3}) {
    font-size: 8px;
    line-height: 10px;
  }
`

const ImageTextData = styled.span`
  display: block;
`

const ExpansionButton = styled.button`
  composes: ${monofont};
  position: fixed;
  z-index: 10;
  top: 22px;
  left: 33%;
  cursor: pointer;
  font-size: 16px;
  line-height: 1.25;
  background: none;
  border: none;
  outline: none;
  user-select: none;
  border-radius: 0;
  padding: 0;
  border-bottom: 2px solid #000;

  @media (${breakpoint1}) {
    left: auto;
    top: 48px;
    right: 10px;
    font-size: 14px;
  }

  @media (${breakpoint3}) {
    display: none;
  }
`

class ImageList extends Component {
  constructor(props) {
    super(props)

    this.setContainerEl = this.setContainerEl.bind(this)
    this.onImageHover = this.onImageHover.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onDocumentClick = this.onDocumentClick.bind(this)
    this.onResize = throttle(this.onResize.bind(this), 100)
    this.fullscreenImageViewerCloseHandler = this.fullscreenImageViewerCloseHandler.bind(
      this
    )
    this.fullscreenImageViewerChangeHandler = this.fullscreenImageViewerChangeHandler.bind(
      this
    )

    const windowSize = typeof window !== 'undefined'
      ? { width: window.innerWidth, height: window.innerHeight }
      : { width: 414, height: 736 } // default to phone size
    this.state = {
      isExpanded: props.alwaysExpand ? true : false,
      hoverImage: null,
      fullscreenImageIndices: null,
      mobileWidth: isMobileWidth(windowSize.width),
      windowSize
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('click', this.onDocumentClick)

    this.onResize()
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('click', this.onDocumentClick)
    window.removeEventListener('resize', this.onResize)
  }

  setContainerEl(el) {
    this.containerEl = el
  }

  onImageHover(hoverImage) {
    this.setState({ hoverImage: hoverImage || null })
  }

  onKeyDown(ev) {
    // if expanded and ESC pressed, unexpand
    if (
      this.state.isExpanded &&
      !this.state.fullscreenImageIndices &&
      ev.keyCode === 27
    ) {
      this.unexpand()
    }
  }

  onDocumentClick(ev) {
    const canUnexpand =
      this.state.isExpanded && !this.state.fullscreenImageIndices
    if (
      canUnexpand &&
      this.containerEl &&
      !this.containerEl.contains(ev.target)
    ) {
      this.unexpand()
    }
  }

  onResize() {
    this.setState({
      mobileWidth: isMobileWidth(window.innerWidth),
      windowSize: { width: window.innerWidth, height: window.innerHeight },
    })
  }

  fullscreenImageViewerCloseHandler() {
    setTimeout(() => {
      this.setState({
        fullscreenImageIndices: null,
      })
    }, 10)
  }

  fullscreenImageViewerChangeHandler(delta) {
    const { imageSets } = this.props
    const { setIndex, imageIndex } = this.state.fullscreenImageIndices

    let nextSetIndex = setIndex
    let nextImageIndex = imageIndex + delta

    // move to next set if necessary and possible
    if (nextImageIndex >= imageSets[nextSetIndex].images.length) {
      if (nextSetIndex >= imageSets.length - 1) {
        return
      }

      nextSetIndex += 1
      nextImageIndex = 0
    }

    // move to previous set if necessary and possible
    if (nextImageIndex < 0) {
      if (nextSetIndex === 0) {
        return
      }

      nextSetIndex -= 1
      nextImageIndex = imageSets[nextSetIndex].images.length - 1
    }

    this.setState({
      fullscreenImageIndices: {
        setIndex: nextSetIndex,
        imageIndex: nextImageIndex,
      },
    })
  }

  renderExpansionButton() {
    return null

    const { isExpanded } = this.state

    if (!isExpanded) {
      return null // no longer show the "O" open state
    }

    const onClick = () => {
      if (this.state.isExpanded) {
        this.unexpand()
      } else {
        this.setState({ isExpanded: true })
      }
    }

    return (
      <ExpansionButton onClick={onClick}>
        {isExpanded ? 'zoom out' : 'zoom in'}
      </ExpansionButton>
    )
  }

  onImageClick(ev, setIndex, imageIndex) {
    if (this.props.unexpandable) return

    if (this.state.mobileWidth) {
      return
    }

    if (this.state.isExpanded) {
      if (ev.target.nodeName === 'IMG') {
        this.setState({
          fullscreenImageIndices: { setIndex, imageIndex },
        })
      }

      return
    }

    this.setState(
      {
        isExpanded: true,
        hoverImage: null,
      },
      () => {
        this.scrollTo(`set-${setIndex}-image-${imageIndex}`, -90)
      }
    )
  }

  unexpand() {
    if (this.props.alwaysExpand) {
      return
    }

    this.setState({ isExpanded: false }, () => {
      this.scrollTo('set-0-image-0', -170) // scroll to top
    })
  }

  scrollTo(name, offset = 0) {
    Scroll.scroller.scrollTo(name, {
      duration: 100,
      smooth: true,
      offset,
    })
  }

  render() {
    const {
      imageSets,
      imageHoverEnabled = false,
      hoverImageRenderer,
      alwaysExpand,
      unexpandable,
      centerImages,
    } = this.props
    const {
      isExpanded,
      hoverImage,
      fullscreenImageIndices,
      mobileWidth,
      windowSize,
    } = this.state

    const hoverInfoClass = cx({
      hidden: !imageHoverEnabled || !hoverImage || !hoverImageRenderer,
    })

    const fullscreenImage = fullscreenImageIndices
      ? imageSets[fullscreenImageIndices.setIndex].images[
          fullscreenImageIndices.imageIndex
        ]
      : null

    const firstImage =
      imageSets.length > 0 && imageSets[0].images.length > 0
        ? imageSets[0].images[0]
        : null

    return (
      <section ref={this.setContainerEl}>
        {firstImage && (
          <Helmet
            meta={[
              { name: 'og:image', content: `${ROOT_URL}${firstImage.src}` },
            ]}
          />
        )}

        {!alwaysExpand && !unexpandable && this.renderExpansionButton()}

        {imageSets.map(({ images, title }, setIndex) => (
          <ImageSet
            key={setIndex}
            className={cx({ unexpandable, 'not-first': setIndex !== 0 })}
          >
            {title && <SetTitle>{title}</SetTitle>}

            <ImageContainer className={cx({ center: centerImages })}>
              {images.map((image, i) => {
                const {
                  src,
                  srcSet,
                  largeSize,
                  texts,
                  unexpandedLink,
                  alt = '',
                } = image

                const { width, height } = largeSize
                const landscape = width > height

                let sizes
                if (mobileWidth) {
                  const maxPixelRatio = landscape ? 2 : 1 // for tall images on mobile, don't load a large retina image
                  const devicePixelRatio = typeof window !== 'undefined' ? window.devicePixelRatio : 1
                  const widthDampingFactor = devicePixelRatio > maxPixelRatio ? (devicePixelRatio / maxPixelRatio) : 1
                  const w = (windowSize.width - 48) / widthDampingFactor // -48 to remove margin
                  sizes = `${w}px`
                } else if (isExpanded) {
                  if (landscape) {
                    sizes = 'calc(100vw - 400px)'
                  } else {
                    const w = (windowSize.height - 160) * (width / height)
                    sizes = `${Number(w.toFixed(2))}px` // 2 decimal precision
                  }
                } else {
                  sizes = '172px'
                }

                const onMouseEnter = isExpanded
                  ? null
                  : () => this.onImageHover(image)
                const onMouseLeave = isExpanded
                  ? null
                  : () => this.onImageHover(null)
                const img = (
                  <img
                    src={src}
                    alt={alt}
                    srcSet={srcSet}
                    sizes={sizes}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                  />
                )

                const scrollElementClass = isExpanded
                  ? scrollElementExpanded
                  : null
                const imageItemClass = cx({
                  expanded: isExpanded,
                  compact: !isExpanded,
                  'with-small-text': !isExpanded && texts && texts.smallText,
                })
                const textContainerClass = cx({
                  expanded: isExpanded,
                  compact: !isExpanded,
                })

                return (
                  <Scroll.Element
                    name={`set-${setIndex}-image-${i}`}
                    key={`image-${i}`}
                    className={scrollElementClass}
                  >
                    <ImageItem
                      className={imageItemClass}
                      onClick={ev => this.onImageClick(ev, setIndex, i)}
                    >
                      {isExpanded || !unexpandedLink ? (
                        img
                      ) : (
                        <Link to={unexpandedLink}>{img}</Link>
                      )}

                      {texts && (
                        <ImageTextWrapper className={textContainerClass}>
                          {texts.smallText && (
                            <ImageTextItems>
                              <ImageText className="small">
                                {texts.smallText}
                              </ImageText>
                            </ImageTextItems>
                          )}

                          <ImageTextItems>
                            {texts.items.map((text, i) => (
                              <ImageText className="expanded-text" key={i}>
                                {text}
                              </ImageText>
                            ))}
                          </ImageTextItems>
                        </ImageTextWrapper>
                      )}
                    </ImageItem>
                  </Scroll.Element>
                )
              })}
            </ImageContainer>
          </ImageSet>
        ))}

        <HoverInfo className={hoverInfoClass}>
          {hoverImage &&
            imageHoverEnabled &&
            hoverImageRenderer &&
            hoverImageRenderer(hoverImage)}
        </HoverInfo>

        {fullscreenImage && !mobileWidth && (
          <FullscreenImageViewer
            image={fullscreenImage}
            closeHandler={this.fullscreenImageViewerCloseHandler}
            changeHandler={this.fullscreenImageViewerChangeHandler}
          />
        )}
      </section>
    )
  }
}

ImageList.propTypes = {
  imageSets: PropTypes.array.isRequired,
  imageHoverEnabled: PropTypes.bool,
  hoverImageRenderer: PropTypes.func,
  alwaysExpand: PropTypes.bool,
  unexpandable: PropTypes.bool,
}

export default ImageList
