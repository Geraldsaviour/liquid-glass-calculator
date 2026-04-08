import React, { useRef } from 'react'
import { gsap } from 'gsap'

export default function ModeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  const thumbRef = useRef(null)
  const switchRef = useRef(null)

  const handleToggle = () => {
    if (thumbRef.current) {
      gsap.timeline({ onComplete: onToggle })
        .to(thumbRef.current, { scale: 0.8, duration: 0.1, ease: 'power2.in' })
        .to(thumbRef.current, { scale: 1.15, duration: 0.15, ease: 'power2.out' })
        .to(thumbRef.current, { scale: 1, duration: 0.2, ease: 'elastic.out(1, 0.4)' })
    } else {
      onToggle()
    }

    if (switchRef.current) {
      gsap.fromTo(switchRef.current,
        { boxShadow: '0 0 0px rgba(255,200,50,0)' },
        { boxShadow: isDark
            ? '0 0 18px rgba(120,100,255,0.6)'
            : '0 0 18px rgba(255,200,50,0.7)',
          duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out'
        }
      )
    }
  }

  return (
    <button
      ref={switchRef}
      className={`theme-switch ${isDark ? 'theme-switch--dark' : 'theme-switch--light'}`}
      onClick={handleToggle}
      aria-label="Toggle theme"
    >
      <svg className="theme-switch__icon theme-switch__icon--sun" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      <span ref={thumbRef} className="theme-switch__thumb" />
      <svg className="theme-switch__icon theme-switch__icon--moon" width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
      </svg>
    </button>
  )
}
