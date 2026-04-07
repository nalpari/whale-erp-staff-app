'use client'
import { useBottomSheetController } from '@/store/useBottomSheetController'
import { useAuthStore } from '@/store/useAuthStore'
import { useScheduleByOrg } from '@/hooks/queries/use-schedule-queries'
import { useAttendanceHistory } from '@/hooks/queries/use-attendance-queries'
import type { ScheduleGroupResponse, AttendanceHistoryItem } from '@/types/api'

interface Props {
  storeName: string | null
}

/** HH:mm 또는 ISO datetime 문자열을 HH:mm으로 변환 */
function formatTime(t?: string | null): string {
  if (!t) return '-'
  // ISO 형식 (2026-04-07T16:14:34...) → HH:mm
  if (t.includes('T')) return t.slice(11, 16)
  // 이미 HH:mm or HH:mm:ss 형식
  return t.slice(0, 5)
}

/** 출퇴근 기록 시간을 HH:mm으로 변환 */
function formatAttendanceTime(t: string | null): string {
  if (!t) return '-'
  if (t.includes('T')) return t.slice(11, 16)
  return t.slice(0, 5)
}

function formatWorkHours(hours: number | null | undefined): string {
  if (!hours || hours <= 0) return ''
  const h = Math.floor(hours)
  const m = Math.round((hours - h) * 60)
  return h > 0 ? `${h}시간${m > 0 ? ` ${m}분` : ''}` : `${m}분`
}

function getGroupName(group: ScheduleGroupResponse): string {
  return group.storeName ?? group.franchiseName ?? group.headOfficeName
}

function parseApiDate(dateStr: string): Date {
  const [yyyy, mm, dd] = dateStr.split('.').map(Number)
  return new Date(yyyy, mm - 1, dd)
}

function getTodayIso(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/** yyyy.MM.dd → yyyy-MM-dd */
function dotToHyphen(s: string): string {
  return s.replace(/\./g, '-')
}

const DAY_KOR = ['일', '월', '화', '수', '목', '금', '토']

export default function CommuteWork({ storeName }: Props) {
  const setCommuteDaySelectSheet = useBottomSheetController((state) => state.setCommuteDaySelectSheet)
  const commuteFrom = useBottomSheetController((state) => state.commuteFrom)
  const commuteTo = useBottomSheetController((state) => state.commuteTo)
  const user = useAuthStore((s) => s.user)

  const { data: scheduleData, isLoading: scheduleLoading } = useScheduleByOrg(
    user?.memberId ?? null,
    commuteFrom,
    commuteTo,
  )

  const fromIso = dotToHyphen(commuteFrom)
  const toIso = dotToHyphen(commuteTo)

  const { data: historyData } = useAttendanceHistory(
    { from: fromIso, to: toIso },
    !!user?.memberId,
  )

  // 출퇴근 이력을 "날짜_근무처명" 키로 맵핑
  const attendanceMap = new Map<string, AttendanceHistoryItem>()
  const historyItems = historyData?.data?.items ?? []
  for (const item of historyItems) {
    const key = `${item.date}_${item.workplaceName}`
    attendanceMap.set(key, item)
  }

  const allGroups = scheduleData?.data ?? []

  // 홈화면에서 특정 점포로 진입 시 해당 점포만, 햄버거 메뉴 진입 시 전체
  const displayGroups = storeName
    ? allGroups.filter((g) => getGroupName(g) === storeName)
    : allGroups

  // 날짜 범위 배열 생성
  const dateList: Date[] = []
  if (commuteFrom && commuteTo) {
    const start = parseApiDate(commuteFrom)
    const end = parseApiDate(commuteTo)
    const cur = new Date(start)
    while (cur <= end) {
      dateList.push(new Date(cur))
      cur.setDate(cur.getDate() + 1)
    }
  }

  const today = getTodayIso()

  return (
    <div className="commute-contents-body">
      <div className="commute-work-date-wrap">
        <div className="commute-work-date">{commuteFrom} ~ {commuteTo}</div>
        <button className="data-list-arr" onClick={() => setCommuteDaySelectSheet(true)} />
      </div>

      <div className="commute-work-list">
        {scheduleLoading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            불러오는 중...
          </div>
        )}

        {!scheduleLoading && dateList.map((date) => {
          const isoDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
          const isToday = isoDate === today
          const isPast = isoDate < today
          const dayLabel = `${DAY_KOR[date.getDay()]}요일`

          // 이 날짜에 해당하는 그룹별 근무 일정 수집
          const entries = displayGroups
            .map((group) => ({
              groupName: getGroupName(group),
              schedule: group.schedules.find((s) => s.date === isoDate),
            }))
            .filter((e) => e.schedule?.hasWork && !e.schedule?.isDeleted)

          return (
            <div key={isoDate} className="commute-work-list-item">
              <div className="commute-work-list-item-date">
                {isToday && <div className="badge-day">오늘</div>}
                <span className="num">{date.getDate()}</span>
                <span>{dayLabel}</span>
              </div>

              <div className="commute-work-list-item-conts">
              {entries.length === 0 ? (
                <div className="commute-work-list-item-cont">
                  <div className="empty-work">근무일정 없음</div>
                </div>
              ) : (
                entries.map((entry, i) => {
                  const attendanceKey = `${isoDate}_${entry.groupName}`
                  const attendance = attendanceMap.get(attendanceKey)

                  const hasCheckIn = !!attendance?.checkInTime
                  const hasCheckOut = !!attendance?.checkOutTime
                  const hasAttendance = hasCheckIn || hasCheckOut

                  // 결근 여부: 과거 날짜이고 출퇴근 기록이 없는 경우
                  const isAbsent = isPast && !hasAttendance

                  return (
                    <div key={i} className="commute-work-list-item-cont">
                      <div className="work-store-tit">{entry.groupName}</div>

                      {isAbsent ? (
                        <div className="work-commute-status absent">결근</div>
                      ) : hasAttendance ? (
                        <>
                          <ul className="work-commute-list">
                            <li className="work-commute-list-item">
                              출근{' '}
                              {hasCheckIn
                                ? formatAttendanceTime(attendance!.checkInTime)
                                : <span className="unrecorded">미기록</span>
                              }
                            </li>
                            <li className="work-commute-list-item">
                              퇴근{' '}
                              {hasCheckOut
                                ? formatAttendanceTime(attendance!.checkOutTime)
                                : <span className="unrecorded">미기록</span>
                              }
                            </li>
                          </ul>
                          {hasCheckIn && hasCheckOut && attendance!.workDuration != null && (
                            <div className="work-commute-time">
                              <div className="work-badge g">근무시간</div>
                              <div className="work-time">
                                {formatWorkHours(attendance!.workDuration / 60)}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        // 출퇴근 기록 없음 (오늘 or 미래) → 스케줄만 표시
                        <>
                          <ul className="work-commute-list">
                            <li className="work-commute-list-item">출근 {formatTime(entry.schedule!.startTime)}</li>
                            <li className="work-commute-list-item">퇴근 {formatTime(entry.schedule!.endTime)}</li>
                          </ul>
                          <div className="work-commute-time">
                            <div className="work-badge g">근무시간</div>
                            <div className="work-time">{formatWorkHours(entry.schedule!.workHours)}</div>
                          </div>
                        </>
                      )}
                    </div>
                  )
                })
              )}
              </div>
            </div>
          )
        })}

        {!scheduleLoading && dateList.length === 0 && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            기간을 설정해주세요.
          </div>
        )}
      </div>
    </div>
  )
}
