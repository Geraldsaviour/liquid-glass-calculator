import { useState, useCallback } from 'react'
import * as math from 'mathjs'

const { evaluate } = math

const MAX_DISPLAY = 12

function formatResult(val) {
  if (typeof val === 'number' || typeof val === 'bigint') {
    const n = Number(val)
    if (!isFinite(n)) return 'Error'
    // Round to avoid floating point noise like 0.1+0.2=0.30000000004
    const rounded = parseFloat(n.toPrecision(10))
    const s = String(rounded)
    if (s.replace('.', '').replace('-', '').length > MAX_DISPLAY) {
      return rounded.toExponential(4)
    }
    return s
  }
  return String(val)
}

function autoCloseParens(expr) {
  // Count unclosed parens and close them
  let open = 0
  for (const ch of expr) {
    if (ch === '(') open++
    else if (ch === ')') open--
  }
  return expr + ')'.repeat(Math.max(0, open))
}

function fixExpression(expr, isDeg) {
  let e = expr

  // Replace display symbols
  e = e.replace(/×/g, '*')
  e = e.replace(/÷/g, '/')
  e = e.replace(/π/g, 'pi')
  e = e.replace(/√\(/g, 'sqrt(')
  e = e.replace(/∛\(/g, 'cbrt(')
  e = e.replace(/\^2/g, '^2')

  // Factorial: mathjs uses factorial(n) not n!
  // Handle patterns like "5!" or "sin(30)!"
  e = e.replace(/([0-9.]+)!/g, 'factorial($1)')
  e = e.replace(/\)!/g, ')') // strip trailing ! on expressions — too complex, skip

  // ln → log (natural log in mathjs is log())
  // log → log10
  e = e.replace(/\bln\(/g, 'log(')
  e = e.replace(/\blog\(/g, 'log10(')

  // Degree conversion for trig — wrap argument properly
  if (isDeg) {
    // forward trig: sin(x) → sin(x * pi / 180)
    e = e.replace(/\bsin\(/g, 'sin((pi/180)*')
    e = e.replace(/\bcos\(/g, 'cos((pi/180)*')
    e = e.replace(/\btan\(/g, 'tan((pi/180)*')
    // inverse trig: asin(x) → asin(x) * 180/pi
    // We wrap the whole call: asin(...) * (180/pi)
    // Use a placeholder approach — replace asin( with __asin(
    e = e.replace(/\basin\(/g, '__asin(')
    e = e.replace(/\bacos\(/g, '__acos(')
    e = e.replace(/\batan\(/g, '__atan(')
    e = e.replace(/__asin\(/g, '(180/pi)*asin(')
    e = e.replace(/__acos\(/g, '(180/pi)*acos(')
    e = e.replace(/__atan\(/g, '(180/pi)*atan(')
  }

  // Auto-close unclosed parentheses
  e = autoCloseParens(e)

  return e
}

export function useCalculator() {
  const [expr, setExpr] = useState('')
  const [display, setDisplay] = useState('0')
  const [history, setHistory] = useState('')
  const [memory, setMemory] = useState(0)
  const [isDeg, setIsDeg] = useState(true)
  const [isError, setIsError] = useState(false)
  const [justEvaluated, setJustEvaluated] = useState(false)

  const clear = useCallback(() => {
    setExpr(''); setDisplay('0'); setHistory(''); setIsError(false); setJustEvaluated(false)
  }, [])

  const backspace = useCallback(() => {
    if (justEvaluated) { clear(); return }
    setExpr(e => {
      const next = e.slice(0, -1)
      setDisplay(next || '0')
      return next
    })
    setIsError(false)
  }, [justEvaluated, clear])

  const input = useCallback((val) => {
    setIsError(false)
    setExpr(prev => {
      let next = prev
      if (justEvaluated) {
        const isOp = ['+', '-', '×', '÷', '^'].includes(val)
        next = isOp ? display : ''
        setJustEvaluated(false)
      }
      next = next + val
      setDisplay(next)
      return next
    })
  }, [justEvaluated, display])

  const negate = useCallback(() => {
    setExpr(prev => {
      if (!prev || prev === '0') return prev
      const next = prev.startsWith('-') ? prev.slice(1) : '-' + prev
      setDisplay(next)
      return next
    })
  }, [])

  const percent = useCallback(() => {
    setExpr(prev => {
      try {
        const val = Number(evaluate(fixExpression(prev, isDeg))) / 100
        const s = formatResult(val)
        setDisplay(s)
        return s
      } catch { return prev }
    })
  }, [isDeg])

  const calculate = useCallback(() => {
    if (!expr) return
    try {
      const fixed = fixExpression(expr, isDeg)
      const result = evaluate(fixed)
      const formatted = formatResult(result)
      if (formatted === 'Error') throw new Error()
      setHistory(expr + ' =')
      setDisplay(formatted)
      setExpr(formatted)
      setJustEvaluated(true)
      setIsError(false)
    } catch {
      setDisplay('Error')
      setIsError(true)
      setJustEvaluated(false)
    }
  }, [expr, isDeg])

  const memAdd = useCallback(() => {
    try { setMemory(m => m + (parseFloat(display) || 0)) } catch {}
  }, [display])

  const memSub = useCallback(() => {
    try { setMemory(m => m - (parseFloat(display) || 0)) } catch {}
  }, [display])

  const memRecall = useCallback(() => {
    const s = formatResult(memory)
    setDisplay(s); setExpr(s); setJustEvaluated(false)
  }, [memory])

  const memClear = useCallback(() => setMemory(0), [])

  return {
    display, history, isDeg, isError, memory,
    setIsDeg,
    actions: { input, clear, backspace, negate, percent, calculate, memAdd, memSub, memRecall, memClear }
  }
}
