import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import Scroll from 'react-scroll'
import { monofont, sansfont, baseUl } from './emotion-base'

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

  &.expanded {
    margin: 0 0 20px 0;
  }

  &.expanded img {
    max-width: 100%;
    max-height: calc(100vh - 80px);
  }
`

const ImageTextContainer = styled.div`
  composes: ${sansfont};
  display: flex;
`

const ImageText = styled.div`
  width: 50%;
  text-align: left;

  &.right {
    text-align: right;
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
`

class ImageList extends Component {
  constructor(props) {
    super(props)

    this.onKeyDown = this.onKeyDown.bind(this)

    this.state = {
      isExpanded: false
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

    this.setState({ isExpanded: true }, () => {
      Scroll.scroller.scrollTo(`image-${i}`, {
        duration: 100,
        smooth: true,
        offset: -24
      })
    })
  }

  render() {
    const { images } = this.props
    const { isExpanded } = this.state

    return (
      <div>
        {this.renderExpansionButton()}

        <ImageContainer>
          {images.map(({ src, linkPath, leftText, rightText, alt = '' }, i) => {
            const img = <img src={src} alt={alt} />
            return (
              <Scroll.Element name={`image-${i}`} key={`image-${i}`}>
                <ImageItem className={cx({ expanded: isExpanded })} onClick={() => this.onImageClick(i)}>
                  { isExpanded && linkPath
                    ? <Link to={linkPath}>{img}</Link>
                    : img
                  }

                  { isExpanded &&
                    <ImageTextContainer>
                      <ImageText className="left">{leftText}</ImageText>
                      <ImageText className="right">{rightText}</ImageText>
                    </ImageTextContainer>
                  }
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
  images: PropTypes.array.isRequired
}

export default ImageList
