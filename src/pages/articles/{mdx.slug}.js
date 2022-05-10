import React, { useEffect, useState } from 'react'
import BaseLayout from '../../components/base-layout'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { FieldTimeOutlined, ReadOutlined } from '@ant-design/icons'
import ScrollProgresser from '../../components/scroll-progresser'
import TableOfContent from '../../components/table-of-content'
import ArticleNavigator from '../../components/article-navigator'
import '../../components/base-layout/index.css'

function getIframeAltBackgroundImg() {
  const altImgList = [
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h218jhhnzqg20dc07ikjm.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21adr50r1g209w05k7wi.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21adqj3x1g20dc07ib2b.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21adpsp5yg20hs09q1ky.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21adp13cag20hs0a0x6u.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21amqaifwg20dc07i4qr.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21ampu8l1g20dc068u0x.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21ampagtwg20dc07i7wh.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21azonp62g20hs09yx6p.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21azu0dldg20dc07inph.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21azr2o2ig20du07q4qp.gif',
  ]

  const randomPos = Math.floor(Math.random() * 100) % altImgList.length

  return altImgList[randomPos]
}

function getNextLevel(levelStr, tagName) {
  const dict = {
    h1: 'h2',
    h2: 'h3',
    h3: 'h3',
  }
  return dict[levelStr]
}

export const query = graphql`
  query ($id: String) {
    mdx(id: { eq: $id }) {
      id
      frontmatter {
        cover
        date(formatString: "YYYY-MM-DD")
        title
      }
      body
      slug
      wordCount {
        sentences
      }
    }
  }
`

export default function ArticleView({ data }) {
  const article = data.mdx
  const [headers, setHeaders] = useState([])

  useEffect(() => {
    document.title = article.frontmatter.title

    const links = document.querySelectorAll('.article-body a')
    if (links) {
      links.forEach(link => (link.target = '_blank'))
    }

    const allHeaders = document.querySelectorAll(
      '.article-body h1, .article-body iframe, .article-body h2, .article-body h3'
    )

    const _headers = Array.from(allHeaders).map((header, idx, array) => {
      header.setAttribute('name', idx)
      const { localName, textContent } = header
      if (header.tagName === 'IFRAME') {
        const lastHeader = array[idx - 1]
        return {
          level: getNextLevel(lastHeader.localName, lastHeader.tagName) ?? 'h2',
          name: 'media',
          label: header.title,
          target: header,
        }
      }
      return {
        level: localName,
        name: `header-${idx}`,
        label: textContent,
        target: header,
      }
    })
    setHeaders(_headers)

    const headNavigate = event => {
      const { target } = event
      if (target.matches('h1, h2, h3')) {
        target.scrollIntoView({
          behavior: 'smooth',
        })
      }
    }
    document.addEventListener('click', headNavigate)

    return () => {
      document.removeEventListener('click', headNavigate)
    }
  }, [article.frontmatter.title, data])

  useEffect(() => {
    const allIframes = document.querySelectorAll('iframe')
    allIframes.forEach(iframe => {
      const wrapper = document.createElement('div')
      const originalParent = iframe.parentNode
      originalParent.insertBefore(wrapper, iframe)
      wrapper.appendChild(iframe)
      wrapper.classList.add('iframe-wrapper')
      wrapper.style.backgroundImage = `url(${getIframeAltBackgroundImg()})`
      wrapper.style.backgroundSize = 'cover'
      const loader = document.createElement('div')
      loader.classList.add('loader')
      loader.textContent = 'YouTube loading'
      wrapper.appendChild(loader)
      iframe.onload = () => {
        wrapper.removeChild(loader)
        wrapper.style.background = 'none'
      }
    })
  }, [])

  return (
    <BaseLayout>
      <ScrollProgresser />
      <div className="article-body">
        <h1 className="article-title">{article.frontmatter.title}</h1>
        <p className="article-meta">
          <span>
            <FieldTimeOutlined /> {article.frontmatter.date} | <ReadOutlined />{' '}
            {Math.round((article.wordCount.sentences * 40) / 100) * 100}
            words {Math.round(article.wordCount.sentences / 7)}min
          </span>
        </p>
        {/* <img
          className="article-cover"
          src={article.frontmatter.cover}
          alt={article.frontmatter.cover}
        /> */}
        <MDXRenderer>{article.body}</MDXRenderer>
      </div>
      <ArticleNavigator currArticle={article} />
      {headers.length && <TableOfContent headers={headers} />}
    </BaseLayout>
  )
}
