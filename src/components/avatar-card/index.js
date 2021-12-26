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
        I'm a software engineer and writer who works with JavaScript, Go, AWS
        and a pen. Working for early stage startups and corporations like the
        Financial Times taught me a lot about building software.
      </p>
      <p>
        I share what I've learned about software design & architecture through
        my articles, books and newsletter. I'm also passionate about
        storytelling, physical training, philosophy
      </p>
    </main>
  )
}
