import React, { useEffect } from 'react'
import { navigate } from 'gatsby'
import { BaseLayout } from '../components'
import AvatarCard from '../components/avatar-card'

export default function AboutPage() {
  useEffect(() => {
    const welcomed = localStorage.getItem('welcomed')
    if (!welcomed) {
      navigate('/')
    }
  }, [])

  return (
    <BaseLayout>
      <AvatarCard />
    </BaseLayout>
  )
}
