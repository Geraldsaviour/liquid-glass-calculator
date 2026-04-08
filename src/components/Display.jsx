import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Display({ history, value, isError }) {
  const valueRef = useRef(null)
  const historyRef = useRef(null)
  const panelRef = useRef(null)
  const prevValue = useRef(value)

  // Animate value change
  useEffect(() => {
    if (prevValue.current === value) return
    prevValue.current = value

    gsap.fromTo(valueRef.current,
      { opacity: 0, y: 8, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.22, ease: 'power3.out' }
    )
  }, [value])

  // Animate history line
  useEffect(() => {
    if (!history) return
    gsap.fromTo(historyRef.current,
      { opacity: 0, x: 10 },
      { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
    )
  }, [history])

  // Error shake
  useEffect(() => {
    if (!isError) return
    gsap.timeline()
      .to(panelRef.current, { x: -8, duration: 0.07, ease: 'power2.out' })
      .to(panelRef.current, { x: 8,  duration: 0.07, ease: 'power2.out' })
      .to(panelRef.current, { x: -5, duration: 0.06, ease: 'power2.out' })
      .to(panelRef.current, { x: 5,  duration: 0.06, ease: 'power2.out' })
      .to(panelRef.current, { x: 0,  duration: 0.05, ease: 'power2.out' })
  }, [isError])

  return (
    <div ref={panelRef} className={`display-panel ${isError ? 'error' : ''}`}>
      <div ref={historyRef} className="display-expr">{history}</div>
      <div ref={valueRef} className="display-value">{value}</div>
    </div>
  )
}
