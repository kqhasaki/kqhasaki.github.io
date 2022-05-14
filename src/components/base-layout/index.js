import React, { useEffect } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { message } from '../../components'
import Footer from '../footer'
import Header from '../header'
import clsx from 'clsx'
import { defineCustomElements as deckDeckGoHighlightElement } from '@deckdeckgo/highlight-code/dist/loader'
import './index.css'
deckDeckGoHighlightElement()

export const languageContext = React.createContext('Chinese')

export default function BaseLayout({
  children,
  pageTitle,
  name,
  navigator,
  tableOfContent,
  additionalClass = [],
}) {
  const { title } = useStaticQuery(graphql`
    query {
      site(siteMetadata: {}) {
        siteMetadata {
          title
        }
      }
    }
  `).site.siteMetadata

  useEffect(() => {
    const copyHandler = e => {
      const text = e.target.textContent
      e.clipboardData.setData('text/plain', text)
      message.success('复制成功')
      e.preventDefault()
    }
    document.addEventListener('copy', copyHandler)

    const dblclickHandler = e => {
      const { target } = e
      if (target.matches('deckgo-highlight-code')) {
        const text = target.textContent.trim()
        const targetNode = document.createElement('input')
        targetNode.style.height = 0
        targetNode.id = 'temp_board'
        targetNode.textContent = text
        document.body.appendChild(targetNode)
        targetNode.select()
        document.execCommand('copy')
        targetNode.remove()
      }
    }
    document.addEventListener('dblclick', dblclickHandler)

    return () => {
      document.removeEventListener('copy', copyHandler)
      document.removeEventListener('dblclick', dblclickHandler)
    }
  }, [])

  return (
    <>
      <title>
        {pageTitle && `${pageTitle} |`}
        {title}
      </title>

      <Header />

      <main className={clsx([...additionalClass, 'layout'])}>
        {navigator}

        <main className={clsx('base-wrapper')} name={name}>
          <main>{children}</main>
        </main>

        {tableOfContent}
      </main>

      <Footer />
    </>
  )
}
