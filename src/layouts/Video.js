import React from 'react'
import styled from 'emotion/react'

import { sansfont, breakpoint1, breakpoint2, breakpoint3 } from './emotion-base'

const VideoWrapper = styled.div`
  margin-bottom: 40px;
  margin-right: 40px;

  & iframe {
    margin: 0;
    width: 100%;
    max-width: 1024px;
    height: 576px;
  }

  @media (${breakpoint1}) {
    margin-right: 20px;

    & iframe {
      max-width: 800px;
      height: 400px;
    }
  }

  @media (${breakpoint2}) {
    & iframe {
      height: 300px;
    }
  }

  @media (${breakpoint3}) {
    margin-right: 0;

    & iframe {
      height: 240px;
    }
  }
`

const Caption = styled.p`
  composes: ${sansfont};
  margin: 0;
  padding: 0;
  font-size: 20px;
  font-weight: 300;
  line-height: 28px;

  @media (${breakpoint2}) {
    font-size: 16px;
    line-height: 24px;
  }
`

const vimeoEmbed = videoId => (
  <iframe
    src={`https://player.vimeo.com/video/${videoId}?portrait=0&byline=0&color=ffffff`}
    frameBorder={0}
    allowFullScreen={true}
  />
)

const Video = ({ video }) => {
  const { vimeoId, caption } = video
  if (!vimeoId) {
    return null
  }

  return (
    <VideoWrapper>
      {vimeoEmbed(vimeoId)}
      {caption && <Caption>{caption}</Caption>}
    </VideoWrapper>
  )
}

export default Video
