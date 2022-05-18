import React, { useEffect, useRef, useState } from 'react'
import BaseLayout from '../components/base-layout'
import { navigate } from 'gatsby'
import { getIframeAltBackgroundImg } from '../components/header'
import { MDXRenderer } from 'gatsby-plugin-mdx'
import { FieldTimeOutlined, ReadOutlined } from '@ant-design/icons'
import ScrollProgresser from '../components/scroll-progresser'
import TableOfContent from '../components/table-of-content'
import ArticleNavigator from '../components/article-navigator'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { debounce, throttle } from 'lodash'
import '../components/base-layout/index.css'

function getNextLevel(levelStr) {
  const dict = {
    h1: 'h2',
    h2: 'h3',
    h3: 'h3',
  }
  return dict[levelStr]
}

function getCommentTheme() {
  const theme = document.documentElement.dataset.theme
  if (theme === 'light') {
    return 'github-light'
  } else {
    return 'github-dark'
  }
}

export default function ArticleView({ pageContext }) {
  const article = pageContext.data.node
  const { next, previous } = pageContext
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
  }, [article.frontmatter.title])

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

  useEffect(() => {
    const scrollingAdder = throttle(() => {
      document.body.classList.add('scrolling')
    }, 100)
    window.addEventListener('scroll', scrollingAdder)

    const scrollingRemover = debounce(() => {
      document.body.classList.remove('scrolling')
    }, 500)
    window.addEventListener('scroll', scrollingRemover)

    return () => {
      window.removeEventListener('scroll', scrollingAdder)
      window.removeEventListener('scroll', scrollingRemover)
    }
  }, [])

  return (
    <BaseLayout
      name="article-wrapper"
      navigator={<ArticleNavigator currArticle={article} />}
      tableOfContent={<TableOfContent headers={headers} />}
    >
      <ScrollProgresser />
      <article className="article-body" style={{ marginBottom: '4rem' }}>
        <img
          alt={article.frontmatter.cover}
          src={article.frontmatter.cover}
          className="article-cover"
        ></img>
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

      <div className="foot-post-navigator">
        <button
          className={
            'previous ' +
            (previous?.slug.startsWith('non-tech') ? 'to-non-tech' : '')
          }
          onClick={() => navigate(`/articles/${previous?.slug}`)}
          style={{ visibility: previous ? 'visible' : 'hidden' }}
        >
          <div>
            <LeftOutlined />
            上一篇
          </div>
          <span>{previous?.frontmatter.title}</span>
        </button>

        <button
          className={
            'next ' + (next?.slug.startsWith('non-tech') ? 'to-non-tech' : '')
          }
          onClick={() => navigate(`/articles/${next?.slug}`)}
          style={{ visibility: next ? 'visible' : 'hidden' }}
        >
          <div>
            下一篇
            <RightOutlined />
          </div>
          <span>{next?.frontmatter.title}</span>
        </button>
      </div>

      <div ref={commentBox} id="commentBoxScript"></div>
    </BaseLayout>
  )
}
