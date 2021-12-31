import React from 'react'
import avatar from '../../images/avatar.png'
import { GithubOutlined } from '@ant-design/icons'
import './index.css'

export default function AvatarCard() {
  return (
    <main>
      <div className="avatar">
        <img src={avatar} alt="avatar" />
      </div>
      <h2 style={{ textAlign: 'center' }}>Hey, I'm Louis K.</h2>
      <div className="personal-links">
        <a href="https://github.com/kqhasaki" target="_blank" rel="noreferrer">
          <GithubOutlined />
        </a>
      </div>
      <p>
        {/* I'm a software engineer and writer who works with JavaScript, Go, AWS
        and a pen. Working for early stage startups and corporations like the
        Financial Times taught me a lot about building software. */}
        I'm a front-end engineer who works mainly with JavaScript and React. I
        also enjoy writing and building my own apps. I learnt most of my skills
        from the Web, and I would like to share everything I know with people
        who want to learn Web development.
      </p>
      <p>
        I currently work in GIS industry, most of my work is related to map
        tools. But I am developing some interesting apps at leisure. Welcome to
        join my project or invite me to your project at any time.
      </p>
    </main>
  )
}
