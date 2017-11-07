import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { css } from 'emotion'
import styled from 'emotion/react'
import cx from 'classnames'
import Scroll from 'react-scroll'

import { ROOT_URL } from '../util'
import {
  monofont,
  sansfont,
  childLink,
  breakpoint1,
  breakpoint2,
  breakpoint3,
  isMobileWidth,
  baseUl
} from '../layouts/emotion-base'
import Helmet from './helmet'
import HoverInfo from './HoverInfo'
import FullscreenImageViewer from './FullscreenImageViewer'

const ImageSet = styled.div`
  &:not(:last-child) {
    margin-bottom: 60px;

    @media (${breakpoint1}) {
      margin-bottom: 30px;
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
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
  box-sizing: border-box;

  &.center {
    justify-content: center;
  }
`

const scrollElementExpanded = css`
  width: 100%;
`

const ImageItem = styled.div`
  margin: 0 20px 20px 0;
  display: inline-block;
  max-width: 144px;
  text-align: center;

  & img {
    margin: 0;
    padding: 0;
    max-width: 100%;
    max-height: 288px;
    cursor: pointer;
  }

  &.with-small-text {
    text-align: left;
    max-width: 172px;

    & img {
      max-height: 300px;
    }
  }

  &.expanded {
    display: table;
    padding-right: 20px;
    max-width: none;

    & img {
      cursor: default;
      cursor: crosshair;
      cursor: nesw-resize;
      cursor: zoom-in;
      min-width: 400px;
      max-width: 100%;
      max-height: calc(100vh - 200px);
    }
  }

  @media (${breakpoint1}) {
    &.expanded {
      margin: 0 0 20px 0;
    }
  }

  @media (${breakpoint3}) {
    margin: 0 0 20px 0;
    max-width: none;
    width: 100%;

    &.with-small-text {
      max-width: none;
      & img {
        max-height: none;
      }
    }

    &.expanded {
      padding-right: 0;
    }

    & img,
    &.expanded img {
      min-width: none;
      max-height: none;
      width: 100%;
      cursor: default;
    }
  }
`

const ImageTextWrapper = styled.div`
  composes: ${sansfont};

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

  @media (${breakpoint3}) {
    & .small {
      display: none;
    }

    &.compact .expanded-text {
      display: block;
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
  font-size: 24px;
  font-weight: 300;
  line-height: 28px;
  margin-bottom: 6px;

  &.small {
    font-size: 13px;
    line-height: 1;
  }

  @media (${breakpoint2}) {
    font-size: 16px;
    line-height: 24px;
    width: auto;
  }

  @media (${breakpoint3}) {
    line-height: 24px;
  }
`

const ImageTextData = styled.span`
  display: block;
`

const ExpansionButton = styled.button`
  composes: ${monofont};
  position: fixed;
  z-index: 10;
  height: 72px;
  right: 15px;
  bottom: 20px;
  cursor: pointer;
  font-size: 96px;
  background: none;
  border: none;
  outline: none;
  user-select: none;

  @media (${breakpoint1}) {
    bottom: 0;
    right: 0;
    font-size: 48px;
    height: 48px;
  }

  @media (${breakpoint3}) {
    display: none;
  }
`

class ImageList extends Component {
  constructor(props) {
    super(props)

    this.onImageHover = this.onImageHover.bind(this)
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onResize = this.onResize.bind(this)
    this.fullscreenImageViewerCloseHandler = this.fullscreenImageViewerCloseHandler.bind(
      this
    )
    this.fullscreenImageViewerChangeHandler = this.fullscreenImageViewerChangeHandler.bind(
      this
    )

    this.state = {
      isExpanded: props.alwaysExpand ? true : false,
      hoverImage: null,
      fullscreenImageIndices: null,
      mobileWidth: false,
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('resize', this.onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('resize', this.onResize)
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

  onResize() {
    const mobileWidth = isMobileWidth()
    if (mobileWidth !== this.state.mobileWidth) {
      this.setState({ mobileWidth })
    }
  }

  fullscreenImageViewerCloseHandler() {
    this.setState({
      fullscreenImageIndices: null,
    })
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
        {isExpanded ? 'x' : 'o'}
      </ExpansionButton>
    )
  }

  onImageClick(setIndex, imageIndex) {
    if (this.props.unexpandable) return

    if (this.state.isExpanded) {
      return this.setState({
        fullscreenImageIndices: { setIndex, imageIndex },
      })
    }

    this.setState(
      {
        isExpanded: true,
        hoverImage: null,
      },
      () => {
        this.scrollTo(`set-${setIndex}-image-${imageIndex}`, -24)
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
    } = this.state

    const hoverInfoClass = cx({ hidden: !imageHoverEnabled || !hoverImage || !hoverImageRenderer })

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
      <section>
        {firstImage && (
          <Helmet
            meta={[
              { name: 'og:image', content: `${ROOT_URL}${firstImage.src}` },
            ]}
          />
        )}

        {!alwaysExpand && !unexpandable && this.renderExpansionButton()}

        {imageSets.map(({ images, title }, setIndex) => (
          <ImageSet key={setIndex} className={cx({ unexpandable })}>
            {title && <SetTitle>{title}</SetTitle>}

            <ImageContainer className={cx({ center: centerImages })}>
              {images.map((image, i) => {
                const {
                  src,
                  srcSet,
                  width,
                  texts,
                  unexpandedLink,
                  alt = '',
                } = image

                let sizes = isExpanded || mobileWidth ? '' : '200px'

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
                      onClick={() => this.onImageClick(setIndex, i)}
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
                            {texts.items.map((text, i) =>
                              <ImageText className="expanded-text" key={i}>
                                {text}
                              </ImageText>
                            )}
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
          {hoverImage && imageHoverEnabled && hoverImageRenderer && hoverImageRenderer(hoverImage)}
        </HoverInfo>

        {fullscreenImage && (
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
