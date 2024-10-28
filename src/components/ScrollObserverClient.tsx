'use client'

import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { headerVisibleAtom, headerTitleAtom } from '@/store/headerState'

export function ScrollObserverClient() {
  const setHeaderVisible = useSetAtom(headerVisibleAtom)
  const setHeaderTitle = useSetAtom(headerTitleAtom)

  useEffect(() => {
    let lastScrollY = window.scrollY
    let ticking = false

    const updateHeader = () => {
      const scrollY = window.scrollY
      const isScrollingDown = scrollY > lastScrollY
      const isScrolledPastThreshold = scrollY > 100

      // 更新导航栏可见性
      setHeaderVisible(!isScrollingDown || !isScrolledPastThreshold)

      // 更新页面标题
      const h1 = document.querySelector('h1')
      if (h1 && isScrolledPastThreshold) {
        setHeaderTitle(h1.textContent)
      } else {
        setHeaderTitle(null)
      }

      lastScrollY = scrollY
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateHeader()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return null
}
