'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  children: React.ReactNode
}

export function RootPortal({ children }: Props) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // 只在客户端渲染时创建 portal
  if (!mounted) return null

  return createPortal(children, document.body)
}
