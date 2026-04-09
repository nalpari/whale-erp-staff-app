'use client'
import { useState } from 'react'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'
import CommuteCheck from './CommuteCheck'
import CommuteWork from './CommuteWork'

interface Props {
  storeName: string | null
}

export default function CommuteContents({ storeName }: Props) {
  const [commuteTab, setCommuteTab] = useState<'check' | 'work'>('check')
  const workplaces = useWorkplaceStore((s) => s.workplaces)

  // ?store= 쿼리 소속 검증: 내 사업장 목록에 없는 점포명이면 차단
  if (storeName !== null) {
    const isOwned = workplaces.some(
      (wp) => wp.storeName === storeName || wp.workplaceName === storeName,
    )
    if (workplaces.length > 0 && !isOwned) {
      return (
        <div className="commute-contents">
          <div style={{ textAlign: 'center', padding: '40px 24px', color: '#999' }}>
            접근 권한이 없는 근무처입니다.
          </div>
        </div>
      )
    }
  }
  return (
    <div className="commute-contents">
      <div className="commute-contents-header">
        <div className="commute-tab-wrap">
          <button
            className={`btn-form block outline xs ${commuteTab === 'check' ? 'active' : ''}`}
            onClick={() => setCommuteTab('check')}
          >
            출퇴근 체크
          </button>
          <button
            className={`btn-form block outline xs ${commuteTab === 'work' ? 'active' : ''}`}
            onClick={() => setCommuteTab('work')}
          >
            근무일정
          </button>
        </div>
      </div>
      {commuteTab === 'check' ? (
        <CommuteCheck storeName={storeName} />
      ) : (
        <CommuteWork storeName={storeName} />
      )}
    </div>
  )
}
