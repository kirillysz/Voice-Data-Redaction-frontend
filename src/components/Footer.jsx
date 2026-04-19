import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      backgroundColor: 'var(--bg-card)',
      transition: 'background-color 0.2s',
    }}>
      <div className="max-w-5xl mx-auto px-6 h-12 flex items-center justify-between">
        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
          © {new Date().getFullYear()} detaflow. Все права защищены.
        </p>
        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
          Voice Data Redaction Service
        </p>
      </div>
    </footer>
  )
}
