'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'

// 로그인 없이 접근 가능한 경로
const PUBLIC_PATHS = ['/login', '/signup', '/request', '/list']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const checkAuth = useAuthStore((s) => s.checkAuth)
  // isAuthenticated: 초기값 false(SSR), checkAuth()가 Zustand set()으로 업데이트 → re-render 유발
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const fetchWorkplaces = useWorkplaceStore((s) => s.fetchWorkplaces)

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )

  // 클라이언트에서만 인증 상태 복원 (SSR에서는 실행되지 않음)
  // checkAuth() 내부에서 Zustand set() 호출 → isAuthenticated 업데이트 → re-render
  useEffect(() => {
    if (isPublic) return
    const isAuth = checkAuth()
    if (!isAuth) {
      router.replace('/login')
      return
    }
    fetchWorkplaces().catch((err) => {
      console.error('[AuthGuard] 사업장 목록 로드 실패:', err)
    })
  }, [pathname, isPublic, router, checkAuth, fetchWorkplaces])

  if (isPublic) return <>{children}</>
  // 초기 SSR / effect 실행 전: null 렌더 (서버와 동일하므로 hydration 불일치 없음)
  if (!isAuthenticated) return null

  return <>{children}</>
}
