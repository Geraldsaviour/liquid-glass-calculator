import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import Display from './Display'
import ButtonGrid from './ButtonGrid'
import { useCalculator } from '../hooks/useCalculator'

export default function Calculator({ theme, onToggleTheme }) {
  const { display, history, isDeg, isError, setIsDeg, actions } = useCalculator()
  const [gridMode, setGridMode] = useState('standard')
  const cardRef = useRef(null)

  // Card entrance animation on mount
  useEffect(() => {
    const card = cardRef.current
    gsap.fromTo(card,
      { opacity: 0, y: 60, scale: 0.92, filter: 'blur(12px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1, ease: 'expo.out', delay: 0.1 }
    )
  }, [])

  // Card expand/contract when switching to Both mode
  useEffect(() => {
    gsap.to(cardRef.current, {
      duration: 0.5,
      ease: 'expo.inOut',
    })
  }, [gridMode])

  return (
    <div
      ref={cardRef}
      className={`glass-card ${gridMode === 'both' ? 'card-wide' : ''}`}
    >
      <Display history={history} value={display} isError={isError} />
      <ButtonGrid actions={actions} isDeg={isDeg} setIsDeg={setIsDeg} onModeChange={setGridMode} theme={theme} onToggleTheme={onToggleTheme} />
    </div>
  )
}
