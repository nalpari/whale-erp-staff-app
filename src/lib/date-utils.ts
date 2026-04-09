const WEEKDAYS = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
const WEEKDAYS_SHORT = ['일', '월', '화', '수', '목', '금', '토']

export function formatDateKorean(date: Date): string {
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekday = WEEKDAYS[date.getDay()]
  return `${month}월 ${day}일 ${weekday}`
}

export function formatDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * HH:mm:ss 또는 ISO datetime 문자열을 HH:mm으로 변환.
 * null/undefined/빈 문자열이면 '-' 반환.
 */
export function formatTime(timeStr?: string | null): string {
  if (!timeStr) return '-'
  // ISO datetime: 2026-04-07T16:14:34... → HH:mm
  if (timeStr.includes('T')) return timeStr.slice(11, 16)
  // HH:mm:ss 또는 HH:mm
  return timeStr.slice(0, 5)
}

/** Date → 'YYYY-MM-DD' */
export function formatDateStr(date: Date): string {
  return formatDate(date)
}

/** 오늘 날짜 레이블 (예: "2026년 4월 9일 목요일") */
export function formatTodayLabel(): string {
  const d = new Date()
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const dayOfWeek = WEEKDAYS_SHORT[d.getDay()]
  return `${year}년 ${month}월 ${day}일 ${dayOfWeek}요일`
}

/** Date → 'YYYY.MM.DD' (점 구분, API 파라미터용) */
export function formatDotDate(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

/** 기본 출퇴근 조회 주간 반환 (오늘 ~ 6일 후) */
export function getDefaultCommuteWeek(): { from: string; to: string } {
  const today = new Date()
  const end = new Date(today)
  end.setDate(today.getDate() + 6)
  return { from: formatDotDate(today), to: formatDotDate(end) }
}
