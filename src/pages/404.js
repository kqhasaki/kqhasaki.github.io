import React, { useEffect } from 'react'
import BaseLayout from '../components/base-layout'

export function getImgURL() {
  const altImgList1 = [
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h288vhuxr4j21hc0u0q7u.jpg',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h288vi9929j20sg0g0di4.jpg',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h289uy4n4rj212w0jgdii.jpg',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h288vjgegkj21hc0ofjts.jpg',
  ]

  const altImgList2 = [
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h28a51e4scj20u01hcaj3.jpg',
    'https://tva1.sinaimg.cn/large/e6c9d24egy1h28a4zbpkwj20kg10cwib.jpg',
  ]

  let altImgList = altImgList1

  const width = document.body.clientWidth

  if (width < 750) {
    altImgList = altImgList2
  }

  const randomPos = Math.floor(Math.random() * 100) % altImgList.length

  return altImgList[randomPos]
}

export default function NotFoundView() {
  useEffect(() => {
    const mainDiv = document.querySelector('.not-found-background')

    mainDiv.style.backgroundImage = `url(${getImgURL()})`
    mainDiv.style.backgroundPosition = 'center'
    mainDiv.style.backgroundSize = 'cover'
  }, [])

  return (
    <BaseLayout additionalClass={['not-found-background']}>
      <h1>YOU DIED</h1>
    </BaseLayout>
  )
}
