import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import { CloseOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
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
    <AnimatePresence>
      {visible && (
        <motion.div
          className={clsx('modal-wrapper')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          ref={contentRef}
          onClick={e => {
            if (e.target === contentRef.current) {
              onClose()
            }
          }}
        >
          <motion.div
            className={clsx('modal-content')}
            initial={{
              rotate: '90deg',
            }}
            animate={{
              rotate: '0deg',
            }}
            exit={{
              x: -100,
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
      )}
    </AnimatePresence>
  )
}
