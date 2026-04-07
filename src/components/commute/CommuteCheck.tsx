'use client'
import { usePopupController } from '@/store/usePopupController'
import { useAuthStore } from '@/store/useAuthStore'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'
import { useAttendanceToday } from '@/hooks/queries/use-attendance-queries'
import { useScheduleByOrg } from '@/hooks/queries/use-schedule-queries'
import type { ScheduleGroupResponse } from '@/types/api'

interface Props {
  /** 특정 점포로 진입 시 해당 점포명. null이면 전체 표시 */
  storeName: string | null
}

function getTodayString(): string {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

function toScheduleDateParam(s: string): string {
  return s.replace(/-/g, '.')
}

function formatTime(t?: string | null): string {
  if (!t) return '-'
  return t.slice(0, 5)
}

function formatDuration(clockIn?: string | null, clockOut?: string | null): string {
  if (!clockIn || !clockOut) return ''
  const [ih, im] = clockIn.split(':').map(Number)
  const [oh, om] = clockOut.split(':').map(Number)
  const totalMins = oh * 60 + om - (ih * 60 + im)
  if (totalMins <= 0) return ''
  const h = Math.floor(totalMins / 60)
  const m = totalMins % 60
  return h > 0 ? `${h}시간${m > 0 ? ` ${m}분` : ''}` : `${m}분`
}

function getGroupName(group: ScheduleGroupResponse): string {
  return group.storeName ?? group.franchiseName ?? group.headOfficeName
}

export default function CommuteCheck({ storeName }: Props) {
  const openQrCodePopup = usePopupController((state) => state.openQrCodePopup)
  const user = useAuthStore((s) => s.user)
  const workplaces = useWorkplaceStore((s) => s.workplaces)

  const today = getTodayString()
  const todayParam = toScheduleDateParam(today)

  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth() + 1
  const day = now.getDate()
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()]
  const dateLabel = `${year}년 ${month}월 ${day}일 (${dayOfWeek})`

  const { data: attendanceData, isLoading: isAttendanceLoading } = useAttendanceToday()
  const { data: scheduleData, isLoading: isScheduleLoading } = useScheduleByOrg(
    user?.memberId ?? null,
    todayParam,
    todayParam,
  )

  const allAttendance = attendanceData?.data?.workplaces ?? []
  const allGroups = scheduleData?.data ?? []

  // 오늘 근무 있는 그룹만 추출
  const todayGroups = allGroups.filter((g) =>
    g.schedules.some((s) => s.date === today && s.hasWork && !s.isDeleted),
  )

  // 점포별 진입 시 해당 점포만, 직접 진입 시 전체
  const displayGroups = storeName
    ? todayGroups.filter((g) => getGroupName(g) === storeName)
    : todayGroups

  // 출퇴근 기록 맵 (attendance.workplaceName = 실제 점포명 = workplace.storeName)
  const attendanceMap = new Map(allAttendance.map((wp) => [wp.workplaceName, wp]))

  const isLoading = isAttendanceLoading || isScheduleLoading

  // workplaceId는 workplaces 스토어에서 storeName으로 매칭
  const handleOpenPopup = (name: string) => {
    const matched = workplaces.find((wp) => wp.storeName === name)
    if (matched?.id) openQrCodePopup(matched.id, name, matched.storeId)
  }

  return (
    <div className="commute-contents-body">
      <div className="commute-date-wrap">
        <div className="badge-day">오늘</div>
        <div className="commute-date">{dateLabel}</div>
      </div>
      <div className="commute-guide-wrap">
        <span>근무시간은 휴게시간이 포함되어 실제 근로시간과 다를 수 있습니다</span>
      </div>

      <div className="commute-store-list">
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            불러오는 중...
          </div>
        )}
        {!isLoading && displayGroups.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            오늘 예정된 근무가 없습니다.
          </div>
        )}

        {displayGroups.map((group, idx) => {
          const name = getGroupName(group)
          const todaySchedule = group.schedules.find(
            (s) => s.date === today && s.hasWork && !s.isDeleted,
          )
          const wp = attendanceMap.get(name)
          const workDuration = formatDuration(wp?.checkInTime, wp?.checkOutTime)
          const hasClockIn = !!wp?.checkInTime
          const hasClockOut = !!wp?.checkOutTime

          let workStatus = ''
          if (wp) {
            if (!hasClockIn && !hasClockOut) workStatus = '미체크'
            else if (!hasClockIn && hasClockOut) workStatus = '출근 미체크'
            else if (hasClockIn && !hasClockOut) workStatus = '퇴근 미체크'
          }

          return (
            <div key={idx} className="commute-store-item">
              <div className="commute-store-header">
                <div className="commute-store-header-tit">{name}</div>
                <div className="commute-store-header-time">
                  {todaySchedule
                    ? `${formatTime(todaySchedule.startTime)} ~ ${formatTime(todaySchedule.endTime)}`
                    : '-'}
                </div>
              </div>
              <div className="commute-store-body">
                <div className="commute-store-body-item">
                  <div className="commute-store-body-item-tit">출근기록</div>
                  <div className={`commute-store-body-item-time${!hasClockIn ? ' none' : ''}`}>
                    {formatTime(wp?.checkInTime)}
                  </div>
                </div>
                <div className="commute-store-body-item">
                  <div className="commute-store-body-item-tit">퇴근기록</div>
                  <div className={`commute-store-body-item-time${!hasClockOut ? ' none' : ''}`}>
                    {formatTime(wp?.checkOutTime)}
                  </div>
                </div>
                <div className="commute-store-body-item">
                  <div className="commute-store-body-item-tit">근무시간</div>
                  <div className={`commute-store-body-item-time${!workDuration ? ' none' : ''}`}>
                    {workDuration || workStatus || '-'}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {storeName !== null && (
        <div className="commute-btn-wrap">
          <button
            className="btn-form block login"
            disabled={displayGroups.length === 0}
            onClick={() => {
              const firstName = displayGroups[0] ? getGroupName(displayGroups[0]) : null
              if (firstName) handleOpenPopup(firstName)
            }}
          >
            출퇴근 체크
          </button>
        </div>
      )}
    </div>
  )
}
