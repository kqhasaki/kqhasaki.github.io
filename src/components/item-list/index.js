import React from 'react'
import './index.css'

export default function ItemList({ items }) {
  return (
    <div className="item-list">
      {Array.isArray(items) &&
        items.map(({ content, label }, idx) => (
          <div className="item" key={idx}>
            <div className="item-label">{label}</div>
            <div className="item-content">{content}</div>
          </div>
        ))}
    </div>
  )
}
