'use client'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const pathnameArray = ['/', '/request', '/signup', '/commute', '/todo', '/mypage/profile']
  return (
    <footer className={pathnameArray.includes(pathname) ? 'main' : ''}>
      <div className="footer-container">Copyrights© 2025 따름인 All Rights Reserved.</div>
    </footer>
  )
}
