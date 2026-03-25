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
    if (isPublic) {
      setChecked(true)
      return
    }

    // checkAuth()로 토큰 + user 정보를 localStorage에서 복원
    const isAuth = checkAuth()
    if (!isAuth) {
      router.replace('/login')
    } else {
      setChecked(true)
    }
  }, [pathname, isPublic, router, checkAuth])

  if (isPublic) return <>{children}</>
  if (!checked) return null

  return <>{children}</>
}
