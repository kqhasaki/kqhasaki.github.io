import React, { useRef } from 'react'
import clsx from 'clsx'
import { CloseOutlined } from '@ant-design/icons'
import './index.css'

export default function Modal({
  visible = false,
  onClose = () => {},
  children,
}) {
  const contentRef = useRef()

  return (
    <div
      className={clsx('modal-wrapper', !visible && 'invisible')}
      ref={contentRef}
      onClick={e => {
        if (e.target === contentRef.current) {
          onClose()
        }
      }}
    >
      <div className={clsx('modal-content')}>
        <div className={clsx('modal-closer')} onClick={onClose}>
          <CloseOutlined />
        </div>
        {children}
      </div>
    </div>
  )
}
