import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import styled from 'emotion/react'
import cx from 'classnames'
import { monofont, sansfont, baseUl } from './emotion-base'

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-end;
`

const ImageItem = styled.div`
  margin: 10px;
  cursor: pointer;

  & img {
    max-width: 144px;
    max-height: 144px;
  }
`

const ImageText = styled.div`

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

    this.state = {
      isExpanded: false
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

  render() {
    const { images } = this.props
    const { isExpanded } = this.state

    return (
      <div>
        {this.renderExpansionButton()}

        <ImageContainer>
          {images.map(({ src, text, alt = '' }, i) =>
            <ImageItem key={`${src}-${i}`}>
              <img src={src} alt={alt} />
              { isExpanded &&
                <ImageText>{text}</ImageText>
              }
            </ImageItem>
          )}
        </ImageContainer>
      </div>
    )
  }
}

ImageList.propTypes = {
  images: PropTypes.array.isRequired
}

export default ImageList
