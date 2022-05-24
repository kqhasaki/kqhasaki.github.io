import React, { useContext } from 'react'
import { GithubOutlined } from '@ant-design/icons'
import avatar from '../../images/avatar.png'
import { languageContext } from '../base-layout'
import ItemList from '../item-list'
import './index.css'

const SELF_INTROS = {
  Chinese: [
    <div>
      Greetings！欢迎来到
      <strike>交界地，褪色者</strike>。 我是一名普普通通、兴趣使然（
      <strike>半路出家</strike>
      ）的程序员，目前从事Web前端开发。这里主要分享一些我的读书笔记（
      <strike>抄抄书</strike>）、技术博客（<strike>抄抄英文博客</strike>
      ）、游戏介绍（<strike>又云又菜</strike>）、杂谈（<strike>吹牛比</strike>
      ）。 欢迎与我交流，持续学习，共同进步（
      <strike>But you, I'm afraid, are maidenless</strike>）。
    </div>,
  ],
}

const CAREER = {
  Chinese: [
    {
      label: '本科',
      content: (
        <div>
          东南大学 - 机械工程学院 - 工学学士 （<strike>九龙湖野生动物园</strike>
          ）
        </div>
      ),
    },
    {
      label: '硕士',
      content: (
        <div>
          南京审计大学 - 统计与数据科学学院 - 经济学硕士 （
          <strike>
            机械行业劝退 \ 跨考 \ 调剂：凑合过呗，还能离咋滴 \ 后悔没跨CS
          </strike>
          ）
        </div>
      ),
    },
    {
      label: '2021.7 ~ 2021.10',
      content: (
        <div>
          海沃机械（中国）- 软件工程师 - base 扬州 （
          <strike>扬州是个“好”地方</strike>？）
        </div>
      ),
    },
    {
      label: '2021.10 至今',
      content: (
        <div>
          小鹏汽车 - 自动驾驶中心 - 前端开发工程师 - base 扬州 （
          <strike>第一份正经写代码的工作</strike>）
        </div>
      ),
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
      label: '基于gatsby开发的静态博客',
      content: (
        <a
          target="_blank"
          rel="noreferrer noopener nofollow"
          href="https://github.com/kqhasaki/kqhasaki.github.io"
        >
          本博客代码库（<strike>没几行代码</strike>） <GithubOutlined />
        </a>
      ),
    },
    {
      label: '一个简单的电影推荐网站（在校项目）',
      content: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://github.com/kqhasaki/Team-Website"
        >
          爬取部分豆瓣数据，使用了简单协同过滤算法的电影推荐系统项目。使用了Django编写的非前后端分离网站。获得全国应用统计研究生案例大赛二等奖。
          （<strike>混了三千块经费</strike>） <GithubOutlined />
        </a>
      ),
    },
    {
      label: '硕士论文latex模版（在校项目）',
      content: (
        <a
          target="_blank"
          rel="noreferrer noopener nofollow"
          href="https://github.com/kqhasaki/thesis"
        >
          本渣的硕士论文repo，包含了论文和答辩slide。适合统计、经济、数学类的latex苦手参考。
          （<strike>上帝保佑永远不要论文抽检到我！</strike>） <GithubOutlined />
        </a>
      ),
    },
  ],
  English: [],
}

export default function AvatarCard() {
  const language = useContext(languageContext)

  return (
    <main className="avatar-wrapper">
      <div className="avatar">
        <img src={avatar} alt="avatar" />
      </div>
      <h2
        style={{
          textAlign: 'center',
          marginBottom: 24,
          marginTop: 18,
          fontWeight: 100,
        }}
      >
        Hey, I'm Louis K.
      </h2>
      {SELF_INTROS[language].map((content, idx) => (
        <div key={idx}>{content}</div>
      ))}
      <h2 className="homepage-title">开源项目</h2>
      <ItemList items={PROJECTS[language]} />
      <h2 className="homepage-title">生涯</h2>
      <ItemList items={CAREER[language]} />
    </main>
  )
}
