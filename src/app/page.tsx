'use client'

import { useEffect, useRef } from 'react'
import MainContents from '@/components/main/MainContents'
import MainEmptyStore from '@/components/main/MainEmptyStore'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'
import { useAuthStore } from '@/store/useAuthStore'
import { usePopupController } from '@/store/usePopupController'
import { contractApi } from '@/lib/api-endpoints'

export default function Home() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const workplaces = useWorkplaceStore((s) => s.workplaces)
  const isLoading = useWorkplaceStore((s) => s.isLoading)
  const fetchWorkplaces = useWorkplaceStore((s) => s.fetchWorkplaces)
  const setEmploymentNotificationPopup = usePopupController((s) => s.setEmploymentNotificationPopup)
  const setPendingContracts = usePopupController((s) => s.setPendingContracts)
  const checkedRef = useRef(false)

  useEffect(() => {
    if (isAuthenticated) {
      fetchWorkplaces()

      // PROGRESS 상태 근로계약서 확인 (최초 1회만)
      if (!checkedRef.current) {
        checkedRef.current = true
        contractApi.getContracts().then((res) => {
          console.log('[Home] 계약 조회 응답:', res)
          const progressContracts = (res.data ?? []).filter(
            (c) => c.status === 'PROGRESS'
          )
          console.log('[Home] PROGRESS 계약:', progressContracts.length, '건')
          if (progressContracts.length > 0) {
            setPendingContracts(progressContracts)
            setEmploymentNotificationPopup(true)
          }
        }).catch((err) => {
          console.error('[Home] 계약 조회 실패:', err)
        })
      }
    }
  }, [isAuthenticated, fetchWorkplaces, setEmploymentNotificationPopup, setPendingContracts])

  // 로딩 중에는 빈 화면
  if (isLoading) {
    return (
      <div className="container main">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', color: '#999' }}>
          로딩 중...
        </div>
      </div>
    )
  }

  // 유효한 근무처가 없으면 EmptyStore, 있으면 MainContents
  return workplaces.length > 0 ? <MainContents /> : <MainEmptyStore />
}
