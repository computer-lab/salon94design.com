import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { css } from 'emotion'
import styled from 'emotion/react'
import cx from 'classnames'
import Scroll from 'react-scroll'
import {
  monofont,
  sansfont,
  childLink,
  breakpoint1,
  breakpoint2,
  breakpoint3,
} from './emotion-base'

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
  text-align: right;

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

const ImageItem = styled.div`
  margin: 0 20px 20px 0;
  display: inline-block;

  & img {
    margin: 0;
    padding: 0;
    max-width: 144px;
    max-height: 144px;
    cursor: pointer;
  }

  &.expanded {
    padding-right: 20px;

    & img {
      max-width: 100%;
      max-height: 100%;
      cursor: default;
    }
  }

  @media (${breakpoint3}) {
    margin: 0 0 20px 0;

    &.expanded {
      padding-right: 0;
    }

    & img,
    &.expanded img {
      max-width: none;
      max-height: none;
      width: 100%;
      cursor: default;
    }
  }
`

const ImageTextContainer = styled.div`
  composes: ${sansfont};
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;

  &.compact {
    & .expanded-text {
      display: none;
    }
  }

  &.expanded {
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

const ImageText = styled.div`
  composes: ${childLink};
  text-align: left;
  width: 50%;
  min-width: 50%;
  font-size: 20px;
  font-weight: 300;
  line-height: 28px;

  &.right {
    text-align: right;
  }

  &.primary {
    font-size: 24px;
    order: -3;
  }

  &.credit {
    order: -2;
  }

  &.caption {
    order: -1;
  }

  &.small {
    width: 100%;
    font-size: 13px;
    line-height: 1;
  }

  @media (${breakpoint2}) {
    font-size: 16px;
    line-height: 24px;
    width: auto;

    &.caption {
      width: 75%;
      text-align: right;
    }

    &.data-texts {
      width: 75%;
      text-align: right;
      margin-top: 2px;
    }
  }

  @media (${breakpoint3}) {
    line-height: 24px;

    &.primary {
      font-size: 19px;
    }
  }
`

const ImageTextData = styled.span`
  display: inline-block;

  &:not(:first-child) {
    margin-left: 24px;

    @media (${breakpoint1}) {
      margin-left: 18px;
    }

    @media (${breakpoint3}) {
      margin-left: 10px;
    }
  }
`

const ExpansionButton = styled.button`
  composes: ${monofont};
  position: fixed;
  right: 50px;
  bottom: 50px;
  cursor: pointer;
  font-size: 96px;
  background: none;
  border: none;
  outline: none;
  user-select: none;

  @media (${breakpoint1}) {
    bottom: 30px;
    right: 0;
  }

  @media (${breakpoint3}) {
    display: none;
  }
`

class ImageList extends Component {
  constructor(props) {
    super(props)

    this.onKeyDown = this.onKeyDown.bind(this)

    this.state = {
      isExpanded: props.alwaysExpand ? true : false,
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown)
  }

  onKeyDown(ev) {
    // if expanded and ESC pressed, unexpand
    if (this.state.isExpanded && ev.keyCode === 27) {
      this.unexpand()
    }
  }

  renderExpansionButton() {
    const { isExpanded } = this.state

    if (!isExpanded) {
      return null // no longer show the "O" open state
    }

    const onClick = () => {
      if (!this.state.isExpanded) {
        this.setState({ isExpanded: true })
      } else {
        this.unexpand()
      }
    }

    return (
      <ExpansionButton onClick={onClick}>
        {isExpanded ? 'x' : 'o'}
      </ExpansionButton>
    )
  }

  onImageClick(setIndex, imageIndex) {
    if (this.props.unexpandable || this.state.isExpanded) return

    if (this.props.onImageHover) {
      this.props.onImageHover(null)
    }

    this.setState({ isExpanded: true }, () => {
      this.scrollTo(`set-${setIndex}-image-${imageIndex}`, -24)
    })
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
      onImageHover,
      alwaysExpand,
      unexpandable,
      centerImages,
    } = this.props
    const { isExpanded } = this.state

    return (
      <section>
        {!alwaysExpand && !unexpandable && this.renderExpansionButton()}

        {imageSets.map(({ images, title }, setIndex) =>
          <ImageSet key={setIndex} className={cx({ unexpandable })}>
            {title &&
              <SetTitle>
                {title}
              </SetTitle>}

            <ImageContainer className={cx({ center: centerImages })}>
              {images.map((image, i) => {
                const { src, texts, unexpandedLink, alt = '' } = image

                const onMouseEnter =
                  isExpanded || !onImageHover ? null : () => onImageHover(image)
                const onMouseLeave =
                  isExpanded || !onImageHover ? null : () => onImageHover(null)
                const img = (
                  <img
                    src={src}
                    alt={alt}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                  />
                )

                const textContainerClass = cx({
                  expanded: isExpanded,
                  compact: !isExpanded,
                })

                return (
                  <Scroll.Element
                    name={`set-${setIndex}-image-${i}`}
                    key={`image-${i}`}
                  >
                    <ImageItem
                      className={cx({ expanded: isExpanded })}
                      onClick={() => this.onImageClick(setIndex, i)}
                    >
                      {isExpanded || !unexpandedLink
                        ? img
                        : <Link to={unexpandedLink}>
                            {img}
                          </Link>}

                      {texts &&
                        <ImageTextContainer className={textContainerClass}>
                          {texts.smallText &&
                            <ImageText className="small">
                              {texts.smallText}
                            </ImageText>}

                          <ImageText className="expanded-text left primary">
                            {texts.title}
                          </ImageText>
                          <ImageText className="expanded-text right data-texts">
                            {texts.data.map(txt =>
                              <ImageTextData key={txt}>
                                {txt}
                              </ImageTextData>
                            )}
                          </ImageText>
                          <ImageText className="expanded-text left caption">
                            {texts.caption}
                          </ImageText>
                          <ImageText className="expanded-text right credit">
                            {texts.credit}
                          </ImageText>
                        </ImageTextContainer>}
                    </ImageItem>
                  </Scroll.Element>
                )
              })}
            </ImageContainer>
          </ImageSet>
        )}
      </section>
    )
  }
}

ImageList.propTypes = {
  imageSets: PropTypes.array.isRequired,
  onImageHover: PropTypes.func,
  alwaysExpand: PropTypes.bool,
  unexpandable: PropTypes.bool,
}

export default ImageList
