import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Calculator from './components/Calculator'
import { useTheme } from './hooks/useTheme'

export default function App() {
  const { theme, toggle } = useTheme()
  const bgRef = useRef(null)

  // Subtle background parallax on mouse move
  useEffect(() => {
    const bg = bgRef.current
    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth  - 0.5) * 18
      const y = (e.clientY / window.innerHeight - 0.5) * 18
      gsap.to(bg, {
        backgroundPosition: `${50 + x}% ${50 + y}%`,
        duration: 1.2,
        ease: 'power2.out'
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div ref={bgRef} className="app-bg" data-theme={theme}>
      <div className="app-center">
        <Calculator theme={theme} onToggleTheme={toggle} />
      </div>
    </div>
  )
}
