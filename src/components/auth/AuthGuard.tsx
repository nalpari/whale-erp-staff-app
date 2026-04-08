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

  // 렌더 시점에 토큰 유효성을 직접 검증한다.
  // checkAuth()는 Zustand set()만 호출하며 React setState를 호출하지 않는다.
  // isAuthenticated가 useSyncExternalStore로 구독되므로
  // checkAuth()가 Zustand 상태를 변경하면 자동으로 리렌더가 발생한다.
  const isVerified = isPublic || useAuthStore.getState().checkAuth()

  // 사이드이펙트: 인증 실패 시 리디렉션, 성공 시 사업장 목록 로드
  useEffect(() => {
    if (isPublic) return
    if (!isVerified) {
      router.replace('/login')
      return
    }
    fetchWorkplaces().catch((err) => {
      console.error('[AuthGuard] 사업장 목록 로드 실패:', err)
    })
  }, [pathname, isPublic, isVerified, router, fetchWorkplaces])

  if (isPublic) return <>{children}</>
  if (!isAuthenticated || !isVerified) return null

  return <>{children}</>
}
