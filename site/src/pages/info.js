import React from 'react'
import Helmet from 'react-helmet'
import Link from 'gatsby-link'
import { css } from 'emotion'
import styled from 'emotion/react'
import { sansfont, baseUl, childLink, Header2, breakpoint1 } from '../layouts/emotion-base'
import Logo from '../layouts/logo'

const Container = styled.div`
  composes: ${sansfont};

  & a {
    color: inherit;
  }
`

const SectionWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

const Section = styled.section`
  margin: 96px 120px 0 24px;
  &:last-child {
    margin-right: 0;
  }

  @media(${breakpoint1}) {
    margin: 60px 0 0 24px;
  }
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
`

const SectionListItem = styled.li`
  composes: ${childLink};
  margin: 0 0 16px 0;
`

const MailingListSignup = styled.div`
  margin-top: 32px;
  font-weight: 500;
  font-size: 28px;

  & a {
    color: #000;
    text-decoration: none;
    border-bottom: 2px solid #000;
  }
`

const Info = ({ data }) => {
  const { allInfoYaml } = data
  const {
    aboutText,
    email,
    instagram,
    facebook,
    twitter,
    mailingList,
  } = allInfoYaml.edges[0].node

  const contactItems = [
    { name: 'Email', link: `mailto:${email}` },
    { name: 'Instagram', link: instagram },
    { name: 'Facebook', link: facebook },
    { name: 'Twitter', link: twitter },
  ]

  return (
    <Container>
      <Helmet title={`Salon 94 Design - Info`} />

      <Link to={'/'}>
        <Logo width={600} />
      </Link>

      <SectionWrapper>
        <Section>
          <Header2>About</Header2>
          <SectionText dangerouslySetInnerHTML={{ __html: aboutText }} />
        </Section>

        <Section>
          <Header2>Contact</Header2>
          <SectionList>
            {contactItems.map(item =>
              <SectionListItem key={item.name}>
                <a href={item.link} target="_blank">
                  {item.name}
                </a>
              </SectionListItem>
            )}
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
          instagram
          facebook
          twitter
          mailingList
        }
      }
    }
  }
`
