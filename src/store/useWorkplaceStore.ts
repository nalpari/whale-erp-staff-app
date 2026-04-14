'use client'

// ============================================================
// 사업장 상태 관리 Zustand 스토어
// ============================================================

import { create } from 'zustand'
import { workplaceApi } from '@/lib/api-endpoints'
import type { WorkplaceResponse } from '@/types/api'

/** 데이터 재조회 허용 간격 (밀리초). 이 시간 이내에는 중복 호출 차단 */
const STALE_TIME_MS = 60_000  // 60초

interface WorkplaceState {
  /** 현재 선택된 사업장 ID (= employeeInfoId). null이면 '전체' 선택 상태 */
  selectedWorkplaceId: number | null
  /** 내 사업장 목록 */
  workplaces: WorkplaceResponse[]
  /** 데이터 로딩 중 여부 */
  isLoading: boolean
  /** 에러 메시지 */
  error: string | null
  /** 마지막 fetch 완료 시각 (timestamp). null이면 미조회 */
  lastFetchedAt: number | null

  setSelectedWorkplace: (id: number | null) => void
  /** 사업장 목록 조회. STALE_TIME_MS 이내 재호출은 무시 (concurrent 방지 포함) */
  fetchWorkplaces: () => Promise<void>
  /** 강제 재조회 (계약 연결 등 즉시 갱신이 필요한 경우 사용) */
  refreshWorkplaces: () => Promise<void>
  reset: () => void
}

export const useWorkplaceStore = create<WorkplaceState>((set, get) => ({
  selectedWorkplaceId: null,
  workplaces: [],
  isLoading: false,
  error: null,
  lastFetchedAt: null,

  setSelectedWorkplace: (id: number | null) => {
    set({ selectedWorkplaceId: id })
  },

  reset: () => {
    set({ selectedWorkplaceId: null, workplaces: [], isLoading: false, error: null, lastFetchedAt: null })
  },

  fetchWorkplaces: async () => {
    const { isLoading, lastFetchedAt, error } = get()
    // 로딩 중이면 중복 호출 차단
    if (isLoading) return
    // 에러 없이 최근에 조회했다면 재조회 생략 (stale time 이내)
    if (!error && lastFetchedAt && (Date.now() - lastFetchedAt < STALE_TIME_MS)) return

    set({ isLoading: true, error: null })
    try {
      const response = await workplaceApi.getWorkplaces()
      set({ workplaces: response.data, isLoading: false, lastFetchedAt: Date.now() })
    } catch (err) {
      const message = err instanceof Error ? err.message : '사업장 목록을 불러오지 못했습니다.'
      console.error('[WorkplaceStore] 사업장 목록 로드 실패:', err)
      set({ error: message, isLoading: false })
    }
  },

  refreshWorkplaces: async () => {
    const { isLoading } = get()
    if (isLoading) return
    // stale time 무시하고 즉시 재조회
    set({ lastFetchedAt: null })
    await get().fetchWorkplaces()
  },
}))
