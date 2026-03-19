'use client'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'

export default function SubHeader() {
  const router = useRouter()
  const pathname = usePathname()
  if (pathname === '/login') {
    return null
  }
  const title = [
    {
      path: '/request',
      title: '본인 인증 요청',
    },
    {
      path: '/signup',
      title: '회원가입',
    },
  ]
  return (
    <div className="sub-header">
      <div className="sub-header-inner">
        <div className="sub-header-back">
          <button onClick={() => router.back()}></button>
        </div>
        <h1 className="sub-header-title">{title.find((item) => item.path === pathname)?.title}</h1>
      </div>
    </div>
  )
}
