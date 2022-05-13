import React, { useEffect, useRef, useState } from 'react'
import BaseLayout from '../../components/base-layout'
import { getIframeAltBackgroundImg } from '../../components/header'
import { graphql } from 'gatsby'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { FieldTimeOutlined, ReadOutlined } from '@ant-design/icons'
import ScrollProgresser from '../../components/scroll-progresser'
import TableOfContent from '../../components/table-of-content'
import ArticleNavigator from '../../components/article-navigator'
import '../../components/base-layout/index.css'

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

function getCommentTheme() {
  const theme = document.documentElement.dataset.theme
  if (theme === 'light') {
    return 'github-light'
  } else {
    return 'github-dark'
  }
}

export default function ArticleView({ data }) {
  const article = data.mdx
  const [headers, setHeaders] = useState([])
  const commentBox = useRef()

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

  useEffect(() => {
    const scriptEl = document.createElement('script')
    scriptEl.async = true
    scriptEl.src = 'https://utteranc.es/client.js'
    scriptEl.setAttribute('repo', 'kqhasaki/kqhasaki.github.io')
    scriptEl.setAttribute('issue-term', 'pathname')
    scriptEl.setAttribute('label', 'blog comment')
    scriptEl.setAttribute('theme', getCommentTheme())
    scriptEl.setAttribute('crossorigin', 'anonymous')

    if (commentBox && commentBox.current) {
      commentBox.current.appendChild(scriptEl)
    } else {
      console.log(`Error adding utterances comments on: ${commentBox}`)
    }

    return () => scriptEl.remove()
  }, [])

  return (
    <BaseLayout
      name="article-wrapper"
      navigator={<ArticleNavigator currArticle={article} />}
      tableOfContent={<TableOfContent headers={headers} />}
    >
      <ScrollProgresser />
      <article className="article-body" style={{ marginBottom: '4rem' }}>
        <h1 className="article-title">{article.frontmatter.title}</h1>
        <p className="article-meta">
          <span>
            <FieldTimeOutlined /> {article.frontmatter.date} | <ReadOutlined />{' '}
            {Math.round((article.wordCount.sentences * 40) / 100) * 100}
            words {Math.round(article.wordCount.sentences / 7)}min
          </span>
        </p>
        <MDXRenderer>{article.body}</MDXRenderer>
      </article>

      <div ref={commentBox} id="commentBoxScript"></div>
    </BaseLayout>
  )
}
