'use client'

import { useEffect, useRef, useState } from 'react'
import { WhaleCalendar } from 'whale-calendar'
import type { CalendarData } from 'whale-calendar'
import { fetchMonthlyCalendar } from '@/lib/todoApi'
import type { CalendarDayData } from '@/types/todo'
import 'whale-calendar/styles.css'

interface TodoCalendarProps {
  selectedDate: Date
  initialCalendarData: CalendarDayData[]
  onDateSelect: (date: Date) => void
  isGridOpen: boolean
  onToggleGrid: () => void
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
}: TodoCalendarProps) {
  const [viewYear, setViewYear] = useState<number | null>(null)
  const [viewMonth, setViewMonth] = useState<number | null>(null)
  const [browseData, setBrowseData] = useState<CalendarDayData[] | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)

  const selectedYear = selectedDate.getFullYear()
  const selectedMonth = selectedDate.getMonth() + 1
  const isViewingSelectedMonth =
    viewYear === null || (viewYear === selectedYear && viewMonth === selectedMonth)

  const displayYear = viewYear ?? selectedYear
  const displayMonth = viewMonth ?? selectedMonth
  const displayData = isViewingSelectedMonth ? initialCalendarData : (browseData ?? [])

  // whale-calendar 타이틀 "M월 스케줄" → "yyyy년 MM월"로 교체
  useEffect(() => {
    const titleEl = wrapperRef.current?.querySelector('.whale-calendar__title')
    if (titleEl) {
      titleEl.textContent = `${displayYear}년 ${displayMonth}월`
    }
  }, [displayYear, displayMonth])

  // 그리드 숨김/표시
  useEffect(() => {
    const gridEl = wrapperRef.current?.querySelector('.whale-calendar__grid') as HTMLElement | null
    if (gridEl) {
      gridEl.style.display = isGridOpen ? '' : 'none'
    }
  }, [isGridOpen])

  const handleMonthChange = (year: number, month: number) => {
    setViewYear(null)
    setViewMonth(null)
    setBrowseData(null)
    onDateSelect(new Date(year, month - 1, 1))
  }

  const handleDayClick = (date: Date) => {
    setViewYear(null)
    setViewMonth(null)
    setBrowseData(null)
    onDateSelect(date)
  }

  return (
    <div ref={wrapperRef} className="todo-diary-wrap" style={{ position: 'relative' }}>
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
