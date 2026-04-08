'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'

// 로그인 없이 접근 가능한 경로
const PUBLIC_PATHS = ['/login', '/signup', '/request', '/list']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const checkAuth = useAuthStore((s) => s.checkAuth)
  const fetchWorkplaces = useWorkplaceStore((s) => s.fetchWorkplaces)
  const [checked, setChecked] = useState(false)

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )

  // 사이드이펙트: 인증 실패 시 리디렉션, 성공 시 사업장 목록 로드
  // checkAuth()는 반드시 useEffect 내부에서만 호출 (렌더 중 Zustand set() 금지)
  useEffect(() => {
    if (isPublic) {
      setChecked(true)
      return
    }
    const isAuth = checkAuth()
    if (!isAuth) {
      router.replace('/login')
      return
    }
    fetchWorkplaces().catch((err) => {
      console.error('[AuthGuard] 사업장 목록 로드 실패:', err)
    })
    setChecked(true)
  }, [pathname, isPublic, router, checkAuth, fetchWorkplaces])

  if (isPublic) return <>{children}</>
  if (!checked) return null

  return <>{children}</>
}
