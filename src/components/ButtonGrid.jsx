import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import ModeToggle from './ModeToggle'

// Ripple effect on click
function triggerRipple(e) {
  const btn = e.currentTarget
  const rect = btn.getBoundingClientRect()
  const ripple = document.createElement('span')
  const size = Math.max(rect.width, rect.height)
  ripple.style.cssText = `
    position:absolute; border-radius:50%; pointer-events:none;
    width:${size}px; height:${size}px;
    left:${e.clientX - rect.left - size / 2}px;
    top:${e.clientY - rect.top - size / 2}px;
    background:rgba(255,255,255,0.25);
    transform:scale(0); opacity:1;
  `
  btn.appendChild(ripple)
  gsap.to(ripple, {
    scale: 2.5, opacity: 0, duration: 0.5, ease: 'power2.out',
    onComplete: () => ripple.remove()
  })
}

const Btn = ({ label, onClick, cls = '' }) => {
  const btnRef = useRef(null)

  const handleClick = (e) => {
    triggerRipple(e)
    // Press scale
    gsap.timeline()
      .to(btnRef.current, { scale: 0.91, duration: 0.08, ease: 'power2.in' })
      .to(btnRef.current, { scale: 1,    duration: 0.25, ease: 'elastic.out(1, 0.4)' })
    onClick()
  }

  return (
    <button
      ref={btnRef}
      className={`calc-btn ${cls}`}
      onClick={handleClick}
      style={{ overflow: 'hidden' }}
    >
      {label}
    </button>
  )
}

const STANDARD = (a) => [
  [
    { l: 'AC',  cls: 'accent',   fn: a.clear },
    { l: '+/-', cls: 'accent',   fn: a.negate },
    { l: '%',   cls: 'accent',   fn: a.percent },
    { l: '÷',   cls: 'operator', fn: () => a.input('÷') },
  ],
  [
    { l: '7', fn: () => a.input('7') },
    { l: '8', fn: () => a.input('8') },
    { l: '9', fn: () => a.input('9') },
    { l: '×', cls: 'operator', fn: () => a.input('×') },
  ],
  [
    { l: '4', fn: () => a.input('4') },
    { l: '5', fn: () => a.input('5') },
    { l: '6', fn: () => a.input('6') },
    { l: '-', cls: 'operator', fn: () => a.input('-') },
  ],
  [
    { l: '1', fn: () => a.input('1') },
    { l: '2', fn: () => a.input('2') },
    { l: '3', fn: () => a.input('3') },
    { l: '+', cls: 'operator', fn: () => a.input('+') },
  ],
  [
    { l: '0', cls: 'wide', fn: () => a.input('0') },
    { l: '.', fn: () => a.input('.') },
    { l: '⌫', fn: a.backspace },
    { l: '=', cls: 'equals', fn: a.calculate },
  ],
]

export default function ButtonGrid({ actions, isDeg, setIsDeg, onModeChange, theme, onToggleTheme }) {
  const [mode, setMode] = useState('standard')
  const gridRef = useRef(null)
  const prevMode = useRef('standard')

  const changeMode = (m) => {
    if (m === mode) return
    prevMode.current = mode
    setMode(m)
    onModeChange?.(m)
  }

  // If viewport shrinks to mobile while in 'both' mode, fall back to 'standard'
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const handleChange = (e) => {
      if (e.matches && mode === 'both') changeMode('standard')
    }
    mq.addEventListener('change', handleChange)
    return () => mq.removeEventListener('change', handleChange)
  }, [mode])

  const changeMode = (m) => {
    if (m === mode) return
    prevMode.current = mode
    setMode(m)
    onModeChange?.(m)
  }

  // Stagger buttons in on mount
  useEffect(() => {
    const btns = gridRef.current?.querySelectorAll('.calc-btn')
    if (!btns) return
    gsap.fromTo(btns,
      { opacity: 0, y: 20, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out', stagger: 0.03, delay: 0.4 }
    )
  }, [])

  // Animate grid when mode changes
  useEffect(() => {
    const btns = gridRef.current?.querySelectorAll('.calc-btn')
    if (!btns) return
    gsap.fromTo(btns,
      { opacity: 0, y: 14, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'power3.out', stagger: 0.018 }
    )
  }, [mode])

  const sciRows = [
    [
      { l: 'sin',  cls: 'sci', fn: () => actions.input('sin(') },
      { l: 'cos',  cls: 'sci', fn: () => actions.input('cos(') },
      { l: 'tan',  cls: 'sci', fn: () => actions.input('tan(') },
      { l: isDeg ? 'DEG' : 'RAD', cls: 'sci accent', fn: () => setIsDeg(d => !d) },
    ],
    [
      { l: 'asin', cls: 'sci', fn: () => actions.input('asin(') },
      { l: 'acos', cls: 'sci', fn: () => actions.input('acos(') },
      { l: 'atan', cls: 'sci', fn: () => actions.input('atan(') },
      { l: 'n!',   cls: 'sci', fn: () => actions.input('!') },
    ],
    [
      { l: 'log',  cls: 'sci', fn: () => actions.input('log(') },
      { l: 'ln',   cls: 'sci', fn: () => actions.input('ln(') },
      { l: 'x²',   cls: 'sci', fn: () => actions.input('^2') },
      { l: '√',    cls: 'sci', fn: () => actions.input('√(') },
    ],
    [
      { l: 'xⁿ',  cls: 'sci', fn: () => actions.input('^') },
      { l: '∛',   cls: 'sci', fn: () => actions.input('∛(') },
      { l: 'π',   cls: 'sci', fn: () => actions.input('π') },
      { l: 'e',   cls: 'sci', fn: () => actions.input('e') },
    ],
    [
      { l: '(',   cls: 'sci', fn: () => actions.input('(') },
      { l: ')',   cls: 'sci', fn: () => actions.input(')') },
      { l: 'MR',  cls: 'sci', fn: actions.memRecall },
      { l: 'MC',  cls: 'sci', fn: actions.memClear },
    ],
    [
      { l: 'M+',  cls: 'sci', fn: actions.memAdd },
      { l: 'M-',  cls: 'sci', fn: actions.memSub },
      { l: 'AC',  cls: 'sci accent', fn: actions.clear },
      { l: '⌫',  cls: 'sci', fn: actions.backspace },
    ],
  ]

  const stdRows = STANDARD(actions)

  return (
    <div>
      <div className="top-controls">
        <ModeToggle theme={theme} onToggle={onToggleTheme} />
        <div className="mode-tabs">
          {['standard', 'scientific', 'both'].map(m => (
            <button
              key={m}
              className={`mode-tab ${mode === m ? 'active' : 'inactive'} ${m === 'both' ? 'desktop-only' : ''}`}
              onClick={() => changeMode(m)}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div ref={gridRef}>
        {mode === 'both' ? (
          <div className="both-layout">
            <div className="btn-grid scientific">
              {sciRows.flat().map((b, i) => <Btn key={i} label={b.l} onClick={b.fn} cls={b.cls || ''} />)}
            </div>
            <div className="both-divider" />
            <div className="btn-grid">
              {stdRows.flat().map((b, i) => <Btn key={i} label={b.l} onClick={b.fn} cls={b.cls || ''} />)}
            </div>
          </div>
        ) : (
          <div className={`btn-grid ${mode === 'scientific' ? 'scientific' : ''}`}>
            {(mode === 'scientific' ? sciRows.flat() : stdRows.flat())
              .map((b, i) => <Btn key={i} label={b.l} onClick={b.fn} cls={b.cls || ''} />)}
          </div>
        )}
      </div>
    </div>
  )
}
