import React from 'react'
import Helmet from 'react-helmet'
import { css } from 'emotion'
import styled from 'emotion/react'
import { sansfont } from '../layouts/emotion-base'

const Container = styled.div`
  composes: ${sansfont};

  & a {
    color: inherit;
  }
`

const SectionHeader = styled.h4`
  composes: ${sansfont};
  margin: 0 0 16px 0;
  font-weight: 500;
  font-size: 24px;
`

const sectionEl = css`
  margin: 0 0 30px 20px;
  padding: 0;
  max-width: 400px;
  font-size: 18px;
  line-height: 1.4;
`

const SectionText = styled.p`
  composes: ${sectionEl};
  & a {
    text-decoration: none;
    border-bottom: 2px solid #000;
  }
`

const SectionList = styled.ul`
  composes: ${sectionEl};
  list-style: none;

  & li {
    margin: 0 0 16px 0;

    & a {
      text-decoration: none;

      &:hover,
      &:focus {
        border-bottom: 2px solid #000;
      }
    }
  }
`

const MailingListSignup = styled.div`
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

      <SectionHeader>About</SectionHeader>
      <SectionText dangerouslySetInnerHTML={{ __html: aboutText }} />

      <SectionHeader>Contact</SectionHeader>
      <SectionList>
        {contactItems.map(item =>
          <li key={item.name}>
            <a href={item.link} target="_blank">
              {item.name}
            </a>
          </li>
        )}
      </SectionList>

      <MailingListSignup>
        <a href={mailingList}>Sign Up For Mailing List</a>
      </MailingListSignup>
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
