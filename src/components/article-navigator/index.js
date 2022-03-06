import React, { useEffect, useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { navigate } from 'gatsby'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark, faList } from '@fortawesome/free-solid-svg-icons'

import './index.css'

const GROUP_TITLES = {
  'front-end': '前端杂谈',
  'introduction-to-algorithms': '抄书系列——《算法导论》',
  'redbook-series': '抄书系列——“红宝书”',
}

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
  `).allFile.group

  useEffect(() => {
    if (document.body.clientWidth < 810) {
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
          const articles = articleGroup.nodes.map(({ childMdx }) => ({
            slug: childMdx.slug,
            title: childMdx.frontmatter.title,
          }))
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
