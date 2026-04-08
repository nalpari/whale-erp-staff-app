'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import { WhaleCalendar } from 'whale-calendar'
import type { CalendarData } from 'whale-calendar'
import { useAuthStore } from '@/store/useAuthStore'
import { useTodoMonthlyCalendar } from '@/hooks/queries'
import type { CalendarDayData } from '@/types/todo'
import 'whale-calendar/styles.css'

interface TodoCalendarProps {
  selectedDate: Date
  initialCalendarData: CalendarDayData[]
  onDateSelect: (date: Date) => void
  isGridOpen: boolean
  onToggleGrid: () => void
  employeeInfoId?: number | null
}

function buildCalendarData(
  year: number,
  month: number,
  dayDataList: CalendarDayData[],
): CalendarData {
  const data: CalendarData = {}
  for (const dayData of dayDataList) {
    const key = `${year}-${String(month).padStart(2, '0')}-${String(dayData.day).padStart(2, '0')}`
    const hasIncomplete = dayData.incompleteCount > 0
    const color = hasIncomplete ? '#ff4d4f' : '#52c41a'
    data[key] = {
      schedules: [{ id: `todo-${dayData.day}`, label: '●', color }],
    }
  }
  return data
}

export default function TodoCalendar({
  selectedDate,
  initialCalendarData,
  onDateSelect,
  isGridOpen,
  onToggleGrid,
  employeeInfoId,
}: TodoCalendarProps) {
  const [viewYear, setViewYear] = useState<number | null>(null)
  const [viewMonth, setViewMonth] = useState<number | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const memberId = useAuthStore((s) => s.user?.memberId)

  const selectedYear = selectedDate.getFullYear()
  const selectedMonth = selectedDate.getMonth() + 1

  const isViewingSelectedMonth =
    viewYear === null || (viewYear === selectedYear && viewMonth === selectedMonth)

  const displayYear = viewYear ?? selectedYear
  const displayMonth = viewMonth ?? selectedMonth

  // 탐색 중인 월 데이터 (선택된 월과 다를 때만 fetch)
  const { data: browseResponse, isError: isBrowseError } = useTodoMonthlyCalendar(
    isViewingSelectedMonth ? undefined : memberId,
    displayYear,
    displayMonth,
    employeeInfoId,
  )

  const displayData = isViewingSelectedMonth
    ? initialCalendarData
    : isBrowseError ? [] : (browseResponse?.data ?? [])

  // whale-calendar 타이틀 "M월 스케줄" → "yyyy년 MM월"로 교체
  // ⚠️ whale-calendar 내부 클래스명(.whale-calendar__title)에 의존.
  // 라이브러리 업데이트 시 클래스명 변경 여부 확인 필요.
  // whale-calendar에 titleFormat prop이 추가되면 이 코드를 제거하고 prop으로 교체할 것.
  // useLayoutEffect: DOM 페인트 전에 동기적으로 적용하여 타이틀 깜빡임 방지
  useLayoutEffect(() => {
    const titleEl = wrapperRef.current?.querySelector('.whale-calendar__title')
    if (titleEl) {
      titleEl.textContent = `${displayYear}년 ${displayMonth}월`
    }
  }, [displayYear, displayMonth])

  // 그리드 숨김/표시
  // ⚠️ whale-calendar 내부 클래스명(.whale-calendar__grid)에 의존.
  // 라이브러리 업데이트 시 클래스명 변경 여부 확인 필요.
  // whale-calendar에 gridVisible prop이 추가되면 이 코드를 제거하고 prop으로 교체할 것.
  // useLayoutEffect: DOM 페인트 전에 동기적으로 적용하여 레이아웃 깜빡임 방지
  useLayoutEffect(() => {
    const gridEl = wrapperRef.current?.querySelector('.whale-calendar__grid') as HTMLElement | null
    if (gridEl) {
      gridEl.style.display = isGridOpen ? '' : 'none'
    }
  }, [isGridOpen])

  // 캘린더 내부 스와이프: 월 탐색 (selectedDate 변경 없음)
  const handleCalendarTouchStart = (e: React.TouchEvent) => {
    if (!isGridOpen) return
    e.stopPropagation()
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleCalendarTouchEnd = (e: React.TouchEvent) => {
    if (!isGridOpen) return
    e.stopPropagation()
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(deltaX) <= 50 || Math.abs(deltaX) <= Math.abs(deltaY)) return

    const direction = deltaX > 0 ? -1 : 1
    const baseYear = viewYear ?? selectedYear
    const baseMonth = viewMonth ?? selectedMonth
    let newMonth = baseMonth + direction
    let newYear = baseYear
    if (newMonth > 12) { newMonth = 1; newYear++ }
    if (newMonth < 1) { newMonth = 12; newYear-- }
    setViewYear(newYear)
    setViewMonth(newMonth)
  }

  // 캘린더 < / > 버튼: selectedDate를 해당 월 1일로 이동 + 탐색 리셋
  const handleMonthChange = (year: number, month: number) => {
    setViewYear(null)
    setViewMonth(null)
    onDateSelect(new Date(year, month - 1, 1))
  }

  // 날짜 셀 / 뱃지 클릭: selectedDate 변경 + 탐색 리셋
  const handleDayClick = (date: Date) => {
    setViewYear(null)
    setViewMonth(null)
    onDateSelect(date)
  }

  return (
    <div
      ref={wrapperRef}
      className="todo-diary-wrap"
      style={{ position: 'relative' }}
      onTouchStart={handleCalendarTouchStart}
      onTouchEnd={handleCalendarTouchEnd}
    >
      <WhaleCalendar
        year={displayYear}
        month={displayMonth}
        data={buildCalendarData(displayYear, displayMonth, displayData)}
        selectedDate={selectedDate}
        onDayClick={handleDayClick}
        onScheduleClick={(date) => handleDayClick(date)}
        onMonthChange={handleMonthChange}
        locale="ko"
      />
      <button
        className="todo-calendar-toggle"
        onClick={onToggleGrid}
        aria-label={isGridOpen ? '달력 접기' : '달력 펼치기'}
        style={{ position: 'absolute', top: '1rem', right: 8, height: 32, display: 'flex', alignItems: 'center' }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <rect x="2" y="3" width="16" height="14" rx="2" stroke="#777" strokeWidth="1.5" />
          <path d="M2 7H18" stroke="#777" strokeWidth="1.5" />
          <path d="M6 1V4" stroke="#777" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M14 1V4" stroke="#777" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  )
}
