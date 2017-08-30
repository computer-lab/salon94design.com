import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import Scroll from 'react-scroll'
import { monofont, sansfont, childLink } from './emotion-base'

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
  box-sizing: border-box;
`

const ImageItem = styled.div`
  margin: 0 20px 20px 0;

  & img {
    margin: 0;
    padding: 0;
    max-width: 144px;
    max-height: 144px;
    cursor: pointer;
  }

  &.expanded img {
    max-width: 100%;
    max-height: calc(100vh - 108px);
    cursor: default;
  }
`

const ImageTextContainer = styled.div`
  composes: ${sansfont};
  display: flex;
  flex-wrap: wrap;
`

const ImageText = styled.div`
  composes: ${childLink};
  width: 50%;
  text-align: left;
  white-space: pre-line;

  &.right {
    text-align: right;
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
      isExpanded: false,
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
      this.setState({ isExpanded: false })
    }
  }

  renderExpansionButton() {
    const { isExpanded } = this.state
    const onClick = () => this.setState({ isExpanded: !isExpanded })
    return (
      <ExpansionButton onClick={onClick}>
        {isExpanded ? 'x' : 'o'}
      </ExpansionButton>
    )
  }

  onImageClick(i) {
    if (this.state.isExpanded) return

    if (this.props.onImageHover) {
      this.props.onImageHover(null)
    }

    this.setState({ isExpanded: true }, () => {
      Scroll.scroller.scrollTo(`image-${i}`, {
        duration: 100,
        smooth: true,
        offset: -24,
      })
    })
  }

  render() {
    const { images, onImageHover } = this.props
    const { isExpanded } = this.state

    return (
      <div>
        {this.renderExpansionButton()}

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
              <Scroll.Element name={`image-${i}`} key={`image-${i}`}>
                <ImageItem
                  className={cx({ expanded: isExpanded })}
                  onClick={() => this.onImageClick(i)}
                >
                  {img}

                  {isExpanded && texts &&
                    <ImageTextContainer>
                      <ImageText className="left">
                        {texts.title}
                      </ImageText>
                      <ImageText className="right">
                        {texts.data.map(txt => <ImageTextData key={txt}>{txt}</ImageTextData>)}
                      </ImageText>
                      <ImageText className="left">
                        {texts.caption}
                      </ImageText>
                      <ImageText className="right">
                        {texts.credit}
                      </ImageText>
                    </ImageTextContainer>}
                </ImageItem>
              </Scroll.Element>
            )
          })}
        </ImageContainer>
      </div>
    )
  }
}

ImageList.propTypes = {
  images: PropTypes.array.isRequired,
  onImageHover: PropTypes.func,
}

export default ImageList
