import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { CloseOutlined } from '@ant-design/icons'
import { motion } from 'framer-motion'
import './index.css'

export default function Modal({
  visible = false,
  onClose = () => {},
  children,
}) {
  const contentRef = useRef()

  useEffect(() => {
    document.body.style.overflow = visible ? 'hidden' : 'initial'
  }, [visible])

  return (
    <motion.div
      className={clsx('modal-wrapper', !visible && 'invisible')}
      animate={{ opacity: visible ? 1 : 0 }}
      ref={contentRef}
      onClick={e => {
        if (e.target === contentRef.current) {
          onClose()
        }
      }}
    >
      <motion.div
        className={clsx('modal-content')}
        animate={{
          rotate: visible ? '0deg' : '90deg',
        }}
      >
        <motion.div
          className={clsx('modal-closer')}
          onClick={onClose}
          whileHover={{ scale: 1.2 }}
        >
          <CloseOutlined />
        </motion.div>
        {children}
      </motion.div>
    </motion.div>
  )
}
