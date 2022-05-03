import React, { useEffect, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { navigate } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faList } from '@fortawesome/free-solid-svg-icons'
import { debounce } from 'lodash'

import './index.css'

export const GROUP_TITLES = {
  'front-end': '前端杂谈',
  'javascript-algorithm-and-data-structure': 'JavaScript数据结构和算法',
  'redbook-series': 'JavaScript高级程序设计',
  'non-tech': '日常杂谈',
  'electron-docs': 'electron',
}

const WIDTH = 900

export default function ArticleNavigator({ currArticle }) {
  const [visible, setVisible] = useState(true)

  const articleGroups = useStaticQuery(graphql`
    query {
      allFile {
        group(field: relativeDirectory) {
          nodes {
            childMdx {
              slug
              frontmatter {
                title
              }
            }
          }
          fieldValue
        }
      }
    }
  `).allFile.group.filter(({ fieldValue }) => {
    if (currArticle.slug.startsWith('non-tech')) {
      return fieldValue === 'non-tech'
    } else {
      return fieldValue !== 'non-tech'
    }
  })

  useEffect(() => {
    document.body.style.overflow =
      visible && document.body.clientWidth < WIDTH ? 'hidden' : 'initial'

    const resizeHandler = debounce(() => {
      if (window.innerWidth >= WIDTH) {
        document.body.style.overflow = 'initial'
        setVisible(true)
      } else {
        if (visible) {
          document.body.style.overflow = 'hidden'
        }
      }
    }, 150)

    window.onresize = resizeHandler
    return () => {
      window.onresize = null
    }
  }, [visible])

  useEffect(() => {
    if (document.body.clientWidth < WIDTH) {
      setVisible(false)
    }
  }, [])

  return (
    <>
      <div
        className="navigator-switch"
        onClick={() => setVisible(true)}
        style={{ display: !visible ? 'block' : 'none' }}
      >
        <FontAwesomeIcon icon={faList} />
      </div>
      <div
        className="article-navigator"
        style={{ display: visible ? 'block' : 'none' }}
      >
        <div
          className="article-navigator-toggler"
          onClick={() => setVisible(false)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </div>
        {articleGroups.map((articleGroup, idx) => {
          const groupTitle = GROUP_TITLES[articleGroup.fieldValue]
          const articles = articleGroup.nodes
            .map(({ childMdx }) => ({
              slug: childMdx.slug,
              title: childMdx.frontmatter.title,
            }))
            .sort((a, b) => a.slug.localeCompare(b.slug))
          return (
            <React.Fragment key={idx}>
              <h4>{groupTitle}</h4>
              {articles.map(({ slug, title }, idx) => (
                <p
                  key={idx}
                  onClick={() => navigate('/articles/' + slug)}
                  title={title}
                  className={
                    currArticle.slug === slug
                      ? 'highlighted-navigator-item'
                      : ''
                  }
                >
                  {title}
                </p>
              ))}
            </React.Fragment>
          )
        })}
      </div>
    </>
  )
}
