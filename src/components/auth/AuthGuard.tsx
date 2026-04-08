'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

// 로그인 없이 접근 가능한 경로
const PUBLIC_PATHS = ['/login', '/signup', '/request', '/list']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const checkAuth = useAuthStore((s) => s.checkAuth)
  const [checked, setChecked] = useState(false)

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )

  useEffect(() => {
    // 경로 변경마다 초기화하여 만료된 토큰으로 보호 UI가 노출되지 않도록 방지
    if (isPublic) {
      // setTimeout으로 감싸 동기 setState 경고 방지
      const id = setTimeout(() => setChecked(true), 0)
      return () => clearTimeout(id)
    }
    const id = setTimeout(() => {
      const isAuth = checkAuth()
      if (!isAuth) { router.replace('/login'); return }
      setChecked(true)
    }, 0)
    return () => clearTimeout(id)
  }, [pathname, isPublic, router, checkAuth])

  if (isPublic) return <>{children}</>
  if (!checked) return null

  return <>{children}</>
}
