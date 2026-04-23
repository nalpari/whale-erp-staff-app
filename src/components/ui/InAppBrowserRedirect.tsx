'use client'

import { useEffect } from 'react'

const SESSION_KEY = 'tried-app-open'
const APP_SCHEME = 'whaleerpstaff://'
const FALLBACK_DELAY_MS = 1500

function showInstallGuide() {
  alert(
    '앱을 사용하시려면 우측 상단 메뉴에서 "다른 브라우저에서 열기"를 눌러주세요.\n' +
      '앱을 설치하시려면 스토어로 이동해 주세요.',
  )
}

function tryOpenInApp() {
  if (typeof window === 'undefined') return

  const ua = navigator.userAgent

  const isKakao = /KAKAOTALK/i.test(ua)
  const isLine = /Line\//i.test(ua)
  const isFB = /FB(AN|AV|IOS)/i.test(ua)
  const isInsta = /Instagram/i.test(ua)
  const inAppBrowser = isKakao || isLine || isFB || isInsta

  if (!inAppBrowser) return

  if (sessionStorage.getItem(SESSION_KEY)) return
  sessionStorage.setItem(SESSION_KEY, '1')

  const target = APP_SCHEME + location.host + location.pathname + location.search + location.hash

  const fallbackTimer = setTimeout(() => {
    showInstallGuide()
  }, FALLBACK_DELAY_MS)

  const cancelFallback = () => {
    if (document.hidden) {
      clearTimeout(fallbackTimer)
      document.removeEventListener('visibilitychange', cancelFallback)
    }
  }
  document.addEventListener('visibilitychange', cancelFallback)

  location.href = target
}

export default function InAppBrowserRedirect() {
  useEffect(() => {
    tryOpenInApp()
  }, [])

  return null
}
