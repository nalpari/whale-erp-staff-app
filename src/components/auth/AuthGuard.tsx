'use client'

import { useEffect, useSyncExternalStore } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/useAuthStore'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'

// 로그인 없이 접근 가능한 경로
const PUBLIC_PATHS = ['/login', '/signup', '/request', '/list']

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const fetchWorkplaces = useWorkplaceStore((s) => s.fetchWorkplaces)

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )

  // SSR-safe: 서버 스냅샷은 false, 클라이언트는 Zustand 실제 값 구독
  const isAuthenticated = useSyncExternalStore(
    useAuthStore.subscribe,
    () => useAuthStore.getState().isAuthenticated,
    () => false,
  )

  useEffect(() => {
    if (isPublic) return
    // checkAuth()는 Zustand set()만 호출 (React setState 아님)
    const isAuth = useAuthStore.getState().checkAuth()
    if (!isAuth) { router.replace('/login'); return }
    fetchWorkplaces()
  }, [pathname, isPublic, router, fetchWorkplaces])

  if (isPublic) return <>{children}</>
  if (!isAuthenticated) return null

  return <>{children}</>
}
