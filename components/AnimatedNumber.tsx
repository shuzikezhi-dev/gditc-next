import { useEffect, useRef, useState } from 'react'

interface AnimatedNumberProps {
  value: number
  className?: string
  duration?: number
}

export default function AnimatedNumber({ value, className = '', duration = 2000 }: AnimatedNumberProps) {
  const [currentValue, setCurrentValue] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            animateNumber()
          }
        })
      },
      { threshold: 0.5 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])

  const animateNumber = () => {
    const startTime = Date.now()
    const startValue = 0

    const updateNumber = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      
      // 使用easeOutQuart缓动函数
      const easedProgress = 1 - Math.pow(1 - progress, 4)
      const current = Math.floor(startValue + (value - startValue) * easedProgress)
      
      setCurrentValue(current)

      if (progress < 1) {
        requestAnimationFrame(updateNumber)
      } else {
        setCurrentValue(value)
      }
    }

    requestAnimationFrame(updateNumber)
  }

  return (
    <div 
      ref={elementRef}
      className={`text-5xl font-bold text-primary mb-4 font-black transition-all duration-300 hover:text-secondary hover:scale-110 ${className}`}
    >
      {currentValue.toLocaleString()}
    </div>
  )
} 