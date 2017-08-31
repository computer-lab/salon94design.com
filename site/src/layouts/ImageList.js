import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import Scroll from 'react-scroll'
import { monofont, sansfont, childLink } from './emotion-base'

const ImageSet = styled.div`margin-bottom: 60px;`

const SetTitle = styled.h3`
  composes: ${sansfont};
  margin: 0 72px 28px 0;
  font-weight: 400;
  font-size: 28px;
  text-align: right;
`

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
  box-sizing: border-box;
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
`

const ImageTextContainer = styled.div`
  composes: ${sansfont};
  display: flex;
  flex-wrap: wrap;
`

const ImageText = styled.div`
  composes: ${childLink};
  text-align: left;
  width: 50%;
  font-size: 18px;
  line-height: 28px;

  &.right {
    text-align: right;
  }

  &.primary {
    font-size: 24px;
  }

  &.small {
    width: 100%;
    font-size: 12px;
    line-height: 1;
  }
`

const ImageTextData = styled.span`
  display: inline-block;

  &:not(:last-child) {
    margin-right: 24px;
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
    if (this.state.isExpanded) return

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
    const { imageSets, onImageHover, alwaysExpand } = this.props
    const { isExpanded } = this.state

    return (
      <section>
        {!alwaysExpand && this.renderExpansionButton()}

        {imageSets.map(({ images, title }, setIndex) =>
          <ImageSet key={setIndex}>
            {title &&
              <SetTitle>
                {title}
              </SetTitle>}

            <ImageContainer>
              {images.map((image, i) => {
                const { src, texts, alt = '' } = image

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

                return (
                  <Scroll.Element
                    name={`set-${setIndex}-image-${i}`}
                    key={`image-${i}`}
                  >
                    <ImageItem
                      className={cx({ expanded: isExpanded })}
                      onClick={() => this.onImageClick(setIndex, i)}
                    >
                      {img}

                      {isExpanded &&
                        texts &&
                        <ImageTextContainer>
                          <ImageText className="left primary">
                            {texts.title}
                          </ImageText>
                          <ImageText className="right">
                            {texts.data.map(txt =>
                              <ImageTextData key={txt}>
                                {txt}
                              </ImageTextData>
                            )}
                          </ImageText>
                          <ImageText className="left">
                            {texts.caption}
                          </ImageText>
                          <ImageText className="right">
                            {texts.credit}
                          </ImageText>
                        </ImageTextContainer>}

                      {!isExpanded &&
                        texts &&
                        texts.smallText &&
                        <ImageTextContainer>
                          <ImageText className="small">
                            {texts.smallText}
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
  alwaysExpand: PropTypes.boolean,
}

export default ImageList
