import React, { useContext } from 'react'
import avatar from '../../images/avatar.png'
import { languageContext } from '../base-layout'
import ItemList from '../item-list'
import './index.css'

const SELF_INTROS = {
  Chinese: [
    `我是一名前端开发者，在这个博客你会看到一些关于前端技术的总结和学习记录。
    当然，也有涉及其他内容的文章。作为一个自学的开发人员，我绝大多数知识是从网络上习得，
    我也很愿意将我总结与任何其他人分享。`,
    `工作之余我也会间断地编写一些我感兴趣的项目、阅读、旅行和绘画，这里也将会更新更多我的项目和作品。
    如果力所能及，我也很愿意加入任何有趣的开源项目。`,
  ],
}

const CAREER = {
  Chinese: [
    {
      label: '本科',
      content: '东南大学 - 机械工程学院 - 工学学士',
    },
    {
      label: '硕士',
      content: '南京审计大学 - 统计与数据科学学院 - 经济学硕士',
    },
    {
      label: '2021.7 ~ 2021.10',
      content: '海沃机械（中国）- 软件工程师 - base 扬州',
    },
    {
      label: '2021.10 至今',
      content: '小鹏汽车 - 自动驾驶中心 - 前端开发工程师 - base 扬州/上海',
    },
  ],
  English: [
    {
      label: '2021.10 ~ Now',
      content: 'XP motor - front-end engineer',
    },
  ],
}

const PROJECTS = {
  Chinese: [
    {
      label: '音乐播放器',
      content: (
        <a href="https://music.louisk.xyz" target="_blank">
          基于React和网易云音乐API的音乐播放器Web应用
        </a>
      ),
    },
    {
      label: '算法动态演示',
      content: '基于React的常用算法和数据结构的交互演示Web应用',
    },
  ],
  English: [],
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
      <h2 className="homepage-title">个人项目</h2>
      <ItemList items={PROJECTS[language]} />
      <h2 className="homepage-title">工作生涯</h2>
      <ItemList items={CAREER[language]} />
    </main>
  )
}
