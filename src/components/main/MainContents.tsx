'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePopupController } from '@/store/usePopupController'
import { useAuthStore } from '@/store/useAuthStore'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'
import { useTodoMonthlyCalendar } from '@/hooks/queries'
import { formatDateKorean, formatDate } from '@/lib/date-utils'
import type { OrgGroup } from '@/types/todo'

export default function MainContents() {
  const router = useRouter()
  const setQrCodePopup = usePopupController((state) => state.setQrCodePopup)
  const setAIChatPopup = usePopupController((state) => state.setAIChatPopup)
  const memberId = useAuthStore((s) => s.user?.memberId)
  const selectedWorkplaceId = useWorkplaceStore((s) => s.selectedWorkplaceId)

  // 렌더마다 재생성 방지: 마운트 시점의 날짜로 고정
  const [today] = useState(() => new Date())
  const { data: calendarResponse, isLoading: isTodoLoading, isError: isTodoError } = useTodoMonthlyCalendar(
    memberId,
    today.getFullYear(),
    today.getMonth() + 1,
    selectedWorkplaceId,
  )

  const todayData = calendarResponse?.data.find((d) => d.day === today.getDate()) ?? null
  const totalTodoCount = todayData?.totalCount ?? 0

  const handleTodoClick = () => {
    router.push(`/todo?date=${formatDate(today)}`)
  }

  return (
    <div className="container main">
      <div className="main-contents">
        <div className="dtae-calendar-wrap"></div>
        <div className="date-list-wrap">
          <div className="date-list-header">
            <div className="date-list-tit">{formatDateKorean(today)}</div>
            <div className="data-jop-wrap">
              <div className="data-jop work">근무: 2일</div>
              <div className="data-jop todo">
                TO-DO: {isTodoLoading ? '...' : isTodoError ? '-' : `${totalTodoCount}개`}
              </div>
            </div>
          </div>
          <ul className="date-cont-list">
            <li className="date-cont-item">
              <div className="date-cont-header">
                <div className="date-cont-ring" style={{ backgroundColor: '#88BDD4' }}></div>
                <div className="date-cont-info">
                  <div className="date-cont-info-name">힘이나는 커피생활 을지로 3가점</div>
                  <div className="date-cont-info-time">10:00-18:00</div>
                </div>
              </div>
              <div className="date-cont-wrap">
                <div className="date-cont-data-item">
                  <div className="cont-item-tit work">출퇴근 체크</div>
                  <div className="cont-item-data-wrap">
                    <div className="data-item-inner">
                      <div className="data-item-inner-item">
                        <span>출근 </span>08:00
                      </div>
                      <div className="data-item-inner-item">
                        <span>퇴근 </span>18:00
                      </div>
                    </div>
                    <div className="data-item-inner-arr"></div>
                  </div>
                </div>
                {/* TODO: 퍼블 구조 확인용 하드코딩 카드 — 확인 후 삭제 예정 */}
                <TodoSection org={null} />
              </div>
            </li>
            <li className="date-cont-item">
              <div className="date-cont-header">
                <div className="date-cont-ring" style={{ backgroundColor: '#B1D488' }}></div>
                <div className="date-cont-info">
                  <div className="date-cont-info-name">바나프레소 교대점</div>
                  <div className="date-cont-info-time">10:00-18:00</div>
                </div>
              </div>
              <div className="date-cont-wrap">
                <div className="date-cont-data-item">
                  <div className="cont-item-tit work">출퇴근 체크</div>
                  <div className="cont-item-data-wrap">
                    <div className="data-item-inner">
                      <div className="data-item-inner-item">
                        <span>출근 </span>08:00
                      </div>
                      <div className="data-item-inner-item">
                        <span>퇴근 </span>18:00
                      </div>
                    </div>
                    <div className="data-item-inner-arr"></div>
                  </div>
                </div>
                {/* TODO: 퍼블 구조 확인용 하드코딩 카드 — 확인 후 삭제 예정 */}
                <TodoSection org={null} />
              </div>
            </li>
            {todayData?.organizations.map((org) => (
              <li
                key={`${org.headOfficeId}-${org.franchiseId}-${org.storeId}`}
                className="date-cont-item"
              >
                <div className="date-cont-header">
                  <div className="date-cont-ring" style={{ backgroundColor: '#88BDD4' }}></div>
                  <div className="date-cont-info">
                    <div className="date-cont-info-name">
                      {org.storeName ?? org.franchiseName ?? org.headOfficeName}
                    </div>
                  </div>
                </div>
                <div className="date-cont-wrap">
                  <TodoSection org={org} onClick={handleTodoClick} />
                </div>
              </li>
            ))}
          </ul>
          <div className="date-list-footer">
            <button className="btn-form login block" onClick={() => setQrCodePopup(true)}>
              출퇴근 체크
            </button>
          </div>
        </div>
      </div>
      <button className="Ai" onClick={() => setAIChatPopup(true)}></button>
    </div>
  )
}

function TodoSection({
  org,
  onClick,
}: {
  org: OrgGroup | null
  onClick?: () => void
}) {
  const incomplete = org?.todos.filter((t) => !t.isCompleted).length ?? 0
  const complete = org?.todos.filter((t) => t.isCompleted).length ?? 0

  return (
    <div className="date-cont-data-item" onClick={onClick} style={onClick ? { cursor: 'pointer' } : undefined}>
      <div className="cont-item-tit todo">TO-DO 체크</div>
      <div className="cont-item-data-wrap">
        <div className="data-item-inner">
          <div className="data-item-inner-item">
            <span>미완료 </span>{incomplete}
          </div>
          <div className="data-item-inner-item">
            <span>완료 </span>{complete}
          </div>
        </div>
        <div className="data-item-inner-arr"></div>
      </div>
    </div>
  )
}
