'use client'

import { BluredBackground } from './BluredBackground'
import { HeaderContent } from './HeaderContent'
import { SearchButton } from './SearchButton'
import { AnimatedLogo } from './AnimatedLogo'
import { HeaderMeta } from './HeaderMeta'
import { HeaderDrawer } from './HeaderDrawer'
import { useIsMobile } from './hooks'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function Header() {
  const isMobile = useIsMobile()
  const [isVisible, setIsVisible] = useState(true)
  const [pageTitle, setPageTitle] = useState<string | null>(null)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateHeader = () => {
      const scrollY = window.scrollY
      const isScrollingDown = scrollY > lastScrollY
      const isScrolledPastThreshold = scrollY > 100

      setIsVisible(!isScrollingDown || !isScrolledPastThreshold)

      const h1 = document.querySelector('h1')
      if (h1 && isScrolledPastThreshold) {
        setPageTitle(h1.textContent)
      } else {
        setPageTitle(null)
      }

      setLastScrollY(scrollY)
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
  }, [lastScrollY])

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-primary/80 backdrop-blur border-b border-primary"
    >
      <BluredBackground />
      <div className="max-w-[1100px] h-full md:px-4 mx-auto grid grid-cols-[64px_auto_64px]">
        <div className="flex items-center justify-center">
          {isMobile ? <HeaderDrawer /> : <AnimatedLogo />}
        </div>
        <div className="relative flex items-center justify-center">
          {pageTitle ? (
            <h1 
              className="text-lg font-bold truncate"
            >
              {pageTitle}
            </h1>
          ) : (
            isMobile ? <AnimatedLogo /> : <HeaderContent />
          )}
          <HeaderMeta />
        </div>
        <div className="flex items-center justify-center">
          <SearchButton />
        </div>
      </div>
    </header>
  )
}
