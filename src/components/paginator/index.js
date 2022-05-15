import React from 'react'
import {
  LeftOutlined,
  RightOutlined,
  EllipsisOutlined,
} from '@ant-design/icons'
import './index.css'

export default function Paginator({
  currentPage,
  totalPage,
  navigateToPage = () => {},
}) {
  return (
    <div className="paginator">
      {currentPage > 1 && (
        <div
          className="paginator-item"
          onClick={() => navigateToPage(currentPage - 1)}
        >
          <LeftOutlined />
        </div>
      )}
      {currentPage > 1 && (
        <div className="paginator-item" onClick={() => navigateToPage(1)}>
          1
        </div>
      )}
      {currentPage > 2 && (
        <div className="ellipsis">
          <EllipsisOutlined />
        </div>
      )}
      <div className="paginator-item paginator-item-active">{currentPage}</div>
      {currentPage < totalPage - 1 && (
        <div className="ellipsis">
          <EllipsisOutlined />
        </div>
      )}
      {currentPage < totalPage && (
        <div
          className="paginator-item"
          onClick={() => navigateToPage(totalPage)}
        >
          {totalPage}
        </div>
      )}
      {currentPage < totalPage && (
        <div
          className="paginator-item"
          onClick={() => navigateToPage(currentPage + 1)}
        >
          <RightOutlined />
        </div>
      )}
    </div>
  )
}
