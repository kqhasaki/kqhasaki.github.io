import React, { useContext } from 'react'
import { ItemList, BaseLayout } from '../components'
import { languageContext } from '../components/base-layout'
import { motion } from 'framer-motion'
import '../components/base-layout/index.css'

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
      content: '基于React Native和网易云音乐api的音乐播放器App',
    },
    {
      label: '算法动态演示',
      content: '基于React的常用算法和数据结构的交互演示Web应用',
    },
  ],
  English: [],
}

const blogDesc = {
  Chinese: {
    title: 'baseDesc',
    content: `欢迎来到这个博客～ 我是一名前端开发者，热爱阅读、创作和分享。
        此博客分享所有我工作、学习中的总结和感想，也分享了我的一些个人项目，希望能够对你有所帮助。`,
  },
  English: {},
}

export default function IndexView() {
  const language = useContext(languageContext)

  return (
    <BaseLayout>
      <motion.div
        style={{ width: '85%', margin: '0 auto 0 auto' }}
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
      >
        <p style={{ textIndent: '2rem' }}>{blogDesc[language].content}</p>
        <h2 className="homepage-title">个人项目</h2>
        <ItemList items={PROJECTS[language]} />
        <h2 className="homepage-title">工作生涯</h2>
        <ItemList items={CAREER[language]} />
      </motion.div>
    </BaseLayout>
  )
}
