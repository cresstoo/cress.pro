'use client'

import { useEffect } from 'react'
import { useSetAtom } from 'jotai'
import { headerVisibleAtom, headerTitleAtom } from '@/store/headerState'

export default function ScrollProvider() {
  const setHeaderVisible = useSetAtom(headerVisibleAtom)
  const setHeaderTitle = useSetAtom(headerTitleAtom)

  useEffect(() => {
    if (typeof window === 'undefined') return

    let lastScrollY = window.scrollY
    let ticking = false

    const updateHeader = () => {
      const scrollY = window.scrollY
      const isScrollingDown = scrollY > lastScrollY
      const isScrolledPastThreshold = scrollY > 100

      setHeaderVisible(!isScrollingDown || !isScrolledPastThreshold)

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
        requestAnimationFrame(() => {
          updateHeader()
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [setHeaderVisible, setHeaderTitle])

  return null
}
