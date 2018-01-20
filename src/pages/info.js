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
import Press from '../components/Press'
import SimpleImageList from '../components/SimpleImageList'
import { imageInfo, imageFilepath } from '../util'

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

const LogoImage = styled.img`
  display: block;
  margin: 0 auto 30px auto;
  width: 600px;
  user-select: none;

  @media (${breakpoint2}) {
    margin-bottom: 20px;
    width: calc(100vw - 48px);
  }
`

const SectionWrapper = styled.div`
  display: flex;
  display: -webkit-flex;
  flex-wrap: wrap;
  -webkit-flex-wrap: wrap;
  justify-content: center;
  -webkit-justify-content: center;
  padding-bottom: 24px;
`

const Section = styled.section`
  margin: 40px 0 0 60px;
  max-width: 400px;

  @media (${breakpoint2}) {
    max-width: none;
    width: 100%;
  }

  @media (${breakpoint3}) {
    margin: 20px 0;
  }
`

const SubSection = styled.div`
  margin-bottom: 40px;

  @media (${breakpoint3}) {
    margin-bottom: 20px;
  }
`

const sectionContent = css`
  margin: 0;
  padding: 0;
  font-size: 16px;
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

const SectionListItemLabel = styled.span`
  &::after {
    content: ' – ';
  }
`

const StaffLabel = styled.div`
  font-weight: 400;
  line-height: 1.4;
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
    hero,
    aboutHtml,
    emails,
    phones,
    social,
    staff,
    mailingList,
    press,
    hydratedImages,
  } = allInfoYaml.edges[0].node

  const formatTel = n => {
    return `+1${n.replace(/[\(\)\-\s]/g, '')}`
  }

  const images = (hydratedImages || [])
    .filter(item => item && item.file && item.file.length > 0)
    .map(image => Object.assign({}, image, imageInfo(image)))

  const renderListItems = items =>
    items.map(item => (
      <SectionListItem key={item.title + item.link}>
        <SectionListItemLabel>{item.title.trim()}</SectionListItemLabel>
        <a href={item.link} target="_blank">
          {item.label}
        </a>
      </SectionListItem>
    ))

  const socialLinks = renderListItems(social)

  const emailLinks = renderListItems(
    emails.map(item => ({
      title: item.title,
      label: item.email,
      link: `mailto:${item.email}`,
    }))
  )

  const phoneLinks = renderListItems(
    phones.map(item => ({
      title: item.title,
      label: item.number,
      link: `tel:${formatTel(item.number)}`,
    }))
  )

  const staffLinks = staff.map(item => (
    <SectionListItem key={item.title + item.name}>
      <StaffLabel>{(item.name || '').trim()}</StaffLabel>
      <StaffLabel>{item.title.trim()}</StaffLabel>
      <StaffLabel>
        <a href={`mailto:${item.email}`} target="_blank">
          {item.email}
        </a>
      </StaffLabel>
    </SectionListItem>
  ))

  return (
    <Container>
      <Helmet title={`Salon 94 Design - Info`} />

      <Link to={'/'}>
        <LogoImage src={imageFilepath(hero)} />
      </Link>

      <SectionWrapper>
        <Section>
          <SubSection>
            <Header2>About</Header2>
            <SectionText dangerouslySetInnerHTML={{ __html: aboutHtml }} />
          </SubSection>

          <Press press={press} />
        </Section>

        <Section>
          <SubSection>
            <Header2>Contact</Header2>
            <SectionList>
              {socialLinks}
              {phoneLinks}
              {emailLinks}
            </SectionList>
          </SubSection>
          <SubSection>
            <Header2>Staff</Header2>
            <SectionList>{staffLinks}</SectionList>
          </SubSection>
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
          hero
          aboutHtml
          staff {
            name
            title
            email
          }
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
            label
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
