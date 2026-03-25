'use client'

// ============================================================
// 인증 상태 관리 Zustand 스토어
// ============================================================

import { create } from 'zustand'
import { getAccessToken, setTokens, clearTokens } from '@/lib/api'
import type { LoginResponse } from '@/types/api'

interface AuthUser {
  memberId: number
  memberName: string
  loginId: string
  rank: string | null
  position: string | null
}

interface AuthState {
  /** 로그인 여부 */
  isAuthenticated: boolean
  /** 로그인한 사용자 정보 */
  user: AuthUser | null

  /** 로그인 처리 */
  login: (response: LoginResponse) => void
  /** 로그아웃 처리 */
  logout: () => void
  /** 인증 상태 복원 (새로고침 시) */
  checkAuth: () => boolean
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,

  login: (response: LoginResponse) => {
    setTokens(response.accessToken, response.refreshToken)
    const userInfo: AuthUser = {
      memberId: response.memberId,
      memberName: response.name,
      loginId: response.loginId,
      rank: response.rank,
      position: response.position,
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_info', JSON.stringify(userInfo))
    }
    set({ isAuthenticated: true, user: userInfo })
  },

  logout: () => {
    clearTokens()
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_info')
    }
    set({ isAuthenticated: false, user: null })
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  },

  checkAuth: () => {
    const token = getAccessToken()
    if (token) {
      let user: AuthUser | null = null
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('user_info')
          if (stored) user = JSON.parse(stored)
        } catch { /* 파싱 실패 무시 */ }
      }
      set({ isAuthenticated: true, user })
      return true
    }
    set({ isAuthenticated: false, user: null })
    return false
  },
}))
