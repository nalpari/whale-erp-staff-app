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
    const { workplaces, isLoading } = get()
    if (workplaces.length > 0 || isLoading) return
    set({ isLoading: true, error: null })
    try {
      const response = await workplaceApi.getWorkplaces()
      set({ workplaces: response.data, isLoading: false })
    } catch (err) {
      const message = err instanceof Error ? err.message : '사업장 목록을 불러오지 못했습니다.'
      set({ error: message, isLoading: false })
    }
  },
}))
