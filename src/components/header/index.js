import { Link, navigate } from 'gatsby'
import Modal from '../modal'
import avatar from '../../images/avatar.png'
import React, { useState, useEffect, useRef } from 'react'
import message from '../message'
import './index.css'

export function getIframeAltBackgroundImg() {
  const altImgList = [
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h218jhhnzqg20dc07ikjm.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21adr50r1g209w05k7wi.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21adqj3x1g20dc07ib2b.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21adpsp5yg20hs09q1ky.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21adp13cag20hs0a0x6u.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21amqaifwg20dc07i4qr.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21ampu8l1g20dc068u0x.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21ampagtwg20dc07i7wh.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21azonp62g20hs09yx6p.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21azu0dldg20dc07inph.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h21azr2o2ig20du07q4qp.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h24zp18rk3g20hs0a0qv7.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h24zp1u2okg20du07lhdv.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h24zp3i44kg20f008ghdz.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h24zp4331gg20be0bex5e.gif',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h24zp5tve8g20du07se89.gif',
  ]

  const randomPos = Math.floor(Math.random() * 100) % altImgList.length

  return altImgList[randomPos]
}

export default function Header() {
  const [profileModalVisible, setProfileModalVisible] = useState(false)
  const [imgUrl, setImgUrl] = useState(getIframeAltBackgroundImg())
  const lampClickCount = useRef(0)
  const inputRef = useRef()
  const lampRef = useRef()

  function changeTheme() {
    const theme = document.documentElement.dataset.theme
    const newTheme = theme === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', newTheme)
    document.documentElement.dataset.theme = newTheme
  }

  function handleAnswer() {
    const rightAnswers = [
      'Ranni',
      '拉妮',
      '魔女拉妮',
      '魔女菈妮',
      '菈妮',
      'Marika',
      'Queen Marika',
      '玛莉卡',
    ]
    const { value } = inputRef.current
    if (!rightAnswers.includes(value.trim())) {
      if (!value) {
        message.warning('请填写凶手')
      } else {
        message.error('很可惜，答案不正确')
      }
    } else {
      message.success('Welcome to the lands between, Tarnished.')
      localStorage.setItem('welcomed', true)
      navigate('/about')
      setProfileModalVisible(false)
    }
  }

  useEffect(() => {
    const changeImgTask = setInterval(
      () => setImgUrl(getIframeAltBackgroundImg()),
      3000
    )

    return () => clearInterval(changeImgTask)
  }, [])

  useEffect(() => {
    const lamp = lampRef.current
    const target = document.querySelector('.lamp-base')
    lamp.onmousedown = () => {
      target.classList.add('lamp-base-down')
    }
    lamp.onmouseup = () => {
      target.classList.remove('lamp-base-down')
    }

    lamp.onclick = () => {
      if (lampClickCount.current >= 5) {
        message.error('台灯坏了')
        navigate('/lamp-broken')
      }
      changeTheme()
      lampClickCount.current++
    }
  }, [])

  return (
    <>
      <header className="navbar">
        <nav>
          <div
            className="nav-link"
            onClick={() => {
              if (localStorage.getItem('welcomed')) {
                navigate('/about')
                return
              }
              setProfileModalVisible(true)
            }}
          >
            <img alt="avatar" src={avatar} />
            <span className="img-label">Louis K</span>
          </div>
          <Link to="/" className="nav-link" activeClassName="link-active">
            <span className="link-label">Tech</span>
          </Link>
          <Link
            to="/non-tech/"
            className="nav-link"
            activeClassName="link-active"
          >
            <span className="link-label">Ramble</span>
          </Link>

          <div className="nav-link" ref={lampRef}>
            <button className="lamp" aria-pressed="true" type="button">
              <span className="lamp-base"></span>
              <span className="lamp-neck"></span>
              <span className="lamp-head"></span>
            </button>
          </div>
        </nav>
      </header>

      <Modal
        visible={profileModalVisible}
        onClose={() => {
          setProfileModalVisible(false)
        }}
      >
        <div className="game">
          <h3>黑刀阴谋之夜，谁主使谋杀了半神“黄金”葛德文？</h3>

          <div className="question">
            <span>他/她是谁？</span>
            <input placeholder="写下凶手" type="text" ref={inputRef}></input>
            <button onClick={handleAnswer}>确定</button>
          </div>

          <img src={imgUrl} alt={imgUrl}></img>
        </div>
      </Modal>
    </>
  )
}
