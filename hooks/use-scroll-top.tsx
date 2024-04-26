import { useState, useEffect } from 'react'

// 判断当前是否滚动到顶部
// 如果滚动到顶部，返回true
// 如果没有滚动到顶部，返回false
// 这里使用了useState和useEffect两个hook
// 一般情况下使用useEffect来监听滚动事件，因为滚动事件不需要每次都执行，且和组件渲染无关
export const useScrollTop = (threshold = 10) => {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > threshold) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [threshold])
  return scrolled
}
