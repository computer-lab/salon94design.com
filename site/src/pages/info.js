import React from 'react'
import Helmet from 'react-helmet'
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
import Press from '../layouts/Press'

const Container = styled.div`
  composes: ${sansfont};

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
`

const AboutWrapper = styled.div`margin-bottom: 40px;`

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

const SectionList = styled.ul`composes: ${baseUl}, ${sectionContent};`

const SectionListItem = styled.li`
  composes: ${childLink};
  margin: 0 0 16px 0;
`

const MailingListSignup = styled.div`
  margin-top: 24px;
  font-weight: 500;
  font-size: 28px;
  line-height: 1.4;

  & a {
    color: #000;
    text-decoration: none;
    border-bottom: 2px solid #000;
  }

  @media (${breakpoint3}) {
    font-size: 24px;
  }
`

const Info = ({ data }) => {
  const { allInfoYaml } = data
  const {
    aboutText,
    email,
    phone,
    instagram,
    mailingList,
    press,
  } = allInfoYaml.edges[0].node

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
            <SectionText dangerouslySetInnerHTML={{ __html: aboutText }} />
          </AboutWrapper>

          <Press press={press} />
        </Section>

        <Section>
          <Header2>Contact</Header2>
          <SectionList>
            <SectionListItem>
              <a href={instagram} target="_blank">Instagram</a>
            </SectionListItem>
            <SectionListItem>
              Phone: <a href={`tel:${phone}`} target="_blank">{ phone }</a>
            </SectionListItem>
            <SectionListItem>
              Email: <a href={`mailto:${email}`} target="_blank">{ email }</a>
            </SectionListItem>
          </SectionList>
          <MailingListSignup>
            <a href={mailingList}>Sign Up For Mailing List</a>
          </MailingListSignup>
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
          aboutText
          email
          phone
          instagram
          mailingList
          press {
            link
            title
          }
        }
      }
    }
  }
`
