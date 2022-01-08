import React, { useContext } from 'react'
import avatar from '../../images/avatar.png'
import { GithubOutlined } from '@ant-design/icons'
import { languageContext } from '../base-layout'
import './index.css'

const SELF_INTROS = {
  Chinese: [
    `我是一名前端开发者，在这个博客你会看到一些关于前端技术的总结和学习记录。
    当然，也有涉及其他内容的文章。作为一个自学的开发人员，我绝大多数知识是从网络上习得，
    我也很愿意将我总结与任何其他人分享。`,
    `工作之余我也会间断地编写一些我感兴趣的项目、阅读、旅行和绘画，这里也将会更新更多我的项目和作品。
    如果力所能及，我也很愿意加入任何有趣的开源项目。`,
  ],
  English: [
    `I'm a front-end engineer who works mainly with JavaScript and React. I
    also enjoy writing and building my own apps. I learnt most of my skills
    from the Web, and I would like to share everything I know with people
    who want to learn Web development. `,
    `I currently work in GIS industry, most of my work is related to map
    tools. But I am developing some interesting apps at leisure. Welcome to
    join my project or invite me to your project at any time.`,
  ],
}

export default function AvatarCard() {
  const language = useContext(languageContext)

  return (
    <main>
      <div className="avatar">
        <img src={avatar} alt="avatar" />
      </div>
      <h2 style={{ textAlign: 'center' }}>Hey, I'm Louis K.</h2>
      {SELF_INTROS[language].map((content, idx) => (
        <p key={idx}>{content}</p>
      ))}
      <div className="personal-links">
        <a href="https://github.com/kqhasaki" target="_blank" rel="noreferrer">
          <GithubOutlined />
        </a>
      </div>
    </main>
  )
}
