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
  const fetchWorkplaces = useWorkplaceStore((s) => s.fetchWorkplaces)

  const isPublic = PUBLIC_PATHS.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )

  const isAuth = isPublic || checkAuth()

  useEffect(() => {
    if (isPublic) return
    if (!isAuth) { router.replace('/login'); return }
    fetchWorkplaces()
  }, [pathname, isPublic, isAuth, router, fetchWorkplaces])

  if (isPublic) return <>{children}</>
  if (!isAuth) return null

  return <>{children}</>
}
