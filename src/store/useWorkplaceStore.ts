'use client'

// ============================================================
// 사업장 상태 관리 Zustand 스토어
// ============================================================

import { create } from 'zustand'
import { workplaceApi } from '@/lib/api-endpoints'
import type { WorkplaceResponse } from '@/types/api'

interface WorkplaceState {
  /** 현재 선택된 사업장 ID (= employeeInfoId). null이면 '전체' 선택 상태 */
  selectedWorkplaceId: number | null
  /** 내 사업장 목록 */
  workplaces: WorkplaceResponse[]
  /** 데이터 로딩 중 여부 */
  isLoading: boolean
  /** 에러 메시지 */
  error: string | null

  setSelectedWorkplace: (id: number | null) => void
  fetchWorkplaces: () => Promise<void>
}

export const useWorkplaceStore = create<WorkplaceState>((set, get) => ({
  selectedWorkplaceId: null,
  workplaces: [],
  isLoading: false,
  error: null,

  setSelectedWorkplace: (id: number | null) => {
    set({ selectedWorkplaceId: id })
  },

  fetchWorkplaces: async () => {
    const { workplaces, isLoading, error } = get()
    // 이미 로드됐고 에러가 없으면 재호출 생략, 에러 상태면 재시도 허용
    if ((workplaces.length > 0 && !error) || isLoading) return
    set({ isLoading: true, error: null })
    try {
      const response = await workplaceApi.getWorkplaces()
      set({ workplaces: response.data, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : '사업장 목록을 불러오지 못했습니다.'
      console.error('[WorkplaceStore] 사업장 목록 로드 실패:', err)
      set({ error: message, isLoading: false })
    }
  },
}))
