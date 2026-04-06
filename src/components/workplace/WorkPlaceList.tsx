'use client'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { useRouter } from 'next/navigation'
import { useWorkplaceList } from '@/hooks/queries/use-workplace-queries'

const STATUS_BADGE: Record<string, { className: string; label: string }> = {
  EMPWK_001: { className: 'green', label: '근무' },
  EMPWK_002: { className: 'brown', label: '휴직' },
  EMPWK_003: { className: 'red', label: '퇴사' },
}

export default function WorkPlaceList() {
  const router = useRouter()
  const setWorkPlaceAddSheet = useBottomSheetController((state) => state.setWorkPlaceAddSheet)
  const { data, isPending: loading } = useWorkplaceList()
  const workplaces = data?.data ?? []

  if (loading) {
    return (
      <div className="data-wrap">
        <div className="data-tit">근무처/급여계좌 설정</div>
        <div className="data-list">
          <div className="data-item">
            <div className="workplace-empty">불러오는 중...</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="data-wrap">
      <div className="data-tit">근무처/급여계좌 설정</div>
      <div className="data-list">
        {workplaces.length === 0 ? (
          <div className="data-item">
            <div className="workplace-empty">등록된 근무처가 없습니다.</div>
          </div>
        ) : (
          workplaces.map((wp) => {
            const badge = wp.workStatus ? STATUS_BADGE[wp.workStatus] : null
            const displayName = wp.storeName
              ? `${wp.workplaceName} ${wp.storeName}`
              : wp.workplaceName

            return (
              <button
                className="data-item"
                key={wp.id}
                onClick={() => router.push(`/workplace/${wp.id}`)}
              >
                <div className="workplace-item-inner">
                  <div className="workplace-info">
                    {badge && (
                      <div className={`sub-badge ${badge.className}`}>{badge.label}</div>
                    )}
                    <div className="workplace-info-name">{displayName}</div>
                  </div>
                  <div className="workplace-arr">
                    <div className="data-list-arr"></div>
                  </div>
                </div>
              </button>
            )
          })
        )}
      </div>
      <div className="data-btn-wrap">
        <button className="btn-form login block" onClick={() => setWorkPlaceAddSheet(true)}>
          근무처 추가
        </button>
      </div>
    </div>
  )
}
