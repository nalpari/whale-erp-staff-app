'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'

// 로그인 없이 접근 가능한 경로
const PUBLIC_PATHS = ['/login', '/signup', '/request', '/list']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const checkAuth = useAuthStore((s) => s.checkAuth)
  // checked: 인증 완료 여부 (ref로 관리하여 리렌더 최소화)
  const checkedRef = useRef(false)
  const [checked, setChecked] = useState(false)

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )

  useEffect(() => {
    // 공개 경로는 인증 검사 불필요
    if (isPublic) return

    // checkAuth()로 토큰 + user 정보를 localStorage에서 복원
    const isAuth = checkAuth()
    if (!isAuth) {
      router.replace('/login')
      return
    }
    // 비동기 마이크로태스크로 setState 호출 (effect 내 동기 setState 방지)
    const timer = setTimeout(() => {
      if (!checkedRef.current) {
        checkedRef.current = true
        setChecked(true)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [pathname, isPublic, router, checkAuth])

  if (isPublic) return <>{children}</>
  if (!checked) return null

  return <>{children}</>
}
