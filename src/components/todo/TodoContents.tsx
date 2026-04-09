'use client'

import { useRef, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useWorkplaceStore } from '@/store/useWorkplaceStore'
import { useTodoMonthlyCalendar, useToggleTodoStatus } from '@/hooks/queries'
import TodoCalendar from './TodoCalendar'
import { formatDateKorean } from '@/lib/date-utils'
import type { OrgGroup, TodoItem } from '@/types/todo'
import './css/todo-temp.css'

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

function getOrgGroupsForDay(
  data: ReturnType<typeof useTodoMonthlyCalendar>['data'],
  day: number,
): OrgGroup[] {
  return data?.data.find((d) => d.day === day)?.organizations ?? []
}

function getOrgDisplayName(org: OrgGroup): string {
  if (org.storeName) return org.storeName
  if (org.franchiseName) return org.franchiseName
  return org.headOfficeName
}

function parseInitialDate(dateParam: string | null): Date {
  if (!dateParam) return new Date()
  // YYYY-MM-DD 형식만 허용 — 그 외 형식은 UTC 기준 파싱으로 날짜가 하루 밀릴 수 있음
  const match = dateParam.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return new Date()
  const [, y, m, d] = match.map(Number)
  const parsed = new Date(y, m - 1, d) // 로컬 timezone 기준 생성
  if (isNaN(parsed.getTime())) return new Date()
  return parsed
}

export default function TodoContents() {
  const searchParams = useSearchParams()
  const selectedWorkplaceId = useWorkplaceStore((s) => s.selectedWorkplaceId)

  const [selectedDate, setSelectedDate] = useState(() =>
    parseInitialDate(searchParams.get('date')),
  )
  const [isCalendarOpen, setIsCalendarOpen] = useState(true)
  const [pendingTodoId, setPendingTodoId] = useState<number | null>(null)

  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const year = selectedDate.getFullYear()
  const month = selectedDate.getMonth() + 1

  const { data: calendarData, isError: isCalendarError } = useTodoMonthlyCalendar(year, month, selectedWorkplaceId)
  const { mutate: toggleStatus } = useToggleTodoStatus(year, month, selectedWorkplaceId)

  const orgGroups = getOrgGroupsForDay(calendarData, selectedDate.getDate())

  const moveDay = (delta: number) => setSelectedDate((prev) => addDays(prev, delta))
  const goToToday = () => setSelectedDate(new Date())

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current
    const deltaY = e.changedTouches[0].clientY - touchStartY.current
    if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
      moveDay(deltaX > 0 ? -1 : 1)
    }
  }

  const handleToggleTodo = useCallback((todoId: number, currentCompleted: boolean) => {
    setPendingTodoId(todoId)
    toggleStatus(
      { id: todoId, isCompleted: !currentCompleted },
      { onSettled: () => setPendingTodoId(null) },
    )
  }, [toggleStatus])

  return (
    <div
      className="todo-contents"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="todo-content-tit">TO-DO 체크</div>

      <TodoCalendar
        selectedDate={selectedDate}
        initialCalendarData={calendarData?.data ?? []}
        onDateSelect={setSelectedDate}
        isGridOpen={isCalendarOpen}
        onToggleGrid={() => setIsCalendarOpen((prev) => !prev)}
        onTodayClick={goToToday}
        selectedWorkplaceId={selectedWorkplaceId}
      />

      <div className="todo-list-wrap">
        <div className="todo-date">
          <span>{formatDateKorean(selectedDate)}</span>
        </div>

        {isCalendarError ? (
          <div className="todo-empty">할 일 정보를 불러오지 못했습니다</div>
        ) : orgGroups.length === 0 ? (
          <div className="todo-empty">할 일이 없습니다</div>
        ) : (
          orgGroups.map((org) => (
            <TodoOrgSection
              key={`${org.headOfficeId}-${org.franchiseId}-${org.storeId}`}
              org={org}
              onToggle={handleToggleTodo}
              pendingTodoId={pendingTodoId}
            />
          ))
        )}
      </div>
    </div>
  )
}

function TodoOrgSection({
  org,
  onToggle,
  pendingTodoId,
}: {
  org: OrgGroup
  onToggle: (id: number, isCompleted: boolean) => void
  pendingTodoId: number | null
}) {
  return (
    <div className="todo-list-item">
      <div className="todo-list-item-tit">{getOrgDisplayName(org)}</div>
      <div className="todo-check-wrap">
        {org.todos.map((todo) => (
          <TodoCheckItem key={todo.id} todo={todo} onToggle={onToggle} isPending={pendingTodoId === todo.id} />
        ))}
      </div>
    </div>
  )
}

function TodoCheckItem({
  todo,
  onToggle,
  isPending,
}: {
  todo: TodoItem
  onToggle: (id: number, isCompleted: boolean) => void
  isPending: boolean
}) {
  return (
    <div className="todo-check-item">
      <div className="check-form-box">
        <input
          type="checkbox"
          id={`todo-check-${todo.id}`}
          checked={todo.isCompleted}
          disabled={isPending}
          onChange={() => onToggle(todo.id, todo.isCompleted)}
        />
        <label htmlFor={`todo-check-${todo.id}`}>{todo.content}</label>
      </div>
    </div>
  )
}
