import React from 'react'
import Helmet from '../components/helmet'
import Link from 'gatsby-link'
import { css } from 'emotion'
import styled from 'emotion/react'

import {
  sansfont,
  baseUl,
  childLink,
  Header2,
  breakpoint2,
  breakpoint3,
} from '../layouts/emotion-base'
import Logo from '../layouts/logo'
import Press from '../components/Press'
import SimpleImageList from '../components/SimpleImageList'
import { imageInfo } from '../util'

const Container = styled.div`
  composes: ${sansfont};
  font-weight: 300;
  box-sizing: border-box;

  & * {
    box-sizing: inherit;
  }

  & a {
    color: inherit;
  }
`

const SectionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  max-width: 840px;
  margin: 0 auto;
`

const Section = styled.section`
  margin: 40px 0 0 0;
  max-width: 400px;

  @media (${breakpoint2}) {
    margin: 40px 0 0 24px;
  }

  @media (${breakpoint3}) {
    margin: 40px 0 0 12px;
  }
`

const AboutWrapper = styled.div`
  margin-bottom: 40px;
`

const sectionContent = css`
  margin: 0;
  padding: 0;
  max-width: 400px;
  font-size: 18px;
  line-height: 1.4;
`

const SectionText = styled.p`
  composes: ${sectionContent};
  & a {
    text-decoration: none;
    border-bottom: 2px solid #000;
  }
`

const SectionList = styled.ul`
  composes: ${baseUl}, ${sectionContent};
  font-weight: 400;
`

const SectionListItem = styled.li`
  composes: ${childLink};
  margin: 0 0 16px 0;
`

const MailingListSignup = styled.div`
  margin-top: 24px;
  font-weight: 500;
  font-size: 24px;

  & a {
    color: #000;
    text-decoration: none;
    border-bottom: 2px solid #000;
  }
`

const Images = styled.div`
  margin-top: 40px;
`

const Info = ({ data }) => {
  const { allInfoYaml } = data
  const {
    aboutHtml,
    emails,
    phones,
    social,
    mailingList,
    press,
    hydratedImages,
  } = allInfoYaml.edges[0].node

  const formatTel = (n) => {
    return `+1${n.replace(/[\(\)\-\s]/g, '')}`
  }

  const images = (hydratedImages || []).map(image =>
    Object.assign({}, image, imageInfo(image))
  )

  const socialLinks = social.map(item => (
    <SectionListItem key={item.link}>
      <a href={item.link} target="_blank">
        {item.title}
      </a>
    </SectionListItem>
  ))

  const emailLinks = emails.map(item => (
    <SectionListItem key={item.email}>
      {item.title}:{' '}
      <a href={`mailto:${item.email}`} target="_blank">
        {item.email}
      </a>
    </SectionListItem>
  ))

  const phoneLinks = phones.map(item => (
    <SectionListItem key={item.number}>
      {item.title}:{' '}
      <a href={`tel:${formatTel(item.number)}`} target="_blank">
        {item.number}
      </a>
    </SectionListItem>
  ))

  return (
    <Container>
      <Helmet title={`Salon 94 Design - Info`} />

      <Link to={'/'}>
        <Logo width={600} />
      </Link>

      <SectionWrapper>
        <Section>
          <AboutWrapper>
            <Header2>About</Header2>
            <SectionText dangerouslySetInnerHTML={{ __html: aboutHtml }} />
          </AboutWrapper>

          <Press press={press} />
        </Section>

        <Section>
          <Header2>Contact</Header2>
          <SectionList>
            {socialLinks}
            {phoneLinks}
            {emailLinks}
          </SectionList>
          <MailingListSignup>
            <a href={mailingList} target="_blank">
              Sign Up For Mailing List
            </a>
          </MailingListSignup>

          {images.length > 0 && (
            <Images>
              <SimpleImageList images={images} />
            </Images>
          )}
        </Section>
      </SectionWrapper>
    </Container>
  )
}

export default Info

export const pageQuery = graphql`
  query InfoQuery {
    allInfoYaml {
      edges {
        node {
          aboutHtml
          emails {
            title
            email
          }
          phones {
            title
            number
          }
          social {
            title
            link
          }
          mailingList
          press {
            title
            link
          }
          hydratedImages {
            file
            title
            width
            height
            resized {
              file
              width
              height
            }
          }
        }
      }
    }
  }
`
