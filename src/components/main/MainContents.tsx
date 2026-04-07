'use client'

import { useRouter } from 'next/navigation'
import { usePopupController } from '@/store/usePopupController'
import { useAuthStore } from '@/store/useAuthStore'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'
import { useTodoMonthlyCalendar } from '@/hooks/queries'
import type { OrgGroup } from '@/types/todo'

const WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']

function formatDateKorean(date: Date): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = WEEKDAYS[date.getDay()]
  return `${month}월 ${day}일 ${weekday}`
}

function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function MainContents() {
  const router = useRouter()
  const setQrCodePopup = usePopupController((state) => state.setQrCodePopup)
  const setAIChatPopup = usePopupController((state) => state.setAIChatPopup)
  const memberId = useAuthStore((s) => s.user?.memberId)
  const selectedWorkplaceId = useWorkplaceStore((s) => s.selectedWorkplaceId)

  const today = new Date()
  const { data: calendarResponse } = useTodoMonthlyCalendar(
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
              <div className="data-jop todo">TO-DO: {totalTodoCount}개</div>
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
